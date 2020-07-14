---
layout: post
tags: post
date: 2016-12-07

title: Adding Custom Arguments to Topshelf
category: .NET
---

[Topshelf](http://topshelf-project.com/) is an amazing framework that let you easily host and build Windows services.

Topshelf is really extensible, but recently I struggled to find how to configure a custom argument to the service.

This post is simple tip to help you create custom arguments to a [Topshelf](http://topshelf-project.com/) service and use it in the command line.

This can be accomplished simply using the Host Configurations.

If you use the method _"AddCommandLineDefinition"_ you will be able to specify the name of your argument (case sensitive) and how you want to use it.

You can find here a simple example.

<script src="https://gist.github.com/gsferreira/615526c3b10fbefcc49caaa4dafed57e.js"></script>

Then you can execute your service sending your argument as you can see in the following example (command line invoke).

```
	.\TopShelfCustomArgs.exe run -path:"c:\temp" -frequency:2
```

Hope this helps.
