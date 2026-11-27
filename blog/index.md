---
layout: post
title: 博文
lang: zh-CN
section: blog
i18n_url: /en/blog/
body_class: blog-index
---
{% assign t = site.data.i18n[page.lang] %}

<div class="blog-intro">
  <p>记录代码、摄影，以及其间的生活。</p>
  <div class="blog-stats" aria-label="{{ t.blog_statistics }}">
    <span>{{ site.posts.size }} {{ t.entries }}</span>
    <span>{{ t.since }}</span>
  </div>
</div>

{% assign posts = site.posts %}
{% include archive.html %}
