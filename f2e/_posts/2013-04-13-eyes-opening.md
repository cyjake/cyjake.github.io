---
title: 前端轶事
layout: post
caption: 该与 HTML5 小组的同仁们分享些啥
---

![太子湾的郁金香](http://pic.yupoo.com/yicai-cyj_v/CMYdgUtU/sRCBN.jpg)

前一阵，有好多前端大拿在抱怨，说前端技术可做的小，饼没有其他工作大之类。传播负面消息自然不好，
直接导致我这边有位外聘同学要离职创业去。好吧，这是玩笑话，他原本就打算不做前端，跟高P们的牢骚关系不大。
在他不长的前端经历中，绝大多数时间花在了切页面上，所以给他的感受是，做前端，和农村里做工艺品差不多。
接一批活，做完，交差，拿钱。

但我是不能认同这种看法的。作为严肃的 IT 从业人士，前端工程师只是我的伪装，本着 DRY、
[Python 之禅](http://www.python.org/dev/peps/pep-0020/) 等一系列计算机主义之精神，
我积极投身于一下前端工程师所热衷的事务之中：

- 代码模块化
- 页面组件化
- 测试自动化

希望以这些为底子，我们可以与设计师、与开发一起，获得
[生命的大和谐](http://tieba.baidu.com/p/1787925405)！

## 模块化

### 看上去很美

前年尾，去年初，忽如一夜春风来，好像全世界的前端工程师都突然开始做模块化。技术大拿们讨论的模块声明语法
（CommonJS），在 NodeJS 里得到印证、细化，变得健壮、直观，很洋气地说，非常 promising（有前途），
于是我们又有了 [RequireJS](http://cyj.me/why-seajs/requirejs/#why-amd)、
[KSLITE](https://github.com/etaoux/kslite#readme)、
[SeaJS](https://github.com/seajs/seajs/issues/242)、
[OzJS](http://ozjs.org/cn/) 等等，连
[KISSY](http://docs.kissyui.com/docs/html/api/seed/loader/)
都摇身变成模块加载器了有木有？

我们有这么多用法：

{% highlight js %}
// SeaJS
define(function(require, exports, module) {
    var a = require('./a')
    var b = require('b')

    module.exports = { ... }
})

// RequireJS、OzJS
define(['./a', 'b'], function(a, b, require, exports) {
    // code
})

// KSLITE
KSLITE.declare(['./a', 'b'], function(require, exports) {
    var a = require('./a')
    var b = require('b')

    module.exports = { ... }
})

// KISSY
KISSY.add('my-module', function(S, a, b) {
    return {
        // exports
    }
}, {
    requires: ['./a', 'b']
})
{% endhighlight %}

一时间百花齐放，只引得列位同僚眼花缭乱，良莠莫辨。所以大牛们的思想碰撞又成一话题，例如 @玉伯也叫射雕
说 “RequireJS 没有明显 bug，而 SeaJS 明显没有 bug”，区区写代码时日尚短，但断言代码一点 bug
没有这种话，大抵是不敢说的；又例如
[SeaJS 与 OzJS 的讨论](https://github.com/dexteryy/OzJS/issues/10)，
如何平衡代码与配置，该不该使用开发时编译工具（ozma）来简化运行时的代码，AMD、CJS、
[CMD](https://github.com/seajs/seajs/issues/242)
这些概念都是怎么回事，等等。

该选择哪个呢？

别着急，还有。除了上边这些个之外，还有更纯粹的 CJS 写法，预编译以运行在浏览器中的解决方案。
我们有 [browserify](https://github.com/substack/node-browserify#readme) ，和 TJ
大神的 [component.io](http://component.io/)。它们做的事情也简单，让你开发时仍然采用
NodeJS 才支持的 CJS 写法，直接代码即模块：

{% highlight js %}
var a = require('./a')
var b = require('b')

module.exports = {
    // exports
}
{% endhighlight %}

在发布时使用相应工具，将其中的 require、exports、module 等包装起来，使其能运行在浏览器中。
许多开源 webapp 采用这种方式开发，例如前一阵很出名的
[learnGitBranching](http://pcottle.github.io/learnGitBranching/?locale=zh_CN)。

好吧，现在可以问了不？

### 该选择哪个呢？

选择题，是个很奇怪的东西，许多人应该都听过那个有关富翁挑媳妇的笑话，他选择了胸大的，那些个候选的优劣，
其实也都是见仁见智的东西，如 @dexteryy 的观点：

> 另外我觉得国内前端社区应该把重心放到解决实际问题和带来新价值的模块上，
> 每个人都去做模块加载器或基础设施，有意无意的做差异化或重复建设，是有违这类项目的初衷的，
> 也许能起到证明自身技术的作用，但只会被国外越甩越远。

搞明白它们都解决了啥，挑个最适合自己的，也就是了。

### 我做了啥

好吧，既然说投身于，那么我到底做了啥？

我只是见证了这一系列变化，切身体会了两个加载器差异化（KSLITE 与 SeaJS）的麻烦处，
但内心还是为后者的易用性与可用性折服，并为其撰文摇旗 [Why SeaJS](http://cyj.me/why-seajs/zh)。

机缘巧合，我又为使用 browserify 的 learnGitBranching 项目贡献了翻译；同时，又因为组件化之事务，
观摩了许多 component 的代码，TJ 绝对是 JavaScript 世界里我心目中排第一的。

## 组件化（或者平台化）

JavaScript 代码模块化事了，CSS 文件的模块化，又早已有 LESS、SASS 等来帮忙，剩下 HTML，
我们只需将其模板化就够了，赶巧，这些年，因为 @ejohn 大神的
[micro templating](http://ejohn.org/blog/javascript-micro-templating/) ，
各路神仙各显其能，各种模板引擎如雨后春笋般冒将出来。

诸位有没有发现，以上这些技术点，仍然还是仰赖后端的技术输出，才最终成为可能的。

因为 NodeJS、Rihno 等服务端 JavaScript 引擎的需求，JS 代码行将模块化，`require` 是不得不做，
不得不确立的事情，Rihno 其实用的是 `load` 关键词，按下不表。最终，有了 CommonJS 规范，
大家商量好了，我们该怎么引入依赖，该如何暴露出模块，等等。

RequireJS、SeaJS 神马的，只是以此为基础，包装了个匿名函数而已；另一种方式，即 component、
browserify 等，保留服务端的模块书写方式，强依赖编译过程；OzJS 则两者均沾。

CSS 模块化，同样如此，LESS 还好些，SASS 原本就是 ruby 代码实现的，样式代码命名空间、mixin、
各种流程控制语法糖，等等，其实也都不是新玩意。

HTML 模板引擎？这个就更不消说，我们现在做的，只不过把渲染拿到前台，原本抽象出来的那些概念，
简单的模板引擎实现该做些啥，同样的，都不是新玩意。

秉着拿来主义，许多后端旧有技术，拿将来与前端世界结合，就是一件很不错的创新。模块化是如此，而组件化，
抛开后端技术辅助，单单在前端世界里玩，恐怕也不会太好玩。

### 我眼中的组件化

我们需要：

- 一套拆分页面的规则
- 应用这些规则拼装页面的加载器
- 加载器的相关配套设施

### 规则与组件加载器

暂时都写在 [dotnil/brix-core](http://github.com/dotnil/brix-core)。

去年年初，@lenel 李牧老师即带着大家试水组件化，并发起
[Brix](http://etaoux.github.com/brix) 项目，在 @左莫莫右莫莫 老师的实践里，
形成了一系列雏形。

我对其中一些约束做了简化，并实现了演示版本，此即我修改的 Brix Core。

### 组件分享工具与服务

暂时都写在：

- [dotnil/mosaic-client](https://github.com/dotnil/mosaic-client)
- [dotnil/mosaic-server](https://github.com/dotnil/mosaic-server)

## 测试自动化

图形界面的测试自动化，是个大坑，我想做的是单元测试与持续集成。立足点自然是前文，模块化与组件化。

### Brix Core 实践

这个项目里，使用 QUnit 作为测试库，为项目中的所有模块都写了单元测试，当然，现在覆盖率还不够高。
写好之后，配合 grunt-contrib-qunit 模块，我们可以将测试、发布流程绑在一起，在发布之前，
强制执行一次所有测试用例，类似：

    grunt test && grunt build

### 发布与持续集成服务

鄙厂前端这些年，积累了大大小小不少的前端资源发布工具，如何形成一系列规则，将发布与集成测试结合起来，
应该是个蛮好玩的事情。

## 后记

![花儿](http://pic.yupoo.com/yicai-cyj_v/CMYi0RFW/gkflG.jpg)

本文非常可耻地烂尾了，后两项（组件化与测试自动化）是我正在经历中的事情，个中许多，我认为都还没确定，
现在拿出来讲不太合适，留待后补吧。

这篇乱糟糟的博文，英文别名叫 eyes opening，野心昭然若揭，想要说的是自己对前端现状的野望，
也希望我的同仁们眼界放宽，不要只盯着这一亩三分地，多看看这花花世界，在这广袤的计算机世界里，
还有好多是我们可以玩的，也有好多，是我们未必就已经做好的，做精、做细，也未尝不可。
