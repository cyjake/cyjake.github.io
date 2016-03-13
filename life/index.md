---
layout: post
title: To Life / 过日子
---

Carpe diem.

生活不能只是眼前这点苟且。

{% for category in site.categories %}
  {% if category[0] == 'life' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
