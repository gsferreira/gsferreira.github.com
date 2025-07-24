---
layout: post
tags: post
date: 2020-07-24
title: Eleventy - The Simplest Static Site Generator
description: Migrate to Eleventy static site generator - simplest 11ty setup, GitHub Pages hosting, markdown support, and Gatsby comparison.
featured_image: /images/archive/eleventy/logo.jpg
---

Eleventy is the simplest Static Site Generator that I know. I know that this is a bold statement and you can prove me wrong. But [Eleventy (11ty)](https://www.11ty.dev/) was the simplest static site generator that I found when I needed to migrate my blog. Eleventy may not be the best or the powerful one but is beautifully simple.

![Eleventy](/images/archive/eleventy/logo.jpg)

## The goal

I have been thinking about moving my blog to a different framework. I was using [Sandra.Snow](https://guiferreira.me/archive/2014/05/reasons-to-blogging-with-github-pages-and-sandra-snow/), that not have been updated recently.

My goal was to keep using a Static Blog, hosting on GitHub Pages. I want to write using markdown. It was also important to be able to keep the same URLs and migrate all the content to the new framework. I also would like the blog not need JavaScript to display the blog posts. Those are the requirements.

## The obvious choices

In the top of my mind, I knew that [Gatsby](https://www.gatsbyjs.org/) and [NextJS](https://nextjs.org/) were able to do the job. I was more inclined to try out Gatsby since there are many starters to create a blog. I don't have experience with Gatsby or NextJS, so, it was important to me to not need to much time to do the work. So, the learning curve was also an important factor.

My first attempt was with Gatsby. I installed the [starter blog](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-blog/) and I tried to migrate my content to Gatsby. I have to confess that after a few hours I was stuck. I couldn't accomplish my task without investing to much time to learn the framework. After a few problems, I was finding myself searching through the web to have a clue of what should I do.

Gatsby was taking so much time that I decided to take a bet on NextJS. I knew beforehand that I didn't have so many starters/templates as in the Gatsby ecosystem. Even so, I was expecting to have results faster.

I picked [Telmo blog](https://web.archive.org/web/20200725231939/https://telmo.im/writings/open-sourcing-blog) as a starting point and I tried to move my content. The results show up faster!

But, there was something that I didn't like and I didn't find a way to overcome. Even with the [static HTML export](https://nextjs.org/docs/advanced-features/static-html-export) build, I needed JavaScript enabled to display the content. Probably was because of my lack of knowledge, but after a few hours, I didn't have a clue of what should I do.

## Eleventy

I was tired of fighting with Gatsby and NextJS. Something simpler was needed. I recall seeing a blog post from [David Neal](https://reverentgeek.com/) about moving his blog to a different technology. The technology is Eleventy. You can read his blog post [here](https://reverentgeek.com/moving-from-ghost-to-eleventy/).

After reading a few things, I start feeling excited. Eleventy seems simple and quick to learn. The learning curve doesn't seem to steep. It feels natural to create pages with it. I see it as Templating Language on steroids.

So, I start working to move my blog into Eleventy. I started with the [MF Blog Starter Template](https://web.archive.org/web/20240301000000*/https://github.com/marcfilleul/mf-blogstarter). After a few hours, I had most of the job done. Without tricks and without needing to search the web to find what I want. The [Eleventy documentation](https://www.11ty.dev/docs/) was just enough.

I can't recommend it more. If you are planning to use a Static Site Generator, give Eleventy a try. Probably something simple is enough.

You can find [here the source code for my blog](https://github.com/gsferreira/gsferreira.github.com). I hope it can be helpful.
