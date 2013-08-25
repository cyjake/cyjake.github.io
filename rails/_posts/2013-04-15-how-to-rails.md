---
title: 如何上手 Rails
layout: post
caption: 为什么不该在 Windows 下开发 Rails 项目
---

Rails 也有些年头拉，幸好它有个“专制独裁”且认为自己“非常有品味”的话事人，叫做 @dhh，
在我经历的 Rails 2 到 3 版本变化，和即将来临的 3 到 4 中，都不难看到这位话事人勇于突破，
敢于尝新，且确实品位不俗。

在 Rails 3 里，我们可以看到
[Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html)、新的 routes、
ActiveModel 提炼等大改动，并且都不赖。在 3 到 4 里，我所知的亮点即 Concern 与 turbolink，
前者为现有的代码组织困扰提供统一的解决方案，后者为普通网站加速，让 webpage 摇身变成 webapp，
用起来又是透明的，当真是化繁为简。

不过本文立意不在此，而在为 Rails 有志者作指引，希望说明一些原则性的东西，让诸位初次接触 
Rails 的人，正确走在通往 Rails 大拿的康庄大道上。


## 开发环境

### Ruby

Ruby 语言本身是跨平台的，它已经 18 岁了，在它走向成年的日子里，先后有 C、Java、C++、C#、
Smalltalk、Objective C 等版本的实现。跨平台支持最好的是前两位，C 版本的实现，又成为 
MRI Ruby，它是 Ruby 语言的创造者 Matz 实现的。

