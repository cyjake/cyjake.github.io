---
layout: post
title: Velocity Beijing 2012 小记
---

上周去参加了 [Velocity Beijing 2012](http://velocity.oreilly.com.cn/2012/)。
上一次去参加这个大会是我刚入职淘宝的时候，2010年，也是在北京。
两次的时间差不多，一样的冷，不一样的议题。但很遗憾，对前端工程师来说，今年的不如两年前的给力。

![飞行途中](/assets/img/2012-velocity/flight.jpg)

两天大会，上午基本都是广告时间。下午的议题，有的十分精彩。

## DAY I

第一天，Google 宣传它们的 Page Speed 计划，涉及到的项目有很多：

 - Apache 模块 [mod_pagespeed](https://developers.google.com/speed/pagespeed/mod)
 - [PageSpeed Insights Chrome 扩展](https://developers.google.com/speed/pagespeed/insights_extensions)
 - [PageSpeed Insights 服务](https://developers.google.com/speed/pagespeed/insights)
 - 顺带还广告了 [Google Analytics](https://www.google.com/analytics)。

都是好东西，前端工程师与小站长们十有八九都会用到这些服务，听到了也会连称“久仰久仰”，
但是在这种技术大会上泛泛而谈产品，绝对不会让人有值回票价之感，而会令人愤怒。

4日早晨的广告，还有敝厂，阿里巴巴在 2012 年又为开源社区贡献了许多代码。而且很值得骄傲的，在阿里巴巴的开源项目名录里头，
我们还能够看到 [KISSY](http://docs.kissyui.com/)：

![KISSY](http://ww3.sinaimg.cn/bmiddle/63419c93jw1dzhlij6wzyj.jpg)

但与 Google 类似，这种广播式的演讲，太没有交流了。

除了 Google 与敝厂，4日早晨的广告还有基调网络、OmniTI 和 Twitter。
[基调网络](http://www.networkbench.com/) 提供的是运维方面的监测、优化等服务，但给工程师们介绍这种产品，
还是不开源的，只能说兴趣缺缺了。[OmniTI](http://omniti.com/) 提供的是全栈式的技术解决方案，演讲者 Theo
讲了其公司在 2012 年对技术热点的一些观点，例如
[Objective-C 的黑马之姿](http://www.tiobe.com/index.php/content/paperinfo/tpci/index.html)，
并非 Objective-C 语言有多优秀，而是 iOS 平台开发利润颇丰之故，是消费者众决定的。在 2012 年，
移动设备上的开发，全是热点，开发者自然也面对挑战，设备多样、复杂。

Theo 给开发者的建议是专注于产品和用户，而非软件本身；有点契合前一阵不要“为了技术而技术”的讨论的意思。同时，引用一下：

> Stop hugging your tools. Technology moves fast. Don't be satisfied with what you know today.

深以为然，从今往后，再也不掺和有关操作系统、编辑器、编程语言、开发框架的孰优孰劣之争了。

Twitter 的同学，Marcel Duran 给大家打来的是 YSlow.org。
这个脱身与 Yahoo! 的项目，如今有了自己的 [项目主页](http://yslow.org)，并且有了姘头，[PhantomJS](http://phantomjs.org/)。
它不再只是个 Firefox 插件，拥抱了 NodeJS 之后，它有了 cli 版本，并且有着丰富的参数。因此我们可以将它用来：

 - 与 CI 结合，滚动发布之前，跑跑产品性能测试
 - 分析 PhantomJS 的 HAR 导出
 - 自定义规则，折腾去

上午的内容，基本如此。

下午内容颇丰，分了三个会场，我分身乏术，在 A 听到底。首场，依然是 Google，Song Libo 同学宣传 Google 提出的
[SPDY](http://www.chromium.org/spdy) 协议（读作 SPeeDY），据说有望进入 HTTP 2.0 标准，
但最快也要到 2014 或者 2015 年。标准规标准，如果你的产品是全方位可控的（从服务到客户端都可以你说了算），用 Apache +
[mod_spdy](http://code.google.com/p/mod-spdy/) 配合 Chrome、Firefox 或者 Opera 浏览器就行了。
在 Chrome 里，你可以在地址栏输入

```
chrome://net-internals/#spdy
```

查看活动的 SPDY 链接。

SPDY 并非 HTTP 的直接替代，这是 Google 说的，不过既然是 underdog，低调点总是没错的。目前而言，它可以称作 HTTP 的补丁。
提供了 HTTP 所不具备的[如下特性](http://www.chromium.org/spdy/spdy-whitepaper)：

 - 多路复用流（multiplexed streams）
 - 请求优先级
 - HTTP 头部压缩
 - 服务端推送
 - 服务端提示

另外，值得注意的是，虽然从技术上说，它不需要依赖 SSL/TLS，但它依然在表现层加入了 SSL/TLS ，演讲者给的理由是，
服务器上 80 端口通常都是被占用的，而通过 SSL 的 NPN（Next Protocol Negotiation）可以很方便地引入 SPDY。
百度的同学对略有些看法，引入 SSL 的话，在国内有两个麻烦：

 - 老大哥不方便监控你了
 - 移动设备上，可用性一般（百度的同学说的）

或者大家可以参考 Google 自己的做法，[先在自己的服务器集群上玩玩吧](http://stackoverflow.com/questions/4065344/is-spdy-really-used)。

第二场，<http://etsy.com> 的同学，讲他们的持续发布的经验；这方面，对我这种 Rails 程序员来说，是个很方便玩的事情，
观点都不错，但欠新意。闲话休提，演讲者说，他们平均每天要发这么多次：

![33 deploys/day](/assets/img/2012-velocity/33_deploys.jpg)

协调这么多次发布的方式十分简单，就跟英国议会投票表决的方式一样原始，他们搞了个 IRC 频道，谁要发布就在那个频道里吼一下，
同时改一下频道名字，类似 John Doe is Deploying……

持续发布好处多多，比较重要的是，发布得越频繁：

 - 每次发布的改动就越小
 - 每次发布就越不容易犯错

所以连 Github 这么大的网站，都是这么发的，在 Rails 世界里，真是数见不鲜了。
唯一的区别是，屌丝 Rails 项目，会在连 CI 都木有、单元测试都没跑的情况下，直接发布；而高富帅则有完善的流程。
顺便，还记得这张图吗？

![I do it in production](/assets/img/2012-velocity/i-dont-always-test-my-code-but-when-i-do-i-do-it-in-production.jpg)

高富帅的流程，主要区别在两个方面：

 - 测试
 - 反馈

切实的反馈能够让你知道自己的改动究竟是好是坏，完备的测试则让你放心开发，快速回归。所以，良好的持续发布流程是：

code ==> test ==> release ==> feedback ==> code

如此循环。

第三场，阿里巴巴的同学分享他们使用 LVS 的经验，我对运维一窍不通，但不开玩笑，他讲得真的很厉害的样子……
对此感兴趣的运维同学，耐心等 Velocity 发相关视频吧。

第四场，仍然是 Google 的同学，讲物理层，TCP 协议，的优化。TCP 的全称是
[Transmission Control Protocol](http://en.wikipedia.org/wiki/Transmission_Control_Protocol)
即传输控制协议。Google 的 Page Speed 计划把影响到网页速度的各个因素都优化到，TCP 协议自然也不例外。

但再一次，关于 TCP 的指摘其实都不再是新闻了，Velocity 第一天的内容全都是这些，确实让人有点失望。
不过不妨碍对此尚未了解的同学，我继续。在当今的网络情况下，TCP 的三次握手方式，是很大的不必要消耗，同时，
它的传输方式是 [sliding window](http://en.wikipedia.org/wiki/Sliding_window_protocol)，
按数据包来传，它有个 [congestion window](http://en.wikipedia.org/wiki/Congestion_window)
即随时可以传的字节数的概念，初始值为 [maximum segment size](http://en.wikipedia.org/wiki/Maximum_segment_size)，
Google 说，对如今的网络速度来说，这个初始值太小了一些。

优化方式其实简单，把它调大一点。Google 自己的数据时，把这个值改到 10 差不多；对此，Google 还给 Linux Kernel
提交了补丁，并撰文一篇以讨论。在 Linux Kernel 2.6.33+ 版本中，这个值已经调整了。

同时，如前边分享 LVS 的阿里巴巴的同学指出，这个 10 并不是绝对的，拥塞窗口越大，丢包率也越高，还是需要运维自己测试才行。

另外，Google 在移动端也做了相关优化，我听的时候并没有理解，还是等视频或者 PPT 再看吧。

第五场，58 同城的 IM，演讲者是从百度 Hi 跳到 58 同城的，从零开始重构自己的项目，并不是每个程序员都能够有的机会，
该同学自然不怠慢，然而我对此没有研究，就不再卖弄。

## DAY II

首场，仍然是 Google 的 Song Libo 同学，仍然是 PageSpeed。优化经验方面的内容，大同小异，比如如何优化带宽利用率。

 - 打开压缩
 - 移除废旧 CSS
 - 压缩资源文件
 - 延迟加载 JavaScript
 - 提供合适的图片尺寸
 - 资源文件的 URL 要统一（减少 DNS 解析的过程，这与当年的分散域名以绕过浏览器请求数限制是完全不同的）
 - 最小化请求大小
 - 静态资源应该放在 cookie-less 域名下（因为每次 HTTP 请求都会带上 Cookie）

而为了减少往返时间（Round trip time），要减少：

 - DNS 解析
 - 重定向
 - 坏请求
 - 资源文件数
 - document.write
 - CSS @import

对于 `document.write` 这一点我并不十分理解。

同时，在移动端，还有个要注意的是，JavaScript 解析，也有可能很慢，优化办法很早就有了，把代码注释掉，先下载再 eval 之类的。

这些优化策略，PageSpeed 都会提醒你，所以，要知道自己还要优化什么，拿自己的网站去跑跑评测就可以了。
演讲者用了两条数据来支持自己的观点：

 - Google 搜索，增加 400ms 的延迟，即减少 0.6% 的搜索次数
 - DoubleClick 中，去掉了一次重定向，点击通过率增加了 12%

第二场，仍然是广告，Oracle 的销售，宣传 MySQL Cluster。

第三场，还是广告，OmniTI 的 Development in Production，演讲精神昨天差不多已经传达过了。

第四场，奇虎360 的同学，讲浏览器性能优化和 HTML5，好像没啥可记；不过，没想到奇虎也热心于技术步道。

第五场，雅虎的同学，宣传 [Mojito](https://github.com/yahoo/mojito) 和
[Manhattan](http://developer.yahoo.com/blogs/ydn/tags/manhattan/)。
Mojito 做的事情，是每个前端架构师都有的梦想，前后端共享模板与业务逻辑代码，同一套框架，
不同的 JavaScript 平台（浏览器、NodeJS）。但每个人都想搞，意味着每个人都有其观点，最终结果就是谁也不服谁。
YUI 的使用者，国内本来就少，淘宝自己都改用了 KISSY，其余的要么在折腾自己的框架，要么用 jQuery。
所以对 Mojito，我并不乐观；不过，只是个人看法而已……

同时，Yahoo! 又搞了 Manhattan，让你的 Mojito 项目有处可跑。

以上，是上午场。

下午场，开场是 Qzone 的同学讲 QQ 空间的首页优化。内容很不错，
[玉伯称其为本次 Velocity 前端议题里的最佳](http://weibo.com/1748374882/z8l8QlQKl)。
因为是站着听，没记多少笔记，等 PPT 吧各位亲。

然后我去 A 厅待到结束，听了 @[cydu](http://weibo.com/cydu) 同学的微博计数器优化，真心觉得不错。

新浪微博里的计数有很多，每条微博都有其转发数、评论数等，每个账号都有关注数、粉丝数和微博数，而中间几次改版之后，
又多了喜欢数之类的东西。杜传赢同学从无到有，把微博在这方面的实现从开始到现在讲了个遍，很透彻。

初版的新浪微博，那会域名还叫 <http://t.sina.com.cn>，要获取上面说的这些计数，一句 `select count(mid)` 就搞定了；
后来数据量增加，`select count(mid)` 性能堪忧，便把这部分独立出来，有了单独的计数表；再后来，请求数越来越高，
就用了解决方案 [Fusion IO](http://www.fusionio.com/solutions/mysql/)。

然后到第二版，发现单独的表也撑不住了，原因有许多，分表越来越多，而数据读写越来越频繁，于是采用了消息队列 + 异步更新的方式，
这帮助微博撑过了农历新年的考验；然后，利用消息队列，又做了批量更新的优化，将多次 `update` 合并成一个；
再后来，又有了缓存，新浪微博用的是 Redis，演讲者讲得很霸气，才几万行代码，几个人一个周末就读完了；同时，在分表方面，也有所优化。

再然后，微博越来越大，业务越来越广，竟然有了更多的问题：

 - 数据量变大，分表复杂、操作风险高
 - 访问量变大
   - 内存利用率低
   - 缓存命中率低
 - 可用性差
 - 业务复杂度提高

于是，深度使用 Redis，并采用其数据固化方案，同时，将计数放入内存，使用自定义的数据结构，等等。
演讲者在这一块的内容十分精彩，也让我看到了想微博这种规模的网站，优化如何做。然而我资质驽钝，所学浅薄，转述不清，
感兴趣的同学，可以找相关内容来看哦。

然后，从初版到现在的内容，不正是想做网站的你，所需要知道的一切网站性能优化方案么？

再之后，阿里巴巴的同学讲机房容灾的一些策略，自觉真心做不到这方面，我就没再仔细听了。

以上，即本次 Velocity 我之所见所闻，希望对你有所帮助。

顺便，此时的北京室外，真的好冷……

![后海](/assets/img/2012-velocity/houhai.jpg)
