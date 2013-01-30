---
layout: post
title: Gitolite 工作原理
---

[Saito](http://ruby-china.org/saito) 同学在某次杭州 Ruby Tuesday 分享过
[Gitolite](https://github.com/sitaramc/gitolite)
的工作原理，他也是开发 GitLab 的组织 [gitlabhq](https://github.com/gitlabhq) 的成员。
我当时理解的并不透彻，算是一知半解；恰好最近公司也搭了 GitLab 服务，但因为各种安全方面的顾虑，
有些限制，让人很摸不着头脑，于是翻出 gitolite 的文档 看了一遍。挑几篇翻译一下。

[How does gitolite work?](http://sitaramc.github.com/gitolite/how.html)

----

### “Gitolite 仓库”长什么样？

Gitolite 仓库与普通 Git 服务器上裸（bare）仓库看起来没什么两样。仓库里会有一些额外的文件，
文件名前缀是 `gl-`，同时在 `hooks` 子目录，还有个更新钩子（update hook），
在很大程度上，仅此而已。

换句话说，你可以把 Gitolite 维护的仓库当做普通裸仓库一般对待，只要你别碰上面说的这些文件。

### 行文约定

    --//-->    网络连接
    ------>    exec() 或者 system() 调用
    --??-->    有条件的 exec() 或者 system() 调用

“有条件的”的意思是，调用者会先做些判断，并依据其结果决定是调用方法，还是中止。

### 通过纯 SSH 连接的 Git

如果你用过 rsync 或者其他类似需要使用 ssh 到远程主机的程序，那其实你已经懂得了通过 SSH
连接 Git 的基本原理。

具体发生的细节如下：

    # 读取操作
    git clone ------> ssh --//--> sshd ------> git-upload-pack
    git fetch ------> ssh --//--> sshd ------> git-upload-pack

    # 写入操作
    git push  ------> ssh --//--> sshd ------> git-receive-pack

本地 git 客户端只不过是执行了类似
`ssh git@host git-receive-pack 'path/to-reponame.git'` 的命令（上例中的推送），
等连接建立之后，本地的 `git-push` 与远端的 `git-receive-pack` 通过此连接交流。

### 通过 Gitolite 连接的 Git

安装 Gitolite 只是在 `sshd` 与 `git-receive-pack`（或者 `git-upload-pack`，
读操作的时候）之间加了一层，以检查是允许此操作，还是中止掉。

以推送为例，真个过程如下：

    git push ------> ssh --//--> sshd ------> gitolite-shell --??--> git-receive-pack

注意**客户端** git 一点都没变；事实上，它都不会知道这世上竟有 Gitolite 插了一脚。

下面是我们搞定服务器如上行为的方法：

 - 我们让 sshd 调用 `gitolite-shell`，即便客户端 git 要求调用的是 `git-receive-pack`
   （或者 `git-upload-pack`，读取时）。
 - 我们还让 sshd 给 `gitolite-shell` 提供一个参数，即该 Gitolite 用户的名称
   （注意这是个虚拟的用户，并非实质的 UNIX 用户）。
 - 最后，sshd 自己会把原始的命令，即客户端 git 所要执行的
   `git-receive-pack 'path/to/reponame.git`），放到一个特殊的环境变量里面，
   叫做 `SSH_ORIGINAL_COMMAND`。

（所有这些都是通过 ssh 特性搞定的；更多细节请阅读
[gitolite and ssh](http://sitaramc.github.com/gitolite/glssh.html)

### gitolite-shell

因此 `gitolite-shell` 有两条信息。通过参数1，它知道了用户名，通过该环境变量，
它知道了是要哪个仓库，和要做什么操作（也就是，是要读取还是写入）。

其时，它检查用户的存取操作，决定是否允许。

（详细内容可以看 [rules](http://sitaramc.github.com/gitolite/rules.html) 页面，
尤其是 when are rules checked 与 how are the rules matched 章节）

对读取操作而言，Gitolite 的介入到此结束。如果允许，`git-upload-pack` 跑起来，干它的活，
然后退出。

### 更新钩子（update hook）

对写操作而言，如果有更新钩子的话，git 在更新索引之前会先执行它。所有 Gitolite
“精美绝伦的读写控制”即通过此钩子发生，每个它维护的仓库都有装。

当 git 调用这个更新钩子时，它提供了三个重要的信息作为参数。我们已知的（用户、仓库），
加上这三条信息（本更新的索引名称，旧的 SHA，和新的 SHA），
告诉了我们实现任何你想要的读写控制所需要的信息，比如“只有爱丽丝与呆伯特才能推送到主分支”，
“瓦利（Wally）只能推送名字以 `wally/` 开头的分支，或者”只有呆伯特才能推送改动到
`license.txt` 文件“，等等。

（再次，详细规则在 [rules](http://sitaramc.github.com/gitolite/rules.html) 页面）