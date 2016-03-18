---
layout: post
title: JSHint 与 Sublime Text 2
---

IDE 党鄙视文本编辑器理由之一是，文本编辑器里代码校验做得不好，不能在写代码的时候就通过分析，
提示你写的代码是否有问题，费事费力。

我不掺和这种争执哈，编辑器、操作系统、编程语言、开发框架、语言库，统统都是 firebait，
能迅速分化阵营，掐个半天，最终自然谁也说服不了谁。

本文说明一下 Sublime Text 2（以下简称 Sublime）里使用 JSHint 实时检查 JavaScript 代码的方法。

有个人叫 Douglas Crockford，他做过许多事情，如下几件对 JavaScript 社区影响深远：

 - JavaScript the Good Parts
 - JavaScript Object Notation，即 JSON
 - JSLint

JSLint 就如当年 C 语言初风靡之时的
[lint](http://en.wikipedia.org/wiki/Lint_\(software\))，
目的是分析代码，标注出代码中的危险之处；但 JSLint 还以其警告闻名

> JSLint may hurt your feelings.<br>
> JSLint 可能会伤害你的感情。

由此可见 Douglas 的 [JavaScript 风格](http://javascript.crockford.com/code.html)
有多严苛。我们自然也容易理解，它不能完全服众。于是后来有人做了 [JSHint](http://jshint.com/)，
因为受不了这种写法都要被警告：

```javascript
function foo() {
    var arr = 'abcdefg'.split('')

    for (var i = 0; i < arr.length; i++) { // 会警告说，var i 该放开头
        console.log(arr[i])
    }
}
```

单从实践中说，这种写法更好地避免了 `i` 忘了声明的情况。

然后，说 Sublime，它是一款 Python 写的编辑器，可以用 Python 给它写扩展，
敝部门同事 [@白汀](http://weibo.com/472811737) 也写过
[教程](http://ux.etao.com/posts/541)。同时，类似 Vim 的 Vundle，
Sublime 也有管理扩展的扩展（Everything gets meta），叫做
[Sublime Package Control](http://wbond.net/sublime_packages/package_control)，
尚未安装的同学，建议猛击其链接，按提示安装。

以上即本文之前情提要，以下 JSHint in Sublime 之安装方式。

首先你需要安装 JSHint：

```bash
$ npm install jshint -g
```

然后，在 Sublime 中，`Command + Shift + P`，Windows 用户应该是 `Control + Shift + P`，
呼出 Package Control，选择 Install Package，安装 JSHint。

装好之后，就可以使用 `Command + B` 或者 `Control + B` 来检查 JavaScript 代码了。
但故事到此还没结束，我们还配置一下 JSHint，让它更符合使用习惯。

JSHint 支持 .jshintrc，即 Runtime Control 文件，方便用户配置。它的查找逻辑是，
从需要检查的文件的当前路径开始找，依次往上，找到或者到 `/` 为止。

所以，可以在你的项目根目录丢个 .jshintrc，以保证代码风格的一致性。文件的格式是 JSON，示例如下：

```javascript
{
    // 设置 JS 执行环境为浏览器
    "browser": true,

    // 加载 jQuery 的全局变量（jQuery、$）
    "jquery": true,

    // 行尾不要分号
    "asi": true,

    // 其他全局变量，我用了 SeaJS
    "predef": [
        "define",
        "seajs",
        "console"
    ]
}
```

详细的配置，可以看 [JSHint 之文档](http://jshint.com/docs/)。

最后，再给你的 Sublime 安装 [SublimeOnSaveBuild](https://github.com/alexnj/SublimeOnSaveBuild)，
就齐活啦。

虽然没有 IDE 实时标注这么高端，没有代码行内放个黄色三角作错误提醒这么时尚，但它很快、很容易定制，
很 unobtrusive，推荐使用喔。
