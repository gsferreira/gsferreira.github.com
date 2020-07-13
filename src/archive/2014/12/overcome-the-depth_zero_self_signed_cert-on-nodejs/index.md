---
layout: post
tags: post
date: 2014-12-15

title: Overcome the DEPTH_ZERO_SELF_SIGNED_CERT on Node.js
category: Node.js
---

If you are making requests to a server that uses self-signed certificates in Node.js probably you already have seen the error DEPTH\_ZERO\_SELF\_SIGNED\_CERT.
That's an usual error, for instance, if you are working in a test environment.

I faced this error in my test environment and after google it, I got a lot of answers telling me to set the option "rejectUnhauthorized" as false on my request to the server.

But, that doesn't make me happy. Why?

<!--excerpt-->

Because I'm using other node modules that do requests to the same server and I will need to "hack" those modules to inject the rejectUnhauthorized attribute. Seems boring isn't it?!

So, what I've done?

![One row to rule them all!](/images/overcome-the-depth_zero_self_signed_cert-on-nodejs-one-row-to-rule-them-all.jpg)

I opened my node start file and I put there the following line of code:

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

If you, like me, want to apply this rule only to a test/development environment, you can do this:

    if ('development' == app.get('env')) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

Now you are conditioning it to the environment that you want.

Hope this helps.

-------------------
***UPDATE***

If you are thinking about applying this to Production environments, please read the comments below.
