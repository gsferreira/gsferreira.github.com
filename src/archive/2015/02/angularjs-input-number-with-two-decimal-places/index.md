---
layout: post
tags: post
date: 2015-02-25

title: AngularJS - Input number with 2 decimal places
category: AngularJS
---

My [AngularJS - Smart Float Directive](http://gsferreira.com/archive/2014/05/angularjs-smart-flo+at-directive/) post has been a post with a lot of traction, so I want to share another tip related to numbers in Angular.

This a kind of simple tip, but I believe that it can be really useful.

My smart-float directive works really fine in a desktop or laptop browser, but in a smartphone I want to take advantage of HTML5 number inputs and show to my users when they enter in the input, the "mini calculator keyboard".

How to accomplish it using angular?

That's easy.

[![meme](/images/angularjs-input-number-with-two-decimal-places-meme.jpg)](http://www.deque.com/blog/accessible-client-side-form-validation-html5/)

##1. Create the number input with the number type.

```html
<input
  type="number"
  name="myDecimal"
  placeholder="Decimal"
  ng-model="myDecimal"
/>
```

##2. Define the step interval.

```html
<input
  type="number"
  name="myDecimal"
  placeholder="Decimal"
  ng-model="myDecimal"
  *step="0.01"
  *
/>
```

##3. Set the regular expression to validate the input using ng-pattern. Here I want to accept only numbers with a maximum of 2 decimal places and with a dot separator.

```html
<input
  type="number"
  name="myDecimal"
  placeholder="Decimal"
  ng-model="myDecimal"
  ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
  step="0.01"
/>
```

##4. Inform your user if the input has a valid value.

```html
<input
  type="number"
  name="myDecimal"
  placeholder="Decimal"
  ng-model="myDecimal"
  ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
  step="0.01"
/>
<span>Is a valid decimal? {{myForm.myDecimal.$valid}}</span>
```

A full example using bootstrap ([demo here](http://jsfiddle.net/gsferreira/Lsv9f0b0/)):

```html
<div ng-app>
  <h2>Todo</h2>
  <div ng-controller="myCtrl">
    <form name="myForm" class="form-horizontal">
      <div
        class="form-group"
        ng-class="{'has-error': myForm.myDecimal.$invalid}"
      >
        <label for="inputText3" class="col-sm-2 control-label">Decimal</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            name="myDecimal"
            placeholder="Decimal"
            ng-model="myDecimal"
            ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
            step="0.01"
            required
          />

          <span class="help-block" ng-show="!myForm.myDecimal.$valid">
            Invalid!
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="inputText3" class="col-sm-2 control-label"
          >The value:</label
        >
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            ng-model="myDecimal"
            disabled
          />
        </div>
      </div>
    </form>
  </div>
</div>
```

Hope this helps.
