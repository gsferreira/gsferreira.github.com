---
layout: post
tags: post
date: 2015-03-28

title: AngularJS - After Render Directive
category: AngularJS
---

Do you ever wanted to execute code after your Angular template is completely rendered?

This post is the answer of how you can accomplish that.

This a simple tip, but I believe that can be really useful.

Add the following directive to your application.

```js
myApp.directive("afterRender", [
  "$timeout",
  function ($timeout) {
    var def = {
      restrict: "A",
      terminal: true,
      transclude: false,
      link: function (scope, element, attrs) {
        $timeout(scope.$eval(attrs.afterRender), 0); //Calling a scoped method
      },
    };
    return def;
  },
]);
```

Now, add the _after-render_ directive to an element in your template:

```html
<div after-render="missionCompled"></div>
```

At this point, your application will run the _missionCompled_ function (or other that you want) in your controller, after the div is rendered.

You can see the working demo on [JSFiddle](https://jsfiddle.net/gsferreira/h53okjtu/).

I hope that this helps you.
