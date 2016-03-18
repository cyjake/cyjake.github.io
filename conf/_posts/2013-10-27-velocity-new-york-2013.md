---
title: Velocity New York 2013 小记
layout: post
---

2013年10月11日，首次踏出国门，前往纽约参加 Velocity New York 2013，时间计划得比较充裕，
因此有幸玩了两三天，感兴趣的同学可以看专门的[准备工作与游记](/life/touring-new-york)。

先说总体印象，Velocity 技术大会的副标题是 Web 性能与运维，议题重点关注是性能优化与系统
运行、维护的部分，本次大会的议题，性能方面专注于移动设备上 HTML5 的优化，运维方面，则有大多
是关于系统检测与自动化测试的。

## Day I

比起后两日早上的密集分享，
[首日的议题](http://velocityconf.com/velocityny2013/public/schedule/grid/public-grid)
要少很多，相应的，时间都比较长。

### 图片加载

先去听了《What Your Browser Does When You Aren't Looking》，即当你不注意的时候你的
浏览器都做了啥。看标题很有点阴谋论之类的意思，其实主要是讲浏览器在资源加载上的各种意外行为。
在此之前，有过一个在线版的测试，[request-quest](http://jakearchibald.github.io/request-quest/)。

![Jake Archibald](/assets/img/2013-new-york/IMG_1510.jpg)

演讲者叫 Jake Archibald，看推特是个很风趣的人，说到了纽约在街上走，又被人当成某个色情明星
给“认”出来了，应该是光头+黑色上装的效果。

他的演讲过程很有趣，在自己的电脑上跑了一个 Web 服务，让在场的人访问，然后在演讲过程中，
会冒出一个个小测验，让大家真切地考考自己，因此互动效果特别好。这些测验都很难，答错要扣分，
说是按平均分为零的标准出题的。

第一道题目都很有欺骗性：

```html
<div src="foo.jpg"></div>
```

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

```html
<picture width="500" height="500">
  <source media="(min-width: 45em)" src="large.jpg">
  <source media="(min-width: 18em)" src="med.jpg">
  <source src="small.jpg">
  <img src="small.jpg">
</picture>
```

有没有觉得和 `<video>` 标签很像？但因为标准支持很慢，这段标记被展开成 `<span>`：

```html
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
```

相比之下，@srcset 的语法则要干练很多：

```html
<img src="fallback.jpg"
     alt=""
     srcset="small.jpg 640w 1x, small-hd.jpg 640w 2x, med.jpg 1x, med-hd.jpg 2x">
```

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

```html
<!-- 原先 -->
<h2>Reviews</h2>
<div class="reviews"><!-- 很多内容 --></div>

<!-- 现在 -->
<h2><a href="reviews.html" data-target="reviews">Reviews</a></h2>
```

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
很多，上午都在 Grand Ballroom，希尔顿酒店的这些会场都是可分割的，上午是一整个，没有隔开。

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

```html
<a href="..." rel="prerender"></a>
<!-- 浏览器将在加载完当前页面之后开始加载注明 prerender 的链接并渲染之 -->
```

同时还可以设置资源优先级：

```html
<img src="foo.jpg" lazyload>
<img src="bar.jpg" postpone>
```

lazyload 与网络有关，会等到网络空闲时再加载；postpone 则与元素是否可视有关，会等到元素可见
时才加载资源。这俩还有对应的 CSS 声明：

```css
video {
    resource-priorities: postpone;
}
```

如果是在 script 标签上，算上已有的 defer 与 async，去掉无关的 postpone（等可见时再加载
某段 script？），script 一共有三个控制加载顺序的属性：

- defer
- async
- lazyload

基本上，lazyload 的优先级在 async 之后，而 lazyload 与 defer 一块用时只有后者会生效。
或许等浏览器那天弄明白这些规则，把它们都实现了，再去了解也不迟吧。

接下来这个或许会更有意义一点，叫做 beacon，即在页面 unload 时有个叫做 beacon 的函数，
用来发起请求，确保等请求发送完毕后才销毁页面。

```js
function unload() {
    beacon('POST', '/log', analyticsData)
}
```

因为如果在 unload 里发起 XMLHttpRequest，会被取消掉。而浏览器会保证 beacon 的请求。

其他还有让第三方可以注入脚本，但避免影响实际页面的：

    Preflight-Cookie: /monitoring.js

用处是可以让 CDN 等服务商加入监控脚本，但不影响实际页面，据说 Akamai 就有这需求。

不过，这个想法被喷的可能性很大，不要抱太大希望。

### 其他小议题

其他还有 HttpWatch 移动版，我还没用过，希望以后可以有机会使用，
[Available on the App Store](https://itunes.apple.com/app/id641613694)。

以及使用 Chrome Dev Tools 分析内存占用，即 Timeline 面板中的 Memory 标签，等视频看吧。

以上，为上午在 Grand Ballroom 的所有演讲。

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

但是，有个很重要的观点，什么慢、什么快是时刻变化的，永远都记得先评估再下判断，现在的最佳实践，
将来可能变成陈腐观点。

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

```html
<meta name="viewport" content="width=device-width, initial-scale=1, max-sacle=1
">```

这样，在 Chrome 中将不响应 double tap 放大的效果，不过并不是所有浏览器都这么聪明，而且
禁用掉放大有点太狠了。

### SCSS

接下来是下午的内容。

英文标题 Stylesheet Wrangling with SCSS，是个妹子讲的，叫做 Sarah Forst。

妹子很紧张，说话声音都发抖，讲的内容一般，就是演示一下 SCSS 的特性，变量、嵌套、mixin，
诸如此类，中间妹子还深情告白，说这是她头一次当中演讲，起点太高，吾等难望项背。

[sass-lang.com](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html)

### onload 之外

英文标题：Going Beyond Onload - How Fast Does It Feel? 三个人合讲，WebPagetest
的作者 Patrick Meenan，微软的哥们 Chao Feng，和 Mike Petrovich。

Patrick 讲的是前一天的补充，即 WebPagetest 里的 Speed Index 概念sass。介绍概念之前，
监测 onload 并不靠谱，举了两个例子，老版本的 Twitter onload 触发得很早，但是实际上页面是
空白的，因为绝大部分工作都被推迟到 onload 之后了，相反的例子是 Engadget，onload 触发要
很久，但是页面主要内容很早就出来了。

[Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)，
就是用数值表现页面内容展示速度的。

WebPagetest 计算页面加载完成的时间并不是靠 onload 事件，而是观察首屏（AFT，Above The
Fold）像素变化。

来自微软的 Chao Feng 同学，则分享了另一个思路，他的想法是计算页面像素变化区域占首屏的百分比，
进而算出变化的速度，从而将页面变化区分成多个阶段。

同时，会将包含黄金分割区域像素变化的阶段当做关键阶段。

PPT（Page Phase Time）的网址 <http://ppt.msn-dev.com>，感兴趣的同学都去试一下吧。

Mike 的思路，则是人肉将页面加载程度标记出来，放弃自动识别，利用 window.performance 提供
的计时接口，暴露 Page.setUserReady 方法，然后前端在合适的时机调用此方法，以标记页面加载
完毕。

### Google in the Cloud

演讲者 Brad Adams 是 [Google 云](https://cloud.google.com/)的产品经理，演讲也偏
Google 云的产品介绍而非技术细节。提到的产品有：

- Google Compute Engine
- Google App Engine
- Google Cloud Storage

Google 云平台现已支持 PHP 与 MySQL，因此你完全可以在 App Engine 里跑一个 wordpress。

有个小段子，说 Google 甚至得保护自己的基础设施不被鲨鱼破坏。鲨鱼？原来鲨鱼会破坏布置在海里
的线路。他们的解决办法是布置监控，鲨鱼出没注意。

他说的有一点我很赞同，我们仍处在云计算的襁褓阶段，许多东西都才刚上路呢。

### 使用 Raspberry Pi 搭建信息化工作间

这个比较有趣，NewRelic 的两位工程师讲的，他们用 Raspberry Pi 搭建了一个监控面板，实时显示
应用状态。去过 Alipay 大厅的同学应该看到过类似的。不过我肯定后者用的主机要强劲很多。
监控面板的好处是：

- 显示团队状态
- 显示项目状态
- 显示日程

第一位工程师 Chris Hansen 讲了面板信息的采集与显示方式，他们采用了 Java 与 AngularJS，
利用 Google Feed API 聚合团队成员的博客，使用
[Masonry](http://masonry.desandro.com/) 布局区块。

第二位工程师 Jonathan Thurman 比较风趣，主要讲硬件，Pi 的好处与限制大家都很清楚了，便宜，
但是硬件限制比较大，倒是很适合明确不需要强计算能力的任务。

另外，就是如何展示信息，他管这个叫 Information Radiator，小型的液晶显示屏，大型的显示器，
都在此类。最终选择的是27寸的显示器。

然后是 Feedback Device，反馈设备，Pi 有
[GPIO](http://zh.wikipedia.org/zh-cn/GPIO%E2%80%8E) 接口，因此可以很容易地扩展它，
接上支持 GPIO 的设备。好几个类型可供选择：

- 听觉反馈
- 视觉反馈
- 暴力反馈

![暴力反馈](/assets/img/2013-new-york/aggressive.jpg)

最终选择了视觉反馈。

### Prebrowsing

Steve Souders 讲 Prebrowsing。Steve 是 Velocity 标志人物，
[Velocity 首页](http://velocityconf.com/)上常年都是他。感觉他的讲话风格非常像我之前的
大老板。

1. `<link rel="dns-prefetch">`
2. `<link rel="prefetch">`
3. `<link rel="prerender">`
4. DNS 预解析
5. TCP 预连接
6. prefresh
7. preloader

前端工程师可以利用前三者优化业务流程。比如搜索结果页中点击概率比较高的条目可以开启
prerender，让浏览器预先加载；比如门户网站的子站点（sports.163.com）可以开启 DNS 预加载，
早点解析好域名，如果用户点击体育，就能打开得快一点。

![浏览器支持度](/assets/img/2013-new-york/prev-browser-support.jpg)

浏览器内部可以优化4到6项，其实 Chrome 已经这么做了，打开新标签页的时候他会预先解析常访问
页面的域名，不管你是否打开这些域名。OmniBox 里如果输入结果比较确定了，它也将预先解析域名。

prefresh 是指，在页面刷新的时候，浏览器直接使用存好的静态文件，而不是重新请求，从而跳过一堆
200 或者 302 请求。

所以4到6都是浏览器内部优化项目，看起来与我们无关，但要知道，浏览器资源加载规则的改动，对前端
的影响其实很大。

另外还推荐了一本书，叫做
《[High Performance Browser Networking](http://book.douban.com/subject/21866396/)》。

## Day III

[第三日议程](http://velocityconf.com/velocityny2013/public/schedule/grid/2013-10-16?schedule=public-grid)
仍然不少，早上的议题仍然都很短，而且还有 Patrick Meenan，这哥们每天都有议题啊。这次是演示
WebPagetest，功能确实强大，新加上了测试对比功能。

### Appurify

来自 Akamai.com 的 Guy Podjarny 分享移动平台测试工具 Appurify，也很强大，而且已经集成
到了 WebPagetest 里面，令人印象深刻。这种跨平台的整合应该很有难度才对，Guy 同学说得跟吃饭
一样。

[Appurify](http://appurify.webpagetest.org/) 是在真实设备上跑这些测试的，目前只支持
iOS 设备，可以配置跑测试时的网络情况，是用 Safari 还是 Chrome）浏览等等。

模拟网络情况的选项非常细致，可以选运营商，还可以选信号具体是多少格。

### MLBAM

Velocity 和我一样，都是头一次来纽约，于是请了当地的公司，负责研发、运维美国大联盟的媒体与
网络的 [MLBAM](http://en.wikipedia.org/wiki/Major_League_Baseball_Advanced_Media)，
Major League Baseball Advanced Media。

他们的主要挑战是 MLB.com 要提供的流媒体服务，不是我的领域，不明觉厉啊。

### Dropbox

Dropbox 的工程师 Kun Do 分享了 Dropbox 的云计算经历。

2008 年前，他们用的是亚马逊的 EC2，跑 MySQL，文件数据存储则使用亚马逊 S3。使用 EC2 的
坏处是：

- 服务不稳定，曾经平均每天一台服务挂掉
- 热切换对于创业公司来说太过昂贵
- 服务挂掉之后束手无策，只能不停刷新控制台面板
- 可定制性差

于是换到了数据中心，尽管它也有其问题，尤其是团队没有自行维护硬件的经验。而且还遇到奇葩情况，
机房的 [HVAC](zh.wikipedia.org/zh-cn/Category:HVAC) 会喷洒不明液体到他们的服务器上。

但是好处也很明显：

- 带宽费用降低 50%
- 稳定性、控制度都有提高
- 数据库性能更优秀（因为更容易调整）
- 更多硬件选择

不过，尽管已经有了自己的服务器，Dropbox 仍然用了许多亚马逊的服务，文件数据存在 S3，用 EC2
跑离线任务与文件数据服务等等。用 EC2 跑离线任务这一点，Dropbox 玩得很高级。例如生成照片
的缩略图，如果加上了新的缩略图尺寸，则要把所有照片的缩略图都生成一遍，利用 EC2 的特性，可以
很容易地开启数以千计个服务器，跑上几个星期，然后关掉，避免产生不必要的费用。

![Dropbox](/assets/img/2013-new-york/dropbox-hybrid.jpg)

### 响应式图片与视频

英文标题 Responsive Images and Videos，Jason Grigsby 演讲。讲了移动设备的重要和特殊，
更多人在用手机上网，但是网络情况各异。

首先要说的是现在的响应式都是纸老虎，思路仍然是讲网站的桌面版本做些变形与变换，塞进小屏幕。
网页的实际大小并没有优化。有的网站的移动版甚至比桌面版还要肥大。

要解决这一问题，Jason 提出了五个原则：

1. 移动设备优先（和 Tim Kadlec 同学想一块去了）
2. CSS 图片要妥善处理
3. 根据设备尺寸与能力按需加载 JavaScript
4. 给不同尺寸的设备提供不同尺寸的图片
5. 小心处理高分辨率图片

移动设备优先看上去很简单，把那些 media query 顺序调转一下即可。不过，现实比较骨感，改变
做法之后需要注意的问题是，老版本的 IE 不响应 media query，改用条件注释与单独的 CSS 文件
即可。

如果你不需要这张图片，最好不要在父节点上 `display: none`，因为节点里面的
`<img src="foo.jpg">` 仍然会被下载。

演讲者还列了一些测试：

- media query 里头的 background-image 会各自下载，不会两个都下
- 父节点 `display: none`，子节点的 background-image 将不会下载
- 外部的 background-image 不会被 media query 中的 background-image 覆盖，仍会下载

按需加载 JavaScript 这一点，Jason 举了一个反例，有个网站要做移动版，做好后发现很慢，结果
原因是网页里嵌入了 Google Maps，在移动版上只是通过 `display: none` 去掉了。但实际上，
这些 JS 仍然会下载。

在 JS 里，可以使用 `mediaMatch()` 方法测试当前多媒体设备，与 CSS 中的 media query 是
一样的。判断之后，按需加载脚本。

提供多种尺寸的方式前一天 Tim Kadlec 也讲过了，有两个还在进化中的方案，`@srcset` 与
`<picture>`，所以还是用
[`<span>` 版本](https://github.com/scottjehl/picturefill) 吧。

哦对，还有个新的，叫做 `@src-n`，在最近几周才出现的。

不过还提到了图片缩放的技巧，除了直接等比缩放，其实还可以作适当裁剪，将主要部分突出，使得
小图也能分辨图片想要传达的信息，这种裁剪、缩放方式，可以翻译作艺术指导。

然后是响应式视频，浏览器支持的视频格式仍未统一，Mark Pilgrim 在 Dive Into HTML5 里也
曾预言，在可以看见的未来是不能统一的。不过，一个 mp4 一个 ogg，还算能接受。

另外，HTTP Live Streaming 目前仅在 Safari 与 iOS 中实现，所以暂时仍无法用它实现分辨率的
实时切换。

理想的图片解决方案是怎样的呢？

1. 尽量使用矢量图与字体
2. 鼓励用户上传尽可能高质量的照片
3. 提供图片缩放与压缩服务
4. 将缩放参数放入 URL

第一点，我想广告一下[敝团队的字体图标](http://ux.etao.com/fonts)；第二点，我们做得并不好，
甚至现在还有图片上传服务要求用户自己压缩图片，以要求的符合文件尺寸；第三点，比公司的图片服务
做得非常好，我们现在有非常详尽的尺寸可用。

最后，记得确保你的图片解决方案容易切换，因为不管是 `@srcset` 还是其他做法，都有可能在将来
不被提倡。

### Topcoat

Adobe 的前端工程师 Brian LeRoux 分享 Topcoat，一个适用于移动设备的样式库。

![Brian](/assets/img/2013-new-york/IMG_1587.jpg)

[Topcoat](http://topcoat.io/) 是个样式库，初看亮点不多，除了感觉 Adobe 的设计师比较
有品位，按钮啥的弄得很高大上之外。后来我去看了[它的代码仓库](https://github.com/topcoat)，
发现做了许多配套的工作，包括使用
[Chrome Telementry](https://github.com/topcoat/topcoat/tree/master/dev/test/perf/telemetry)
进行 [性能测试](http://bench.topcoat.io)。对此测试感兴趣的同学，可以看看
[grunt-telementry](https://github.com/axemclion/grunt-telemetry)

Brian 演示的是使用 PhoneGap 与 Topcoat 快速创建应用程序。

在后来的问答环节中，有听众问到 [Topcoat 的 Demo](http://topcoat.io/topcoat/) 是怎么
做的，Brian 说是专门写了个文档转换工具，叫做 [topdoc](https://github.com/topcoat/topdoc)。

这个做法挺有趣，有点像 @lepture 同学做的 [nico](http://lab.lepture.com/nico/zh/)。

另外，还提到当初开始做 Topcoat 时，是用 CodePen 编写了初始稿，放到 Twitter 之后，
各种大拿冒出来，纷纷 fork。

### Evernote

同样是分享运维经验，与 Dropbox 大同小异。亮点是 Evernote 在中国也设立了数据中心，还曾经
不断电换机房，关掉几台，运到新机房，开起来，回到旧机房，再关掉几台，再运过去。

### 移动 Web 性能的五项迷思

演讲者来自 Sencha，Michael Mullany，CEO，承玉老师的偶像。

![Michael Mullany](/assets/img/2013-new-york/IMG_1595.jpg)

五项迷思在早前 Sencha 的博客中就发过了，那会 Facebook 放弃了 HTML5，客户端改用原生方式
编写，Mark Zuckerberg 认为 HTML5 还没有好，太慢了。

Sencha [表示反对](http://www.sencha.com/blog/the-making-of-fastbook-an-html5-love-story)，
做了个 [Fastbook](http://fb.html5isready.com/)，
[对比当时的 Facebook 客户端](http://vimeo.com/55486684)，前者能够达到 60 fps
无压力，而原生应用 Facebook 却只有二三十。

博文的[中文翻译](http://www.geekpark.net/read/view/168794)。

要达到这般高性能，需要注意的事情很多，随着五项迷思的披露一一阐述。这五项是：

1. 移动 Web 性能 == JavaScript 速度
2. 移动 Web 性能只是依靠 CPU 提速而有所改进
3. 在将来，再好的 CPU 也不能提高移动 Web 性能
4. 移动设备上的浏览器已经高度优化
5. 因为用了带有垃圾回收的动态语言，JavaScript 注定性能堪忧

这些自然都不是真的，至少以偏概全了。

1. Web 性能不止是关于 JavaScript 速度，也和 DOM 访问速度、Canvas 速度、SVG 速度、CSS
   transform 性能……等等
2. Web 性能改进依靠硬件与软件起头并进，iOS、Windows Phone 与 Android 各个版本以来都有
   长足进步
3. 同上，更好的硬件当然能更好地提高性能
4. 从 Canvas、SVG、核心 DOM 功能一直以来的性能改进看，仍然有不少优化空间
5. GC 确实很影响性能，因为 JS 是单线程的，不过，浏览器在进步，而且也可以通过重用 DOM 元素
   减少触发 GC。而且 60 fps 在任何平台上都是个不小的挑战，GC 只是其中一个小问题。

讲到第四点的时候提到一个例子，SVG 中的 `<path>` 绘制，iOS7 比 iOS6 要快200倍，算法从
O(n) 变成了 O(1)。耶，算法拯救世界。

### 优化 HTML5 中的 video

用过 `<video>` 标签的同学可能觉得是老生常谈了，要在页面中放视频，准备好 .mp4 和 .ogv
文件，在页面里丢这么一段 HTML：

```html
<video>
  <source src="velocity.mp4">
  <source src="velocity.ogv">
  <object ...><!-- 不支持 <video> 的浏览器 --></object>
</video>
```

就行了。不过，没那么简单，魔鬼都在细节里。来自 Akamai 的 Will Law 分享 Optimizing the
Black Box of HTML `<video>`。

首先，页面上视频比较多，或者比较大，的时候，直接把它放在页面上其实非常有风险，Chrome 会自动
加载视频，如果用户只是看了看页面，没有播放这些视频，带宽就等于是白白浪费了。

可以用 `@preload="none"` 将 `<video>` 预加载关掉，但是，这个属性在 iOS 上不管用。所以，
Will 提供了更彻底的办法，在视频位置放一张图片，点击图片时再创建 `<video>` 标签。

在 iOS 上，在 onclick 事件句柄里是能够调用 `video.play()` 的，不在句柄内就不行啦。

另外，在中间穿插的问答环节中，有个听众提到一件事情，`<video>` 内部，其实是将视频、流媒体
交给操作系统处理的，所以这里可以通过前端优化的东西比较少。

## 跋

![留念](/assets/img/2013-new-york/IMG_1513.jpg)

谢谢[公司](http://alimama.com)给的机会，确实是一次大开眼界的经历。



