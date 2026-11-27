---
layout: post
title: 编程作乐
lang: zh-CN
section: programming
i18n_url: /en/programming/
body_class: archive-index
---

{% for category in site.categories %}
  {% if category[0] == 'programming' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
