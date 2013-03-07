---
layout: post
title: Style Guide
---

## JavaScript

[代码风格](http://en.wikipedia.org/wiki/Indent_style)或者说规范，是件有点宗教意义的事情，
科班出身的程序员们，开始写代码没多久就会遇到这个问题，比如说我的第二门编程语言 C，
就有两个比较典型的缩进风格：

 - GNU Style
 - 1TBS（One True Brace Style）

前者看起来是这样的：

{% highlight c %}
static char *
concat (char *s1, char *s2)
{
  while (x == y)
    {
      something ();
      somethingelse ();
    }
  finalthing ();
}
{% endhighlight %}

后者则是：

{% highlight c %}
if (x < 0) {
    puts("Negative");
    negative(x);
} else {
    puts("Non-negative");
    nonnegative(x);
}
{% endhighlight %}

抛开缩进不谈，1TBS 最大的特点，是大括号中开括号的位置，是直接放在区块开端的行尾，而不是另起一行，
在阿里的前端世界里，它应该是最广为接受的，KISSY 用的即是这种。

### 花括号

我的选择是 1TBS，与 KISSY 保持一致，花括号的开括号放在行尾：

{% highlight js %}
;(function() {
    // code
})()
{% endhighlight %}

### 分号

故事绝不会到此结束，鄙厂另外一个为人熟知的前端项目是 SeaJS，它的代码风格，是这样的：

{% highlight js %}
function parseDependencies(code) {
  var ret = []

  code.replace(SLASH_RE, "")
      .replace(REQUIRE_RE, function(m, m1, m2) {
        if (m2) {
          ret.push(m2)
        }
      })

  return ret
}
{% endhighlight %}

和 1TBS 的明显区别是，两个空格缩进，其余基本相若。咦，有没有觉得代码干净那么一点点？
它的风格另一大特色，就是行尾的分号一律省略，只是在 `[` 和 `(` 做行首时，加上分号，类似：

{% highlight js %}
foo('bar')
;(function(d) {
    egg('ham')
})(document)
{% endhighlight %}

这里若不加分号，会被 JavaScript 引擎解析成 `foo('bar')(function(d){ ... })(document)`：

 - 先调用 `foo('bar')`
 - 然后将它的返回值视作函数，把 `function(d) {...}` 作为参数，调用

如果它的返回值不是函数，当场就跪，那还算好；如果它的返回值偏偏是个函数，错在哪儿了都不一定知道。
也正是因为这个原因，Douglas Crockford 和 Google 推荐的 JS 代码风格里，表达式行尾一律加上分号，
尽管在绝大多数时候，上述情况并不易出现。

当然也有不吃 [FUD](http://en.wikipedia.org/wiki/Fear,_uncertainty_and_doubt) 这一套的，
开始[号召大家不要用](http://mislav.uniqpath.com/2010/05/semicolons/)了，有
[写得很详细](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding)，
从 ECMAScript 规范解释省略分号是本意的，也有 [行为艺术](https://github.com/madrobby/semicolon.js) 的。

本文不讨论细节，只表述个人风格，我的选择是省略不必要的分号。

### 缩进

我用四个空格作为缩进。仍然用四个空格原因很简单，避免自己一不小心就写出回调金字塔，
平白多出许多无用的闭包，只能用 27" 的显示器写前端代码，等等。

{% highlight js %}
                   //some codes
              })
         }
    })
}
{% endhighlight %}

正如 Linus Torvalds 曾经说的，如果你的代码得缩进好多层，从一个角度讲，也许意味着该好好重构了。

另外，也有好多人喜欢用制表符（tab）做缩进，并约定其宽度为四个或两个空格，jQuery 也是如此，
但我不采用这种。

### 变量声明

老道推荐一个函数一个 `var`，初衷是改变从C系程序员转变过来的前端工程师对 JavaScript
中区块的错误看法。JavaScript 里头，没有区块级别的变量声明，例如：

{% highlight js %}
;(function() {
    var a = 1

    if (true) {
        var a = 2
    }

    console.log(a) // => 2
})()
{% endhighlight %}

限制只能使用单个 `var`，自然避免了这种困扰。但是这个用法带来的问题是，容易写出这种代码：

{% highlight js %}
var a = this.foo(),
    b = this.bar(),
    c = this.egg(),
    d = this.ham()
{% endhighlight %}

