---
layout: post
tags: post
date: 2014-07-04

title: metro-bootstrap with improved tiles
category: metro-bootstrap
---
Yesterday we released metro-bootstrap 3.1.1.2. The highlights of this release are based on improvements to tiles. We have been working to give you the flexibility to implement tiles where you want and as you want.

In the previous version metro-bootstrap tiles were based on the Thumbnail component of bootstrap that will let you place them side by side easily. Now you will be able to place a tile in a "div" tag, for example, and set the positioning as you want.

<!--excerpt-->

 
#What's new
Here's a look at tiles news.

##New positioning - Remove Thumbnail dependency
In the last version was mandatory to use thumbnails, now don't. If you want, you can use them, but you aren't obligated anymore. For example, if you want to create a Tile board taking part of the Bootstrap grid system you can ([you can find here an example of how you can accomplish this](http://talkslab.github.io/metro-bootstrap/dashboardtemplate.html)).

##New template
You can find [here](http://talkslab.github.io/metro-bootstrap/dashboardtemplate.html) a template of a responsive dashboard based on tiles.

![metro-bootstrap dashboard template](/images/metro-bootstrap-with-improved-tiles-dashboard-template.png)


##New colors
Using the info, danger, warning and success colors already defined in bootstrap, you can add the following classes to your tiles:

- *tile-info*
- *tile-danger*
- *tile-warning*
- *tile-success*

##New default variables
In the *variables.less* file you can find the following variables:

- *@tile-bg* to define the default color for tiles
- *@tile-border* to define the border size
- *@tile-border-bg* to define the border color

##New sizes
Following the [Microsoft Guidelines](http://msdn.microsoft.com/en-us/library/windows/apps/hh465403.aspx) were implemented new classes and now it's possible define the following sizes:

- Small (70x70). Add the css class *tile-small*.
- Medium (150x150). Add the css class *tile-medium*.
- Wide (310x150). Add the css class *tile-wide*.
- Large (310x310). Add the css class *tile-large*.

##Tile title
Place a tile title on the lower left corner.

    <span class="tile-label">Tile 5</span>

##What's next
Well, since Bootstrap v3.2.0 has been released we'll be updating metro-bootstrap to be compatible with it soon.

