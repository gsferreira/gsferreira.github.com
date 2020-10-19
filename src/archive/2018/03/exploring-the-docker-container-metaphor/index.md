---
layout: post
tags: post
date: 2018-03-05
title: Exploring the Docker Container metaphor
description: Containers is one of the hot topics in the Software Development world and Docker is the technology that everyone wants to play with. Thanks to this hype, everyone has at least a brief idea of what a container is.
category: Docker
featured_image: /images/exploring-the-docker-container-metaphor-docker.png
---

_This post is my interpretation of the Container metaphor and how I use it to understand the concepts and explain containers to others._

Containers is one of the hot topics in the Software Development world and Docker is the technology that everyone wants to play with.

Thanks to this hype, everyone has at least a brief idea of what a container is. The problem is that we can easily be confused about what containers really are and the advantages of it.

I faced the same problem and, in my case, explore the container metaphor helped me to understand it.

## So, why containers?

As you know, the Docker logo is a blue whale fully loaded with shipping containers, remembering us of a ship. The ship is a key part in this story.

[![Docker](/images/exploring-the-docker-container-metaphor-docker.png)](https://docker.com/)

Imagine that you have a company in Europe and you want to transport your products to China by sea. So, you can find a ship with the adequate size and load the Ship with your cargo.

_Metaphor: In the software world, the ship is your Server._

In a local trading association you find out that other companies are also sending products to China and you all can use a bigger Ship and send your products together to save some money.

The question is: Should that big Ship carry the smaller boats?

![Ship of Ships](/images/exploring-the-docker-container-metaphor-ship-of-ships.png)

Obviously not! No one would do that!

_Metaphor: Here, the big Ship is your server and the smaller ships are virtual machines. In this case, we have multiple Ships with all the capabilities to travel to China, but they are all constrained to the capacity and limitations of the big ship._

If we have a big ship we load the ship with the cargo of every company.

But, you have to face a few challenges:

1. How to be sure that the Cargo of a Port Wine company won't damage or contaminate the Cargo of other company?
2. How to isolate the cargo?
3. How to be sure that the cargo is inviolated?
4. How to make sure that the cargo is being transported in the best conditions (correct temperature for instance)?

Well, you can put the cargo into containers.

_Metaphor: In software, you are now loading the Server with containers. Containers will guarantee you that the software is isolated, protected and that a Container will take care what it needs, not the ship. Other benefit is that Containers are immutable so you can be pretty sure that your container won't be violated._

Obviously you are now in a better situation then having a big Ship carry over small ships. But, **don't forget that even an empty Container is pretty heavy**. Heavier then a few boxes.

_Metaphor: This is a common misconception. The idea that a container is extremely lightweight is dangerous unless you are comparing it to Virtual Machines. In other case you are taking the risk of the other person think that containers are even lighter then running in the bare metal._

A cool thing about Shipping Containers is that they are pretty standard and modular. You can assume that when the ship arrives in China, there will be a Truck that can transport it and that the container can return in a different ship. **Shipping containers are ship agnostic.**

_Metaphor: That's another advantage of a container. Containers are pretty standard and without additional effort they can run in any Cloud or Server and be sure that they are self-sufficient._

[![Containers](/images/exploring-the-docker-container-metaphor-containers.jpg)](https://unsplash.com/photos/uBe2mknURG4)

## Composing

How could you be sure that you have two ships loaded in the same way? How to be able to say that they are "equal" in terms of cargo?

Well, since we can't 3D print a ship capable of transport this (at least in 2018), you will need to document the process. You need to explain how the ship is setup with all containers, explaining the position of each container, what is the cargo and how the multiple containers are interconnected.

_Metaphor: In Docker you use the Docker Compose to accomplish that. Compose is a command that uses a configuration file to know how to build multiple images and how they relate with each other._

## The Economic side

What is more expensive?

1. Sending a big ship carrying small ships or containers?
   _Metaphor: A Server with Virtual Machines or Docker Containers?_
2. Is it better to load the cargo in a repeatable way, right? _Metaphor: Docker file and Docker compose are important tools to remove the uncertainty of new deployments._
3. Wouldn't be nice to don't contaminate the cargo of one company because of a problem in other company products? _Metaphor: Isolation give you the confidence that your containers are protected. Containers are self-sufficient._

There's any concept that I'm missing in this interpertation? If so, go ahead and leave a comment!
