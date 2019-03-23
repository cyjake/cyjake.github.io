---
layout: post
title: Programming Leoric I
---

2016 年初由于工作所需，我开发了一个比较粗浅的模块，用来映射 MySQL 表到 JavaScript 类，取名 xx-orm。两年后，Node.js 社区的 ORM 方案仍然是五花八门，在 npmjs.com 搜 orm 能让人挑花眼。我把 xx-orm 从应用代码中剥离出来，取名 [Leoric](https://github.com/dotnil/Leoric)，为这场混战添一把柴火。

Leoric 最朴素的需求是为了做字段名 `column_name` 到属性名 `attributeName` 的映射。因为 DBA 通常使用 `snake_case` 来表达数据库名、表名、字段名，但是 JavaScript 默认的代码风格又是 `camelCase` 的：

| column name | attribute name |
|-------------|----------------|
| foo         | foo            |
| foo_bar     | fooBar         |

另一件事情是 Leoric 目前的一个 feature 或者 bug，无需 Model 属性定义以及 Migration。在开发 xx-orm 时，我们的表结构设计都是通过数据库服务所提供的设计工具进行。待设计完成后，只需继承 `Bone` 然后 `connect` 数据模型和数据库：

```js
const { Bone, connect } = require('Leoric')
class User extends Bone {}
connect({ client: 'mysql', models: [User] })
```

这样 `User` 就可以用了，所有 `users` 表中的字段信息都会被自动导入：

```js
User.columns
// => ['id', 'name', 'age', 'created_at', ... ]
User.attribtes
// => ['id', 'name', 'age', 'createdAt', ... ]
```

`User` 的使用者只需要关心映射后的属性名 `attribute name`。可以阅读《[Leoric 基础](http://cyj.me/Leoric/zh/basics#%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A)》一文了解更多相关内容。

在这个朴素需求之上，Leoric 的绝大多数特性都是借鉴 Active Record 的，比如查询、关联关系的 API 设计。但对于熟悉 Node.js 但不了解 Ruby on Rails 的程序员来说，前面这句不会给人直观印象，所以下文将 Leoric 与 Node.js 流行的 ORM 库做个比较。

目前社区中最成熟的方案大致是 Sequelize、Bookshelf（大多数会直接用它底层的 Knex） 、还有 sails 框架所包含的 Waterline。Waterline 是一个志在兼收并蓄的模块，不仅能够映射关系型数据库，还可以把底层存储换成文件系统、Redis 等等。功能太过强大，惹不起惹不起，这里就不深入讨论了。

Leoric 的主要比较对象是 Sequelize、Knex。从查询说起，假设我们需要查询 `WHERE (foo IS NULL OR foo = 1) AND deleted_at IS NULL`，在 Sequelize 里：

```js
Table.findAll({
  where: {
    [Op.and]: [
      { [Op.or]: [
        { foo: null },
        { foo: 1 } ] },
      { deletedAt: null }
    ]
  }
})
```

在 Knex 里：

```js
Table.where(function() {
  this.where({ foo: null }).orWhere({ foo: values })
}).andWhere({ deletedAt: null })
```

用 Leoric，则是：

```js
Table.find('(foo = null or foo = ?) and deletedAt is null', 1)
```

其实 Sequelize 这种查询方式 Leoric 也支持，但作为一个曾经的 Ruby on Rails 小粉丝，我还是认为 SQL-like 的表达方式是最合适的。注意这里传入的字符串并不会直接被放到 `WHERE`，而是会被解析、过滤，最后再拼到 SQL 中去。

如果认为 placeholder 形式不够直观，也可以用 [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)：

```js
Table.find`(foo = null or foo = ${foo}) and deletedAt is null`
```

可惜这个我所认为的优势并[不被 cnodejs.org 所认同](https://cnodejs.org/topic/5a48f2a7f320ae9f0dd581f8)。如果你仍然对 Leoric 的查询 API 感兴趣，不妨阅读《[Leoric 查询接口](http://cyj.me/Leoric/zh/querying)》一文。

另一个比较方便的是关联关系的处理。使用 Leoric，我们可以在 Model 中声明[多种映射关系](http://cyj.me/Leoric/zh/associations)：

```js
const { Bone } = requier('Leoric')
class Comment extends Bone {}
class User extends Bone {}
class Post extends Bone {
  static describe() {
    this.hasMany('comments')
    this.belongsTo('author', { className: 'User', foreignKey: 'authorId' })
    this.hasMany('tagMaps')
    this.hasMany('tags', { through: 'tagMaps' })
  }
}
```

查询的时候就可以一次取出：

```js
Post.include('comments', 'author', 'tags').where('posts.id = ?', [8, 24])
```

上面这种关联关系，使用 Sequelize 表示，可能是这样的：

```js
const Post = sequelize.define('post', { ... })
const Comment = sequelize.define('comment', { ... })
const User = sequelize.define('user', { ... })
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })
Post.hasMany(Comment)
Post.hasMany(TagMap)
Post.hasMany(Tag, { through: 'TagMap' })
```

使用 Sequelize 查询的时候：

```js
Post.findAll({
  include: [
    { model: Comment },
    { model: User },
    { model: Tag,
      through: { /* ? */ } }
  ],
  where: {
    id: { $in: [8, 24] }
  }
})
```

一些基于 Knex 的 ORM 也支持关联关系，但使用的语法比 Sequelize 还要繁琐，这里就不深入讨论了。在关联关系定义上，Leoric 和 Sequelize 相差不多，Leoric 的 API 更现代化一些。而在查询的时候，Leoric 则要简洁许多，毕竟 **Leoric 懂得你的查询表达式**。
