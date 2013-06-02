---
layout: rosetta
title: jQuery 与 KISSY 对照表
---

## 快速上手

<table>
  <tr>
    <th>jQuery 1.8.3</th>
    <th>KISSY 1.3</th>
  </tr>
  <tr>
    <td>
      {% highlight html %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="https://somedomain.com/path/to/plugin.js"></script>
<script src="https://somedomain.com/path/to/anotherplugin.js"></script>

<script>
$(document).ready(function() {
    // HTML 加载分析完成，DOM 树创建完毕，即 DOMContentLoaded 事件的跨浏览器支持。
    $.foo.bar()
})

// 简写
$(function() {
    $.foo.bar()
})
</script>
      {% endhighlight %}

      <p><strong>作用域</strong>：jQuery、$ 为全局变量。</p>
      <p><strong>插件</strong>：jQuery 以插件机制方便开发者扩展其自身所不提供的功能，插件可以静态加载，
        与 jquery.js 合并，或者使用 Sea.js 之类的模块加载器动态加载。本文中的所有示例只限于 jQuery
        核心功能，不讨论插件。</p>
    </td>
    <td>
      {% highlight html %}
<script src="http://a.tbcdn.cn/s/kissy/1.3.0/seed-min.js"></script>

<script>
KISSY.ready(function(S) {
    // 同样注册 DOMContentLoaded
    // S 即 KISSY，将全局变量赋值到回调函数的第一个参数，语法糖+性能优化
    S.foo.bar()
})
</script>
      {% endhighlight %}

      <p><strong>作用域</strong>：KISSY 为全局变量。</p>
      <p><strong>模块</strong>：KISSY 本身也是个加载器，DOM 操作、Ajax 请求、事件机制、Base 模块等，
        在 KISSY 内部都是以 KISSY 模块的形式存在。要扩展 KISSY，加上项目需要的公用库，只需按照
        <a href="http://docs.kissyui.com/docs/html/api/seed/loader/">KISSY Loader</a>
        约定的语法，添加、使用模块即可。
      </p>
      <p>KISSY 在回调函数里加 S 参数的做法，会让人想到 YUI 。但与 YUI 不同的是，KISSY 不是个构造函数，它只是个普通对象。</p>

      {% highlight js %}KISSY.isPlainObject(KISSY) === true{% endhighlight %}

      <p>回调函数里那个 S，正是 KISSY 对象自身。</p>
    </td>
  </tr>
</table>

## KISSY Loader

<table>
  <tr>
    <th>编写模块</th>
    <th>使用模块</th>
    <th>注解</th>
  </tr>
  <tr>
    <td>
      {% highlight js %}
// 类
KISSY.add('my/dialog', function(S) {
    function Dialog() {}

    return Dialog
})
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
// 在编写时引用外部模块
KISSY.add('my/popupmanager', function(S, Dialog) {
    return {
        // 公共方法
        popup: function() {}
    }
}, {
    // 声明模块的依赖
    requires: [
        'my/dialog'
    ]
})

// 使用模块
KISSY.use('my/popupmanager', function(S, PopupManager) {
    PopupManager.popup('Hello, KISSY!')
})
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>这一套模块编写与应用的过程与时兴的其他模块加载器相若，与 Sea.js 的区别是，KISSY 不提倡匿名模块的使用。</p>
      <p>也因为此，KISSY 的粒度比 jQuery 细，DOM 操作、Ajax 请求、事件支持等，都对应到相应的模块，
        在使用时，可以有两种方式：</p>

      <ol>
        <li>直接引用 <a href="http://a.tbcdn.cn/s/kissy/1.3.0/kissy-min.js">kissy-min.js</a>，
          这其中已经打包了前述常用模块。</li>
        <li>使用 KISSY Loader 提倡的方式，引用 <a href="http://a.tbcdn.cn/s/kissy/1.3.0/seed-min.js">seed-min.js</a>，
         在需要相关功能时显式声明。</li>
      </ol>

      <p>方式二的代码示例如下：</p>

      {% highlight js %}
// 直接 use
KISSY.use('node', function(S) {
    // 查找节点
    S.all('code')
})

// 放入 requires
KISSY.add('some-module', function(S, Node) {
    S.all('code')
}, {
    requires: ['node']
})
      {% endhighlight %}

      <p>视你的项目需求复杂度而定，普通页面，直接使用方式一无妨。</p>
    </td>
  </tr>
</table>


## 选择节点

<table>
  <tr><th>jQuery 1.8.3</th><th>KISSY 1.3.0</th><th>注解</th></tr>
  <tr>
    <td>
      {% highlight js %}$('div.foo:first'){% endhighlight %}
    </td>
    <td>
      {% highlight js %}S.one('div.foo'){% endhighlight %}
    </td>
    <td class="notes">
      <p>jQuery 与 KISSY 的选择器语法基本相同，在 KISSY 中需要显式打开 sizzle 选择器引擎以支持
        CSS 3 选择器。<code>:first</code> 是 jQuery 扩展，用于返回首个匹配选择器的节点，
        S.one 等同于此效果。</p>
      <p>KISSY 默认仅支持 #id tag.class 常用形式，详细列表见
        <a href="http://docs.kissyui.com/docs/html/api/core/dom/selector.html">selector 文档</a>
      </p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
var foo = $('div.foo:first')

foo.some_method()
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
var foo = S.one('div.foo')

if (foo) {
    foo.someMethod()
}
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>假如找不到相应的节点，S.one 返回 null ，而 <code>:first</code> 返回的仍然是节点列表，只是为空。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}$('div.foo'){% endhighlight %}
    </td>
    <td>
      {% highlight js %}S.all('div.foo'){% endhighlight %}
    </td>
    <td class="notes">
      <p>选择所有 class 为 foo 的节点。</p>
      <p>开启后 sizzle 引擎后， Node.all 在选择器与节点实例化上等同于 $ ：</p>
      {% highlight js %}
