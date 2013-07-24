---
title: 使用 mina 与 kirua 快速部署 express 应用
layout: post
---

初涉 Node.js 与 express.js 的同学，在做完首个应用之后，都可能会问这样的问题，该怎么样正确部署
这个应用呢？

## Short Answer

简单点的回答是：

    $ NODE_ENV=production nohup node app.js &

对比开发时跑 express 的命令：

    $ node app.js

能够发现多了三个东西：

- NODE_ENV=production
- nohup
- &

### NODE_ENV

NODE_ENV 环境变量用来告诉 express，把它的 env 配置项设为 production，即加了这个前缀之后，
app.js 中的环境变量判断，会变到 production 分支：

{% highlight js %}
app.get('env') === 'production'             // ==> true

app.configure('production', function() {
    // production env configurations
})
{% endhighlight %}

### nohup 与 &

nohup 其实就是 no hangup 的意思，后来延伸为即使父进程退出，子进程也不会终止，末尾的 & ，即让此
命名在后台运行。

### 缺点

用了这条命令，线上服务就可以跑起来了。不过，有两个比较显著的缺点：

- 反复部署时很麻烦，得把旧进程 kill 掉
- 没能利用到服务器的多核

对后者，Node.js 0.10.x 版本开始，内建了 [cluster](http://nodejs.org/api/cluster.html)
模块，使我们可以快速派生出工作进程，并在主进程中管理起来。

而前者，则只能依靠诸位的 bash 脚本功底，自行记录进程 pid，下次发布前在用记好的 pid 把相关进程杀掉。

不过，也不尽然，我们可以试试 [kirua](https://github.com/dotnil/kirua)

## 使用 kirua 维护线上服务

讲 kirua 之前，得说说 forever，两者的定位是一样的其实。forever 是
[nodejitsu](http://nodejitsu.com/) 维护的线上环境管理工具，顾名思义，就是让 express 应用
永远运行着的意思。因为不管我们代码写得如何，总会出现异常导致进程挂掉，或者进程假死变成僵尸等等状况，
forever 会在出状况时，自动 fork 新的进程。

但是它也有两个不好的地方：

1. 没有内建 cluster，
2. 我在用它时发现 forever restart app.js 经常没效果

kirua 正是为了解决这两点不足而开发的。

kirua 要求 express app 的目录结构为：

    .
    ├── app.js
    ├── log
    └── tmp
        └── pids

当你执行 kirua start，它会在相应目录中放置相应文件：

    .
    ├── app.js
    ├── log
    │   └── production.log
    └── tmp
        └── pids
            ├── master.pid
            ├── worker.1.pid
            └── worker.2.pid

log/production.log 即应用在运行时记录的日志，tmp/pids 下面那些，则是主进程与工作进程的进程 id，
默认情况下，工作进程数与 CPU 数相同。

### 安装 kirua

kirua 以 NPM 包形式发布，通过 npm 命令安装即可：

    $ npm install kirua -g

装好后，有三个子命令可用：

- kirua start
- kirua stop
- kirua restart

在项目根目录执行相关命令即可。

## 使用 mina 部署代码到线上

有了 kirua，我们可以很方便地维护线上的进程了，那如何讲代码快速部署到线上服务呢？Rails 社区提供了
许多好选择，最著名的莫过于：

- capistrano
- mina

前者我用得太久，有些腻了，后者一直以小清新闻名，我们不妨一试。

### 安装 mina

首先，它是个 gem，我们执行：

    $ gem install mina

即可得到 mina 命令，在项目根目录中执行：

    $ mina init

会初始化一份文件，在 config/deploy.rb，在这个文件里配置好相关项，以我的为例：

{% highlight ruby %}
require 'mina/git'


set :domain, 'cyj.me'
set :deploy_to, '/home/johndoe/webapp/awesome-app'
set :repository, 'git@github.com:johndoe/awesome-app.git'
set :branch, 'master'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_paths, ['config/database.yml', 'log', 'tmp', 'node_modules']

# Optional settings:
set :user, 'johndoe'    # Username in the server to SSH to.

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]

  queue! %[mkdir -p "#{deploy_to}/shared/node_modules"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/node_modules"]

  queue %[touch "#{deploy_to}/shared/config/database.yml"]
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    queue! %[npm install]

    to :launch do
      queue 'NODE_ENV=production kirua restart'
    end
  end
end

desc "Start the server."
task :start do
  queue %[cd #{deploy_to}/current && NODE_ENV=production kirua start]
end

desc "Restart the server."
task :restart do
  queue %[cd #{deploy_to}/current && NODE_ENV=production kirua restart]
end

desc "Stop the server."
task :stop do
  queue %[cd #{deploy_to}/current && NODE_ENV=production kirua stop]
end

# For help in making your deploy script, see the Mina documentation:
#
#  - http://nadarei.co/mina
#  - http://nadarei.co/mina/tasks
#  - http://nadarei.co/mina/settings
#  - http://nadarei.co/mina/helpers
{% endhighlight %}

### 准备线上环境

使用过 capistrano 的同学应该比较了解一些，在我们初始部署之前，要执行 setup 命令，准备好线上的
目录结构，mina 也是如此。

执行 setup 之前，确保 deploy_to 变量设置的目录是有权限访问的，在我的配置里，这个目录是：

    /home/johndoe/webapp/awesome-app/

执行 setup 之后，这个目录中将有：

- releases
- shared
- current

current 是个软链接，指向 releases 中某个子目录。

### 部署

搞定之后，把代码推送到 git 仓库，然后在自己机器上，项目根目录下执行：

    $ mina deploy

就妥啦。


