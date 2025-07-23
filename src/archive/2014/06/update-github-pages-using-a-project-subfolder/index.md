---
layout: post
tags: post
date: 2014-06-21

title: Update GitHub Pages using a project subfolder
description: Automate GitHub Pages deployment using git subtree - push project subfolders to gh-pages branch without manual branch management.
---

Do you have a project in GitHub and you are tired of manage the _gh-pages_ branch manually?! If so, stay tuned because that can be pretty simple.

I used to make a full copy of the master repository into the _gh-pages_ using the _rebase_ command, but this brings a lack of organization because it's difficult don't mix the source code and the web pages files.

This is the process that I used to update the full branch:

```text
git checkout gh-pages // go to the gh-pages branch
git rebase master // bring gh-pages up to date with master
git push origin gh-pages // commit the changes
git checkout master // return to the master branch
```

Recently I re-organize my repository to have a _docs_ subdirectory, on the master branch, where I put the files required for web pages and with the following command I did some magic:

```text
git subtree push --prefix docs origin gh-pages // Replace 'docs' by your folder name
```

Now, the _docs_ folder is the root directory of gh-pages branch.

This seems pretty simple, but in the process I found some troubled waters. So, I leave the details here, in case you get the same problem.

In my first tries I got the following error:

```text
! [rejected]        1835ac01fe63c030216c22d3d834366d5e2a854r -> gh-pages (non-fast-forward)
error: failed to push some refs to 'https://github.com/gsferreira/myrepository.git'
hint: Updates were rejected because a pushed branch tip is behind its remote
hint: counterpart. Check out this branch and integrate the remote changes
hint: (e.g. 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

If you want to get rid of this error, I suggest that you delete your gh-pages branch and then recreate it before execute the _git subtree_ command.

How to delete a branch?

```text
git push origin :gh-pages
```

I hope this helps you.
