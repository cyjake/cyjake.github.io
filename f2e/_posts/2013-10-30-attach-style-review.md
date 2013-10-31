---
title: attachStyle 代码评审
layout: post
---

小组内首次代码评审，解释 cc/templets/meta 模块中，`.attachStyle()` 方法的变迁，评审
黄龙的最新版代码。

## heredoc

{% highlight js %}
var css = heredoc(function(){/*
    .frames {
        width: 200px;
        height: 80px;
    }
*/})
{% endhighlight %}

用法如上，好处是声明长字符串时非常方便，不需要考虑引号的转义和字符串拼接。

### 原理

在 JavaScript 里我们可以将 function 体变成字符串：

{% highlight js %}
function foo(name) {
    console.log(name)
    /* comments remains */
}

console.log(foo + '')

// 将输出：
// "function foo(name) {
//     console.log(name)
//     /* comments remains */
// }"
{% endhighlight %}

所以对于文首的 function，我们可以将其转为字符串，并使用字符串替换去掉多余的
`function(){/*` 和 `*/}`。

### 掌故

heredoc 名字来源于 Bash 中的长文本声明方式，叫做
[here document](http://en.wikipedia.org/wiki/Here_document)，

{% highlight bash %}
COMMAND <<InputComesFromHERE
...
...
...
InputComesFromHERE
{% endhighlight %}

### strip

这个时候拿到的字符串，将是：

{% highlight js %}
    .frames {
        width: 200px;
        height: 80px;
    }
{% endhighlight %}

行首的空格很讨厌，但是如何拿捏到底有多少个空格是不必要的会很微妙。在 Ruby 世界里，Rails
中的 ActiveSupport 中包含了一个
[.strip_heredoc](http://guides.rubyonrails.org/active_support_core_extensions.html#strip-heredoc)
方法，使用这个方法定义的字符串：

{% highlight ruby %}
if options[:usage]
  puts <<-USAGE.strip_heredoc
    This command does such and such.

    Supported options are:
      -h         This message
      ...
  USAGE
end
{% endhighlight %}

输出的字符串将是：

    This command does such and such.

    Supported options are:
      -h         This message
      ...

逻辑是，分析每一行行首的空格长度，以最短的为准，将每行行首的空格替换掉。

## attachStyle

在创意中经常需要添加一段 CSS 到宿主页面，添加的 CSS 得减少对宿主页面的影响，并且最理想的，
这些 CSS 的选择器应该有些特殊，以保证创意不被 iframe 保护时，也能不收宿主页面的影响。

所以，现在的创意中心里使用的 attachStyle 处理方式是，要求创意中元素的选择器都加上 uid
前缀，而样式声明的时候要求都用 `.class` 选择器，然后再 attachStyle 方法中统一替换，
为这些选择器加上 uid 前缀，变成 `.{uid}-class`。

### scoped

{% highlight html %}
<div class="democontain">
    <style scoped>
        div { border: 1px solid green; margin-bottom: 20px; min-height: 40px; }
        .democontain { background: #f8f8f8; }
    </style>
    <div></div>
    <div style="border-color: pink;">
        <style scoped>
            div { background: lightblue; border: 1px solid blue; }
        </style>
        <div></div>
    </div>
    <div></div>
</div>
{% endhighlight %}

`<style scoped>` 中的样式将仅在父节点内生效，不过，它并不能保证区块不受外部样式干扰。

### polyfill

讨论了 scoped 属性的 polyfill 思路，可以人肉用 JavaScript 取到页面中的 style[scoped]
节点和它们的位置信息，然后将它们移除，解析其中的样式，把样式规则再人肉挨个应用一下。

已经[有人写啦](https://github.com/PM5544/scoped-polyfill)。

## 站内接入

这部分的问题则和公司技术模式关系比较大，这里只记录比较问题，解决方案，得在接下来的实践中摸索。

### 迭代成本

区块发布非常麻烦，如果接入单个区块，需要：

- 到创意中心获取创意代码
- 更新 TMS 区块
- 等待宿主页面更新

如果接入多个，则还需要：

- 选择需要发的创意，合并
- 获取代码
- 更新 TMS 区块
- 等待宿主页面更新

整个过程非常机械，并且有多次等待，都将中断工作状态。因为这些麻烦处，导致迭代过程让人身心俱疲。

### 代码混乱

影响迭代过程的另一个主要原因，就是接入代码已经变得膨胀、混乱，业务逻辑不清楚，业务代码陈旧，
创意接口封装不佳，都是问题。

如何改进？