在它的[官方网站](http://ruby-lang.org) 上，提供了以上各个版本的下载地址，推荐的自然是 MRI
实现，在类 UNIX 系统上，直接通过相关包管理工具安装即可，Windows 用户，则可以通过
[RubyInstaller](http://rubyinstaller.org/) 安装。

### Rails

Ruby 语言里，除了自带库（[stdlib](http://ruby-doc.org/stdlib-1.9.3/)）之外，还可以借助
[rubygems](http://rubygems.org) 系统，安装其他人共享出来的封装好的库，称为 gem 。

Rails 项目本身，就是由一系列 gem 组成的，许多以 active 开头：

- acitvesupport
- activerecord
- activeresource
- actionmailer
- actionpack
- railties
- bundler

到这里，Ruby 与 Rails，都跨得两脚好平台，Windows 上跑跑，问题不大。

### 其他库

但问题往往出在浓眉大眼的第三方库上，一个最寻常的 Rails 开发的网络应用，通常需要数据库、图片处理、
数据缓存等技术，相应的，它需要这仨：

- mysql2
- mini_magick
- redis

mysql2 顾名思义，即 MySQL 支持，做得还不错，配合 RubyInstaller 与 DevKit，一般搞得定；
mini_magick 即 ImageMagick 的 Ruby 接口封装，已经略有些坑；到了 redis…… redis-server
官方不支持 Windows 好么？

### 没得选择

所以啰嗦了这么一堆，只想告诉诸位亲一个事实，如果要入 Rails 的门，切莫拄 Windows 这根拐。

解决方案，按如下优先级：

- 能申请或者购买到 Mac 不？
- 能直接安装自己中意的 Linux 发行版不？
- 能虚拟机安装个 Linux 配合宿主机做开发不？

好啦，我当你搞定了，不管用什么环境开发 Rails 项目，都有相应的方案，即使是支持程度不佳的 
Windows 操作系统，我们也可以曲线救国，通过
[安装虚拟机来跑环境]({{ site.baseurl }}/binary/arch-linux-in-vbox)

## Mac 环境安装

Mac 用户是最幸福的，因为既不像 Windows 那么束手束脚，也不像 Linux 这样容易被沿途的风景耽误
正事，安装 Rails 环境，只需要：

- 安装 [Xcode](https://developer.apple.com/xcode/)
- 安装 [Command Line Tools](https://developer.apple.com/downloads/)
- 安装 [HomeBrew](http://mxcl.github.io/homebrew/)
- 安装 [RVM](http://rvm.io/)
- 安装 [bundler](http://gembundler.com/)

剩下的就交给 bundle install 即可。

### HomeBrew 还是 MacPorts

MacPorts 是 BSD 里 Ports 工具的 Mac 版本，HomeBrew 则是在其后出现的，广告词曾是
“MacPorts 让你借酒浇愁？试试 HomeBrew 吧”，现在则是 Mac OS X 所遗漏的包管理工具。

后者比 MacPorts 的好处有很多：

- 比 MacPorts 新
- 支持二进制直接安装
- Formula 是 Ruby 写的
- 在 [Github 开源](https://github.com/mxcl/homebrew)

我没用过 MacPorts ，而 HomeBrew 一直好用，所以像诸位郑重推荐。

### zsh 与 oh-my-zsh

zsh 相比 bash 的好处，恐怕普通用户说不出所以然来，更好的补全支持可能是一大方面，而对我来说
[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) 也是很重要的一方面。通过 
oh-my-zsh 包，可以很方便地配置需要补全支持的子命令（git、gem、bundle、rails、npm 之类），
可以选择主题，等等。

安装方式非常简单：

{% highlight bash %}
# 安装 zsh
brew install zsh

# 手动安装 oh-my-zsh
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.zshrc ~/.zshrc.orig
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
chsh -s /bin/zsh
{% endhighlight %}

需要注意的是，如果在安装了 RVM 之后才安装 zsh 的，需要将相关初始化语句加到 ~/.zshrc 里。

另外我还推荐使用 [iTerm2](http://www.iterm2.com/) 与 zsh 搭配，OS X 自带的 Terminal
弱了一些。

## 从哪儿开始？

### Ruby 语言

Rails 是个很厉害的框架，它把 Ruby 语言特性发挥得淋漓尽致，又封装得简明干练。如果没有学过 
Ruby ，那即使知晓其他编程语言，我也不推荐大家直接从 Rails 开始。除了 Smalltalk、schema、
或者 Perl 这些影响过 Ruby 的，一般编程语言对学习 Ruby 基本没有帮助，自然更不建议直接从 
Rails 开始。

直接硬上，小到理解 `render :template => 'foo.html.erb'`，大到 `method_missing`
之流，都容易碰壁，所以还是安安心，从 Ruby 开始。

而学习 Ruby 没有什么快办法，就是找本书来看。推荐：

- [Why's Poignant Guide to Ruby](http://mislav.uniqpath.com/poignant-guide/)
- [Ruby 编程语言](http://book.douban.com/subject/3329887/)

速查 stdlib 的 API，可以使用 <http://ruby-doc.org> 网站。

### Rails 指引

Rails 当初驰名，还让 @dhh 上了回杂志，常被人提及的正是那个 5 分钟开发个博客的教程，
这个教程现在被丰富，改写，作为
[Rails 指南首篇](http://guides.rubyonrails.org/getting_started.html)，自然是不得不看，
鄙站，将不日推出此文中译，提请诸位垂注。

练完手，继续看 [Rails 指引](http://guides.rubyonrails.org/index.html) 即可，这些文章，
能解答你在用 Rails 开发网站时遇到的绝大部分问题，找准关键字，理清技术点，可保无虞。

也有一本书值得推荐：

- [Agile Web Development with Rails](http://book.douban.com/subject/1416743/)

但这本书有几个问题，比较老，新版拿 Rails 3 讲，但是内容反而薄了，我只看了旧版，谨慎怀疑新版把
Rails 2 到 3，3.0 到 3.1 的一些问题给忽略掉了。而旧版本身，真的很有些旧了，不适合拿来跟着做。

所以，如果你借得到这本，就不妨看看；如果要买，还是算了，看官方的指引吧。

## 后记

![东区长廊](http://pic.yupoo.com/yicai-cyj_v/CMYZob6E/4Oovj.jpg)

如上，即 Rails 上手基础，其余，后补。
