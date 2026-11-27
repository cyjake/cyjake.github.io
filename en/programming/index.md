---
layout: post
title: Happy Hacking
lang: en
section: programming
i18n_url: /programming/
body_class: archive-index
---

{% for category in site.categories %}
  {% if category[0] == 'programming' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
