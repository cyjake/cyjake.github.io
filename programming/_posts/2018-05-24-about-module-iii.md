---
layout: post
title: 前端模块在广告业务的实践
---

About Module 是一系列文章，本系列想要讨论的：

- [前端模块的历史沿革 A Brief History of Module]({{ site.baseurl }}{% link programming/_posts/2018-05-22-about-module-i.md %})
- [前端模块的现状 The Status Quo of Module]({{ site.baseurl }}{% link programming/_posts/2018-05-23-about-module-ii.md %})
- 前端模块在广告业务的实践 The Module Practiced in Cara

本文为系列文章中的最后一篇，讲述前端模块在广告业务的实践。

## Use Cases

在广告业务中，一方面是快速严谨的平台技术，一方面是稳定压倒一切的广告代码。在笔者维护的一个项目中，就存在这两种情况：

- 既使用 Webpack + React + Redux 等流行技术方案开发相关功能；
- 也使用 jQuery（甚至自研的类 jQuery 库 yen）开发广告代码。

对后者，我们有一个给予 Node.js 中间件和自主开发的前端模块加载器的方案。但这个方案并不支持以下使用场景：

- 基于 loose-envify 和 dead code elimination 的条件依赖（前文有提及）
- Webpack 自定义 loader（比如 worker-loader）
- 放飞自我的模块查找逻辑（比如 main 只写 dist ，实际文件在 dist/index.js ，诸如此类）

这套方案能够让前端代码和寻常 CommonJS 模块基本一致：

```js
// relative specifier
var foo = require('./foo')

// non-relative specifier
var bar = require('lib/bar')

// non-relative specifier that resolves to npm package
var jQuery = require('jquery')
```

到 2017 年末，为了整合上述两种使用场景，我们再度重构了这套方案，现在可以：

```js
// relative specifier
var foo = require('./foo')

// non-relative specifier
var bar = require('lib/bar')
var jQuery = require('jquery')

// directory as specifier
var dist = require('./dist')

// conditional require
if (process.env.NODE_ENV == 'production') {
  require('./logger/prod')
} else {
  require('./logger/dev')
}

// worker-loader
var Worker = require('worker-loader!./worker')
```

