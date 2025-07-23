---
layout: post
tags: post
date: 2018-06-27
title: Versioning .net Core applications using Cake
description: Version .NET Core applications with Cake Build - Directory.Build.props integration, automated versioning, and build strategies.
category: Cake, .net, .net Core
---

If you are moving to .net Core and you want to implement a versioning strategy in your application, now you have an awesome alternative to the good old fellow "AssemblyInfo".

The alternative is the [_Directory.Build.props_](https://docs.microsoft.com/en-us/visualstudio/msbuild/customize-your-build) file. If you place these file in the root folder that contains your source code, when MSBuild runs will add to every project the properties defined in the _Directory.Build.props_.

In this post, we will see how to quickly setup a solution with multiple projects and use _Directory.Build.props_ with [Cake](http://cakebuild.net) to build and increment the version number.

![Directory.Build.props](/images/versioning-a-net-core-applications-using-cake-directory-build-props.png)

## Setup your project

Let's use the [.net Core CLI](https://docs.microsoft.com/en-us/dotnet/core/tools/?tabs=netcore2x) to quickly accomplish this task.

Start by creating a folder in your computer and then open the command line and go to the directory that you just created. Then execute the following commands.

1. Create a Solution: `dotnet new sln --name DotNetCoreVersioning`
2. Create a console application and place it in the _src_ folder: `dotnet new console --name Application --output src\Application`
3. Create a class library and place it in the _src_ folder: `dotnet new classlib --name Library --output src\Library`
4. Add the console application to the solution: `dotnet sln add .\src\Application\Application.csproj`
5. Add the class library to the solution: `dotnet sln add .\src\Library\Library.csproj`
6. Build it: `dotnet build`

If you go to the folder you will see a solution file that you can open in Visual Studio.

## Adding the _Directory.Build.props_

Now it's time to add the file that will do the magic.

You just need to create a file with the name _Directory.Build.props_ inside the _src_ folder.

Add it and then copy the following snippet into it.

```xml
<Project>
<PropertyGroup>
    <Company>Empire</Company>
    <Version>1.0.1</Version>
    <AssemblyTitle>Death Star - Superlaser</AssemblyTitle>
</PropertyGroup>
</Project>
```

If you run the `dotnet build` command and go to the bin folder, of the console application or the class library, you can see in the DLL details that now the version is 1.0.1.

**NOTE: The casing is important if you want to use a Linux machine to run your build. Otherwise, the version may be 1.0.0.**

## Incrementing the version number.

In this example, I will use a simple Cake script to increment the version number.

### Setup your build script

I will explain how to do that manually, but if you are a [Visual Studio Code](https://code.visualstudio.com/) user I highly recommend that you install the cake extension and use the tools provided by the extension.

1. Install the Cake bootstrapper. You can find [here](https://cakebuild.net/docs/tutorials/setting-up-a-new-project) how to do that.
2. Create a _build.cake_ file next to the bootstrapper.
3. Add the following snippet to the build.cake.

&nbsp;

```csharp
///////////////////////////////////////////////////////////////////////////////
// ARGUMENTS
///////////////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

///////////////////////////////////////////////////////////////////////////////
// TASKS
///////////////////////////////////////////////////////////////////////////////

Task("Version")
    .Does(() => {
});

Task("Build")
    .IsDependentOn("Version")
    .Does(() => {
        DotNetCoreBuild("./DotNetCoreVersioning.sln");
});

Task("Default")
    .IsDependentOn("Build");

RunTarget(target);
```

Your build has now two steps and is building your solution using _DotNetCoreBuild_.

### Increment the version number

To increment the version number we need to update the _Directory.Build.props_ file.

Since the _props_ file is an XML we can use the Cake [XML aliases](https://cakebuild.net/dsl/xml/) like XmlPeek and XmlPoke to read and update the version number.

**Note:** _I recommend you to use the Build Number of your build server to calculate the new version number. In this case, we will read the current version from the file content._

Go ahead and copy the following snippet into the _Version_ task in your _build.cake_ file.

```csharp
var propsFile = "./Directory.Build.props";
var readedVersion = XmlPeek(propsFile, "//Version");
var currentVersion = new Version(readedVersion);

var semVersion = new Version(currentVersion.Major, currentVersion.Minor, currentVersion.Build + 1);
var version = semVersion.ToString();

XmlPoke(propsFile, "//Version", version);
```

As you can see, we are reading the version property, incrementing the build number and then updating the _props_ file again.

### The result

Now that our build script is completed, go ahead and run your Cake bootstrapper (_build.ps1_ or _build.sh_) and you will see that the compiled DLLs from all the projects have the version incremented.

You can use the _Directory.Build.props_ to customize other project properties, not only for versioning.

Go ahead and give it a try.

