---
layout: post
title: "一个 Web 开发者的自白"
source: https://www.yuque.com/alpa/notes/fgoek8
---

这是一篇约稿，题目是向大家介绍个人成长经历。工作十多年，成长曲线有高峰有低谷，仔细回忆一番，觉得不妨从 2004 年来到杭州开始说起，谈谈一个 Web 开发者的成长历程。

## 操作系统革命

2004 年就读浙江大学软件工程专业，在学校时印象最深刻的是学校内部的各种网站比如 cc98.org、缘网、以及各种 ftp，通过这些触手可及、五花八门的资源，快速拓宽了视野，领略到一个乐于分享、热切交流的~~互联网~~局域网。

冲击最大的则是大三暑假的 Java 训练营，三周培训、一周实操，量产 Java 熟练工，对这门行业有了全新的认识。在这门课之前，心目中的程序员是纪录片《操作系统革命》[<sup>[1]</sup>](https://www.bilibili.com/video/BV1iC4y187nT?from=search&seid=10030910082143008802) 中的 Linus Torvalds、Richard Stallman、甚或对着比尔盖茨说“I'm your worst nightmare”的中二大叔 Eric Raymond。在这门课之后，写写 Java servlet 和 jsp 养家糊口近在眼前，和前者似乎云泥之别。

但这些心路历程都是后话，在大三的时候，我开始用一个笔记软件，或者说是一个编辑器的笔记插件，Emacs Muse[<sup>[2]</sup>](https://www.gnu.org/software/emacs-muse/)，用这个软件记笔记，生成个人主页，又顺带学习 HTML 和 CSS，攒出来这样一个网页：![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/01.png)

和 Emacs Muse 类似的比较新的例子可能是 Jekyll 或者 Gitbook。如今我对这个工具的使用方式早已忘却，站点源码也已经不见，庆幸当时 `wget` 了全站镜像，至今这个站点仍可访问，反而是后来那些 WordPress 搭建的个人博客全都散佚在比特海里。

写毕业论文的时候，正值北京奥运会，互联网环境空前开放，彼时还有一句非常有趣的号召，Cool URIs don't change[<sup>[3]</sup>](https://www.w3.org/Provider/Style/URI)，几乎就是当时我对心目中的 Web 的最佳总结，想要寻找的知识都在那里，仿佛亘古不变。

## JavaScript 语言精粹

2008 年大四择业时陷入了迷惘期，最终选择就近工作，去做 Java 开发，一家投资银行在杭州的信息技术公司。

工作内容非常杂，用一款非常老的软件制作财务报表，用 Perl 写脚本整理财务报表的 SQL，用 ActionScript（传说中的 ES4）写制作财务报表的 GUI 工具，以及用 django 制作新版财务报表系统的原型。最后一件事很有意思，我能取得的最大成功就是说服波士顿我可能无法成功，就很气人。

在此期间，因为市面上没有太多比较好的 ActionScript 书籍，我便买了介绍 ES5 的《JavaScript 语言精粹》[<sup>[4]</sup>](https://book.douban.com/subject/3590768/) 开始学习，也是在那个时间段接触到淘宝 UED[<sup>[5]</sup>](http://ued.taobao.com/) 的博客（这个博客似乎已经打不开了我猜 Cool URIs do change），加上一路从 PHP、Perl、Python 这么学习过来，ES5 似乎更符合一个脚本小子的喜好。

也因为这些因素，我在 2010 年 10 月份投入前端热潮，去往当时的淘宝搜索与广告发展部门，现在的阿里妈妈。为了这个转型，还啃了好一阵 MDN，这是当时用 Canvas 做的小玩意：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/02.png)

## 黑客与画家

进入广告部门的第一件事情是一个“二跳页面”[<sup>[6]</sup>](https://re.taobao.com/)，这些广告行业术语并不是特别复杂，某种程度来说甚至有些过于直白，但对当时的我来说还是充满了新鲜感。这个页面和淘宝搜索结果页非常像，只是展示内容由广告引擎控制，借着熟悉业务，我记得花了足足两到三周才完成，没想到这页面过于健壮，2010 年上线后，默默陪伴广告业务日进斗金，直到两年后才有新的需求说，要不改个版吧。

然后接手了钻石展位[<sup>[7]</sup>](https://zuanshi.taobao.com/)，算是入行前端以来第一个比较完整、正式的产品，但很快我被调整为全栈研发，学习 Ruby on Rails，参与维护 BannerMaker（基于 Flash 的 swf banner），负责一个名为创意中心的新版（基于 HTML）：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/03.png)

创意中心的起点是当时两个主管的意志杂糅，偏设计的静态物料生成、偏技术的动态广告物料管理，最终在后者取得成功，很好地服务了当时的直通车站外投放需求，我自己也在 2012 年初顺利晋升 P6。

这个版本完成之后，我陷入了一个雕花的阶段，开始琢磨怎么样更好地抽象一个 300x250 尺寸的 HTML，如何拆解其中的轮播组件、请求模块，以及试图实现一个 WYSIWYG 的 HTML 编辑器：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/04.png)

这一年还用 Ruby on Rails 做了当时新成立的一淘 UX 部门网站[<sup>[8]</sup>](https://github.com/thx/mux.alimama.com/tree/old-mux)：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/05.png)

一淘的元年年会是除集团年会之外我参加过的最高大上的年会，毕竟近距离围观刘谦的机会不是每年都有，很遗憾这家公司没能长久。

2013 年发生很多事情，回到广告，搬到西溪园区，工作内容也更加专注在创意中心。我决定把之前的积累推翻，后端实现切换到 Node.js，全部使用 JavaScript。在这个版本里，我们实现了基于 Canvas 动画生成视频，拆解了模板开发套件、针对广告场景的基础 DOM 库 yen[<sup>[9]</sup>](https://github.com/erzu/yen) 、甚至还有现在看来有些用力过猛的 html/css 解析器。

这套方案大幅降低了后端研发成本，全组同学都能够参与到后端研发，相关技术创新还攒下两个专利，所服务的视频广告业务也取得成功。凭借这些因素，我在 2014 年顺利晋升 P7。

也是在这一年，我开始完全使用静态站点生成工具来建设团队门户[<sup>[10]</sup>](https://thx.github.io/) ，为了减少大团队的同事对安装 Jekyll 以及 Ruby 的抵触，还专门研发了一个 Node.js 版本叫做 darko[<sup>[11]</sup>](https://github.com/cyjake/darko) ：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/06.png)

2015 年移动端的流量占比上升已经势不可挡，投放形式最为简单的图文创意再执牛耳。这个客观条件也对我们提了更高的要求，既要多种尺寸适配、又要智能配色，更甚至还要千人千面，而所有的这些都只能在图片中实现。

在一个封闭格式上实现这些的难度很大，我们选择开放格式 SVG 作为中间格式，在这个基础上设计尺寸适配和配色规则，从而实现前两者。但在第三点上很快遇到了性能瓶颈，用 Node.js 调用 SVG 或者 HTML 转 JPEG 显然效率不够高，最后我们采用 Rust 实现了文字渲染和图层叠加逻辑，凭借极高的性能大幅简化了千人千面的图文创意投放技术方案。

在这个阶段，许多技术攻坚已经是团队中成长起来的中坚力量完成，我自己在技术上的投入则放到更加基础的模块。在这些工作中，我实现并开源了 ORM 库 Leoric[<sup>[12]</sup>](https://leoric.js.org/)、前端构建工具 Porter[<sup>[13]</sup>](https://github.com/erzu/porter) （作为一个取名鬼才，我因此被小伙伴揶揄很久），这两个库也被我称为“献给互联网的两毛钱”（my own two cents for the web）。

这套方案在当时取得的影响是空前且深远的，直接推高了手淘首页焦点图等广告位的投放单价，但最终也是因为这个原因没有被大幅铺开。无论如何，我们都迎来了「大数据下的智能创意」：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/07.png)

而我也侥幸凭借这些工作在 2016 年晋升 P8。

这一波晋升后的迷惘期比预期的来得要晚一些，16/17 年我们没有多少犹豫，一方面完善技术方案，一方面对外输出，掺和了天猫双十一、Lazada、AliExpress 等等业务，想要成为集团内的图文创意事实标准。如今回顾，创意中心支持的业务遍布集团，可能我们真的做到了。

但因为集团内同一赛道上还有一只房间里的大象，业务上的重心又需要我们从图文创意抽离，探索移动端的视频广告场景，我在 17/18 年陷入拉扯，到 18/19 年，自觉不再能给团队带来新的东西，又想要跟 Web 再续前缘，我选择转岗加入语雀。

读到这里你可能早已意识到这篇文章的章节标题都是电影或者书的名字，我在阿里妈妈的经历用《黑客与画家》这本书来总结可能再合适不过，尤其对程序员和手工艺人的比喻有共鸣，仍然梦想成为 10x 程序员。

## 有限与无限的游戏

彼时的语雀在我看来已经是一个很成功的内部工具，是个完成品，但后来的一些沟通改变了我的看法，觉得参与研发一个用户产品实在是太有吸引力，很想看看这条路最后通往何方。

来语雀之后，做了许许多多的项目，最值得说的可能是 2020 年做的流程图和演示文稿，在某种程度上，这套基于 SVG 的绘图工具和之前在广告做的工作产生了联系：

![image.png]({{ site.baseurl }}/assets/img/confessions-of-a-web-developer/08.png)

演示文稿的立意被挑战很多次，拔高一点来讲，也和公司要求汇报“脱水”背道而驰，但我始终认为一个 Web 原生的演示文稿工具大有可为。也可能是因为这个原因，我还发起了文档演示模式的优化迭代，中间在“是否切页”这一点上有过停留，但这次不会再鸽了，会在九月和大家见面。

在技术上，我的“两毛钱”仍在继续，在疫情期间给 ORM 库 Leoric 支持了 SQLite 并服务语雀桌面端，去年做完演示文稿那波，专门花了 4-6 周时间调整语雀的前端技术架构，不要脸一点讲，也算是给今年小程序的快速迭代打下一点基础，但离很早之前展望的深色模式、性能优化还有很远。

语雀在快速演化，去年我们最终定下来想要做的“三个圈”[<sup>[14]</sup>](https://www.yuque.com/yuque/blog/xsrv8e)，笔记+协同+内容，今年都会各自发力，上半年还花了非常多的时间在招聘上，希望在年前顺利完成招聘目标，也欢迎有识之士加入，无论是文档编辑、电子表格、白板、演示文稿，还是 Node.js 研发、前端工程、小程序、Electron、以及移动端，都是一片广阔天地，大有可为[<sup>[15]</sup>](https://www.yuque.com/about/careers)。

这两年多时间里，影响我最多的可能是《有限与无限的游戏》这本书，尤其是文中这句：

> 有限游戏以取胜为目的，而无限游戏以延续游戏为目的。
>
> ——《有限与无限的游戏》

我对这句话的理解是有限游戏的主题是竞争，大家参与到一个个有着明确规则的竞争里面去，以取胜为目的，赢家通吃。而无限游戏的主题是成就，是乔布斯在某期 Macworld 主题演讲里提的 put a dent in the universe，是米开朗基罗雕琢大卫。

这真是一个有趣的划分，似乎放诸四海皆准，也希望自己能够真的成就一些什么。

## 参考链接

[1]: [https://www.bilibili.com/video/BV1iC4y187nT](https://www.bilibili.com/video/BV1iC4y187nT)

[2]: [https://www.gnu.org/software/emacs-muse/](https://www.gnu.org/software/emacs-muse/)

[3]: [https://www.w3.org/Provider/Style/URI](https://www.w3.org/Provider/Style/URI)

[4]: [https://book.douban.com/subject/3590768/](https://book.douban.com/subject/3590768/)

[5]: [http://ued.taobao.com/](http://ued.taobao.com/)

[6]: [https://re.taobao.com/](https://re.taobao.com/)

[7]: [https://zuanshi.taobao.com/](https://zuanshi.taobao.com/)

[8]: [https://github.com/thx/mux.alimama.com/tree/old-mux](https://github.com/thx/mux.alimama.com/tree/old-mux)

[9]: [https://github.com/erzu/yen](https://github.com/erzu/yen)

[10]: [https://thx.github.io/](https://thx.github.io/)

[11]: [https://github.com/cyjake/darko](https://github.com/cyjake/darko)

[12]: [https://leoric.js.org/](https://leoric.js.org/)

[13]: [https://github.com/erzu/porter](https://github.com/erzu/porter)

[14]: [https://www.yuque.com/yuque/blog/xsrv8e](https://www.yuque.com/yuque/blog/xsrv8e)

[15]: [https://www.yuque.com/about/careers](https://www.yuque.com/about/careers)
