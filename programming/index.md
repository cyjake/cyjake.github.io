---
layout: post
title: Programming for Life / 活到老，码到老
---

{% for category in site.categories %}
  {% if category[0] == 'programming' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
