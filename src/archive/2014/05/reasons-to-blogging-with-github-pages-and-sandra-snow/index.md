---
layout: post
tags: post
date: 2014-05-31

title: Reasons to blogging with GitHub Pages and Sandra.Snow
description: Why choose GitHub Pages and Sandra.Snow over WordPress for .NET developers - markdown writing, no database, version control, and zero maintenance.
---

This is my second try to create a personal blog and the third blog where I'm writing. The first two experiences were in WordPress.

In the past, my attempts failed by my fault, lack of commitment... But during the process, I learned how hard is to maintain a self hosted blog.

Create content to a blog is really time-consuming, so I don't need more work to maintain it. Maybe this is my Developer side telling me to stay away from maintenance tasks, like update packages and be sure that I'm not hacked.

let's be realistic, when we're a blogger **the focus should be the content**, the other tasks are just a black hole for the precious free time.

![Gollum - My Precious Time](/images/reasons-to-blogging-using-github-pages-and-sandra-snow-my-precious-time.jpg)

So, what I was looking for when I started this page?!

1. Write using markdown
2. Comments using Disqus
3. Easy customization
4. Reduce the infrastructure costs
5. A lightweight blog
6. No database
7. Version control/Hitory

Based on these requirements, I found [Jekyll](https://jekyllrb.com/) hosted over [GitHub Pages](https://pages.github.com/). It fits perfectly and the number of users active can attest it. The downside?! I need ruby to use it. Since I'm a Windows guy and in my professional life I'm mostly connected to .NET Developement I don't want to install ruby on my machines.

A friend of mine ([@NelsonReis](https://twitter.com/NelsonReis)) suggested I look at [Sandra.Snow](https://github.com/Sandra/Sandra.Snow), a system inspired by Jekyll, which is **written in .NET and [Nancy](https://nancyfx.org/)**, by [Phillip Haydon](https://twitter.com/philliphaydon) and [Jonathan Channon](https://twitter.com/jchannon). So, I picked it! Now my website is generated using Sandra.Snow and hosted on GitHub pages.

During the process, I created [_letsnow_](https://github.com/gsferreira/letsnow), a simple theme based on snowbyte theme. You can use it, fork it and contribute. I would love to hear your opinion.

Well, I could describe here how I did it, but since there's already a lot of good articles of it, I leave you here some to guide you. You will see that it's a piece of cake.

- ["Introducing Sandra.Snow"](https://www.philliphaydon.com/2013/10/01/introducing-sandra-snow/) by Phillip Haydon
- ["Hello Sandra Snow"](https://www.macsdickinson.com/blog/2013-12-12-Hello-Sandra-Snow/) by Macs Dickinson
- ["Blogging with Markdown & Deploying via Git - Introducing Sandra.Snow"](https://blog.jonathanchannon.com/2013/10/01/blogging-with-markdown-and-git/) by Jonathan Channon

![Feel like a superhero](/images/reasons-to-blogging-using-github-pages-and-sandra-snow-feel-like-superhero.png)

**What I hope to see in Sandra.Snow in a near future?!**

- Generate RSS feeds for any category
- More configuration options, like Google Analytics ID or Disqus ID
- A "marketplace" for Sandra.Snow blog templates

It's too early to say that Sandra.Snow is perfect for me, but I hope that it was a wise decision!
