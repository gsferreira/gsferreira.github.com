---
layout: post
tags: post
date: 2022-01-24
title: Taking control over xUnit test names
description: What if we could take our xUnit test names a step further? Here we will see how.
featured_image: /images/archive/xunit/xunit-configuration-method-name-after.png
---

Unit Testing naming conventions are almost as conflicting as spaces versus tabs. I've never worked on a project where everyone has the same preferences.

Often, you even find multiple practices in the same codebase. They go from _Given_When_Then_ to _MethodUnderTest_Scenario_ExpectedResult_ or even variances where one person may use Pascal and another Snake case.

Often, we forget that **the most important thing is expressing clearly the test intent**. So, it's the question of how to make the most of those shapes or forms.

## xUnit Test name customization

The good news is that you have some ways to control xUnit behaviour in terms of test display names.

The simplest one is defining a custom Display Name through the Fact attribute.

```csharp
[Fact(DisplayName = "Get the max number of an array")]
public void GivenAnArray_WhenApplyMax_ThenGetThenBiggerOne()
{
    new[] { 12, 10, 20, 42 }
        .Max()
        .Should()
        .Be(42);
}
```

That will give you a higher degree of freedom, but it's an extra effort, difficult to keep consistent across the code. We already need to craft a meaningful method name, so having an extra-label may lead to out of sync text. We already know what happens to code comments. We don't need to deal with the same problem in tests.

## So, what can we do?

One interesting thing from xUnit is the [configuration files](https://xunit.net/docs/configuration-files).

There, you can find many options to change the default behaviours of xUnit. One of them is related to Display Name.

xUnit in .net will display names based on class and method name by default. With the configuration file, you can define the [display name](https://xunit.net/docs/configuration-files#methodDisplay) to be the Method name.

To do it, create a _`xunit.runner.json`_ file in the xUnit project root, make sure it's included and add the following snippet.

```json
{
  "$schema": "https://xunit.net/schema/current/xunit.runner.schema.json",
  "methodDisplay": "method"
}
```

To include, add to the _csproj_:

```xml
<ItemGroup>
    <Content Include="xunit.runner.json" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

Besides that, the most interesting thing is the [method display name options](https://xunit.net/docs/configuration-files#methodDisplayOptions), where you can find options to:

- Replace underscores with spaces;
- Replace operators with matching symbols (example: `eq becomes =`);
- Replace periods with a comma and a space.

To enable them, go to the _`xunit.runner.json`_ file and add a new key.

```json
"methodDisplayOptions": "replaceUnderscoreWithSpace,useOperatorMonikers"
```

So, for the following tests:

```csharp
public class DisplayNameTests
{
    [Fact]
    public void Given10_WhenMultiplyBy2_ThenGet20()
    {
        var result = 10 * 2;

        result.Should().Be(20);
    }

    [Fact]
    public void Is_20_gt_10()
    {
        20.Should().BeGreaterThan(10);
    }
}
```

Once you run the tests, you will see:

![xUnit / Result after changing method display name configuration](/images/archive/xunit/xunit-configuration-method-name-after.png)

Instead of:

![xUnit / Result before changing method display name configuration](/images/archive/xunit/xunit-configuration-method-name-before.png)

## Wrapping up

I don't say you must use this, but knowing that these features exist may be helpful to improve the readability of your tests when analysing the results. In some cases, the existing conventions may help achieve better results, like if you are using Snake casing, enabling the "_replaceUnderscoreWithSpace_" is a quick improvement.

Now it's time to take a look into your codebase, look into the existing configuration options, and you may find a quick win.

🔗 You can find the source code used [here](https://github.com/gsferreira/dotnet-playground/tree/main/Tests/xUnit/xUnitDisplayName).

I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
