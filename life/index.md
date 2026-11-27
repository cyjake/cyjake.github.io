---
layout: post
title: 过日子
lang: zh-CN
section: life
i18n_url: /en/life/
body_class: archive-index
---

{% for category in site.categories %}
  {% if category[0] == 'life' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
