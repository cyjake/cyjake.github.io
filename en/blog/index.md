---
layout: post
title: Blog
lang: en
section: blog
i18n_url: /blog/
body_class: blog-index
---
{% assign t = site.data.i18n[page.lang] %}

<div class="blog-intro">
  <p>Notes on software, photography, and the days in between.</p>
  <div class="blog-stats" aria-label="{{ t.blog_statistics }}">
    <span>{{ site.posts.size }} {{ t.entries }}</span>
    <span>{{ t.since }}</span>
  </div>
</div>

{% assign posts = site.posts %}
{% include archive.html %}
