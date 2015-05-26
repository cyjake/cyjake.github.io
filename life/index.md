---
layout: post
title: To Life
---

拍下一些照片，记下一点心情，追逐一些玩乐，生活不能只是眼前这点苟且。

{% for category in site.categories %}
  {% if category[0] == 'life' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
