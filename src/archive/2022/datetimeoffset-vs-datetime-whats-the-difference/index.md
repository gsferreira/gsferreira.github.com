---
layout: post
tags: post
date: 2022-10-25
title: DateTimeOffset vs DateTime - What's the difference?
description: Do you know that even Microsoft doesn't recommend using DateTime by default? They recommend using DateTimeOffset instead. Let's see why.
featured_image: /images/archive/highlight/datetimeoffset-vs-datetime.png
---

Do you use DateTime everywhere? Do you know that **Microsoft recommends DateTimeOffset as the default option**?

_"consider DateTimeOffset as the default date and time type for application development."_
([here](https://learn.microsoft.com/en-us/dotnet/standard/datetime/choosing-between-datetime))

But why? We know that DateTime can be risky. Who has never suffered from a missing UTC Conversion?! (crickets sound)

Who has not realized too late in the project that time localization was needed against all the odds?

## What's the problem with DateTime?

For those who may not know, a [DateTime](https://learn.microsoft.com/en-us/dotnet/api/system.datetime) value represents a date and time. There you can find a Kind property that provides data about the Time Zone. The problem is that it is limited. You have 3 possible values: Local (machine time zone), UTC, or Unspecified. That is not enough in a world with more than 40 time zones.

![DateTimeKind](/images/archive/dotnet/datetimekind.png)

**DateTime can't capture the exact moment of an event.** It's common to enforce that we only deal with UTC inside the system boundaries. The problem is that it requires discipline, which is difficult to enforce after a long period. And besides that, we can't say the original local time anymore.

### Scenario

Imagine that you are building a monitoring system for your company.

Your company has offices across multiple time zones.

One of the system requirements is that it should notify the person On Call if the alert happens outside of working hours. Alerts are triggered in the time zone where the Owner Team is located.

If you approach this problem by converting all the dates to UTC, you will lose the semantics of the Offset. The Offset is useful to understand if the DateTime is inside working hours or not. So, DateTime will not do the job.

## The solution

If you value the original local time, you can use the [DateTimeOffset](https://learn.microsoft.com/en-us/dotnet/api/system.datetimeoffset) structure.

The [DateTimeOffset](https://learn.microsoft.com/en-us/dotnet/api/system.datetimeoffset) structure represents a date and time value, together with an offset that indicates how much that value differs from UTC. Thus, **DateTimeOffset always identifies a single point in time**.

We can say that DateTimeOffset is like DateTime+Offset.

**Important:** DateTimeOffset doesn't give you the time zone, only the Offset. Based on the Offset, you can figure out a subset of time zones where it might have happened. If you want to know the exact time zone, you need to store the time zone. Why? Because it's common to have time zones overlapping.

## When is DateTime the solution?

Imagine that you are building an application to manage alarms. Like the one you have on your phone.

One of the most common use cases will be creating an alarm to wake up every day at 8 am. Simple.

The question is: Is the Offset important? Not really. You need a constant Date and Time. You need it to trigger at 8 am even if you change the time zone or daylight-saving time.

## Rule of thumb

The Offset doesn't have semantic value for you, or you are sure that you will **never** ever work with time zones, and UTC is enough? You can use DateTime.

Otherwise, use DateTimeOffset.

In case of doubt, use DateTimeOffset.

Let's keep in touch. You can find me on [Twitter (@gsferreira)](https://twitter.com/gsferreira).
