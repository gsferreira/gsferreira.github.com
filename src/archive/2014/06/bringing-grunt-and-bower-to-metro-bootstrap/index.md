---
layout: post
tags: post
date: 2014-06-05

title: Bringing Grunt and Bower to metro-bootstrap
category: metro-bootstrap
---

Since we publish [metro-bootstrap](https://github.com/TalksLab/metro-bootstrap) we saw an incredible acceptance to the project and we are really happy to have decided to delivery it as an open source project.

This project has grown up with a lack of structure in my opinion, so, this week I've been working to add Grunt and Bower to metro-bootstrap. To accomplish this task, I have the valuable help of [Yeoman](http://yeoman.io/). If you're like me, and [Grunt](http://gruntjs.com/) or [Bower](http://bower.io/) are crazy talk, you will find in Yeoman a great way to start.

[![Yeoman](/images/bringing-grunt-and-bower-to-metro-bootstrap-yeoman.jpg)](http://yeoman.io/)

We have adopted bower for dependency management, so we can manage the dependencies in a declarative way. Now you can know the current dependencies looking at the bower.json file.

Since the metro-bootstrap release, we always work on .less files, but we also release the css file and a minified version of it. To do this, we used some tools like [SimpLESS](http://wearekiss.com/simpless) or [WinLess](http://winless.org/). This is over, now we leave this responsibility to Grunt. Grunt is the tool to compile the less files, minify the css files and release our page for GitHub Pages.

What have changed? Take a look.

## Repository structure

In the repository you will find the following directories:

    app/
    ├── fonts/
    │   └── (FontAwesome files)
    └── less/
        └── (metro-bootstrap less files)
    dist/
    ├── fonts/
    │   └── font-awesome/
    │   │   └── (FontAwesome files)
    └── css/
        ├── metro-bootstrap.css
        └── metro-bootstrap.min.css
    docs/
    └── (metro-bootstrap GitHub Pages)

We provide compiled CSS (`metro-bootstrap.css`) in the dist folder, as well as compiled and minified CSS (`metro-bootstrap.min.css`).

##Instaling Dependencies

We manage dependencies using Bower.
Run `bower install` to download the required dependencies.

If don't have Grunt installed, execute the following steps from the command line:

1. Make sure you have node.js installed.
2. Install bower with `npm install -g bower`.

## Compiling CSS

We compile metro-bootstrap using [Grunt](http://gruntjs.com/).
Run `grunt build` to compile the CSS into `/dist`.

If don't have Grunt installed, execute the following steps from the command line:

1. Make sure you have node.js installed.
2. Install `grunt-cli` globally with `npm install -g grunt-cli`.
3. Go to the `metro-bootstrap` directory, then run `npm install`. npm will look at package.json and automatically install the necessary dependencies.

Now, go fork it!
