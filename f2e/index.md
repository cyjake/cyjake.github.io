---
layout: post
title: 伪前端工程师
---

Yes I do speak JavaScript.

基本上，这家伙快变成 JavaScript 程序员了。

{% for category in site.categories %}
  {% if category[0] == 'f2e' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
