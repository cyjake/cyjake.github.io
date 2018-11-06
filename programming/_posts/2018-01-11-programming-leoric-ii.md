---
layout: post
title: Programming Leoric II
---

上周末花了两天时间给 Leoric 增加 SQLite 支持。SQLite 是个极轻量的数据库，在轻应用架构中[非常流行](https://www.sqlite.org/mostdeployed.html)，常见于浏览器、移动设备的操作系统、以及一些较为大型的客户端软件（比如 Skeype、iTunes、微信）。它本身非常简单，数据库实体可以是一个文件，也可以待在内存：

```js
new Database('foo.sqlite3')
new Database(':memory:')
```

所以在考虑给 Leoric 支持 MySQL 之外哪些数据库的时候，我想着接起来会非常容易，第一个考虑的是它。但事实上，SQLite 的 Node.js 支持很弱。在 npmjs.com 里能搜到的客户端，比较成熟的大概是如下几个：

- better-sqlite3
- dblite
- sqlite
- sqlite3

下载量最多的是 sqlite3，sqlite、better-sqlite3 和它都差不多，都是 C binding 的简单封装，然后三个在数据库初始化的时候 API 还全都不一样：

```js
// sqlite3
new Database(db, mode, callback)  // callback based
// better-sqlite3
new Database(db, { memory, readonly, fileMustExist }) // synchronous api
// sqlite
sqlite.open(db, { Promsie })  // callback/Promise based
```

执行 SQL 的时候，则都是 SQLite 提供的四件套：

```js
db.all(sql, [...param], callback)   // all rows
db.each(sql, [...param], callback)  // iterate rows one by one
db.get(sql, [...param], callback)   // one row
db.run(sql, [...param], callback)   // queries other than SELECT
```

前三个的作用差不多，区别只是 `each` 可以用来优化大数据量的遍历，`get` 则方便只获取一条数据（用 `all` 配合 `LIMIT` 其实效果差不多）。`all` 返回的数据结构类似：

```js
[ { id, foo, bar, ... },
  { id, foo, bar } ]
```

这种结构在查询单表的时候非常方便，但是在遇到 JOIN 的时候，比如 Leoric 里常用的示例 `Post.include('comments')`，上面这种结构会导致 `posts` 表中的字段被 `comments` 表中的同名字段覆盖：

```js
[ { id: 1, content, post_id, ... } ]
```

这里的 `id` 和 `content`（假设都有 content 字段）都会是 `comments` 表的，`posts` 的就取不到了。这个问题 sqlite3 里[三年前就有人提](https://github.com/mapbox/node-sqlite3/issues/443)了，然而并没有得到重视。

解决的办法很简单，可以想 postgres 模块那样支持 [`rowMode: 'array'`](https://node-postgres.com/features/queries#row-mode)：

```js
client.query({ text: sql, rowMode: 'array' }, (err, { rows, fields }) => {
  // rows => [ [ 1, 'foo', ... ],
  //           [ 2, 'bar', ... ] ]
  // fields => [ { name: 'id', table: 'foo' },
  //             { name: 'text', table: 'foo' } ]
})
```

也可以像 mysql 模块那样更进一步，支持 `nestTables`：

```js
client.query({ sql, nestTables: true }, (err, rows) => {
  // rows => [ { foo: { id: 1, text: 'foo' } },
  //           { foo: { id: 2, text: 'bar' } } ]
})
```

还有一个委曲求全的解决办法，就是用 identifier alias 把 `SELECT foo.*` 改成 `SELECT foo.id AS "foo:id"` 之类的，但开倒车不是维护 Leoric 的正确思路，我并没有考虑。

我最终选择的方式是[给 sqlite3 提 pr](https://github.com/mapbox/node-sqlite3/pull/932)，增加 `.all({ sql, rowMode }, [...param], callback)` 这种调用形式，同时把底层接口改为默认带上 `fields`：

```js
db.all({ sql, rowMode: 'array' }, (err, rows, fields) => {
  // rows => [ [ 1, 'foo', ... ],
  //           [ 2, 'bar', ... ] ]
  // fields => [ { name: 'id', table: 'foo' },
  //             { name: 'text', table: 'foo' } ]
})

db.all({ sql, rowMode: 'nest' }, (err, rows) {
  // rows => [ { foo: { id: 1, text: 'foo' } },
  //           { foo: { id: 2, text: 'bar' } } ]
})
```

但从 sqlite3 的历史 pr 处理情况来看，我非常担心这个 pr 要到此为止。sqlite3 模块的维护者并不十分热衷响应社区的反馈。我觉得，如果实在等不到，又实在想给 Leoric 支持 SQLite，我还是直接 fork 一个比较好。

哦对了，我好像还一直没说 dblite，这个客户端倒是提供了一个比较通用的 [`db.query()`](https://github.com/WebReflection/dblite#bootstrap) 方法，不需要我再判断应该用 `db.run()` 还是 `db.all()`。但它其实只是一个 `sqlite3` 命令的浅包装，与其他客户端直接接口调用比起来，它还得 spawn 一个进程来完成查询，不推荐使用。

另一个有关 SQLite 比较有趣的差别是 column metadata 的获取方式。在 MySQL、PostgreSQL、[MSSQL](https://docs.microsoft.com/en-us/sql/relational-databases/system-information-schema-views/columns-transact-sql) 这些数据库里，我们可以通过 `information_schema.columns` 表查询字段元数据，会返回包括字段名、字段类型、是否主键、能否为空等信息，是[一项 ANSI 标准](https://en.wikipedia.org/wiki/Information_schema)。遗憾的是，SQLite 没有遵循。在 SQLite 要获取表结构信息，需要[使用 Pragma](https://stackoverflow.com/questions/947215/how-to-get-a-list-of-column-names-on-sqlite3-iphone)：

```sql
PRAGMA table_info(table_name);
```

最后一个比较有趣的，SQLite [不支持自定义的自增字段](https://sqlite.org/autoinc.html)，也就是说字段描述里不能使用 `AUTO_INCREMENT`。但在定义主键的时候，有个比较隐蔽的逻辑：

> In SQLite, a column with type INTEGER PRIMARY KEY is an alias for the ROWID (except in WITHOUT ROWID tables) which is always a 64-bit signed integer.

如果主键是 `INTEGER`，则主键将变成内建的 `ROWID` 的别名，而 `ROWID` 是表中唯一的自增字段。所以用 MySQL 时可以 `bigint(20) AUTO_INCREMENT PRIMARY KEY`，用 SQLite 时得改成 `INTEGER PRIAMRY KEY`。

而且定义主键时又可以用 `AUTOINCREMENT`（没有下划线）：

```sql
CREATE TABLE foo (id INTEGER PRIMARY KEY AUTOINCREMENT);
```

这时主键的自增行为与不加 `AUTOINCREMENT` 时有些微差别，会确保新插入的 `id` 值是当前表中最大的。如果没有 `AUTOINCREMENT`，会在 `id` 值超过最大值时，尝试寻找表中还没有使用过的 `id` 值，也就是可能新插入的 `id` 值并非表中最大值。

真是一些无聊的区别……

总之，给 Leoric 增加 SQLite 支持所耗费的工作远超我的预计，希望我的 pr 能最终被合并吧。