这套方案叫做 [Porter](https://github.com/erzu/porter)。

## Entrypoint

由于依赖自定义的模块加载器，在运行页面入口代码之前，我们得先预备好模块加载器。Porter 支持两种使用方式：

```html
<!-- 1. 自动合并 -->
<script src="./app.js?main"></script>
<!-- 2. 显式声明 -->
<script src="/loader.js" data-main="./app.js"></script>
```

两者都会先执行模块加载器的代码，并在转换 `app.js` 代码时，尝试去解决 app.js 所声明的依赖。从浏览器和 Porter 两端看上述代码的加载流程，大致如下：

![](http://ossgw.alicdn.com/creatives-assets/oss/uploads/2018/08/03/ac381710-9713-11e8-b170-a914946a31c4.svg)

可以看到，Porter 在处理 `app.js?main` 请求时，会在返回实际代码之前解析 app.js 实际依赖，从而返回正确的 app.js transport：

```js
define('app.js', ['jquery'], function(require, exports, module) {
  // actual code of app.js
})
```

`<script src="/loader.js" data-main="./app.js"></script>` 的情况与此类似，区别只是 `loader.js` 单独加载，不再赘述。

## Webpack Diff

前文可能给人一种感觉，Porter 是在 Webpack 的阴影中亦步亦趋。我觉得，是也不是。

无论是广受欢迎的 Webpack，还是野蛮生长的 Porter，都是为了解决同样的问题，使前端代码能够模块化开发、自如消费社区模块、并且遵循标准。从这方面讲，Porter 是 Webpack 的学生。

从功能实现角度来讲，（至少对 Node.js 应用来说）Porter 的使用体验要比 Webpack 好很多。Porter 基本无需配置，指定前端代码所在目录，指定缓存目录并在服务中可见，就可以自如使用了。相比 Webpack，Porter 在如下角度比较轻量：

- Entry（或者叫 Entrypoint）是在页面中直接写的，无需单独配置
- 不需要单独监听文件改动
- 也不需要每次都生成一整个 bundle

Porter 在开发模式的 bundle 逻辑是按 package 的，会自动按 package 合并文件，且在浏览器加载流程中可以多层缓存（服务端缓存、浏览器端 Service Worker 缓存等等）。

Porter 在生产模式时，是不需要启动中间件的。为生产模式编译、打包脚本时，可以选择给每个 Entry 打包所有依赖，也可以选择按 package 打包，Entry 仅包含自身 package 中的依赖。和 Webpack vendor/common 或者更新一些的 DLL 插件一样，Porter 还可以选择按 Entry 打包两个版本，根据 Entry 不同而不同的 vendor，以及 Entry 之间共享的 common。

## Convert to ES Module

> 本节为开放讨论，实际工作尚未完成

想要一步到位是不太可能的，比较欣慰的是，海棠中所使用的模块化方案在 2017 年已经支持 Babel（但 TypeScript 还得再等等），所以上述用例已经可以转换为：

```js
// relative specifier
import './foo'

// non-relative specifier
import 'lib/bar'
import $ from 'jQuery'

// alias specifier (./dist => ./dist/index.js)
import './dist'

// worker-loader
import Worker from 'worker-loader!./worker'

// dynamic import is NOT ready yet
```

听起来似乎马上用就行，但实际上上述代码是依赖 `babel.transform()` 转换为 CommonJS 模块，再以普通脚本模式运行的。也就说前文中提及的 `module` 模式的好处、 `import` 声明式依赖的好处，在运行时其实捞不到。不管怎么说，ESLint 工具在检验源码时确实是更加有的放矢了。

如果要让浏览器执行真正的 ES Module，我们可能需要修改 Entrypoint，大致改为：

```html
<script type="module" src="./app.mjs"></script>
<script nomodule src="./app.js?main"></script>
```

此处借用 Node.js 所采用的专用扩展名 .mjs ，只为表示使用 type="module" 引入 ES Module，使用属性 nomodule 设置降级方案。实际浏览器中脚本的执行模式是以引入方式决定的。

不过，浏览器中默认的 ES Module 依赖解决逻辑并没有考虑 npm 管理的部分，要让上述方案正式可行，我们还需要扩展 Loader 逻辑，加入版本判断。这里头还隐藏了一个比较大的问题，在动态依赖方面也有，我一并描述。

## import with context

> 本节为开放讨论，实际工作仍未完成

ES Module 给出的动态依赖解决方案是 `import()` 。假设我们现在有 foo/bar.js ：

```js
// foo/bar.js
require.async('./qux.js', function(qux) {
  // use qux.js
})

// fetches foo/qux.js
```

上述动态依赖引入逻辑执行时，会以当前模块路径为上下文来解决依赖 `resolve(specifier, context)` 。这就是我所说的隐藏的逻辑。在 ES Module 中，这一层逻辑同样没有显式表达出来。而且由于 `import()` 的特殊调用形式，对开发者自定义的模块化方案来说，基本上是无从自主实现的。

声明式的 `import` 同样会隐藏上下文，例如：

```js
import $ from 'jquery'
```

因为可能存在 `a => jquery@1.x` 而 `b => jquery@3.x` ，我们需要知道是谁依赖 `jquery` 。假如在这一层不处理，等请求 `jquery.js` 到了服务端，就无从下手了。

## Bonus: CSS @import

Porter 对 CSS 的 `@import` 同样做了处理，只是方式比较简单，是基于 postcss 插件 postcss-import 实现的：

![](http://ossgw.alicdn.com/creatives-assets/oss/uploads/2018/08/03/4ac47810-9714-11e8-8cc4-e5bdfc7cf1ea.svg)

## Afterword

到这里，All About Module 系列文章就结束了。撰写这个系列的初衷之一，是回答两个 Porter 相关问题：

- 为什么会有 Porter
- Porter 的下一步是什么

希望看完这个系列，你能在了解 ES Module 的同时，对 Porter 也感兴趣。
