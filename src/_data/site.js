/**
  This file can be accessed using: {{ site.title }}
*/

const year = new Date().getFullYear();

module.exports = {
  allowDarkMode: true,
  lang: "en", // for html tag
  title: "Guilherme Ferreira - Minimalist developer",
  description: "Guilherme Ferreira - Minimalist developer",
  url: "https://gsferreira.com", // don't end with a slash /
  brandName: "Guilherme Ferreira", // for copyright and legal page

  author: {
    name: "Guilherme Ferreira", // for posts meta and Open Graph meta (FB and Twitter)
    email: "me@gsferreira.com", // used in legal page
    github: "https://github.com/gsferreira", // used in footer
    twitter: "https://twitter.com/gsferreira", // used in footer
  },

  meta_data: {
    theme_color: "#ffffff", // used in Chrome, Firefox OS and Opera
    default_social_image: "/assets/img/featured_image.png", // for Open Graph meta
    locale: "en_US", // for Open Graph meta
    twitter_username: "@gsferreira", // for Twitter Open Graph meta
  },

  disqus: "gsferreira",
};
