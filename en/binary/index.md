---
layout: post
title: Tools & Toys
lang: en
section: programming
i18n_url: /binary/
body_class: archive-index
---

A computer hobbyist?

{% for category in site.categories %}
  {% if category[0] == 'binary' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
