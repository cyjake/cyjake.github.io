---
layout: post
title: Conferences I Attended / 会议记录
---

Maybe someday I'll be at the other side of the conference.

参加技术大会的收益随着个人的技术长进直线下降。

{% for category in site.categories %}
  {% if category[0] == 'conf' %}
  {% assign posts = category[1] %}
  {% include archive.html %}
  {% endif %}
{% endfor %}
