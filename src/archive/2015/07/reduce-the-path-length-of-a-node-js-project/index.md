---
layout: post
tags: post
date: 2015-07-09

title: Reduce the path length of a Node.js project
category: Node.js
---

Are you fighting with the path length of your Node.js projects?

If you are using Microsoft Visual Studio to development, I bet you do. If you don't, you will (this isn't any curse that I'm throwing at you)!

Windows has the "Maximum Path Length Limitation" that is terrible for Node.JS projects.

> _"The specified path, file name, or both are too long. The fully qualified file name must be less than 260 characters, and the directory name must be less than 248 characters."_

As you know, when you install a package in Node.js, the npm will place the dependencies under the package folder. This process is recursive for each package, so you can easily overcome the path length.

Unfortunately, there's no silver bullet to fix it (I'm not a Node.js guru, so please let me know if I'm wrong), but we can follow some tips to deal with it.

![dependencies everywhere](/images/reduce-the-path-length-of-your-node-js-project-dependencies-dependencies-everywhere.jpg)

### 1. Azure Cloud Services - Change the output directory

If you are getting an error when you publish your cloud service to azure, it's probably because the deployment will place the output into a subfolder.
I've already had [blogged how to deal with it and you can find it here](https://gsferreira.com/archive/2014/11/azure-deploy-and-the-path-length-limitation/).

### 2. Find the packages that are leading you into the limit and install them

Imagine that you install a package that has a dependency from _request_ and that dependency made you overcome the path limit.
Go to the npm and install the package explicitly. Now, Node.js will not install the request in a subfolder of your first package.

```
	npm install request --save
```

### 3. Remove dev packages

Install the packages with the _"--production"_ flag to remove all development only packages.

```
	npm install --production
```

### 4. Remove duplicated packages

Npm has a command that will find for you the duplicated dependencies and install them as top dependencies.
With a simple command you can simplify your dependency tree and reduce your project size.

```
	npm dedupe
```

Hope this helps. Feel free to leave comments and ask questions.
