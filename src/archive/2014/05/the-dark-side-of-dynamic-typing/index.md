---
layout: post
tags: post
date: 2014-05-08

title: The dark side of dynamic typing
category: .NET
---

[Dynamic typing](http://msdn.microsoft.com/en-us/library/dd264736.aspx) isn't anything new in the .NET Framework world, he is available since .NET 4.0 and I'm sure that you have used it. If you didn't, you should take a spare of time for it. Dynamic typing is great because it let you get your work done faster and it may avoid some complicated reflection code, for example. I've used it a lot, but recently I've discovered his dark side... **the performance side**. 
<!--excerpt-->

![alt text](http://www.quickmeme.com/img/e8/e8e8d6ebfd29823854295376337528dc9853a26b27f43c85dd8eb0ed0ab666dc.jpg)

Why do I say it? If you measure the performance cost of a simple "Set" or "Get" operation you will see a great improvement simply changing it to typed code. You can use the following code to test it.

    //Typed Object performance - SET PERFORMANCE
    MyClass myObject = new MyClass();
    sw.Reset();
    sw.Start();
    myObject.Str = "Hello World!";
    sw.Stop();
    Console.WriteLine("Typed Object - SET - Elapsed={0}", sw.Elapsed);


    //Typed Object performance - GET PERFORMANCE
    sw.Reset();
    sw.Start();
    result = myObject.Str;
    sw.Stop();
    Console.WriteLine("Typed Object - GET - Elapsed={0}", sw.Elapsed);


    //Dynamic Object performance - SET PERFORMANCE
    dynamic myDynamicObject = new MyClass();
    sw.Reset();
    sw.Start();
    myDynamicObject.Str = "Hello World!";
    sw.Stop();
    Console.WriteLine("Dynamic Object - SET - Elapsed={0}", sw.Elapsed);

    //Dynamic Object performance - GET PERFORMANCE
    sw.Reset();
    sw.Start();
    result = myDynamicObject.Str;
    sw.Stop();
    Console.WriteLine("Dynamic Object - GET - Elapsed={0}", sw.Elapsed);


With this piece of code inside a loop I got the following results. You can see the time differences.

- Typed Object - GET - Elapsed=00:00:00.0000022
- Typed Object - SET - Elapsed=00:00:00.0000008
- Dynamic Object - GET - Elapsed=00:00:00.0330937
- Dynamic Object - SET - Elapsed=00:00:00.0027800
- Typed Object - GET - Elapsed=00:00:00
- Typed Object - SET - Elapsed=00:00:00.0000004
- Dynamic Object - GET - Elapsed=00:00:00.0000031
- Dynamic Object - SET - Elapsed=00:00:00.0000026
- Typed Object - GET - Elapsed=00:00:00.0000004
- Typed Object - SET - Elapsed=00:00:00.0000004
- Dynamic Object - GET - Elapsed=00:00:00.0000022
- Dynamic Object - SET - Elapsed=00:00:00.0000026
- Typed Object - GET - Elapsed=00:00:00.0000004
- Typed Object - SET - Elapsed=00:00:00.0000004
- Dynamic Object - GET - Elapsed=00:00:00.0000022
- Dynamic Object - SET - Elapsed=00:00:00.0000022

I'm not trying to tell you to keep a safety distance from dynamic typing, I'm just saying that if you're building an application where the performance is a key factor, where you don't need dynamic typing and you really need to pay attention to any fraction of second... so you should keep an eye on it. 