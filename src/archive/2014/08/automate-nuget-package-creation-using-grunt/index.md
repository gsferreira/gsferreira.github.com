---
layout: post
tags: post
date: 2014-08-29

title: Automate NuGet package creation using Grunt
---

Probably you are already using Grunt, to automate the tasks to build your application or library. In [metro-bootstrap](https://github.com/TalksLab/metro-bootstrap) we are using Grunt to automate the build process, but until now there's a last step that we are doing manually: **create the NuGet package** for new releases, until today.

How we automate the package build?

It's simpler than it seems.

### 1. Install nuget

First make sure that you have nuget.exe in your machine.

**Is NuGet.exe in your PATH?**

1. Open a command prompt.
2. Type _nuget_ and hit enter.
  - If the nuget help documentation is displayed, then nuget.exe is already in your PATH.
  - If you received the message, "'nuget' is not recognized as an internal or external command, operable program or batch file." then nuget.exe is not in your PATH.

**How to add NuGet.exe to your PATH?**

1. Open a command prompt.
2. Enter the following command: _set PATH=%PATH%;C:\nuget_ where "c:\nuget" is the path to the nuget.exe ([available here](http://docs.nuget.org/docs/start-here/installing-nuget#Installing_a_CI_build)).

### 2. Create the NuGet definition file

Create the following XML file with the definition for the package with the _".nuspec"_ extension.

```xml
<?xml version="1.0"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        <!--
        ID used to identify the nuget package
        -->
        <id>metro-bootstrap</id>
        <!--
        Package version - leave this blank
        -->
        <version>0.0.0</version>
        <!-- Author, Owner and Licensing details -->
        <authors>TalksLab</authors>
        <owners>TalksLab</owners>
        <requireLicenseAcceptance>false</requireLicenseAcceptance>
        <copyright>Copyright 2014</copyright>
        <!-- General Information -->
        <description>metro-bootstrap: Twitter Bootstrap with Metro style</description>
        <releaseNotes>-</releaseNotes>
        <tags>twitter bootstrap css metro responsive html5 talkslab</tags>
        <!--
        Packages (incl. minimum version) on which this package
        depends
        -->
        <dependencies>
          <dependency id="Twitter.Bootstrap.Less" version="3.2.0.1" />
        </dependencies>
    </metadata>
    <files>
        <file src="app\less\*" target="content\Content\metro-bootstrap" />
        <file src="dist\css\metro-bootstrap.css" target="content\Content" />
        <file src="dist\css\metro-bootstrap.min.css" target="content\Content" />
    </files>
</package>
```

Define in the files element the files to copy to the package.
If you want to test the nuspec file, just type the following command in the command line (where mypackage.nuspec is the name of the nuspec file).

```text
nuget pack mypackage.nuspec
```

### 3. Create grunt task to build the NuGet package

In order to create the file, go to the grunt script and add the following task (just rename the definition file name):

```js
grunt.registerTask("nuget", "Create a nuget package", function () {
  var done = this.async();
  //invoke nuget.exe
  grunt.util.spawn(
    {
      cmd: "nuget.exe",
      args: [
        //definition file
        "pack",
        "metro-bootstrap.nuspec",

        //path where the package should be created
        "-OutputDirectory",
        "nuget",

        //override the version using the version in package.json
        "-Version",
        grunt.config.get("pkg").version,
      ],
    },
    function (error, result) {
      if (error) {
        grunt.log.error(error);
      } else {
        grunt.log.write(result);
      }
      done();
    }
  );
});
```

Now, just open the command line and run the _"grunt nuget"_ command, and a nuget package will be created.

The configuration used in this post is running on [metro-bootstrap](https://github.com/TalksLab/metro-bootstrap) library. Fill free to fork it and try.

I hope this helps you.
