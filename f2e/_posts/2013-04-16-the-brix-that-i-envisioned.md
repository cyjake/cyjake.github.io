---
title: 我所设想的 Brix
layout: post
---

![](/assets/img/2013-ruian/10.jpg)

代码 + README，似乎不能很好地表达自己，之前弄了
[Brix Core](https://github.com/dotnil/brix-core) 与
[其演示项目](https://github.com/dotnil/brix-test)，
并在两个项目的说明档里表达了自己做这两件事情的想法，但是从反馈上来看，没能顺利达到目标。

所以写了这篇博文，说明一下为什么我要简化 Brix 即我所设想的 Brix 又该是如何。


### 当我们讨论 Brix 时，我们在讨论什么

李牧老师为 Brix 组件框架画了个
[蓝图](http://img01.taobaocdn.com/tps/i1/T1DWzOXmxdXXXUBqn8-3663-1304.png)，
同时要求组件可以拥有一些高级特性，例如局部刷新、嵌套组件等。

要完成以上这些目标，Brix 必须有如下身份：

- Style： 基础样式
- Loader： 组件加载器
- Manager： 组件管理工具
- Base： 组件基类
- Gallery：基础组件

Loader 与 Base 都应该能够加载其当前持有节点下的所有组件，即所有拥有 @bx-name 属性的子节点。
Loader 自身需要提供组件的版本、时间戳配置，提供指定区块加载。Base 则需要提供某种方式以获取子模板，
并可以在其关联数据发生变更时，重新渲染这部分子模板，并加载渲染结果中可能有的子组件。

Manager ，依赖于 Loader 形成的配置规范。Style 则提供组件的基础样式。Gallery 则提供基本的组件，
例如面包屑导航、下拉选择等。

而目前我们是将这五者放在一块谈，Style 里有部分是以 Gallery 形式出现的，Loader
需要确立的东西显得混乱，让 Manager 有点无所适从，Base 提供的功能，缺乏明确的文档、用例来说明。

当我们谈论 Brix 时，它可能是其中任何一个角色，太容易因为蓝图太过宏伟而吓跑用户了。
我所设想的 Brix 是，包含以上所有功能，但各个模块各司其职，明确其接口，简化各自的使用方式：

想要像 Bootstrap 那样使用 Brix？你只要引入 brix.css；

那 Bootstrap 里的弹窗、提示浮层又在哪里？你只要加上 `KISSY.use('brix/app')`，并在你的 HTML
里像 Bootstrap 要求的那样标记出你的组件；

{% highlight html %}
<div bx-app>
  <div bx-name="brix/dialog">
    <h2>Congrats!</h2>
    <p>There's a Nigeria pricess wants to marry you!</p>
    <span class="btn btn-blue">Yay!</span>
  </div>
</div>
{% endhighlight %}

想要利用 Brix 提供的组件封装自己的？你只需要：

{% highlight js %}
KISSY.add('myapp/dropdown/index', function(S, Dropdown) {

    function MyDropdown(opts) {
        MyDropdown.superclass.constructor.call(this, opts)
    }

    S.extend(MyDropdown, Dropdown)

    return MyDropdown
}, {
    requires: ['brix/dropdown']
})
{% endhighlight %}

然后在你的页面中与默认组件一样使用自己的组件：

{% highlight html %}
<div bx-name="myapp/dropdown">
  <ul>
    <li>Please select...</li>
    <li>One</li>
    <li>Two</li>
    <li>睡！</li>
  </ul>
</div>
{% endhighlight %}

想要分享自己的组件，或者安装别人的组件？ `npm install bpm -g`，让 BPM 来帮你做剩下的事情吧亲。

所以，我想做的事情是：

### 拆掉 Brix

拆成四个项目：

- Brix Core：提供加载器与 Base
- Brix Style：提供基础样式
- Brix Gallery 提供基本组件
- Brix Manager 组件依赖管理工具

Brix Style 相对独立，我已经提出来，放到了
[brixjs/brix-style](https://github.com/brixjs/brix-style)。

Brix Core 是后两者（Gallery 与 Manager）的依赖，需要明确组件目录结构，开发、线上组件加载方式等，
是重中之重，根据之前的一些想法，我写了个演示项目，放在
[dotnil/brix-core](http://github.com/dotnil/brix-core)，并在其说明档中解释了一些。
但是如篇首所说，效果不彰，因此有了本文。

Brix Gallery 与 Brix Manager 容后再谈。

## 设想的使用方式

### 组件的文件组织

目录下会有一到五个文件：

- index.{less,css}
- index.js
- template.html
- template.js
- data.json

除了 template.js，组件开发者需要提供剩余四个文件，index.less 或者 index.css 均可，
推荐使用前者。

data.json 与 template.html 结合，可以渲染出一份示例 HTML 片段，用于演示此组件需要的数据输入，
和 index.js 所需要的 DOM 结构。

template.js 是 template.html 的编译结果，在线上使用时，会采用编译后的内容，即前者。

### 项目的文件组织

项目的初始目录中，需要含有两个目录，用来放置相关组件：

- imports
- components

imports 即此项目引入的组件，结构如下：

    imports
    ├── ux.shopping-ads
    │   └── ceiling
    │       ├── 0.1.0
    │       │   └── index.js
    │       └── 0.1.1
    │           └── index.js
    └── ux.tanx
        ├── dropdown
        │   └── 0.1.5
        │       ├── index.js
        │       ├── template.html
        │       └── template.js
        ├── grid
        │   └── 0.2.1
        │       └── index.js
        └── message
            └── 0.1.2
                └── index.js

引入的组件基本路径为 `imports/ux.shopping-ads/ceiling/0.1.0/`：

    +--------------------+-------------------+
    | imports            |                   |
    | └──ux.shopping-ads | namespace         |
    |    └──ceiling      | component name    |
    |       └──0.1.0     | component version |
    +--------------------+-------------------+

components 即此项目自身的组件，结构如下：

    components
    └── ux.brix-test
        ├── ceiling
        │   └── index.js
        └── footer
            ├── index.js
            └── template.html

项目自身的组件基本路径为 `components/ux.brix-test/ceiling/`。与 imports 目录的区别是，
components 目录中，不需要在组件名目录下创建组件的相关版本目录，直接写组件的相关文件就可以了。

以上内容，与当前版本的 Brix 出入不大，只是在 components 目录设计中，加入了一层当前项目的命名空间，
即示例中的 ux.brix-test。

### 组件的使用方式

在现有的 Brix 组件名划分中，有三种组件名：

- 业务组件：components/ceiling
- 外部组件：imports/ux.tanx/ceiling/0.1.0
- 核心组件：brix/gallery/ceiling/0.1.2

我建议将这三种组件名统一掉，一律为 <namespace>/<component> 这种形式，假设当前项目的命名空间为
ux.brix-test：

- 业务组件：ux.brix-test/ceiling
- 外部组件：ux.tanx/ceiling
- 核心组件：brix/ceiling

外部组件，本来就是从各个业务组件中提炼出来的，而核心组件，除了命名空间为 brix 之外，也不应有何不同。
并且，这里我去掉了版本，将其提取出来，放到统一的地方配置。

名字统一掉之后，在页面中，我们只需要统一用 @bx-name 来引用：

{% highlight html %}
<div bx-name="ux.tanx/ceiling">
  <p>你好，逸才</p>
  <span>已买到的宝贝</span>
</div>
{% endhighlight %}

不再像现有 Brix 实现那样，还需要额外指定一下 @bx-path，说明一下这个组件是从哪儿来的。

那我该怎么锁定组件的版本呢？得先从 Brix Core 的入口模块说起：

## Brix Core

### brix/app

Brix 将暴露出一个叫做 brix/app 的入口模块，项目开发者只需要像平常 KISSY 模块一般使用它：

{% highlight js %}
KISSY.use('brix/app', function(S, app) {
    // config and boot your app
})
{% endhighlight %}

以下代码示例，为求简单，只讲包装其中的部分，省略外层的

{% highlight js %}
KISSY.use('brix/app', function(S, app) { ... })
{% endhighlight %}

app 提供暴露出一些常用方法，例如：

- config
- set
- boot
- on
- bootStyle

config 用来配置你的 app，不管是单页应用还是传统页面，我们更能接受的都是一个页面一次配置，
即页面初始化，加载 brix/app，配置 app，这些事情，只需要做一次。通常项目需要配置的内容如下：

{% highlight js %}
app.config({
    namespace: 'ux.brix-test',      // 项目自己的 namespace
    imports: {                      // 引入的组件
        'ux.tanx': {
            ceiling: '0.1.2'
        }
    },
    components: ['footer'],         // 项目自身组件，app.bootStyle 需要用到
    timestamp: 130416               // 时间戳，项目发布时写入
})
{% endhighlight %}

在这其中，必配项为：

- namespace
- imports
- components （如果你需要 brix/app 帮你加载样式，不推荐这样做，后面会介绍更好的办法）

timestamp 在开发时不需配置，在项目资源文件发布之后，再另行配置即可。实际页面里的初始化，
可能类似这样：

{% highlight html %}
<script src="http://a.tbcdn.cn/s/kissy/1.3.0/seed.js"></script>
<script>
KISSY.config('packages', {
    brix: {
        base: 'http://a.tbcdn.cn/s/brix/'
    }
})
KISSY.use('brix/app', function(S, app) {
    app.config({
        namespace: 'ux.brix-test',
        imports: {
            // import 进来的组件
        },
        components: [
            // ux.brix-test 项目自身的组件
        ],
        timestamp: 130416
    })
})
</script>
{% endhighlight %}

这样，即可在开发时忘掉时间戳这茬，上线时又可以先发布资源文件，再更新 vm 或者 TMS 中的 timestamp
来完成发布流程。

配置的部分讲完了，接下来就是启动页面，方式如下：

{% highlight js %}
// 如果只需要初始化页面中所有组件，其他啥也不用做：
app.boot()              // 等同于 app.boot('[bx-app]')
                        // 即如果选择器参数忽略，会自动找有自定义属性 bx-app 标记的节点
                        // 返回 brix/page 模块的实例

// 如果需要传递数据，以便使用模板的组件正确渲染：
app.boot({
    // 数据
    // ...
})                      // 等同于 app.boot('[bx-app]', { ... })

// 如果只需要初始化某个节点（单页应用中的某个 View）
app.boot('#J_someView', { ... })

// 如果需要初始化完毕之后进行额外的操作：
app.boot('#J_myView', { ... }).on('bx:ready', function() {
    // app.boot() 返回的是 brix/page 实例，可以通过监听该实例的 bx:ready 事件，
    // 以进一步操作被初始化页面中组件。

    // 按照组件名查找组件，可能返回多个
    this.bxFind('ux.brix-test/ceiling')

    // 按照组件所在节点 ID 查找组件，返回结果唯一
    this.bxFind('#J_ceiling')
})
{% endhighlight %}

那个 page 参数是神马？ page 即 Brix Core 暴露出来的另一个模块，brix/page，它只在 app.boot
触发的 bx:ready 事件回调中返回，用处是持有当前被初始化的节点，以及该节点下直属的组件。

通过 page.find，用户即可查找该 HTML 区域中的组件，对其进行进一步操作。

至此，brix/app 模块就基本讲完了，它做的事情非常简单，提供用户配置组件版本、自定义组件的时间戳，
让用户通过 app.boot 方法初始化整个页面、或者某个局部节点。

### 为什么不推荐使用 app.bootStyle

app.bootStyle 做的事情是，获取 app.config 中配置掉的所有 imports 与 components，
将它们的 index.css 一并 KISSY.use 一下，类似：

{% highlight js %}
KISSY.use('ux.brix-test/ceiling/index.css, ux.tanx/table/index.css')
{% endhighlight %}

这里的问题在于，CSS 文件的优化空间很小，优化不到两个不同组件引入了相同 CSS 模块的情况，
例如可能有类似以下情况：

{% highlight scss %}
// ux.brix-test/ceiling/index.scss
@import "brix/mixins.scss";

.yangqi {
    @include border-radius(2px);
}
{% endhighlight %}

{% highlight scss %}
// ux.tanx/table/index.scss
@import "brix/mixins.scss";

.shangdangci {
    @include border-radius(5px);
}
{% endhighlight %}

在这俩组件生成的 index.css 里，可能都会有份 brix/mixins 的编译结果，但在项目级别上看，
很容易就发现这 mixins.scss ，不应该存在多份。

如果能够做到在项目开发时，样式与脚本分开处理，使用 less 或者 scss 来自动打包项目的样式文件，
效果应该会好很多。

### imports 对象该如何生成

`app.config('imports', { ... })` 参数里，所需要传入的对象是这种结构：

{% highlight js %}
{
    'ux.tanx': {
        breadcrumb: '0.1.0',
        dropdown: '0.1.2'
    },
    'ux.diamond': {
        table: '0.1.4',
        list: '0.2.0'
    },
    brix: {
        kwicks: '0.3.1'
    }
}
{% endhighlight %}

假如项目使用到的外部与标准组件十分多，这个对象会变得非常大，难以维护。所以在设计上，这个文件理应提出来，
作为一个单独的 JS 或者 JSON 文件，放在项目根部，在实际页面中只需要引用这份 JS 即可。我想，应该有个
Brixlock.js 文件，它的内容类似：

{% highlight js %}
var Brixlock = { ... }          // imports 对象的实际内容
{% endhighlight %}

注意，imports 对象需要描述当前项目 **所有** 引入的组件的版本，这样才能保证 brix/app 在根据
bx-name 初始化页面时可以顺利进行。但在实际应用中这么做肯定是不现实的，所以完整的解决方案，
应该有两个文件。

项目根目录下，会有个 brix.json 文件，这个文件描述了这个项目中直接使用到的组件版本，描述格式类似
Rails 项目的 Gemfile，或者 NPM 的 package.json ：

{% highlight js %}
{
    "imports": {
        "ux.tanx": {
            "ceiling": "~ 0.1.0"
        }
    },
    "components": [             // 如果不写，则解析 components 下所有组件
        "nav",
        "sidenav"
    ]
}
{% endhighlight %}

然后，在 components/ux.brix-test/nav 和 components/ux.brix-test/sidenav 目录中，
则有 brick.json 文件，结构同样类似 package.json ，用于描述当前组件所依赖的父组件，
以 components/ux.brix-test/nav 为例：

{% highlight js %}
{
    "name": "ux.brix-test/nav",
    "version": "0.1.0",          // 因为是项目组件，此处版本写不写无所谓，只在发布时需要
    "dependencies": {
        "brix/dropdown": "~ 0.1.0",
        "brix/checkbox": "~ 0.1.0"
    }
}
{% endhighlight %}

imports/ux.tanx/ceiling/0.1.0 目录下，自然也会有这么一份 brick.json ，内容类似：

{% highlight js %}
{
    "name": "ux.tanx/ceiling",
    "version": "0.1.0",
    "dependencies": {
        "brix/dropdown": "~ 0.1.0"
    }
}
{% endhighlight %}

但这份文件不需要使用者关心，我们可以拜托 Brix Manager 来帮忙做这件事情。

所以，理想的情况，应当是用户在开发一个页面时，通过 brix.json 文件来描述当前页面会直接使用到的组件，
并且以比较宽松的方式指定外部组件的版本，如果需要限定自定义组件的依赖查找，则在额外写个 components
数组，最终形成类似前文所述那种描述。

剩下的事情，就拜托 Brix Manager 来做，让它去下载外部组件的 brick.json ，去找自定义组件的
brick.json ，解析它们，如果它们所依赖的组件还有依赖，则继续往上找，直到所有依赖都获取完毕，
形成了多颗倒着长的树。这个时候，再去把这棵树铺平，找到满足依赖关系的所有组件，把它们都下载下来，
放到 imports 目录，与最终所下载的确切版本一起，把这个铺平的映射，反映到 Brixlock.js 文件中去。

这里有两件比较有难度的事情：

- 需要写明组件的依赖，同时在 brick.json 中，又不能写得太死；
- 组件的版本需要满足一定规则，例如 <http://semver.org>，使得这一切依赖关系是可以推断的。

说到底，这对 Brix Manager 是个大挑战。

### Brix Manager 该当如何

简单说，Brix Manager 需要做两件事情：

- publish 组件到仓库，并将相应版本发布到 CDN
- install 组件到本地

但同时，Brix Manager 需要支持一些高级特性，包括：

- 从一段 HTML 片段中解析需要引入的组件，生成或者更新 brix.json，并形成 Brixlock.js
- 从 brix.json 与 brick.json 解析出整个项目的依赖组件图，最终形成 Brixlock.js

### 组件依赖如何处理

我设想的 Brix 组件，是应该有其依赖的。具体做法，思考 ing，容后谈。

![](/assets/img/2013-ruian/12.jpg)