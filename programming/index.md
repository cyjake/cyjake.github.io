---
layout: post
title: Programming for Fun / 编程作乐
---

{% for category in site.categories %}
  {% if category[0] == 'programming' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
