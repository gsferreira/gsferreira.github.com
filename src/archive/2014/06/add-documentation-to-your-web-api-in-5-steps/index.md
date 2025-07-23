---
layout: post
tags: post
date: 2014-06-27

title: Add documentation to your Web API in 5 steps
description: Auto-generate ASP.NET Web API documentation in 5 steps using HelpPage package. Create XML comments and interactive API docs effortlessly.
category: .NET, ASP.NET
---

APIs are created to expose the system to other developers, so we need to provide documentation that explain how to use our API.

So far, so good, but maintain documents manually is a kind of boring. What about auto-generate it?

Well, if you are using ASP.NET Web API this is a piece of cake.

How to add documentation to your ASP.NET Web API?

1. Install "_Microsoft.AspNet.WebApi.HelpPage_" package from nuget. (If you are using VB.NET install "_Microsoft.AspNet.WebApi.HelpPage.VB_"). This package will create an Area called "Help" in the API project.
2. Make sure that you have the following code in the "_Application_Start_" method at your Global.asax file: _AreaRegistration.RegisterAllAreas();_
3. Documentation will be available in the _/Help_ URI. So, just add a link to it in your application.
4. To enable the XML Documentation comments, open the file _Areas/HelpPage/App_Start/HelpPageConfig.cs_ and uncomment the line "_config.SetDocumentationProvider(new XmlDocumentationProvider(HttpContext.Current.Server.MapPath("~/App_Data/XmlDocument.xml")));_"
5. In Solution Explorer, right-click the project, select Properties, then go to the _Build_ page. In the _Output_ section check the _XML documentation file_ property and set the text box with the value "App_Data/XmlDocument.xml".

Now you are able to start adding comments to your Web API methods, as you can see in the following example:

```csharp
    /// <summary>
    /// Get text by ID
    /// </summary>
    /// <param name="id">ID used to get the result text.</param>
    public string Get(int id)
    {
        return "value";
    }
```

Build your application and you are done! Now, if you want to do some advanced stuff, I recommend that you take a look into the following posts:

- [Creating Help Pages for ASP.NET Web API](http://www.asp.net/web-api/overview/creating-web-apis/creating-api-help-pages)
- [Advanced Help Page customizations](http://blogs.msdn.com/b/yaohuang1/archive/2012/12/10/asp-net-web-api-help-page-part-3-advanced-help-page-customizations.aspx)
- [Introducing the ASP.NET Web API Help Page](http://blogs.msdn.com/b/yaohuang1/archive/2012/08/15/introducing-the-asp-net-web-api-help-page-preview.aspx)

I hope this helps you.
