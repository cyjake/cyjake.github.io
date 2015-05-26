---
layout: post
title: Chasing Down the Rails
---

曾经是一名 Ruby 程序员，写 Ruby 要求的脑容量比写 JavaScript 要大，而我的脑袋大概就比金鱼
大那么一点。

{% for category in site.categories %}
  {% if category[0] == 'rails' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
