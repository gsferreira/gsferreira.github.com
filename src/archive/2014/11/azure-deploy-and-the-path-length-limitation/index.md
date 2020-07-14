---
layout: post
tags: post
date: 2014-11-27

title: Azure deploy and the path length limitation
category: Azure
---

Windows has that boring thing, the "Maximum Path Length Limitation". That can be a terrible headache when you are dealing with Azure Cloud Service deploy.

If you create your projects in the Visual Studio default folder (_C:\Users\USER\Documents\Visual Studio 2013\Projects_) or in a longer path, probably you already have faced the error:

> _"The specified path, file name, or both are too long. The fully qualified file name must be less than 260 characters, and the directory name must be less than 248 characters."_

To fix this:

1.  Go to the Cloud Service project folder.
2.  Edit the user cloud service options file (_\*.ccproj_ file) in notepad.
3.  Add the ServiceOutputDirectory element with the value _"c:\azure"_ for example.
4.  Open the solution in Visual Studio again and the error has gone.

Example:

```xml
    <?xml version="1.0" encoding="utf-8"?>
    <Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
      <PropertyGroup>
        <Name>WorkerRole</Name>
        <ServiceOutputDirectory>c:\azure\</ServiceOutputDirectory>
      </PropertyGroup>
    </Project>
```

Hope this helps.
