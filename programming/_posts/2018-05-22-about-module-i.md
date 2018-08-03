---
layout: post
title: 前端模块的历史沿革
---

All About Module 是一系列文章，本系列想要讨论的：

- 前端模块的历史沿革 A Brief History of Module
- [前端模块的现状 The Status Quo of Module]({{ site.baseurl }}{% link programming/_posts/2018-05-23-about-module-ii.md %})
- [前端模块在广告业务的实践 The Module Practiced in Cara]({{ site.baseurl }}{% link programming/_posts/2018-05-24-about-module-iii.md %})

本文讨论的**前端模块的历史沿革**可以用一张图概括：

![](https://img.alicdn.com/tfscom/TB1wIZoby6guuRjy1XdXXaAwpXa.png_1200x1200.jpg)

## ServerJS

不过作为一篇掉书袋的文章，我得从老老年间开始说起。和许多前端技术点类似，前端模块的概念离不开后端贡献。早在 1997 年，Netscape 想要 JavaScript 能在 Java 平台上运行，以配合当时的 JavaScript/Java 联姻，因此开发了 [Rhino](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino)。Rhino 意为犀牛，得名的原因正是那本著名的《JavaScript 权威指南》（[1996 年首次出版](https://www.google.com/search?ei=a57-Ws3iFI2UsgXTm4zQAg&q=when+is+javascript+the+definitive+guide+first+published&oq=when+is+javascript+the+definitive+guide+first+published&gs_l=psy-ab.3..33i21k1.15666.20254.0.20317.24.16.0.0.0.0.509.1795.2-2j2j0j1.5.0....0...1c.1.64.psy-ab..20.3.990...33i22i29i30k1j33i160k1.0.qTjUY6_Oipc)）：

![](https://img.alicdn.com/tfscom/TB1XYfImrsrBKNjSZFpXXcXhFXa.png_1200x1200.jpg)

Rhino 进入到 21 世纪后，随着 JavaScript 语言渐趋成熟（应该归功于 ECMAScript 5），所谓「同构」（使用 JavaScript 搞定前后端）项目的呼声渐起。一个名为 [ServerJS](https://wiki.mozilla.org/ServerJS) 的标准化项目逐渐展开，旨在规范化 JavaScript 在服务端使用时的模块化，以及 Filesystem API、I/O Streams、Socket IO 等等服务端开发领域所涉及内容的标准化。

## CommonJS

JavaScript 社区在 2009 年有两件比较大的事情：

- ServerJS 发展成大家耳熟能详的 [CommonJS](http://wiki.commonjs.org/wiki/CommonJS)，最终发展出 [Modules/1.1.1](http://wiki.commonjs.org/wiki/Modules/1.1.1) 和 [Modules/Async/A](http://wiki.commonjs.org/wiki/Modules/Async/A)
- Ryan Dahl 发布动如脱兔的 Node.js

直接使用 CommonJS 规范实现模块体系的 Node.js 广受欢迎，相信绝大部分 Web 开发者至今都管 Node.js 的模块体系叫 CommonJS 规范：

```js
'use strict'
const math = require('./math')
exports.sum = function(...nums) {
  return nums.reduce((result, num) => result + num, 0)
}
```

事实上，两者的关系并非我们认为的标准制定者和标准执行者的角色。作为当时的 Node.js 领头人，Isaacs Schlueter 曾在 2013 年对 CommonJS 的人提出的「为何不遵从标准」的疑问发表过[一则比较激烈的评论](https://github.com/nodejs/node-v0.x-archive/issues/5132#issuecomment-15432598)：

> A few good things came out of CommonJS. The module system we have now is basically indistinguishable from the original "securable modules" proposal that Kris Kowal originally came up with. (Of course, we went pretty far off the reservation in v0.4, with the whole node_modules folder thing, and loading packages via their "main" field. Maybe we should remove those features, I'm sure that Node users would appreciate us being more spec-compliant!)

评论中认为，CommonJS 标准已经成为小众服务端 JS（Server Side JS）方案的文档集中地，而 Node.js 已经赢得服务端 JS 的竞争，如同 Node.js 创始人 Ryan Dahl 所说：

> "Forget CommonJS. It's dead. We are server side JavaScript."

Node.js 就是服务端 JavaScript。更为重要的是，Isaac 更看重真实用户的声音而不是所谓标准制定者的意见，而当时 CommonJS 工作组所提出的新标准更多的是添乱（比如所谓的 Package 标准）。简而言之，到 2013 年的时候，其实 [Node.js Modules](https://nodejs.org/docs/latest/api/modules.html) 就已经自成一家了。

> 上上段引用中，有个大家可能熟悉的名字，Kris Kowal。这个人不仅起草了 CommonJS 模块规范，还提出 Promise 规范，并开发最初的 Promise 实现 [Q.js](https://github.com/kriskowal/q)。只是他这两项开创性的工作在后来都被更好或者更标准化的方案取代了，前者是 ES Module，后者则先是有青出于蓝的 bluebird，继而也被标准化的 Promise 内建实现取代。
>
> 哦对，他还写过一个 [UncommonJS 规范](https://github.com/kriskowal/uncommonjs/blob/master/modules/specification.md)。

## The Clash of Loaders

回到风起云涌的 2009 年，真正在前端领域摸爬滚打的开发者们正对着一堆 `<script>` 标签发愁。在浏览器中如何管理依赖，在当时是一个很时髦的话题。YUI 2 和 Google Closure Library 都提出过基于 namespace 的方案，但治标不治本，仍然需要人肉确保脚本的加载、打包顺序。

CommonJS 提出后，前端同学广受启发，加上浏览器加载的异步特性，想出许多 API，最终被标准化为 Modules/Async/A 的是 `require.ensure` ：

```js
require.ensure(['increment'], function(require) {
    var inc = require('increment').inc;
    var a = 1;
    inc(a); // 2
});
```

[Webpack code splitting](https://webpack.js.org/guides/code-splitting/) 后，传统方式即使用 `require.ensure` 方法加载相关的分片脚本（新方式则是直接使用 `import` ）。但如何请求脚本只是一方面，更为棘手的问题是如何处理 CommonJS 模块让它可以在浏览器中自如加载：

- 有提出 transport（代码转换）方案的，将代码放在一个匿名函数中，异步加载，顺序执行；
- 有提出 XHR 请求模块代码，再 eval 或者 new Function 执行的；
- 有提出应当直接改良 CommonJS，推出纯异步的模块加载方案的；

方案一很快被大家所接受，但在 transport （前身叫 [Wrapping](http://wiki.commonjs.org/wiki/Modules/Wrappings)）上仍然有显著分歧：

- 有认为这层 transport 应当强制，要求开发者写明模块 id、依赖
- 有认为这层 transport 应当强制，但 id、依赖可以自动解析
- 有认为这层 transport 没必要要求开发者来写，可以通过工具自动转换，id、依赖可以在转换时解析

前两者，代表了 2009-2010 年间绝大部分模块加载器的实现方案，比如要求写明依赖的 kslite：

```js
KSLITE.declare('app', ['math'], function(require, exports, module) {
  const math = require('math')
})
```

比如由加载器自动解析 id 和依赖的 SeaJS：

```js
define(function(require, exports, modules) {
  require('math')
})
// SeaJS 会从当前 JavaScript 解析 id 和依赖
```

解析 id 的方式是获取当前脚本的 `src` 再去匹配 SeaJS 配置或者解析好的 `base` ，解析依赖的方式在当时则有较多的讨论。简单来说，都离不开 `Function.prototype.toString()` 以及正则表达式。

在当时，支持方案一且采用第三种观点的人并不多。SeaJS 开发者玉伯[对构建工具的态度](https://github.com/dexteryy/OzJS/issues/10#issuecomment-14034196)是有所保留的，认为能解决一定问题但增加开发人员的使用成本。

而方案三，直接改良 CommonJS 让它更适合浏览器环境，则催生了最广为人知的模块加载器 [RequireJS](http://requirejs.org/)。它认为与其兼容麻烦的同步 `require` 调用，不如采用纯异步 API：

```js
requirejs(['foo', 'bar'], function(foo, bar) {
  // use foo, bar
})
```

这套 API 也有其规范，叫做 [AMD（Asynchronouse Module Definition）](https://github.com/amdjs/amdjs-api/wiki/AMD)。但相比 CommonJS，AMD 有两个问题。比较小的问题是依赖的声明与使用不在一个地方，依赖数组 `['foo', 'bar']` 可能很长，和匿名函数的参数对应时会有麻烦。比较严重的问题，是 foo、bar 这两个 js 的执行顺序不确定。在 CommonJS 里，先 require 的先执行。但在 AMD 里，foo、bar 谁先执行是个黑箱。

> 其实 RequireJS 也[支持 CommonJS 风格的模块定义](http://requirejs.org/docs/commonjs.html)，即上面举例的 kslite、SeaJS 中所采用的风格。

到这一部分，在 SeaJS 的[一则 issue](https://github.com/seajs/seajs/issues/588) 中也有详细讲述。比较有趣的是，因为 2013 年发生了 Node.js 小组与 CommonJS 规范小组分道扬镳的事情，有 StackOverflow 答主认为 RequireJS 才是新时尚，但其实他们只是一棵树上开的两朵花。

到 Node.js 成为事实 Server Side JS 标准的 2013 年，CommonJS 在前后端领域的实践也日趋成熟，连原本追随 YUI 3 的 KISSY 都演化出一个名为 [modulex](https://github.com/kissyteam/modulex) 的模块加载方案，兼容 CommonJS 与 AMD。开始用 JavaScript 跨后后端的前端同学提出一个著名的疑问：

> 如何真正做到前后端共享代码？

代码复用简直是软件开发领域的圣杯，虽然有时会被务实主义者弃如敝履，但仍然不妨碍它成为程序员的野望之一。等于对当时计划使用 Node.js 开启新项目、并且项目中真的就需要前后端共享代码的我来说，遵从 CommonJS 并采用构建工具 transport 模块成 Loader 能够加载的版本，是最自然不过的选择。

我的方案是编写一个 Express 中间件，动态处理前端代码，解析 id 和依赖，剩下的交给 SeaJS 处理。SeaJS 彼时在做的 spm（当时做 *pm 也是一种流行）也开始支持模块转换，只是方式略有差别。然而这种在已有 Loader 基础上二次加工所产出的方案，都敌不过一个 2012 年开始的项目的降维打击。

## Browserify & Webpack

[Webpack](https://webpack.js.org/) 选择了一个很好的切入点，立足于前端领域当时的几大痛点：

- 由于浏览器对 HTTP 请求数的限制，以及多请求时的额外耗时，前端资源需要尽可能合并，尤其在初兴的无线领域，网络情况更为复杂；
- 模块很重要但是模块化标准太多，有用 CommonJS 写然后用 npm 管理的，也有用 RequireJS 写然后直接放 Github 的，社区代码使用成本较高；
- 没人真的想要 *pm，只用 npm 就够了。

Webpack 最出色的特性一是它的模块解析粒度以及因此带来的强大打包能力（图片、SVG 都给你转 data uri 打包进去），二是它的可扩展性。虽然中间经历起伏，但它的社区一直活跃，相关转换工具（Babel、PostCSS、CSS Modules）可以变成插件快速接入，还能自定义 Loader（比如在我看来神烦的 worker-loader）。这些特性加在一起，无往而不利。

而且它还支持那波 Loader 所无从想象的，2015 年发布的 ES6 标准（后来索性叫 ES2015）带来的 [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)：

```js
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
```

这便是构建工具带来的好处了，发挥空间远比传统浏览器 Loader 来得大，可以轻松加入像 Babel、Traceur 等 transpiler 支持。
夸完 Webpack，也得说说 Node.js 社区开出的另一朵花，比 Webpack 还要早一年发布的 [Browserify](http://browserify.org/)。

![](http://browserify.org/images/browserify.png)

Node.js 社区早期活跃成员 substack 开发 Browserify 的初衷非常简单：

> Browsers don't have the require method defined, but Node.js does. With Browserify you can write code that uses require in the same way that you would use it in Node.

相比 Webpack，Browserify 的方案要更朴实一些，就是允许浏览器代码使用 require ，并且是 require 自有模块、Node.js 自带模块、npm 社区模块全都支持。另一个和务实主义的 Webpack 比较不一样的地方，是 Browserify 对异步 require 的态度。[尽管社区呼声一直很高](https://github.com/browserify/browserify/issues/58)，作者坚持认为 Browserify 的 require 应当和 Node.js 保持一致。

Browserify 支持非 CommonJS 模块的方式是 transform，通过在 package.json 的 browserify.transform  数组配置转换插件，Browserify 可以吧非 CommonJS 输入转变为 CommonJS，继而进入后续流程。

## WHATWG Loader

在 ECMAScript 2015 发布的同年，独辟蹊径的 [SystemJS](https://github.com/systemjs/systemjs) 也开始开发。因为 Web 平台技术日新月异，浏览器所提供的 API 与性能表现和 2009 年早已今非昔比，SystemJS 选择在浏览器中直接加入 transpiler 支持。SystemJS 中可供选择的 transpiler 有著名的 Babel 和 TypeScript，也有如今似乎有些销声匿迹的 Traceur。

SystemJS 的背后其实也是一套标准，[WHATWG 的 Loader](https://whatwg.github.io/loader/)。这套标准想要规范的基本上就是 SystemJS 所表现的，一个功能强大的、在浏览器和 Node.js 中都能运行的、自成一体、支持 Transpiler 配置的模块加载器。在当时的讨论中，这一标准的最终目的是期望进入 ECMAScript 规范。我们可以从它规范中对当时 tc39 新提出的 Reflect 全局变量、Symbol 的使用看出端倪。

然而比较尴尬的是，无论是 tc39 还是 Node.js CTC，都没有接纳这一标准。tc39 的成员 Domenic Denicola 认为 Loader 标准是和 ES Module 的兼容度并不好，且有过度设计之嫌。而 Node.js 中则是务实主义再度占据上风，认为 Loader 标准对 Node.js 已经完备的模块体系[弊大于利](https://github.com/WebAssembly/design/issues/256)，[很不实际](https://github.com/whatwg/loader/issues/54)。最为直接的争论点，就是 `Loader.import` 应当同步还是异步：

```js
// WHATWG Loader
Loader.import('./foo.js').then(foo => {
  // use foo
})

// or with async/await
const foo = await Loader.import('./foo.js')
```

前者大家很熟悉，和 `require.async` 没啥差别，只是 callback 变成了 Promise。后者就有些异想天开，直接把模块的执行上下文换成一个 `async function` ，这显然是不切实际的。当时的 Node.js 负责人 Trevor Norris 说，在服务端同步加载一个模块的耗时只有几毫秒，异步毫无必要。更不可接受的是，如果引入 Promise 变成异步，引起 Promise 雪球效应（Promise Snowball Effect），整个运行体系都会受影响。

WHATWG Loader 标准和 CommonJS 标准一样，最终变成一个历史的见证，a collection of interesting ideas。但正如我们总结内部失败项目常用的思辨技巧，极为 Loader 标准的参与者，例如 SystemJS 作者 [Guy Bedford](https://github.com/guybedford)、热心网友 [Bradley Meck](https://github.com/bmeck)，都从这个项目中积累了丰富经验，在此过程中的思辨，最终又影响了 ES Module 和 Node.js Module（前身即 CommonJS）的融合。

这波融合从 ECMAScript 2015 标准发布开始，到 `<script type="module">` 进入主流浏览器，以及 Node.js 通过 `.mjs` 支持 ES Module 结束。也将是下一篇文章《The Status Quo of Module》将要讨论的。

## import()

ES Module 和已经成型的 CommonJS、RequireJS 有着明显的区别：

- `import` 是声明 Declaration，不像 CommonJS 的 require() 是表达式 Statement
- `import` 是预先解析、预先加载的，不像 RequireJS（或者 SystemJS）是执行到点了再发一个请求

但对实际业务来说，后两者特性其实是有必要的。比如可能要用到类似反射（Reflection）特性：

```js
if (type == 'foo') {
  require('./foo')
} else {
  require('./bar')
}

// 或者夸张一点
const { env } = require('querystring').parse(location.search.slice(1)
require(`./env/${env}`)
```

比如单页应用可能要用到异步模块请求：

```js
async function loadPage(name) {
  const page = await SystemJS.import(`./pages/${name}`)
  page.load()
}
```

为了解决这两个问题，Domenic Denicola 提出 `import()` API。`import()` 是在现有条件下的 hack，启发自 WHATWG Loader 标准讨论，当时对一个嵌套 `import` 的支持方式有争议，即上文提及的 `await import` 。

在 JavaScript 运行环境中，`import` 是个关键词，我们不能拿它来命名函数或者变量，所以反过来说，用它来做异步模块加载 API 的函数名，其实很合适。确切地说，它是一个特殊的函数，`typeof import` 是拿不到信息的。

这个 WHATWG Loader 生出的又一个 interesting idea，如今已进入 [HTML 标准](https://html.spec.whatwg.org/multipage/webappapis.html#hostimportmoduledynamically(referencingscriptormodule,-specifier,-promisecapability))，在 Chrome 中已经支持。更令人鼓舞的是，这也将作为 Node.js 支持 ES Module 的武器之一，是的最终 Node.js 中不仅可以自如使用 ES Module，还可以[在一定程度上与现有的 CommonJS 模块互通](https://medium.com/@giltayar/native-es-modules-in-nodejs-status-and-future-directions-part-i-ee5ea3001f71)。

> This leads us to two additional rules, which I call The Rules of Interoperability:
> - CJS can import ESM, but only using await import()
> - ESM can import CJS using the import statement, but only a default import

## Afterword

以上帝视角来审视浏览器模块在这些年所经历的沿革，给人一种指点江山挥斥方遒的事后诸葛亮之感。到 2018 年，常青浏览器均已支持 `<script type="module">` ，Node.js 的下一个 LTS 版本预计也会正式支持 `.mjs` ，希望 ES Module 和 `import()` 一起，给这场纷争画上一个句号。

本文刻意漏掉了 ES Module 的介绍与讨论，反倒是额外介绍了 `import()` ，目的是给系列文章的下一篇《[前端模块的现状 The Status Quo of Module]({{ site.baseurl }}{% link programming/_posts/2018-05-23-about-module-ii.md %})》做铺垫，一定要看哦。
