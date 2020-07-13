---
layout: post
tags: post
date: 2016-02-03

title: The shining new C# Scripting API
category: .NET 
---

**Say hello to the new Scripting Language: C#!**

Since the first days the .NET platform lacks scripting capabilities compared to dynamic languages like JavaScript or Ruby, but those days are over.

Why this is awesome?! If you are familiar with the capabilities that VBA brings the Office users and how many "Excel VBA Programming" books were sold to non developers, you will understand why.
And it's [open source](https://github.com/dotnet/roslyn/tree/master/src/Scripting)!!!
  

<!--excerpt-->

In the past few years we have been following the growing of the new .NET Compiler, commonly known as Roslyn. 

One of the great features of Roslyn is the Scripting API. The scripting API can enable applications to evaluate code at runtime providing the API to implement an excellent scripting experience.

In December Microsoft finally released the Roslyn version 1.1.1 (stable version) in nuget that includes the Scripting API (that has been removed from Roslyn 1.0 release by the team). 

Here you can find some examples of how to use the scripting API and what you can do with it.

##How to start

Install the nuget Scripting package ([Microsoft.CodeAnalysis.CSharp.Scripting](http://www.nuget.org/packages/Microsoft.CodeAnalysis.CSharp.Scripting/)) in your project.

In the following example I used the version 1.1.1.

	Install-Package Microsoft.CodeAnalysis.CSharp.Scripting -Version 1.1.1


##Expression evaluation

Evaluate the result of an C# expression.

	object result = null;
	
	CSharpScript.EvaluateAsync("System.DateTime.Today.Year")
		.ContinueWith(s => result = s.Result).Wait();
	
	Assert.AreEqual(DateTime.Today.Year, result);

##Expression evaluation with strong type

Evaluate an expression with an expected result type. 

	int result = 0;

    CSharpScript.EvaluateAsync<int>("100 * 2")
		.ContinueWith(s => result = s.Result).Wait();

    Assert.AreEqual(200, result);


##Evaluation with parameters

Send parameters to the expression and use them in the script logic. 

    public class Globals
	{
		public int NumberOfStudents;
    	public int StudentsPerClass;
	}

	var globals = new Globals { NumberOfStudents = 80, StudentsPerClass = 15 };
	
	int result = 0;
    CSharpScript.EvaluateAsync<int>("NumberOfStudents/StudentsPerClass", globals: globals)
    	.ContinueWith(s => result = s.Result).Wait();

	Assert.AreEqual(globals.NumberOfStudents / globals.StudentsPerClass, result);

##Build a script and run it multiple times

The scripting API enables you to create an expression and then use it multiple times, removing the compile time of the remaining evaluations.

	var script = CSharpScript.Create<decimal>("NumberOfStudents/StudentsPerClass", globalsType: typeof(Globals));
    
	script.Compile();
    
	for (int i = 1; i < 10; i++)
    {
    	script.RunAsync(new Globals { NumberOfStudents = i, StudentsPerClass = 5 })
			.ContinueWith(s => 
				Assert.AreEqual(i / 5, s.Result.ReturnValue))
			.Wait();
	};


##References

The script can use references to other assemblies with a simple instruction.

    string result = string.Empty;
	
	CSharpScript.EvaluateAsync<string>("System.Configuration.ConfigurationManager.AppSettings[\"MyValue\"].ToString()", 
    ScriptOptions.Default.WithReferences(typeof(System.Configuration.ConfigurationManager).Assembly))
		.ContinueWith(s => result = s.Result).Wait();
	
	Assert.AreEqual(ConfigurationManager.AppSettings["MyValue"].ToString(), result);

##Imports


	int result = 0;
    CSharpScript.EvaluateAsync<int>("DateTime.Today.Year",
    ScriptOptions.Default.WithImports("System"))
    	.ContinueWith(s => result = s.Result).Wait();

	Assert.AreEqual(DateTime.Today.Year, result);

##Dynamic Support

To use dynamic objects in scripts we need to add a reference to the *System.Code*, *Microsoft.CSharp* and *System.Dynamic*.

	int result = 0;
    
	CSharpScript.EvaluateAsync<int>(@"
		dynamic value = 30;
    	return value;",
	ScriptOptions.Default.WithImports("System.Dynamic")
		.AddReferences(
			Assembly.GetAssembly(typeof(System.Dynamic.DynamicObject)),  // System.Code
			Assembly.GetAssembly(typeof(Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo)),  // Microsoft.CSharp
			Assembly.GetAssembly(typeof(System.Dynamic.ExpandoObject))  // System.Dynamic
		))
		.ContinueWith(s => result = s.Result).Wait();

	Assert.AreEqual(30, result);


##Access to script variables

	var globals = new Globals { NumberOfStudents = 80, StudentsPerClass = 10 };

	ScriptState state = null;
	
	CSharpScript.RunAsync(@"
    	bool shouldOpenClass = NumberOfStudents >= StudentsPerClass;
		int numberOfClasses = NumberOfStudents/StudentsPerClass;
	", globals: globals)
	.ContinueWith(s => state = s.Result).Wait();
	
	Assert.AreEqual(true, state.GetVariable("shouldOpenClass").Value);
    Assert.AreEqual(8, state.GetVariable("numberOfClasses").Value);


Those are just a few examples and I recommend you check out the [Roslyn Github Repository](https://github.com/dotnet/roslyn).
