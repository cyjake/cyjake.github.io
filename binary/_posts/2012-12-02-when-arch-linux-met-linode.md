---
title: 在 Linode 上用 Arch Linux
layout: post
---

身为码农，少壮不努力，此生已在内地，自然得弄个 VPS，诚所谓居家旅行，杀人越货之必备。
所以我有个 Linode 512，与 luoo 合租，99% 为他的 [落网](http://luoo.net) 及其他相关网站服务。
我选择了 [Arch Linux](http://archlinux.org)。

现在回想起来，租这个 VPS 的时间，正是年初，到现在已将近一年。这一年里，它兢兢业业，尽职尽责，
uptime 妥妥的，但也有过一次 glibc 事故。

Arch 是滚动更新的，意思是，它没有固定的版本号，不像 Debian 或者 Ubuntu ，有各种版本，或者
testing, stable 等区分。拿到 Arch 光盘安装的话，基本的东东装装完，只要 `pacman -Syu` 一下，
你的系统就是最新版了。

看上去很美，不是么？

于是在今年8月份，我一拍脑袋，哎呀，好久没更新 Arch 了，我得更新一下。
呃，`pacman -Syu` 一下就好，对吧？[这位哥哥](https://bbs.archlinux.org/viewtopic.php?id=145795) 也是这么想的：

{% highlight bash %}
error: failed to commit transaction (conflicting files)
glibc: /lib exists in filesystem
glibc: /usr/lib/ld-linux-x86-64.so.2 exists in filesystem
...
{% endhighlight %}

咦？这是什么错误？当即去 Google，结果我选择了最坑爹的方式：`pacman -S --force glibc`。
命令执行得很顺利，结束之后我习惯性的 `ll` 一下，嗯？说找不到 `ls` 命令。这不科学啊，我重启一下吧……
然后就是这条 [微博](http://weibo.com/1665244307/yyky2fLWB) 了，我很遗憾地告诉落在地处，
我把服务器给整挂了。

原因是，Arch 发了[一次比较疼的更新](https://www.archlinux.org/news/the-lib-directory-becomes-a-symlink/)，
把 `/lib` 下的文件丢到 `/usr/lib` 下，`/lib` 只是个指向 `/usr/lib` 的软连接了。
正确的更新方式是：

{% highlight bash %}
pacman -Syu --ignore glibc
pacman -Su
{% endhighlight %}

该文还指出，千万不要用 `--force` 哦亲~

不早说…… 痛定思痛，我犯了好多个错误：

 - 没能多关注 Arch 的新闻动态，错过了这次7月份发布的重要更新
 - 没能多阅读相关文档，遇到错误之后轻信了论坛里一个二货的答案……

说到底还是自己太懒，而又认为最新的软件永远是最好的，殊不知可用的才是真的。

不过，在本周，我又做了类似的事情，ssh 到 VPS，再度输入 `pacman -Syu`，嘿嘿。
这一次，Arch 又有状况，它说，`systemd` 和 `initscripts` 冲突了，装不了啊亲。
我学乖了，看到这个错误立马去看看这 `systemd` 是何方神圣。找到 Arch 维护者
[文章一篇](https://bbs.archlinux.org/viewtopic.php?pid=1149530#p1149530)。

这货来头不小哦，按 @tomegun 的话，好处多多：

 - 支持设备热插拔
 - 系统状态是可知的 `systemctl status foo`
 - 模块化
 - 让 dbus、udev 做它们的本职，别管守护程序的启动之类的事情
 - 管理守护进程的启动顺序也变得容易
 - 安全、沙箱
 - systemd 是个跨发行版的项目，贡献者众
 - 很快哦

其实对我等几百年不打理服务器的人来说，只要服务器还跑着，就不用管这些。但每个挨踢人士都有颗追新的心，
于是我在读完 Arch Wiki 上关于 [VPS](https://wiki.archlinux.org/index.php/Virtual_Private_Server#Moving_your_VPS_from_initscripts_to_systemd)
和 [systemd](https://wiki.archlinux.org/index.php/Systemd) 的文章之后，
整理了 `/etc/rc.conf`，成功把 `initscripts` 这个包给替代掉了。

对用户来说，读文档，很重要；对开发者来说，如果你希望你的项目用户多多，好好记录你的软件吧！
