/**
  This file can be accessed using: {{ site.title }}
*/

const year = new Date().getFullYear();

module.exports = {
  allowDarkMode: true,
  lang: "en", // for html tag
  title: "Gui Ferreira - Minimalist Software Craftsman",
  description: "Gui Ferreira - Minimalist Software Craftsman",
  url: "https://gsferreira.com", // don't end with a slash /
  brandName: "Gui Ferreira", // for copyright and legal page

  author: {
    name: "Gui Ferreira", // for posts meta and Open Graph meta (FB and Twitter)
    email: "me@gsferreira.com", // used in legal page
    github: "https://github.com/gsferreira", // used in footer
    twitter: "https://twitter.com/gsferreira", // used in footer
  },

  meta_data: {
    theme_color: "#ffffff", // used in Chrome, Firefox OS and Opera
    default_social_image: "/images/logo.jpg", // for Open Graph meta
    locale: "en_GB", // for Open Graph meta
    twitter_username: "@gsferreira", // for Twitter Open Graph meta
    twitter_image: "https://gsferreira.com/images/logo.jpg",
    twitter_title: "Gui Ferreira",
    twitter_description:
      "Minimalist Software Craftsman",
  },
};
