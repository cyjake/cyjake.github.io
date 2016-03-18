---
layout: post
title: 在 RHEL 5 上安装 CouchDB
---

公司的服务器，跑的操作系统都很老，一水的
[RedHat Enterprice Linux](http://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux)，
而且是 5，更加令人发指的是 yum 源陈旧得一塌糊涂。

于是安装新鲜玩意就只剩一个选择，源代码安装。对于我等没有正经接触过 Linux 编程的人来说，
这种安装方式之奇诡，不亚于关掉大灯开夜车，只求佛祖保佑。而在 RHEL 5 上源代码安装 CouchDB 尤甚，
以下便是昨日之安装过程。

tl;dr 请直接跳到末尾。

像所有理科生一样，在使用工具之前，我们会翻阅手册。于是我参考
《[CouchDB - the Definitive Guide](http://guide.couchdb.org/index.html)》
中的[源代码安装章节](http://guide.couchdb.org/draft/source.html)，
发现丫只有 Debian 与 Mac OS X 上的说明，作了第一个错误决定，跳过了

    apt-get install build-essential erlang libicu-dev libmozjs-dev libcurl4-openssl-dev

直接跑到 apache-couchdb-1.2.1 目录中 `./configure`，不出所料它提醒我说找不到 erl 和 erlc，
也就是说木有 erlang。本来么

    yum install erlang

即可，但我自作聪明，非要从 [erlang.org](http://www.erlang.org/) 上搞一份手工装，庆幸无虞。
搞定 erlang 之后，couchdb 可以顺利 `./configure` 之后 `make && make install` 了。

接着创建 couchdb 用户，并修改相关目录的权限：

    adduser -r --home /usr/local/var/lib/couchdb -M --shell /bin/bash --comment "CouchDB Administrator" couchdb

    chown -R couchdb:couchdb /usr/local/etc/couchdb
    chown -R couchdb:couchdb /usr/local/var/lib/couchdb
    chown -R couchdb:couchdb /usr/local/var/log/couchdb
    chown -R couchdb:couchdb /usr/local/var/run/couchdb

    chmod -R 0770 /usr/local/etc/couchdb
    chmod -R 0770 /usr/local/var/lib/couchdb
    chmod -R 0770 /usr/local/var/log/couchdb
    chmod -R 0770 /usr/local/var/run/couchdb

于是就可以 `/usr/local/etc/rc.d/couchdb start` 这么跑起来了，测试一下看看：

    curl http://127.0.0.1:5984/

```javascript
{
    "couchdb": "Welcome",
    "version": "1.2.1"
}
```

但是，不要以为已经搞定，苦难才刚刚开始。这枚 CouchDB 是私有 npm 仓库，当然不能只限本机访问，
我们需要修改一下 `bind_address`：

    vim /usr/local/etc/couchdb/local.ini

找到 `[httpd]` 章节，改成 `bind_address = 0.0.0.0`。另外，为了保证 npm 客户端正常使用，
还要在此节中加入 `secure_rewrite = false`。

如此配置之后，http://couchdb:5984/_utils 已经能够打开 Futon 了，右下角说，
现在所有人都是管理员，赶快 Fix This！ CouchDB 的逻辑就是，没有管理员的话，所有人都是管理员，
修复的办法自然就是给它设置个管理员了，有两种方式，其一，在 CouchDB 服务器上：

    curl -X PUT http://127.0.0.1:5984/_config/admins/obama -d '"combo-breaker"'

或者直接点击 Futon 里的那个 Fix This，输入用户名密码，再点 Create。

但我就没这么顺利了，创建用户 500，返回的错误信息如下（curl 方式结果相同）：

```javascript
{
    "error": "error",
    "reason": "eacces"
}
```

Google 一番，这个错误的信息意思是木有权限，不对瓦，既然所有人都是管理员，为啥会木有权限。
结果是配置文件的权限作怪，一定是前面执行相关命令的时候姿势不对，重新搞一遍：

    chown -R couchdb:couchdb /usr/local/etc/couchdb
    chmod 0700 /usr/local/etc/couchdb

终于成功创建管理员账号了。

然后去 [isaacs/npmjs.org](https://github.com/isaacs/npmjs.org) 上导入 npm 数据，
一路顺遂。这里有个注意的是如果你已经创建了管理员账号，在 replicate 数据库的时候要加上身份验证：

    curl -X POST -H "Content-Type:application/json" \
        http://obama:combo-breaker@127.0.0.1:5984/_replicate \
        -d '{"source":"http://isaacs.iriscouch.com/registry/", \
             "target":"registry", \
             "doc_ids":["_design/app","_design/scratch","_design/ui"]}'

至此搞定 npm registry。

但是我们在客户端

    npm adduser --registry http://couchdb:5984/registry/_design/app/_rewrite

时，服务器报 500 错误，查看日志，说是 OS_Process_Error，如下：

    … OS Process Error … {os_process_error,{exit_status,127}}

[Wiki 上说](http://wiki.apache.org/couchdb/Error_messages#OS_Process_Error_.7Bos_process_error.2C.7Bexit_status.2C127.7D.7D)
是因为 SpiderMonkey 没装好，于是找到这篇 CouchDB Wiki 上的
[Install SpiderMonkey](http://wiki.apache.org/couchdb/Installing_SpiderMonkey)，
试了 1.7.0 与 1.8.0-rc1，都告失败，现在回想可能我忘了装好之后重新 `./configure` CouchDB。

然后我找到了 [Install on RHEL 5](http://wiki.apache.org/couchdb/Installing_on_RHEL5)，
才发现有 [EPEL](http://fedoraproject.org/wiki/EPEL) 这种东东，可以直接从它们的源里安装预编译的 couchdb。

首先，按照 [EPEL 的安装流程](http://fedoraproject.org/wiki/EPEL#How_can_I_use_these_extra_packages.3F)，
找到相应版本的 rpm 包，下载过来之后执行：

    rpm -Uvh epel-release-*.noarch.rpm
    yum clean all

要安装预编译的，执行：

    yum install couchdb

要自行编译安装，这个源也能帮上忙，它提供了官方源里木有的 js-devel 和 erlang。

坑爹之旅到此结束，粗枝大叶如我真干不了这个。
