---
layout: post
title: 前端模块的现状
---

All About Module 是一系列文章，本系列想要讨论的：

- [前端模块的历史沿革 A Brief History of Module]({{ site.baseurl }}{% link programming/_posts/2018-05-22-about-module-i.md %})
- 前端模块的现状 The Status Quo of Module
- [前端模块在广告业务的实践 The Module Practiced in Cara]({{ site.baseurl }}{% link programming/_posts/2018-05-24-about-module-iii.md %})

本文为系列文章第二篇，讨论前端模块的现状。在历史沿革一文中，我们讨论了 CommonJS 以及一系列衍生规范，甚至连最最新的 `import()` 都有提及，唯独没有讲  ES Module。本文就从它说起。

## ES Module

ES Module 是 2015 年颁布的 ES2015（原名 ES6）标准所覆盖的特性之一，设计目标是整合 CommonJS、AMD 等已有模块方案，提供一个标准的、更高效的做法。ES Module 与现有方案的区别主要在以下方面：

- 声明式而非命令式，或者说 `import` 是声明语句 Declaration 而非表达式 Statement
- `import` 和 `export` 的值也和 CommonJS 这种以 `exports` `Object` 为载体的方式不同
- 默认运行环境为 `module` ，相当于 `script` 模式的普通脚本 `'use strict'` 开启严格模式

第一点的区别，主要在 ES Module 中无法使用 import 声明带变量的依赖、或者动态引入依赖：

```js
// WRONG
import * as env from `./env/${process.env.NODE_ENV}.js`

// WRONG
if (process.env.BROWSER) {
  import "./browser.js"
} else {
  import "./node.js"
}
```

