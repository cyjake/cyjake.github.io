---
layout: post
title: Binaries in the Bit Sea
---

计算机爱好者？别闹了，既然靠着它吃饭，总得对吃饭的家伙事儿讲究一点。

{% for category in site.categories %}
  {% if category[0] == 'binary' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
