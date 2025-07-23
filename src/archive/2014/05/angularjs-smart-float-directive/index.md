---
layout: post
tags: post
date: 2014-05-24

title: AngularJS - Smart Float Directive
description: Build an improved AngularJS smart-float directive for number validation with comma/dot decimal separators and thousands separators support.
category: AngularJS
---

Recently I started looking for an AngluarJS directive to validate numbers and I found the "smart-float" directive [here](https://docs.angularjs.org/guide/forms), in the AngularJS documentation. This amazing example solves the problem of convert my numbers that use a comma as decimal mark to a Javascript number.

My problem is that this directive doesn't solve my two problems:

1. Display numbers with 2 fractional digits by default.
2. Validate numbers with thousands separator.

So, this is an improved directive based on Angular's _smart-float_ directive.
First, add the following directive to your application:

```js
myApp.directive("smartFloat", function ($filter) {
  var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; //Numbers like: 1.123,56
  var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; //Numbers like: 1,123.56
  var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; //Numbers like: 1123.56
  var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; //Numbers like: 1123,56

  return {
    require: "ngModel",
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        if (FLOAT_REGEXP_1.test(viewValue)) {
          ctrl.$setValidity("float", true);
          return parseFloat(viewValue.replace(".", "").replace(",", "."));
        } else if (FLOAT_REGEXP_2.test(viewValue)) {
          ctrl.$setValidity("float", true);
          return parseFloat(viewValue.replace(",", ""));
        } else if (FLOAT_REGEXP_3.test(viewValue)) {
          ctrl.$setValidity("float", true);
          return parseFloat(viewValue);
        } else if (FLOAT_REGEXP_4.test(viewValue)) {
          ctrl.$setValidity("float", true);
          return parseFloat(viewValue.replace(",", "."));
        } else {
          ctrl.$setValidity("float", false);
          return undefined;
        }
      });

      ctrl.$formatters.unshift(function (modelValue) {
        return $filter("number")(parseFloat(modelValue), 2);
      });
    },
  };
});
```

Now, add the _smart-float_ directive to your input:

```html
<input
  type="text"
  id="inputAmount"
  name="inputAmount"
  placeholder="Amount"
  ng-model="amount"
  smart-float
/>
```

This gives you what you need. Now, you can improve it showing to your users that the value in the input is invalid. In the following example I used [Bootstrap](https://getbootstrap.com/) to demonstrate it:

```html
<form name="myForm" class="form-horizontal" role="form" novalidate>
  <div class="form-group" ng-class="{'has-error': myForm.inputAmount.$invalid}">
    <label for="inputText3" class="col-sm-2 control-label">Amount</label>
    <div class="col-sm-10">
      <input
        type="text"
        class="form-control"
        id="inputAmount"
        name="inputAmount"
        placeholder="Amount"
        ng-model="amount"
        smart-float
      />
      <span class="help-block" ng-show="myForm.inputAmount.$error.float">
        Invalid Amount!
      </span>
    </div>
  </div>
</form>
```

You can see the working demo on [JSFiddle](https://jsfiddle.net/gsferreira/SCr6X/).

I hope that this helps you.

## UPDATE 2015-03-11

Post has been updated with a fix to a bug that [Cooper Sellers](https://disqus.com/by/coopersellers/) found (you can see the details at the comment feed below).
