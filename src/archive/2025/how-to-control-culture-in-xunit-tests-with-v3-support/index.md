---
layout: post
tags: post
date: 2025-10-30
title: How to Control Culture in xUnit Tests (with v3 Support)
description: Prevent flaky tests caused by system culture differences. Learn 4 ways to set culture in xUnit tests, including assembly-wide config in xUnit v3.
---

https://www.youtube.com/watch?v=I4sjGttgSUE

Ever had a test pass on your machine but fail on your colleague's. Or worse, in CI?  
You check the code. Looks fine. Rerun it. Still fails. 🤔

Whose fault? **System culture.**

Whether it's formatting a date or converting a decimal, regional settings can mess with your test results, especially in global teams.

Let's fix that.

We'll cover **4 ways** to control culture in xUnit, including a new v3 feature that lets you set a **default culture for the entire test assembly**.

### Why culture matters 🧠

```csharp
var amount = 1234.56;
var output = amount.ToString();
````

Depending on your system culture, `output` could be:

* `1,234.56` (US)
* `1.234,56` (Portugal)
* `1 234,56` (France)

If your test expects a specific format, it's flaky by design. Control the culture up front and move on with your life.
(Need to assert culture-specific outputs? [3 Fluent Assertions Features You Should be Using](/archive/2022/3-fluent-assertions-features-you-should-be-using/) covers DateTime and string assertions.)

---

### Option 1: Manually set culture in setup/teardown 

Use the constructor/`Dispose()` pattern when **all tests in the class** share the same culture.

```csharp
using System.Globalization;

namespace xUnitV3Culture.CultureAwareTestClass;

public class CultureAwareTests : IDisposable
{
    private readonly CultureInfo _originalCulture;
    private readonly CultureInfo _originalUiCulture;

    public CultureAwareTests()
    {
        // Store the original culture settings to restore them later
        _originalCulture = Thread.CurrentThread.CurrentCulture;
        _originalUiCulture = Thread.CurrentThread.CurrentUICulture;

        // Set the culture for this test
        Thread.CurrentThread.CurrentCulture = new CultureInfo("pt-PT");
        Thread.CurrentThread.CurrentUICulture = new CultureInfo("pt-PT");
    }

    [Fact]
    public void DateFormatting_UsesSpecifiedCulture()
    {
        // Arrange
        var date = new DateTime(2023, 4, 15);

        // Act
        var formatted = date.ToString("d");

        // Assert
        Assert.Equal("15/04/2023", formatted);
    }

    // IDisposable implementation to clean up after tests
    public void Dispose()
    {
        // Restore the original culture settings
        Thread.CurrentThread.CurrentCulture = _originalCulture;
        Thread.CurrentThread.CurrentUICulture = _originalUiCulture;
    }
}
```

**✅ Pros:** Simple and explicit.

**❌ Cons:** Doesn't scale if you need multiple cultures in one class.

---

### Option 2: Reusable fixture

Have **many classes** that should run with the same culture? Extract a small fixture to avoid repetition.

```csharp
public class CultureFixture : IDisposable
{
    private readonly CultureInfo _originalCulture;
    private readonly CultureInfo _originalUiCulture;

    public CultureFixture()
    {
        _originalCulture = Thread.CurrentThread.CurrentCulture;
        _originalUiCulture = Thread.CurrentThread.CurrentUICulture;
    }

    public void SetCulture(string cultureName)
    {
        Thread.CurrentThread.CurrentCulture = new CultureInfo(cultureName);
        Thread.CurrentThread.CurrentUICulture = new CultureInfo(cultureName);
    }