KISSY.use('sizzle', function(S) {
    var $ = Node.all

    $('div.foo').each(function() {
        console.log($(this).html())
    })
})
      {% endhighlight %}
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
.find('p.foo:first')
.find('p.foo')
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
.one('p.foo')
.all('p.foo')
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>在给定节点中查找 class 为 foo 的 p 子节点。</p>
      <p>KISSY 中用于处理节点的类叫做 NodeList ，S.one 与 S.all 是其静态方法，同时在它的原型链上也有
        NodeList#one 与 NodeList#all 方法，可与 jQuery#find 对应。<p>
    </td>
  </tr>
</table>

## 操作节点

<table>
  <tr>
    <td>
      {% highlight js %}
$('<div/>')

$('<a/>', {
    href: 'http://cyj.me',
    target: '_blank',
    title: 'EVERYTHING JAKE',
    click: fn
})
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.DOM.create('<div/>')

S.DOM.create('<a/>', {
    href: 'http://cyj.me',
    target: '_blank',
    title: 'EVERYTHING JAKE'
    // 不能在此处传递事件绑定
})
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>创建新的 DOM 元素，暂未添加至 DOM 树。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
.html()
.html('foo')

.text()
.text('foo')

.val()
.val('foo')

.attr('foo')
.attr('foo', 'bar')

.prop('disabled')
.prop('disabled', false)
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
.html()
.html('foo')

.text()
.text('foo')

.val()
.val('foo')

.attr('foo')
.attr('foo', 'bar')

.prop('disabled')
.prop('disabled', false)
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>两者一致。</p>
      <p>在 KISSY 早前的版本中，API 更偏向于 YUI 一些，不过这些都已成为过去，就好像那浮云一样。</p>
    </td>
  </tr>
</table>

## 工具方法

<table>
  <tr>
    <td>
      {% highlight js %}
$.globalEval
$.isArray
$.isEmptyObject
$.isPlainObject
$.isWindow
$.makeArray
$.merge
$.now
$.trim
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.globalEval
S.isArray
S.isEmptyObject
S.isPlainObject
S.isWindow
S.makeArray
S.merge
S.now
S.trim
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>jQuery 的 <a href="http://api.jquery.com/category/utilities/">工具包</a>
        与 KISSY <a href="http://docs.kissyui.com/docs/html/api/seed/kissy/index.html">lang</a>
        模块提供的辅助方法大约有 80% 的交集。</p>
      <p>常用的基本都覆盖到了。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}$.isNumeric(4338){% endhighlight %}
    </td>
    <td>
      {% highlight js %}S.isNumber(4338){% endhighlight %}
    </td>
    <td class="notes"><p>判断是否为数值类型。</p></td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.grep([1, 2, 3, 4, 5], function(value, index) {
    return value % 2 === 0
})
// ==> [2, 4]

// 扩展 jQuery.prototype
$.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true
        })
    }
})
      {% endhighlight %}
    </td>
    <td>
    </td>
    <td class="notes">KISSY 中所没有的。</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>
      {% highlight js %}
S.isNull
S.isObject
S.isRegExp
S.isString
S.lastIndexOf
      {% endhighlight %}
    </td>
    <td class="notes"><p>KISSY 中的辅助方法更多。</p></td>
  </tr>
  <tr>
    <td></td>
    <td>
      {% highlight js %}
S.substitute('Hello, {world}!', { world: 'pandora' })
// ==> Hello pandora!
      {% endhighlight %}
    </td>
    <td class="notes">KISSY 中提供的字符串替换方法，可以当做一个穷人版的模板引擎来用。</td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.inArray(1, [1, 2, 3])       // ==> 0

// 还可以传起始下标
$.inArray(1, [1, 2, 3], 1)    // ==> -1
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.inArray(1, [1, 2, 3])       // ==> true

S.indexOf(1, [1, 2, 3])       // ==> 0

S.lastIndexOf(2, [1, 2, 2, 5])      // ==> 3
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>两者的返回值有所不同。jQuery 的更像是 Array#indexOf，在 if 表达式中使用时尤其需要注意。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.extend({ foo: 1 }, { bar: 2, foo: 3 })
// { foo: 3, bar: 2 }

