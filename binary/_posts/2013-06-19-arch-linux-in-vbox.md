---
title: 在 Windows 下开发 Rails 项目
layout: post
excerpt: 使用 VirtualBox 搭建 Arch Linux 虚拟环境
---

MacBook Pro 电池挂掉了，右上角电池状态是个 X ，于是交给 IT 送修，翻出一台老旧的
Dell 760 主机，装着 Windows XP，平日里用来测 IE6 的，继续日常的工作。

然而基于 Rails 的项目开发自然是没辙了。

恰好前些日子，有个新同事来，申请的 rMBP 还没来得及采购，也是让他用虚拟机装
Linux 跑项目，但是中间过程有些语焉不详，也缺乏记录。于是自己动手丰衣足食，
实践之，并记录本文。

## 基本过程

1. 下载、安装 [VirtualBox](https://www.virtualbox.org/)
2. 下载 [Arch Linux](http://www.archlinux.org) 光盘镜像
3. 在 VirtualBox 中创建 Linux 虚拟机，光驱中装载下载好的 .iso 文件
4. 遵照 [Begginer's Guide](https://wiki.archlinux.org/index.php/Beginners%27_Guide) 完成安装
5. 安装 [RVM](http://rvm.io) 与 Ruby

### Why X?

解释一下选择 VirtualBox 和 Arch Linux 的理由。在 Sun 还没被 Oracle
吞掉前我就在用前者，因为开源且免费，虽然未必有 VMware 强大，但想要的都有，
比 qemu 神马的，看起来不吓人很多，故而一直在用。

在 Mac 平台里需要测试 IE 各个版本时，我也是通过多个版本的 Windows 系统虚拟机来搞的。
当然有更好的方式，大公司里，会有团队致力于前端工程的自动化，自然会有又快又方便的
Windows 2003，Windows 7 之类的服务，用远程桌面连接一下即可。利用这些服务，
还可以快速跑前端代码的测试用例，参考 @ejohn 大神的 TestSwarm 。

选择 Arch Linux ，原因则复杂一些，我用过的 Linux 发行版有：

- Ubuntu
- Debian
- Fedora
- RedHat Enterprise Linux
- Arch Linux

Arch Linux 是我单凭个人喜好选择的最近一款 Linux 发行版，滚动发布，永远最新，
Wiki 建设的非常好，社区反馈也一直很快。我的 [VPS](/binary/when-arch-linux-met-linode/)
装的也是它，跑了一年多，中间只因我的个人疏忽强制更新而出了一次篓子，其余顺滑如丝。

### Arch Linux 安装步骤

看到这里，我猜你已经装好了 VirtualBox ，下好了 .iso 了。首先要创建 VirtualBox VM ：

- 类型：Linux
- 版本：Arch Linux

![创建 VM]({{ site.baseurl }}/assets/img/2013-arch-linux-install-guide/create-vm.jpg)

即可。会询问你给这虚拟机分配多少硬盘和内存空间，一般而言硬盘 20G ，内存 512M ，
也就够了。将来要是觉得不够用，还可以调整。当然，调整过程看起来有点奇诡，
所以如果你的硬盘有富余，多分配些吧就。 创建完毕之后，在存储一栏里找到虚拟光驱，
挂载好下载的 archlinux.iso ，然后启动机器。

![从光盘启动]({{ site.baseurl }}/assets/img/2013-arch-linux-install-guide/boot-from-iso.png)

选择 Boot Arch Linux ，等它启动完，就能动手开始安装了。

启动好的界面可能有点吓人，啥也木有，进入的是 root 帐号，/root/ 下只有一个
install.txt 文件，其实是
[Install Guide](https://wiki.archlinux.org/index.php/Installation_Guide)
的 Wiki 源码，所以直接看该页面就好啦。

在之前的 Arch 版本中，提供过初始安装脚本，但在最新的 Arch 里去掉了，
以几个人肉步骤代替，分别是：

1. 选择键盘布局
2. 划分磁盘
3. 格式化磁盘
4. 挂载分区
5. 配置网络
6. 安装基础系统
7. 配置系统
8. 安装 GRUB 引导
9. 重启

这些步骤里，假如物理安装，磁盘操作和启动引导部分比较有风险，幸亏我们是在虚拟机里。

### 键盘布局

我们的键盘布局都很正常，默认的 us 就是，无需修改。如果你不走运和我一样，
买过一些欧版键盘，则需要到 /usr/share/kbd/keymaps 目录寻找相应的布局，并装载：

    loadkeys uk

### 准备磁盘

没有操作过分区软件的同学，在这一步可能会手足无措，所以 Wiki 中建议使用图形化工具
[GParted](http://sourceforge.net/projects/gparted/files/gparted-live-stable/0.16.1-1/) 。
后者直接以 Live CD 形式提供，可以直接在虚拟机里挂载，启动，打开 GParted 工具，
鼠标点点，把分区工作做好。后面还会提到它。

![GParted 启动]({{ site.baseurl }}/assets/img/2013-arch-linux-install-guide/gparted-boot.png)

选择第一项（GParted Live），回车即可。在启动的过程中，它会探测硬盘中安装的系统，
并询问是否要根据系统中的配置调整从 Live CD 启动的系统。Live CD 中采用的系统是
[Debian](http://2008.cyj.me/debian.html) 。

根据它提供的选项，貌似还提供中文界面，为了保险起见，我没有选择。启动好界面：

![GParted 界面]({{ site.baseurl }}/assets/img/2013-arch-linux-install-guide/gparted-live-cd.png)

如果嫌麻烦，用 cfdisk 之类的工具，按照
[新手指南 - 分区示例](https://wiki.archlinux.org/index.php/Beginners%27_Guide#Example)
操作即可。

### 格式化磁盘

弄好之后，可以用 `lsblk /dev/sda` 检查是否正确，如果你是物理安装，而且有多个磁盘，
记得一定别搞混了。

    mkfs.ext4 /dev/sda1
    mkfs.ext4 /dev/dsa2

即以 EXT4 为文件系统，格式化新创建的磁盘 a 上的 1、2 分区。

### 挂载分区

命令如下：

    mount /dev/sda1 /mnt
    mkdir /mnt/home
    mount /dev/sda2 /mnt/home

### 配置网络

如果是物理安装，而且刚好没法连有线网络（例如正在用 MacBook Air 而且没有 USB
转以太网口），那这里会稍微麻烦点。幸好这里只是在虚拟机中安装，网络设置的又是桥接，
只要你的网络环境支持 dhcp ，这一步应该就不用愁。

可以 ping Google ，确定网络正常：

    # ping -c 3 google.com

    PING www.l.google.com (74.125.132.105) 56(84) bytes of data.
    64 bytes from wb-in-f105.1e100.net (74.125.132.105): icmp_req=1 ttl=50 time=17.0 ms
    64 bytes from wb-in-f105.1e100.net (74.125.132.105): icmp_req=2 ttl=50 time=18.2 ms
    64 bytes from wb-in-f105.1e100.net (74.125.132.105): icmp_req=3 ttl=50 time=16.6 ms

    --- www.l.google.com ping statistics ---
    3 packets transmitted, 3 received, 0% packet loss, time 2003ms
    rtt min/avg/max/mdev = 16.660/17.320/18.254/0.678 ms

然后，记得要做的是，从 /etc/pacman.d/mirrorlist 中选择一个地理位置最接近的 Arch
镜像服务器，一般地理位置越近，网络越快。

文件有点长，搜一下 China 即可，国内 Arch 镜像很不少了。把其余的都注释掉，剩这一个。

### 安装基础系统

执行：

    pacstrap -i /mnt base

如果不想一个个选，把 `-i` 去掉就好。

生成 fstab ，让装好的系统能自动挂载相关分区：

    genfstab -U -p /mnt >> /mnt/etc/fstab

然后 chroot 到新系统的分区，配置系统：

    chroot /mnt

需要配置的东西其实不多：

- locale
- dhcp 服务
- 时区
- hostname

按 [新手指南 - 配置](https://wiki.archlinux.org/index.php/Beginners%27_Guide#Chroot_and_configure_the_base_system)
章节介绍的操作即可。

记得执行 passwd 命令，给 root 帐号设置个密码。

### 安装 GRUB

再一次，如果是物理安装，磁盘可能是别的值（例如 /dev/sdb），记得修改。
注意不要加上分区号：

    pacman -S grub-bios
    grub-install --recheck /dev/sda
    cp /usr/share/locale/en\@quot/LC_MESSAGES/grub.mo /boot/grub/locale/en.mo

生成配置文件：

    grub-mkconfig -o /boot/grub/grub.cfg

### 重启

退出 chroot ，卸载磁盘，重启：

    exit
    umount /mnt/home
    umount /mnt
    reboot

记得在 VirtualBox 里把挂载的 .iso 文件取消掉。

### 配置新系统

首先，安装一些必备软件：

    pacman -S sudo vim zsh curl openssh

添加个普通帐号，把它加为 sudoer ：

    useradd -m -g users -G wheel -s /usr/bin/zsh john
    passwd john
    visudo

然后 exit ，切换到刚创建的 john 帐号：

1. 安装 RVM
2. 用 RVM 安装 Ruby
3. 安装 bundler
4. 用 bundler 安装项目依赖

至此，基本的 Arch Linux 系统安装完毕。但一些增强可用性的软件还没装：

- Xorg
- VirtualBox Guest Additions

安装 Xorg 和相应的桌面软件（GNOME、KDE、XFCE 等）非常简单，可玩度也很高。
此处按下不表。

### 安装 VirtualBox Guest Additions

[Arch Wiki](https://wiki.archlinux.org/index.php/VirtualBox) 上就有，
我兜售一下二手资料。执行如下命令即可：

    pacman -S virtualbox-guest-utils
    modprobe -a vboxguest vboxsf vboxvideo

创建 /etc/modules-load.d/virtualbox.conf 文件，内容为：

    vboxguest
    vboxsf
    vboxvideo

告诉 Arch Linux 下次启动的时候自动加载这三个模块。

在 ~/.xinitrc 里加上：

    exec VBoxClient-all

要配置共享文件夹的话，首先需要创建分组，并将用户加到该组：

    groupadd vboxsf
    gpasswd -a john vboxsf

在 VirtualBox 虚拟机里配置好需要挂载的共享目录，然后启动 vboxservice ：

    systemctl enable vboxservice
    systemctl start vboxservice

这样就能在 /media/ 目录下看到共享目录了，例如 `/media/sf_Dropbox/`。

把它链接到 /home/john 下面：

    ln -s /media/sf_Dropbox ~/dropbox

### Windows 下开发，Linux 下提交

在两种不同系统下共享文件，文件权限控制（filemode）的问题比较讨厌。Git
默认会记录文件的权限设置，普通文本文件的权限应该是 0644 ，但在 Linux
里挂载 Windows 目录，这些文件会的权限是 0777 。爽快点的办法，让 Git 别记录了：

    git config code.filemode false

## 后记

其实这样并非长久之计，最爽利的方式该是直接在 Linux 中开发，抛弃 Windows，
但确实用 Linux 会把人往可劲折腾的地方引，导致忘了正事。

所以还是买 Mac 吧！