    public void Dispose()
    {
        Thread.CurrentThread.CurrentCulture = _originalCulture;
        Thread.CurrentThread.CurrentUICulture = _originalUiCulture;
    }
}
```

You could expand this pattern with attributes or base classes.

**✅ Pros:** Centralises culture logic; readable tests.

**❌ Cons:** A bit clunky if you want **different cultures per test** in the same class.

---

### Option 3: Per-test control with `BeforeAfterTestAttribute` 

The cleanest way to run **different tests with different cultures** in the same class.

Save the original culture in `Before()`, set the new one, and restore it in `After()`.

```csharp
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class UseCultureWithAttributeAttribute : BeforeAfterTestAttribute
{
    private readonly string _cultureName;
    private CultureInfo _originalCulture;
    private CultureInfo _originalUiCulture;

    public UseCultureWithAttributeAttribute(string cultureName)
    {
        _cultureName = cultureName;
    }

    public override void Before(MethodInfo methodUnderTest, IXunitTest test)
    {
        _originalCulture = Thread.CurrentThread.CurrentCulture;
        _originalUiCulture = Thread.CurrentThread.CurrentUICulture;

        Thread.CurrentThread.CurrentCulture = new CultureInfo(_cultureName);
        Thread.CurrentThread.CurrentUICulture = new CultureInfo(_cultureName);
    }

    public override void After(MethodInfo methodUnderTest, IXunitTest test)
    {
        Thread.CurrentThread.CurrentCulture = _originalCulture;
        Thread.CurrentThread.CurrentUICulture = _originalUiCulture;
    }
}
```

```csharp
[UseCultureWithAttribute("pt-PT")]
[Fact]
public void Formats_currency_in_Portuguese() { /* ... */ }

[UseCultureWithAttribute("es-ES")]
[Fact]
public void Formats_currency_in_Spanish() { /* ... */ }
```

**✅ Pros:** Very flexible; perfect for localisation scenarios.

**❌ Cons:** Small amount of boilerplate.

---

### Option 4 (xUnit v3): Assembly-wide default culture

xUnit v3 finally makes culture control a first-class citizen. No more custom attributes for the common case.

Set a **default culture for the entire test assembly** via `xunit.runner.json`:

```json
{
  "$schema": "https://xunit.net/schema/current/xunit.runner.schema.json",
  "culture": "en-GB"
}
```

Add it to your `.csproj` so it's copied to the output:

```xml
<ItemGroup>
  <Content Include="xunit.runner.json" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

Notes:

* Culture values follow **BCP 47** (e.g., `en-GB`, `pt-PT`, `fr-FR`, or `"invariant"`).
* Works across the whole assembly; override per test/class when you need to.
* Want more `xunit.runner.json` tricks? See [Taking control over xUnit test names](/archive/2021/taking-control-over-xunit-test-names/) for customising test display.
* **v3 runner:**
  `dotnet run -- -culture en-GB`

xUnit v3 officially supports overriding via CLI **or** config.

---

### TL;DR cheat sheet

| Scenario                                  | Best option                         |
| ----------------------------------------- | ----------------------------------- |
| All tests in a class use the same culture | Manual ctor/`Dispose()` (Opt. 1)    |
| Many classes share the same culture       | Fixture (Opt. 2)                    |
| Different tests need different cultures   | `BeforeAfterTestAttribute` (Opt. 3) |
| You want a safe default baseline          | Assembly-wide config (Opt. 4 ✅)     |

---

### Parallelism + culture (gotcha)

xUnit runs **test collections in parallel** by default.
If you mutate culture, do it **per test** and **restore it** (Options 1 & 3), or set a **fixed baseline** assembly-wide (Option 4).

Avoid *set-once-never-restore* patterns. They create cross-test leaks when parallelism is on.
(xUnit v3 documents the culture override as assembly-wide.)

---

### Final thoughts 💬

If you've ever shipped a test that only fails on someone else's machine, culture probably did you in. 
With xUnit v3, it's now trivial to **lock down culture** and kill that class of flakiness.

My move:

1. On v3, set a **default culture** via `xunit.runner.json` (`en-GB`, `en-US`, your pick).
2. Use per-test `UseCulture` when you're **intentionally** verifying localised behaviour.

**Want more v3 goodies?**
Check out [A Small but Powerful Feature in xUnit v3 You'll Use Everywhere](/archive/2025/a-small-but-powerful-feature-in-xunit-v3-youll-use-everywhere/) for another game-changing v3 feature.

**Want to try all these options yourself?**
I've put together a small sample project with every approach ready to run. From manual setup to the new xUnit v3 config.

👉 [Grab the full source code for free](https://gui-ferreira.kit.com/f05f1a7895) and see which one fits your team best.