对务实主义的 Node.js 开发者来说，这些区别都让 npm 所营造出来的海量社区代码陷入一种尴尬的境地，无论是升级还是兼容都需要大量的工作。对此，David Herman 撰文解释，[ES Module 所带来的好处远大于不便](http://calculist.org/blog/2012/06/29/static-module-resolution/)：

- `静态 import 能确保被编译成变量引用`，这些引用在当前执行环境运行时能被解析器（通过 JIT 编译 polymorphic inline cache）优化，执行更有效率
- `静态 export 能让变量检测更准确`，在 JSHint、ESLint 等代码检测工具中，变量是否定义是个非常受欢迎的功能，而静态 export 能让这一检测更具准确性
- `更完备的循环依赖处理`，在 Node.js 等已有的 CommonJS 实现中，循环依赖是通过传递未完成的 exports 对象解决的，对于直接引用 exports.foo 或者父模块覆盖 module.exports 的情况，传统方式无从解决，而因为 ES Module 传递的是引用，便不会有这些问题

其他还有对未来可能新增的标准（宏、类型系统等）更兼容等，在《Exploring ES6》[一书也有介绍](http://2ality.com/2014/09/es6-modules-final.html)，不再赘述。

## ES Module in Browser

在 ES Module 标准出来之前，尽管社区实现的 Loader 一箩筐，但浏览器自身一直没有选定模块方案，支持 ES Module 对浏览器来说还是比较少顾虑的。
由于 ES Module 的执行环境和普通脚本不同，浏览器选择增加 `<script type="module">` ，只有 `<script type="module">` 中的脚本（和 `import` 进来的脚本）才是 `module` 模式。也只有 `module` 模式执行的脚本，才可以声明 `import` 。也就是说，下面这种代码是不行的：

```html
<script>
import foo from "./foo.js"
</script>

<script type="javascript">
import bar from "./bar.js"
</script>
```

目前，几大常青浏览器都[已支持 ES Module](https://caniuse.com/#search=import)。最后一个支持的是 Firefox，2018 年 5 月 8 日发布的 Firefox 60 正式支持 ES Module。

此外，考虑到向后兼容，浏览器还增加 `<script nomodule>` 标签。开发者可以使用 `<script nomodule>` 标签兼容不支持 ES Module 的浏览器：

```html
<script type="module" src="./app.js"></script>
<script nomodule src="./app.bundle.js"></script>
```

## ES Module in Node.js

但在 Node.js 这边，ES Module 遭遇的声音要大很多。前 Node.js 领导者 Isaacs Schlutuer 甚至认为 ES Module 太过阳春白雪且不考虑实际情况，毫无价值（[adds nothing](http://blog.izs.me/post/25906678790/on-es-6-modules)）。本系列的第一篇文章也讲到，WHATWG Loader 标准在 Node.js 社区同样碰壁。但值得庆幸的是，WHATWG Loader 成员并没有就此放弃，而是选择以一种更直接的方式，在兼顾存量代码的前提下，去完善 [Node.js 对 ES Module 的支持](https://nodejs.org/api/esm.html)。

首先纠结的是如何支持 module 执行模式，是自动检测，还是 `'use module'` ，还是在 `package.json` 里增加 `module` 属性作为专门的入口，还是干脆增加一个新的扩展名？

最终 Node.js 选择增加新的扩展名 .mjs ：

- 在 `.mjs` 中可以自如使用 `import` 和 `export`
- 在 `.mjs` 中不可以使用 `require`
- 在 `.js` 中只能使用 `require`
- 在 `.js` 中不可以使用 `import` 和 `export`

也就是两套模块系统完全独立。此外，依赖查找方式也有变化，原本 `require.extensions` 是：

```js
{ '.js': [Function],
  '.json': [Function],
  '.node': [Function] }
```

如今（需要开启 `--experimental-modules` 选项）则是：

```js
{ '.js': [Function],
  '.json': [Function],
  '.node': [Function],
  '.mjs': [Function] }
```

但两套独立的模块系统也导致第二个纠结的方面，模块系统彼此之间如何互通？对浏览器来说这不是问题，但对 Node.js 来说，npm 中海量的 CommonJS 模块是它不得不考虑的。

最终确定的方案倒也简单，在 `.mjs` 里，开发者可以 `import` CommonJS（虽然只能 `import` default）：

```js
import 'fs' from 'fs'
import { readFile } from 'fs'
import foo from './foo'
// etc.
```

在 `.js` 里，开发者自然不能 `import` ES Module，但他们可以 `import()` ：

```js
import('./foo').then(foo => {
  // use foo
})

async function() {
  const bar = await import('./bar')
  // use bar
}()
```

注意，和浏览器以引入方式判断运行模式不同，Node.js 中脚本的运行模式是和扩展名绑定的。也就是说，依赖的查找方式会有所不同：

- 在 `.js` 中 `require('./foo')` 找的是 `./foo.js` 或者 `./foo/index.js`
- 在 `.mjs` 中 `import './bar'` 找的是 `./bar.mjs` 或者 `./bar/index.mjs`

善用这些特性，我们现在就可以将已有的 npm 模块升级成 ES Module，并且仍然支持 CommonJS 方式。

## Dual-Mode Packages

双模式 npm 包（Dual-Mode Package）概念（以及本文大量 Node.js 相关内容）来自《[Native ES Modules in Node.js: Stauts and Future Directions, Part I](https://medium.com/@giltayar/native-es-modules-in-nodejs-status-and-future-directions-part-i-ee5ea3001f71)》一文。

首先 package.json 中的 main 需要去掉扩展名：

```js
{
  "name": "some-package",
  "main": "./index"
}
```

Node.js 会自行根据父模块的运行模式决定应当加载哪个文件。也就是说，我们需要 `index.mjs` 和 `index.js` 两个文件，前者提供 ES Module，后者提供 CommonJS 模块。这当然不是说我们得人肉写两个版本，而是可以选择使用 ES Module 书写全部代码，继而在发布前使用 Babel 或者 Traceur 或者其他 transpiler 编译。

这样，通过双模式的 npm 包，我们既可以升级模块代码，也可以兼顾新旧两种使用方式。

## Dynamic Import

静态 `import` 固然好，但动态引入依赖这一实际需求不能不考虑。例如在 React 等代码中我们经常看到条件依赖：

```js
if (process.env.NODE_ENV !== 'production') {
  require('./cjs/react.development.js')
} else {
  require('./cjs/react.production.js')
}

if (process.env.BROWSER) {
  require('./browser.js')
}
```

目前采用的处理方式是先使用 loose-envify 替换代码中的环境变量名，继而让 webpack 移除条件判断中的无效分支。假如环境变量为 `{ NODE_ENV: 'production', BROWSER: false }` ，上述代码将变为：

```js
require('./cjs/react.production.js')
```

为此，Domenic Denicola 起草 `import()` [标准提案](https://github.com/tc39/proposal-dynamic-import)，作用与 `System.import()` 相若，来满足上述使用情况。`import()` 的特殊之处在于，import 本身是关键词，`import()` 并非普通函数，因此它不会影响已有代码。但对想要兜底实现相关逻辑的人来说，想要自主实现 `import()` 就变得很困难了。

除了用来处理动态依赖，`import()` 也被用来从 `script` 环境引入 `module` 。在 HTML 中：

```html
<script>
import('./foo.js').then(foo => {
  // use foo
})
</script>
```

在 Node.js 中（`.js` 文件）：

```js
import('./foo.mjs').then(foo => {
  // use foo
})
```

## import.meta

另一个 `import` 的特殊之处在于 `import.meta` ，无论是 Node.js 还是浏览器，在 `module` 模式下，开发者都可以通过 `import.meta` 获取当前模块的元数据。目前仅暴露 `import.meta.url` ，浏览器中拿到的是当前模块的 url，Node.js 中则是 `file:///` 开头的文件路径。

## Afterword

到目前为止，使用 ES Module 编写浏览器、Node.js 通用的 JavaScript 代码已经完全可行，而且还不依赖任何编译或者打包工具。开发者只需要确保 ES Module 扩展名为 `.mjs` ，就可以在浏览器里：

```html
<script type="module">
import "./foo.mjs"
</script>
```

在 Node.js 里（仍需开启 `--experimental-modules` 选项）：

```js
import "./foo"
// or
import "./foo.mjs"
```

以上便是 ES Module 在浏览器和 Node.js 中的现状，看起来前途光明。那么，我们还需要编译或者打包工具么？我将在本系列的最后一篇《[前端模块在广告业务的实践 The Module Practiced in Cara]({{ site.baseurl }}{% link programming/_posts/2018-05-24-about-module-iii.md %})》回答这个问题。
