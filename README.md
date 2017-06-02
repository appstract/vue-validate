# Vue Validate

[![Latest Version on NPM](https://img.shields.io/npm/v/v-validate.svg?style=flat-square)](https://npmjs.com/package/v-validate)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Input validation for Vue 1.0

[![](https://gifyu.com/images/inaction.gif)](https://gifyu.com/image/SZQV)

## Install

You can install the package via yarn:

```bash
$ yarn add v-validate
```
If you use webpack:
```js
Vue.use(require('v-validate'));
```
If you don't, just include 'v-validate.js' somewhere in your page.

## Usage

Use the `v-validate` directive on your input.
Example:

```html
<input type="text" v-model="name" v-validate="{required: true, minLength: 5}">
```
Classes `valid` or `invalid` will be appended to the input.

## See it in action

Play with the options in [JSFiddle](https://jsfiddle.net/2pyx98Lr/1/)

## Contributing

Contributions are welcome, [thanks to y'all](https://github.com/appstract/vue-validate/graphs/contributors) :)

## About Appstract

Appstract is a small team from The Netherlands. We create (open source) tools for webdevelopment and write about related subjects on [Medium](https://medium.com/appstract). You can [follow us on Twitter](https://twitter.com/teamappstract), [buy us a beer](https://www.paypal.me/teamappstract/10) or [support us on Patreon](https://www.patreon.com/appstract).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
