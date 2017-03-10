var validate = {},
    errorBag = 'invalidFields',
    validateTimer = null;

// exposed global options
validate.config = {};

var validators = {
    required: function (value) {
        if (typeof value == 'boolean') return value;
        return !((value == null) || (value.length == 0));
    },

    numeric: function (value) {
        return (/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(value);
    },

    integer: function (value) {
        return (/^(-?[1-9]\d*|0)$/).test(value);
    },

    digits: function (value) {
        return (/^[\d() \.\:\-\+#]+$/).test(value);
    },

    alpha: function (value) {
        return (/^[a-zA-Z]+$/).test(value);
    },

    alphaNum: function (value) {
        return !(/\W/).test(value);
    },

    email: function (value) {
        return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
    },

    url: function (value) {
        return (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(value);
    },

    minLength: function (value, arg) {
        return value && value.length && value.length >= +arg;
    },

    maxLength: function (value, arg) {
        return value && value.length && value.length <= +arg;
    },

    length: function (value, arg) {
        return value && value.length == +arg;
    },

    min: function (value, arg) {
        return value >= +arg;
    },

    max: function (value, arg) {
        return value <= +arg;
    },

    pattern: function (value, arg) {
        var match = arg.match(new RegExp('^/(.*?)/([gimy]*)$'));
        var regex = new RegExp(match[1], match[2]);
        return regex.test(value);
    }
};

validate.install = function (Vue) {

    Vue.directive('validate', {
        params: ['v-model'],

        bind: function () {
            // This is the initial data
            this.isInitial = true;
            this.vm.$set('formIsValid', false);

            // Set the validation rules
            // from the expression
            this.validateRules = eval('('+ this.expression + ')');

            // Bind the v-model to
            // the directive
            if (this.params.vModel) {
                this.expression = this.params.vModel;
            } else {
                this.expression = null;
            }
        },

        update: function (value) {
            clearTimeout(validateTimer);
            var vm = this;

            Vue.nextTick(function () {
                vm.validate(value);
            })
        },

        validate: function (value) {
            var valid = true;

            Object.keys(this.validateRules).forEach(function (rule) {
                if (!validators[rule]){
                    throw new Error('Unknown rule ' + rule);
                }

                var ruleArgument = this.validateRules[rule];

                // type is boolean and it is true
                if (typeof(ruleArgument) == 'boolean' && ruleArgument) {
                    if(!validators[rule](value)) {
                        return valid = false;
                    }
                } else {
                    // type has argument
                    if(!validators[rule](value, ruleArgument)) {
                        return valid = false;
                    }
                }
            }.bind(this));

            var bagEntry = this.expression.replace(/\./g, '_');

            if (typeof this.vm[errorBag] != "undefined") {
                Vue.delete(this.vm[errorBag], bagEntry);
            }

            if (valid) {
                // instantly add the valid class
                this.el.classList.add('valid');
                this.el.classList.remove('invalid');
            } else {
                // add the field to the errorbag
                this.vm.$set(errorBag + '.' + bagEntry, true);

                // instantly remove the valid class
                this.el.classList.remove('valid');

                // In case of the initial data, only add invalid class
                // if data is filled
                if (!this.isInitial || typeof value != 'undefined') {
                    var vm = this;

                    // give a sec before adding the invalid class
                    validateTimer = setTimeout(function(){
                        vm.el.classList.add('invalid');
                    }, 1000);
                }
            }

            this.isInitial = false;
            this.setFormIsValid();

            return valid;
        },

        setFormIsValid: function () {
            if (typeof this.vm.$get(errorBag) == 'object' && Object.keys(this.vm.$get(errorBag)).length > 0) {
                this.vm.$set('formIsValid', false);
            } else {
                this.vm.$set('formIsValid', true);
            }
        }

    });

};

if (typeof exports == "object") {
    module.exports = validate;
} else if (typeof define == "function" && define.amd) {
    define([], function(){ return validate })
} else if (window.Vue) {
    window.validate = validate;
    Vue.use(validate);
}