---
layout: post
title: To Craftsmanship / 项目
---

## Jorma

[Jorma](https://github.com/dotnil/jorma) is an object-relational mapping library for morden JavaScript. It borrows a lot from Active Record of Ruby on Rails. With Jorma we can:

- have `snake_case` columns mapped to `camelCase` attributes automatically,
- set up associations with `belongsTo()`, `hasOne()`, `hasMany()`, or `hasMany({ through })`,
- query tables either including predefined associations or joining abitrary models.

Jorma has a SQL expression parser built-in, hence make following queries possible:

```js
Post.group('MONTH(createdAt) as month').count().having('count > 0')
```

## Instaport

[Instaport](https://github.com/erzu/instaport) is a consolidated solution for browser module authoring and code sharing between Node.js and browser. It features three parts:

- a module loader for browser side module loading,
- a koa/express middleware for server side module transpiling, and
- a compiler for browser module transpiling and bundling to make them production ready.

Instaport has been used in several web applications at Alimama.com for more than three years and serves them well. For more introduction please visit the repo.

Instaport 是一个集成前端模块化方案，方便前后端模块共享。它包含三个组件：

- 用于浏览器模块加载的模块加载器；
- 用于转换 CommonJS/`es6 module` 的 Koa/Express 中间件；以及
- 用于转换、打包前端代码的编译工具。

Instaport 已经在阿里妈妈事业部多个产品中使用多年，久经考验，欢迎访问仓库了解更多。