// 混入多个对象至首个
$.extend(obj0, obj1, obj2, obj3 ... objN)
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.mix({ foo: 1 }, { bar: 2, foo: 3 })
// { foo: 3, bar: 2 }

S.mix(
    obj0,
    obj1,
    true,       // 是否覆盖，overwrite
    ['foo', 'bar'],  // 白名单，只覆盖如下属性
    true        // 是否深度混入
)
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>混入一个或者多个对象到某一特定对象，是前端代码中比较常见的操作，尤其是要为函数、类提供初始参数时。</p>
      <p>jQuery 提供的方法是 extend，KISSY 则叫 mix，两者的可变参数完全不同，使用时需注意。</p>
    </td>
  </tr>
  <tr>
    <td></td>
    <td>
      {% highlight js %}
// 混入方法、属性到构造器的原型链
S.augment(function Class() {}, {
    egg: function() {},
    ham: function() {}
})

// 继承类，同时混入自定义方法
S.extend(
    function SubClass() {},
    function BaseClass() {},
    {
        egg: function() {},
        ham: function() {}
    }
)
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>在 mix 的基础上，KISSY 还提供了 augment 与 extend 方法，方便扩展构造函数。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.each(['foo', 'bar'], function(index, value) {
    console.log(index, value)
    // ==> 0 foo
    // ...
})

$.each({ foo: 1, bar: 2 }, function(key, value) {
    console.log(key, value)
    // ==> foo 1
    // ...
})
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.each(['foo', 'bar'], function(value, index) {
    console.log(index, value)
    // ==> 0 foo
    // ...
})

S.each({ foo: 1, bar: 2 }, function(value, key) {
    console.log(key, value)
    // ==> foo 1
    // ...
})
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>
        两者唯一的差别就是给回调函数的参数顺序不一样，
        KISSY 的更贴近 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach">Array#forEach</a>
      </p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.map([1, 2, 3, 4], function(value, index) {
    return value + index
})
// ==> [1, 3, 5, 7]

$.map({ foo: 1, bar: 2 }, function(value, key) {
    return key + value
})
// ==> ['foo1', 'bar2']
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.map([1, 2, 3, 4], function(value, index) {
    return value + index
})
// ==> [1, 3, 5, 7]

// 不支持传入对象
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>KISSY 不支持传入对象，两者表现都与
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">Array#map</a>
        一致。
      </p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.proxy(fn, context[, additionalArguments])

$.proxy(context, name)
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.bind(fn, context[, additionalArguments])
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>创建绑定上下文的匿名函数，参见
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">Function#bind</a>
      </p>
      <p>jQuery 还提供另一种调用形式，只需写一遍 context。</p>
    </td>
  </tr>
</table>

## 事件绑定

<table>
  <tr>
    <th>jQuery 1.8.3</th>
    <th>KISSY 1.3</th>
    <th>注解</th>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$('#foo').click(fn)
$('#foo').focus(fn)
$('#foo').blur(fn)
$('#foo').mouseout(fn).mouseover(fn)

// 一次绑定多个的语法糖
$('#foo').on({
    click: function() {},
    hover: function() {}
})
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.one('#foo').on('click', fn)
S.one('#foo').on('focus', fn)
S.one('#foo').on('blur', fn)
S.one('#foo')
    .on('mouseout', fn)
    .on('mouseover', fn)

// 可以同时绑定到多个事件
S.one('#foo').on('mouseenter mouseleave', fn)
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>KISSY 不支持 .click 这种语法糖，确实也没有多少必要。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$('#foo').on('click', '.item', fn)
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.delegate('click', '.item', fn)

// 绑定事件监听函数执行时的上下文
S.delegate('click', '.item', fn, this)
      {% endhighlight %}
    </td>
    <td class="notes">事件代理。</td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$('#foo').click()
$('#foo').trigger('click')

// 仅触发绑定或者代理到 #foo 节点的 click 事件的监听函数
$('#foo').triggerHandler('click')
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.one('#foo').fire('click')
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>触发事件，jQuery 中的 <a href="http://api.jquery.com/triggerHandler/">#triggerHandler</a> 比较特殊。</p>
    </td>
  </tr>
</table>

## 异步请求

<table>
  <tr>
    <th>jQuery 1.8.3</th>
    <th>KISSY 1.3</th>
    <th>注解</th>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.get(
    'http://example.com/items',
    function(items) {
        console.log(items)
    },
    dataType: 'json'
)
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.IO.get(
    'http://example.com/items',
    function(items) {
        console.log(items)
    },
    dataType: 'json'
)
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>普通 Ajax GET 请求。</p>
    </td>
  </tr>
  <tr>
    <td>
      {% highlight js %}
$.get(
    'http://example.com/items',
    function(items) {
        console.log(items)
    },
    dataType: 'jsonp'
)
      {% endhighlight %}
    </td>
    <td>
      {% highlight js %}
S.IO.jsonp(
    'http://example.com/items',
    function(items) {
        console.log(items)
    }
)
      {% endhighlight %}
    </td>
    <td class="notes">
      <p>JSONP 请求。</p>
    </td>
  </tr>
</table>