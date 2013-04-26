---
title: Specified, Computed, Used, and Resolved Value
layout: post
---

## Specified Value

- [MDN](https://developer.mozilla.org/en-US/docs/CSS/specified_value)
- [W3C](http://www.w3.org/TR/CSS2/cascade.html#specified-value)

即**设定值**，文档样式表中所设定的值，可以是：

- `<link type="stylesheet">` 标签里指定的 CSS 文件中设定的值
- `<style>` 标签中所设定的值
- 内联 style 属性中所设定的值

如果没找到样式设定，则从父节点上继承
（[inheritance](https://developer.mozilla.org/en-US/docs/CSS/inheritance)）。例如：

{% highlight html %}
<div style="font:helvetica;">
  <p></p>
</div>
{% endhighlight %}

p 标签没有指定 font 样式，则从父节点 div 上继承，也就是 helvetica

如果仍然没找到，即 initial ，为浏览器默认值。

## Computed Value

- [MDN](https://developer.mozilla.org/en-US/docs/CSS/computed_value)
- [W3C](http://www.w3.org/TR/CSS2/cascade.html#computed-value)

即**计算值**

将所设定值中为相对值的，转换为绝对值（例如 em 单位、百分比、或者 url() 中的相对路径）。

{% highlight css %}
div {
  font-size: 12px;
  padding-top: 1.5em;
}

// 转换为
div {
  font-size: 12px;
  padding-top: 18px
}
{% endhighlight %}

有些值，单从 CSS 是推不出的，例如 width、margin-right、text-indent、top 等，这些值的
Computed Value ，仍然保留为相对值，直到 Used Value 被推导出来。

## Used Value

- [MDN](https://developer.mozilla.org/en-US/docs/CSS/used_value)
- [W3C](http://www.w3.org/TR/CSS2/cascade.html#used-value)

即**使用值**，CSS 属性最终被计算出来的值，可以通过调用
[window.getComputedStyle](https://developer.mozilla.org/en-US/docs/DOM/window.getComputedStyle)
取得。维度值（width、line-height 等）都以像素为单位，简写属性（例如 background）都与组成属性
（例如 backgroung-color ）同步，display 与 position 和 float 也达成一致，所有的 CSS
属性都有值。

## Resolved Value

- [W3C Draft](http://dev.w3.org/csswg/cssom/#resolved-values)

即**决定值**

- line-height
  - 使用值即决定值
- height
- margin
- margin-bottom
- margin-left
- margin-right
- margin-top
- padding
- padding-bottom
- padding-left
- padding-right
- padding-top
- width
  - 如果属性应用到节点或者伪节点，且该节点的 display 决定值不为 none，则使用值即决定值；反之，
    则计算值即决定值。
- bottom
- left
- right
- top
  - 如果属性应用到定位节点，且该节点 display 决定值不为 none，则使用值即决定值；反之，
    则计算值即决定值。
- 其他属性
  - 计算值即决定值

