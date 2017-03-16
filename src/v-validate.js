var validate = {},
    errorBag = 'invalidFields',
    timers = {};

// exposed global options
validate.config = {};

var validators = {
    required: function (value) {
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
                this.identifier = this.params.vModel.replace(/\./g, '_');
                this.expression = this.params.vModel;
            } else {
                console.error('No v-model on input');
            }
        },

        update: function (value) {
            if (!this.vm) {
                return;
            }

            if (typeof timers[this.identifier] != 'undefined') {
                clearTimeout(timers[this.identifier]);
            }

            if (typeof value == 'undefined') {
                value = '';
            }

            var vm = this;

            Vue.nextTick(function () {
                vm.validate(value);
            });
        },

        validate: function (value) {
            if (!this.vm) {
                return;
            }

            var valid = true;
            var isRequired = (typeof this.validateRules['required'] != 'undefined' && this.validateRules['required']);

            // if empty, but not required
            // it is still valid
            if(!isRequired && value.length < 1) {

            } else {
                // validate each rule
                Object.keys(this.validateRules).forEach(function (rule) {
                    if (!validators[rule]) {
                        throw new Error('Unknown rule ' + rule);
                    }

                    var ruleArgument = this.validateRules[rule];

                    // type is boolean and it is true
                    if (typeof(ruleArgument) == 'boolean' && ruleArgument && !validators[rule](value)) {
                        return valid = false;
                    } else if(!validators[rule](value, ruleArgument)) {
                        // type has argument
                        return valid = false;
                    }
                }.bind(this));
            }

            if (typeof this.vm[errorBag] != 'undefined') {
                Vue.delete(this.vm[errorBag], this.identifier);
            }

            // remove classes
            this.el.classList.remove('valid');
            this.el.classList.remove('invalid');

            if (valid) {
                // add the valid class
                if(value.length > 0) {
                    this.el.classList.add('valid');
                }
            } else {
                // add the field to the errorbag
                this.vm.$set(errorBag + '.' + this.identifier, true);

                // In case of the initial data, only add invalid class
                // if data is filled
                if (! (this.isInitial && value.length < 1) ) {
                    var vm = this;

                    // give a sec before adding the invalid class
                    timers[this.identifier] = setTimeout(function(){
                        vm.el.classList.add('invalid');
                    }, 800);
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