---
title: Velocity New York 2013 小记
layout: post
---

2013年10月11日，首次踏出国门，前往纽约参加 Velocity New York 2013，时间计划得比较充裕，
因此有幸玩了两三天，感兴趣的同学可以看专门的[准备工作与游记](/life/touring-new-york)。

先说总体印象，Velocity 技术大会的副标题是 Web 性能与运维，议题重点关注是性能优化与系统
运行、维护的部分，本次大会的议题，性能方面专注于移动设备上 HTML5 的优化，运维方面，则有大多
是关于系统检测与自动化测试的。

![首日报到](/assets/img/2013-new-york/IMG_1513.jpg)

## Day I

[首日议程](http://velocityconf.com/velocityny2013/public/schedule/grid/public-grid)

### 图片加载

先去听了《What Your Browser Does When You Aren't Looking》，即当你不注意的时候你的
浏览器都做了啥。看标题很有点阴谋论之类的意思，其实主要是讲浏览器在资源加载上的各种意外行为。
在此之前，有过一个在线版的测试，[request-quest](http://jakearchibald.github.io/request-quest/)。

演讲者叫 Jake Archibald，看推特是个很风趣的人，说到了纽约在街上走，又被人当成某个色情明星
给“认”出来了，应该是光头+黑色上装的效果。

他的演讲过程很有趣，在自己的电脑上跑了一个 Web 服务，让在场的人访问，然后在演讲过程中，
会冒出一个个小测验，让大家真切地考考自己，因此互动效果特别好。这些测验都很难，答错要扣分，
说是按平均分为零的标准出题的。

第一道题目都很有欺骗性：

{% highlight html %}
<div src="foo.jpg"></div>
{% endhighlight %}

这段 HTML 会不会导致浏览器下载 foo.jpg？

接触过 XHTML 的同学可能觉得会下载，事实上 XHTML2 里确实是这样规定的，任何元素都可以有 src
与 href 属性。src 会导致该元素下载该资源，href 则将它变成可点击的。不过，现代浏览器认的
标准是 HTML5 而非 XHTML2，后者被放弃了。

### WebPagetest

[WebPagetest](http://www.webpagetest.org/about) 是个网页速度测试工具，起初是 AOL
开发，在 2008 年开源，现在由 Google 支持，是 Google
[Make the Web Faster](https://developers.google.com/speed/) 运动的一部分。

演讲者叫 Patrick Meenan，是此项目的负责人。在演讲过程中有个小插曲，他电脑上的 IM 工具没
关掉，女？朋友发来一条消息，问他在干嘛，是不是已经开始演讲了。

他以一个虚拟项目为例，讲述如何建立分布式的综合测试，要求：

- 能从多地访问
- 模拟实际网络条件，而不是数据中心或者机房之内的访问
- 统计正确的加载数据，而不仅仅依靠 onload 事件
- 模拟单点故障
- 等等

第三点非常有趣，是本次 Velocity 常被提起的话题，很多时候 onload 事件并不意味着页面加载完毕，
尤其是单页应用等大量异步化的网站。相应的，Patrick 提出了一个 Speed Index 的东东，即
页面速度指数，大致是网页大部分像素变化完成所需时间以及这个过程是如何变化的，详细可看
[WebPagetest 的文档](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)。

次日 Patrick 还有议题，和另外两位一起，讲述 onload 之外的网页加载速度测试。

### 响应式设计

英文标题是《Responsive Responsive Design》，这个词被重复太多遍，有点 hype 的意思，
但实际上它一点也不，尤其是在敝厂现在才发现自己落下太多无线功课的时候。

演讲者叫 Tim Kadlec，是《[响应式 Web 设计与实践](http://book.douban.com/subject/21263576/》
一书的作者。本书挺有料，是补课的首选。

演讲内容与书差不多，强调 Mobile First，以及小屏版本不应该想着如何把桌面版本塞进去，而是如何
从内容到形式都能更符合小屏幕，减少资源加载，有必要则减少内容。

另一个话题是如何给不同 PPI 的设备提供图片，我们有 @srcset 与 `<picture>`，然而这两个方案
都不能算成熟。他只好吐槽，三年过去了，我们仍然停留着几乎什么都没有的阶段，最好的解决方案，
仍然是自行用 `<span>` 配合 JS 解决。

{% highlight html %}
<picture width="500" height="500">
  <source media="(min-width: 45em)" src="large.jpg">
  <source media="(min-width: 18em)" src="med.jpg">
  <source src="small.jpg">
  <img src="small.jpg">
</picture>
{% endhighlight %}

有没有觉得和 `<video>` 标签很像？但因为标准支持很慢，这段标记被展开成 `<span>`：

{% highlight html %}
<span data-picture data-alt="A giant stone face at The Bayon Temple in Angkor
    Thom, Cambodia">
  <span data-src="small.jpg"></span>
  <span data-src="medium.jpg" data-media="(min-width: 400em)"></span>
  <span data-src="large.jpg" data-media="(min-width: 800px)"></span>
  <!-- fallback for browsers with JavaScript disabled. -->
  <noscript>
    <img src="small.jpg" alt="A giant stone face at The Bayon Temple">
  </noscript>
</span>
{% endhighlight %}

相比之下，@srcset 的语法则要干练很多：

{% highlight html %}
<img src="fallback.jpg"
     alt=""
     srcset="small.jpg 640w 1x, small-hd.jpg 640w 2x, med.jpg 1x, med-hd.jpg 2x">
{% endhighlight %}

除了人肉提供多个尺寸的图片以供不同设备展示之外，Tim 还提到一个近似黑魔法的东西，叫做
[Compressive Image](http://filamentgroup.com/lab/rwd_img_compression/)，
大致意思是，把一张 JPEG 放大 1.5 或者两倍存储，但是劣质。在图像处理软件中导出过 JPEG
的同学都知道，有个 quality 选项，选择 10 甚至 0。因为劣质，虽然图片很大，但文件大小与
原来的高质量小图差不多。然后在浏览器中用 img 的 width、height 属性，或者用样式，将图片缩小
到实际需要的尺寸，你会发现那个放大的、质量很差的图片，经过浏览器缩小之后质量很不错，不管实在
普通屏幕还是视网膜屏幕上。

这么做的坏处其实不少：

1. 占用浏览器更多内存，因为会被展开成位图，后者占用的内存将是原图的四倍。
2. 用户保存的图片质量很差，因为右键保存的是放大后的劣质版本。
3. 缩放图片比较大时将使浏览器卡顿

所以，尽管初看这种做法很棒，帅得让人难以置信，但它的坏处使得它难以取代其他图片解决方案。

另外 Tim 还分享了一些移动设备上的特殊做法，有些在其他演讲者那儿也有提及，比如将不重要的内容
异步化：

{% highlight html %}
<!-- 原先 -->
<h2>Reviews</h2>
<div class="reviews"><!-- 很多内容 --></div>

<!-- 现在 -->
<h2><a href="reviews.html" data-target="reviews">Reviews</a></h2>
{% endhighlight %}

在桌面电脑、iPad 等强力些的设备上，可以在页面加载完毕之后加入异步请求，载入 Reviews 部分。

### 为移动应用打造性能实验室

英文标题《Building a Performace Lab for Mobile Apps In a Day》，演讲者是三个人：

- Ashray Mathur
- Venkatesh Katari
- [Susie Xia](https://www.facebook.com/susie.xia/about)

前两个是印度人，第三个则是华人，很牛哦。他们都来自
[Salsforce](https://www.salesforce.com/homepage/index-f.jsp?r=X&s_tnt=63114:1:0)。

但是真的要原谅我，听不习惯印度英语，只能是一知半解。大致上，介绍了一些用来性能检测、
测试自动化的工具：

- [Kylie](https://github.com/forcedotcom/kylie)
- Dave

Susie 同学的口音还是有点重，她讲了安卓应用的自动化测试：

<table>
  <tr>
    <td>Web</td>
    <td>ChromeDrvier2 AndroidDriver</td>
    <td>Kylie Loglines</td>
  </tr>
  <tr>
    <td>Native/Hybrid</td>
    <td>Selendroid</td>
    <td>Customized Loglines</td>
  </tr>
</table>

还有个优化资源加载的小窍门，因为：

1. 在移动设备上输密码是很花时间的，因为密码通常都比较复杂，而键盘又很小，通常需要切换
2. 图片与 CSS 是并行下载的，而 JS 是单线程（存疑，应该可以用 async 属性并行下载）

这其中，还有分析 Dalvik 虚拟机的日志，取得 GC 信息，查内存泄露等等，但不太明白他们最终的
产品是什么。

## Day II

[次日议程](http://velocityconf.com/velocityny2013/public/schedule/grid/2013-10-15?schedule=public-grid)

上午都在 Grand Ballroom，希尔顿酒店的这些会场都是可分割的，上午是一整个，没有隔开。

![Grand Ballroom](/assets/img/2013-new-york/IMG_1545.jpg)

议题都很短，只有10到20分钟不等，基本上以广告为主，比如 Keynote 公司（不是 Apple 的幻灯片
软件）做得 KITE 与 MITE：

### Keynote 的 KITE 与 MITE

- KITE, Keynote Internet Testing Environment
- MITE, Mobile Internet Testing Environment

KITE 是个用户操作记录与回放工具，并记录操作过程中产生的信息，例如资源加载瀑布流等。感觉是个
商业味道比较浓的公司做出来的工具。

KITE 有个亮点是，可以把录下来的操作放到不同地方的服务器上回放，因此可以用来做实时监测。

MITE 大同小异，只是针对移动 Web 的，演讲者说，会做一些特别处理：

- 根据最佳实践计算 Mobile Score，告诉你网页的评分
- 模拟 JavaScript 环境，把实际环境中不可用的对象隐藏掉
- 模拟 geolocation 等 API

后来在他们的展位，我还跑过去问了一把，问他们是怎么记录的，因为听的时候以为是直接生成
JavaScript。实际上是，操作记录的格式是 XML，JavaScript 作为补充，当操作记录不好用的时候，
改用 JavaScript 手写操作。据说那份 XML 格式还申请专利了，我说过这家公司商业味道很浓的吧？

### 复杂系统是如何产生故障的

演讲者 Richard Cook，来自斯德哥尔摩皇家技术学院，演讲标题很长长长，叫：Resilience In
Complex Adaptive Systems: Operating At The Edge Of Failure。

在我听他的演讲之前，刚好看过他的[研究报告](http://www.ctlab.org/documents/How%20Complex%20Systems%20Fail.pdf)，
的[中文翻译](http://blog.liancheng.info/how-complex-systems-fail-zh/#.UnCiB5TN9E8)。

他这里的复杂系统是广泛概念，电力系统，民用航空系统，交通系统，股票交易系统等等，都在其中。

运维人员每天都在：

- 监测系统的某些部分
- 抓住机会
- 预估离故障还有多远
- 应对风险
- 预期未来的情况
- 学习系统特性

这些都不是离散的行为，它们是有内在联系、相互影响的。接着 Richard 老师介绍了一个模型：

![Rasmussen's System Model](/assets/img/2013-new-york/rasmussens-system-model.jpg)

右上和右下分别是财务故障边界和忍无可忍的劳动力边界，通常在系统运维中会优先做相应的事情以将
运维状态，即中间的那个点，推离高财务和高劳动力，所以通常不会因此而导致系统故障。但是，这些
努力都将运维状态推向第三个边界，即意外边界。

更少的钱，更少的人手，也通常意味着更大可能的意外。

但是，自21世纪以来，人们更加惊讶的不是系统为何产生故障，而是为何系统不会产生故障。因为随着
监测技术成熟，和愈发被重视，人们对系统中的不足其实非常清楚，往往因为系统规模太大，修改成本
太高而作罢。于是问题来了，既然有这么多的问题，为何系统仍然可以运转无虞？

于是回到议题，复杂自调节系统的弹性。我们运维在失败的悬崖边，而系统安全正是关于：

- 会发生什么
- 当前的运维状态究竟如何
- 意外的边界究竟在哪儿
- 在压力下，我们做什么：
  - 监测
  - 反应
  - 预料
  - 学习

### 不止是平均

来自 AppNeta 的小哥介绍数据展示与解读，说普通的曲线图虽然看起来只管但是砍掉了太多信息。

- perecentile
- histogram
- heatmap

他重点推荐的就是 heatmap，用颜色深浅将信息表示出来，从而更直观地看到隐藏在曲线图之后的内容。

### Web 性能工作组

Web 性能工作组给大家带来：

- 浏览与资源计时：`.redirectStart` 与 `.domainLookupStart` 等
- 用户行为计时：`.mark()` 与 `.measure()`
- 文档是否可视：`document.hidden`
- `.requestAnimationFrame`
- 高精度计时：`.now()`

在今后，还将带来 prerender：

{% highlight html %}
<a href="..." rel="prerender"></a>
<!-- 浏览器将在加载完当前页面之后开始加载注明 prerender 的链接并渲染之 -->
{% endhighlight %}

同时还可以设置资源优先级：

{% highlight html %}
<img src="foo.jpg" lazyload>
<img src="bar.jpg" postpone>
{% endhighlight %}

lazyload 与网络有关，会等到网络空闲时再加载；postpone 则与元素是否可视有关，会等到元素可见
时才加载资源。这俩还有对应的 CSS 声明：

{% highlight css %}
video {
    resource-priorities: postpone;
}
{% endhighlight %}

如果是在 script 标签上，算上已有的 defer 与 async，去掉无关的 postpone（等可见时再加载
某段 script？），script 一共有三个控制加载顺序的属性：

- defer
- async
- lazyload

基本上，lazyload 的优先级在 async 之后，而 lazyload 与 defer 一块用时只有后者会生效。
或许等浏览器那天弄明白这些规则，把它们都实现了，再去了解也不迟吧。

接下来这个或许会更有意义一点，叫做 beacon，即在页面 unload 时有个叫做 beacon 的函数，
用来发起请求，确保等请求发送完毕后才销毁页面。

{% highlight js %}
function unload() {
    beacon('POST', '/log', analyticsData)
}
{% endhighlight %}

因为如果在 unload 里发起 XMLHttpRequest，会被取消掉。而浏览器会保证 beacon 的请求。

其他还有让第三方可以注入脚本，但避免影响实际页面的：

    Preflight-Cookie: /monitoring.js

用处是可以让 CDN 等服务商加入监控脚本，但不影响实际页面，据说 Akamai 就有这需求。

不过，这个想法被喷的可能性很大，不要抱太大希望。

### 其他小议题

其他还有 HttpWatch 移动版，我还没用过，希望以后可以有机会使用，
[Available on the App Store](https://itunes.apple.com/app/id641613694)。

以及使用 Chrome Dev Tools 分析内存占用，即 Timeline 面板中的 Memory 标签，等视频看吧。

### Bing 的前端优化

他的观点是，不要只看页面加载速度，而是看如何帮助用户更快地完成他要做的事情。

有几点有趣的地方：

- 内联样式反而比放在外部来得更有效率，他们做了个开关用来切换样式是内联还是引用外部
- 内联 JavaScript 事件句柄非常影响性能，去掉它们减少了 20% 的页面加载时间
- 恶意软件影响了 5% 的用户，开启 HTTPS 也没用

另外，尽管用得非常保守，开启搜索结果中点击率比较高的项目的 prerender，大大提高用户响应速度。
在之后的问答环节中，他也讲到 Bing 里头的脚本组织方式是以区块重要程度而定的，对于用户看到后
可能马上要用的，相关功能代码可能就直接内联在该区块后面了。对于相对不重要些的，则放到 onload
或者 ondomready 之后。

### Rendering Without Lumpy Bits

还是 Jake Archibald 的演讲，这次将渲染速度优化，提到了不少概念，和 Chrome 中的调试技巧。

首先是 FPS 的概念，知道的同学可能都觉得老生常谈了，Frames Per Second，在 FPS（First
Person Shooting，第一人称射击游戏）中常有的概念，玩过 CS 的同学应该知道的。所以，我们的
桌上型电脑如此强劲，玩各种 3D 游戏毫无压力，却在渲染 2D 网页会卡？实在是太不可理喻了。

先说明 Chrome 里网页是如何渲染的，你可以在 Chrome Dev Tools 里地 Timeline 标签中实践
一把，点记录按钮，打开网页，即可。

1. 解析 HTML
2. 计算样式
3. 计算布局，生成 RenderObject 树
4. 绘制

计算布局比较耗时，所以在循环中要避开触发布局计算的属性，比如：

- offsetWidth
- offsetHeight
- ...

绘制自然也会影响页面渲染速度，有几项很容易拖慢绘制速度的东西：

- 渐变背景
- 圆角边框
- 盒子阴影，阴影越大越卡
- 模糊滤镜
- 固定定位的背景图片

但是，有个很重要的观点，什么慢、什么快是时刻变化的，永远都记得先评估再下判断。

接着，为了更好地解释渲染，Jake 以 Windows 为例，Windows XP 时代，整个屏幕当做一个画布，
窗口拖动时，其他打开的窗口也要响应重绘事件，以清除掉焦点窗口被拖走之后的废弃画面。但假如
这里是子窗口与父窗口的关系，因为整个程序卡顿，子窗口拖动时，父窗口没法响应重绘，于是就导致了
经典的残影。

到了 Windows Vista，屏幕是层次化的，类似 PS 中的图层概念，背景、各个程序都有各自的图层，
此时，窗口拖动时，其他程序不需要响应重绘，只需要让屏幕绘制程序自行处理即可。

Chrome 中的绘制也是如此，网页绘制是层次化的。

所以 Jake 也猜测，固定定位的背景图片因为还不是层次化渲染的，所以目前还会卡，但是在将来，
很有能会弄成层次化，那时就不会成为瓶颈了。

人眼期望的最高 FPS 是 60，即每秒六十帧画面，反过来说，即每帧得在 16.67 毫秒之内就算出来。
我们还知道，setTimeout 与 setInterval 纪律性不好，并不一定准时，所以 Web 性能小组搞出来
一个 requestAnimationFrame，确保动画的计时控制。

另外，Jake 还提到了移动设备里的 tap 实践，因为移动设备需要响应 double tap，所以 tap 事件
的触发会被延迟，需要等一会看看到底是双击还是单击，时间是 300ms。这导致普通的点击事件给人
卡顿的感觉。

替代方案有很多，可以改用 touchend 事件，但是滚动时也可能触发 touchend，所以 IE 中加了新的
事件，叫做 pointerup，比较管用。

pointerup 支持还不算好，着急优化这个点击的同学，还可以尝试
[FastClick](https://github.com/ftlabs/fastclick) 封装。

还有个办法是，索性禁用掉放大：

{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1, max-sacle=1
">{% endhighlight %}

不过并不是所有浏览器都这么聪明，而且禁用掉放大有点太狠了。

以上，为上午在 Grand Ballroom 的所有演讲。

## Day III