这种写法，没法只在其中某一行下断点，只能在 `var` 起始的地方下，假如这个变量声明长得令人发指，
想要调试的话，是很恼人的。不可能很长？你看看
[zepto](https://github.com/madrobby/zepto/blob/master/src/zepto.js) 的风格就知道了，
天知道他们怎么调试的（[Dijkstra](http://en.wikipedia.org/wiki/Edsger_W._Dijkstra)
倒是说过，调试对解决臭虫的帮助并不大，它不过是慢动作演示一遍代码执行的过程而已，所以，或许大神们写代码，
从来都是不调试的吧）。

言归正传，我的风格是：

{% highlight js %}
var a = this.foo()
var b = this.bar()
{% endhighlight %}

### 命名

至于变量名长度，全局或者范围比较广的变量，越能表达其作用越好，局部小函数体里的变量，不致歧义的情况下，
短名字也无不可。

类名请以大写字母开头，类似 `SomeClassWithLongName`。

模块中的全局变量，或者模块名比较朴素，容易误覆盖的变量，可以用 `_` 开头，例如：

{% highlight js %}
var _path = require('path')
var _cache = {}

module.exports = function() {
    // code
}
{% endhighlight %}

普通变量名，使用 `someVar` 或者 `some_var` 均可，但在我的项目中，沿袭其核心数据格式的属性名规范，
使用下划线分隔字符，这是历史原因，不对其他项目做约束。

模块或者类暴露到外部的方法，统一使用驼峰，不可用 `_`，因为这些方法是不能被压缩工具优化掉的，
`cameCase` 比 `lame_method` 可以少一个字符，也更加符合 JavaScript 整体的风格一些。

### 留白

{% highlight js %}
if (typeof a === 'undefined') {
    // code
}
while (i++ !== 8848) {
    climb()
}
for (var i = 0; i < 365; i++) {
    eat()
    sleep()
}
{% endhighlight %}

这些流程控制语句，`if`、`while` 和 `for` 与后边的开括号要有个空格，闭括号与花括号的开括号也是，
还有其他一些地方，也都要留白。总结一下规律，除了函数调用和匿名函数声明，括号前都要留白。
不用留白的例子：

{% highlight js %}
var foo = function(a, b) {}
foo()
{% endhighlight %}

匿名函数声明时，大括号的开括号前仍然要留的。

错误示例：

{% highlight js %}
// 错误：if、=== 及相关分隔符号之间要有留白
if(typeof a==='undefined'){
    //code
    // 错误：注释符号后边也得留个空白哦
}
// 同上
while(i++!==8848){
    climb()
}
// 同上
for(var i=0;i<365;i++){
    eat();sleep()
}
{% endhighlight %}

另外，请不要在行尾有多余的空格。

### 单行区块

前面的例子里，除了 `for` 循环，`if` 和 `while` 还可以写成：

{% highlight js %}
if (typeof a === 'undefined') findA()

while (i++ !== 8848) climb()
{% endhighlight %}

请不要写成：

{% highlight js %}
// 如果区块代码另起一行，请别忘了大括号
if (typeof a === 'undefined')
    findA()

// 如果只在一行内，大括号是不必要的，别画蛇添足啦
while (i++ !== 8848) { clibm() }
{% endhighlight %}

### 对象字面量

{% highlight js %}
module.exports = {
    propFoo: 'aha',
    propBar: true,
    propArray: ['a', 'b', 'c'],
    propAnotherArray: 'what a wonderful world'.split(' ')
}
{% endhighlight %}

冒号后头一个空格即可。

Node 的逗号前置风格，太另类了，还是不采用吧。

## CSS 与 SCSS

CSS 的缩进风格与 JavaScript 相似，不同的是这里我们采用两个空格宽度：

{% highlight css %}
.content {
  padding: 5px 10px;

  .title {
    font-weight: bold;
  }
}
{% endhighlight %}

需要有浏览器厂商前缀（vender prefix）的声明，按长短循序排列：

{% highlight scss %}
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
          border-radius: $radius;
}
{% endhighlight %}

## HTML

请使用 HTML5，两个空格缩进：

{% highlight html %}
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>HTML Skeleton</title>
</head>
<body>
  <!-- your content goes here -->
  <script>
  // JavaScript 代码的缩进，仍然是四个空格
  ;(function() {
      console.log('foobar')
  })()
  </script>
</body>
</html>
{% endhighlight %}

### 跋

以上，都是个人的风格。代码风格的讨论，是很容易引起口水的。最妥帖的原则应该是在已有项目中统一使用已有的规范，
在新项目中则尽早确立。维持项目风格的一致性，才是最重要的，其余只是口水。
