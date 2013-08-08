---
title: RichBase 的前世今生
layout: post
---

KISSY 从 1.3.x 版本开始，提供一个叫做 RichBase 的模块，顾名思义，它是 Base 的富集，直接从
Base 继承。但在我们挖 RichBase 的身份是红是黑之前，先有些基础知识得普及一下。

## 原型继承

在你初次接触 JavaScript 之前，可能就已经听到这种评价，JavaScript 有个叫做原型继承之类的东西，
所以在 JavaScript 里要做面向对象编程，我们需要把数据和方法写成这个样子：

### 原型链

{% highlight js %}
function Pet(attrs) {
    this.name = attrs.name
    this.age = attrs.age
    this.gender = attrs.gender
}

Pet.prototype.greeting = function() {
    console.log('Hi there. I am ' + this.name + '.')
}
{% endhighlight %}

然后在实例化时，我们这么用：

{% highlight js %}
var pet = new Pet({ name: 'Ghibli', age: 28, gender: 'male' })

pet.greeting()      // ==> Hi there. I am Ghibli.
{% endhighlight %}

将类方法定义在原型链上，可以节省内存空间，不需要所有实例上都重新定义方法，以上定义方式，和如下写法，
自然是不同的：

{% highlight js %}
function Pet(attrs) {
    var pet = {}

    pet.name = attrs.name
    pet.age = attrs.age
    pet.gender = attrs.gender

    pet.greeting = function() { ... }

    return pet
}
{% endhighlight %}

这种写法，唯一的好处是可以不用写 `new`，然而每个实例都有自己的 `.greeting()` 方法，当实例变多时，
是极大的内存浪费。

言归正传，原型链写法看上去很美，可拿到实践中去又会冒出两个新问题：

- 如何从 Pet 继承？
- 如何声明私有属性？

### 如何实现继承？

假设我们现在要从 Pet 派生出子类 Dog，然而 JavaScript 木有提供 extends 之类的语法，而按照
prototype 的设计，我们需要做的事情如下：

{% highlight js %}
function Dog(attrs) {
    Pet.call(this, attrs)
    this.breed = attrs.breed
}

Dog.prototype = new Pet()

Dog.prototype.bark = function() {
    console.log('Woof! Woof!')
}
{% endhighlight %}

这样，Dog 能够继承到 Pet 的方法，也能够继续扩展自己的。

{% highlight js %}
var dog = new Dog({
    name: 'Klinsmann',
    age: 49,
    gender: 'male',
    breed: 'Golden Retriever'
})

dog.greeting()      // ==> Hi there. I am Klinsmann.
dog.bark()          // ==> Woof! Woof!
{% endhighlight %}

这样的继承实现有许多问题：

- 与父类耦合严重，需要在子类构造函数中调用父类构造函数
- 父类构造器有副作用时，需要一个临时函数做原型链中转

第一个问题，暂时按下不表。第二个问题，意思是这样的：

{% highlight js %}
function Dummy() {}

Dummy.prototype = Pet.prototype
Dog.prototype = new Dummy()
{% endhighlight %}


为何不直接 `Dog.prototype = Pet.prototype`？
因为这样的话 `Dog.prototype.bark = function() {}` 也会跑到 `Pet.prototype` 上去，
并不是所有宠物都会吠的哇。

不管这么样，这种继承方式当真是不直观，所以 Node.js 的官方 API 里，直接在 util 模块中提供了
inherits 方法：

{% highlight js %}
var util = require('util')

// 仍然需要在子类中调用父类的构造函数
function Dog(attrs) {
    Pet.call(this, attrs)
}

// 使用 util.inherits 处理原型链
util.inherits(Dog, Pet)
{% endhighlight %}

于是，inherit 关键字，算是实现了。

### 如何声明私有属性？

在上述例子中，pet 或者 dog 的属性全部都是外部可以直接访问的，例如：

{% highlight js %}
var dog = new Dog({ name: 'Christiano' })

dog.name = 'Ronaldo'
{% endhighlight %}

假如我们需要进行变量验证，使用类似 Java Bean 中 getter、setter 这种写法，以确保获取与设置变量
的正确性：

{% highlight js %}
var dog = new Dog({ age: 10 })

dog.getAge()        // ==> 10
dog.setAge(49)      // 哪有狗狗可以活 49 岁的
dog.setAge(-1)      // 哪有 -1 岁的？这不科学
dog.getAge()        // ==> 10

// 但是挡不住这一招必杀
dog.age = NaN       // 囧
{% endhighlight %}

在编程范式一书中，谈论了许多对象继承、接口约束、私有变量保护之类的事情，感兴趣的同学可以找来看，
本文不往下讨论。

## KISSY 中的辅助方法

你可能注意到了，不管是定义类还是继承类，都与 prototype 脱不了关系。所以在说 Base 之前，我们需要
了解一下 KISSY 中为了方便处理原型链、继承等事务所提供的辅助方法。有如下三个方法：

- S.mix
- S.augment
- S.extend

### S.mix

当我们需要往对象上混入（mix）属性或者方法时，可以使用 S.mix：

{% highlight js %}
var Singleton = {
    data: { ... }
}

S.mix(Singleton, {
    get: function(prop) {
        return this.data[prop]
    },
    set: function(prop, value) {
        if (typeof value !== 'undefined') {
            this.data[prop] = value
        }
    }
})
{% endhighlight %}

在此例中，我们实现了一个单体，它有 get、set 方法，同时持有 data 数据。

除了这种简单的混入之外，[S.mix](http://docs.kissyui.com/docs/html/api/seed/kissy/mix.html)
还支持额外的参数，本文不着重讨论，按下不表。

此外，用于方便处理默认与自定义配置项合并的方法，还有 [S.merge](http://docs.kissyui.com/docs/html/api/seed/kissy/merge.html)。
它不会影响第一个参数，会返回一个新的对象。

### S.augment

S.augment 其实就是混入，只不过混入的对象是第一个参数的 prototype 属性，它的用法如下：

{% highlight js %}
var Furry = {
    shave: function() {
        this.shaved = true
    }
}

function Dog(attrs) {
    Pet.call(this, attrs)
}

function Cat(attrs) {
    Pet.call(this, attrs)
}

S.augment(Dog, Furry)
S.augment(Cat, Furry)

var dog = new Dog()
var cat = new Cat()

dog.shave()
cat.shave()
{% endhighlight %}

同样的，[S.augment](http://docs.kissyui.com/docs/html/api/seed/kissy/augment.html)
所支持的用法比这里的示例要强大很多，此处不深入。

### S.extend

S.extend 像 Node.js 里的 util.inherits，就是用于声明两个类的继承关系，与 util.inherits
相比，它更为贴心，还会维护 superclass 和 superclass.constructor。

{% highlight js %}
function Dog(attrs) {
    Dog.superclass.constructor.call(this, attrs)
}

S.extend(Dog, Pet, {
    greeting: function() {
        Dog.superclass.greeting.call(this)
        console.log('Woof!')
    }
})
{% endhighlight %}

详细用法请看 [S.extend 的官方文档](http://docs.kissyui.com/docs/html/api/seed/kissy/extend.html)。

注意 Dog 的构造函数体内，通过 Dog 类上的 superclass 属性，子类不再需要显式写明父类的名称，
只需要直接调 `SubClass.superclass.constructor.call(this, attrs)` 即可。

而在方法内，也可以通过 `SubClass.superclass` 拿到父类上的方法，类似其他编程语言中的 super 之类。

## Base

有了 S.augment，我们可以很方便得扩展类的原型；有了 S.extend，我们可以很方便地继承；那么 KISSY
对属性 getter、setter 有什么好的解决方案么？答案自然是 Base。

顾名思义，Base 是个基础类；而这个类，也是通过 S.augment 等搞定的。

### Attribute

Base 的属性配置来自 Attribute 模块，它提供如下方法：

- addAttr()
- addAttrs()
- hasAttr()
- get()
- getAttrVals()
- set()
- reset()

眼尖的同学们，看到 get() 和 set() 了不？

通过 get() 与 set() 这一层包装，Base 允许类在定义自己时，配置 getter、setter 方法：

{% highlight js %}
function Dog(attrs) {
    Dog.superclass.call(this, attrs)
}

Dog.ATTRS = {
    breed: {
        value: '中华田园犬',
        getter: function(value) {
            return value + '，汪星人'
        },
        setter: function(value) {
            if (S.inArray(['金毛猎犬', '拉布拉多', '萨摩', '中华田园犬'], value)) {
                return value
            }
        }
    }
}
{% endhighlight %}

在此，我们定义了 Dog 的属性 breed，即狗狗的种类，默认值是“中华田园犬”，同时，在设置种类时，
我们限制种类只能是金毛猎犬、拉布拉多、萨摩、或者中华田园犬。而在获取种类时，我们恶意卖萌，给返回值加上
汪星人后缀。

{% highlight js %}
var dog = new Dog()

dog.get('breed')                // ==> 中华田园犬，汪星人
dog.set('breed', '金毛猎犬')
dog.get('breed')                // ==> 金毛猎犬，汪星人
{% endhighlight %}

### 属性变更事件

同时 Base 提供如下事件：

- beforeAttrNameChange
- afterAttrNameChange
- *Change

注意此处的 AttrName 是个示例名称，例如 breed 的相应事件名称是：

- beforeBreedChange
- afterBreedChange

{% highlight js %}
dog.on('afterBreedChange', function(e) {
    console.log('我要从' + e.prevVal + '变成' + e.newVal + '啦！')
})
{% endhighlight %}

### 从 Base 继承

追求性能卓越的偏执狂，可能会想，“那我直接从 Attribute 继承好了呗？反正我只需要属性支持”，但在彻底
了解 Base、Attribute、EventTarget 之前，这是个危险的想法，所以对于普通模块开发者，我的建议
是直接从 Base 继承：

{% highlight js %}
function Dog(attrs) {
    Dog.superclass.call(this, attrs)
}

S.extend(Dog, Base)
{% endhighlight %}

从 Base 继承，我们就有了封装属性、自定义事件的能力。在从 Base 继承的模块中，我们还可以向外部抛出
自定义事件：

{% highlight js %}
S.extend(Dog, Base, {
    bark: function() {
        this.fire('bark', {
            message: 'Woof! I just barked!'
        })
    }
})

var dog = new Dog()

dog.on('bark', function(e) {
    console.log(e.message)      // ==> 'Woof! I just barked!'
})
{% endhighlight %}

## RichBase

终于讲到正主啦，在 Base 一节中我们了解到，可以通过继承 Base 获得属性封装、自定义事件等特性，
在寻常工作中处理业务逻辑，大致是够的了。但是，假如需求非常变态，单线继承变得不够用呢？

所以开讲之前，先来八一八 Base 的不足处：

- 单线继承，每个子类都只有一个父类，继承树类似 DOM 树
- 实例化声明周期无法干预，实例销毁需要自行搞定
- 写法蹩脚过时，看看人家 [arale/class](http://aralejs.org/class/)

于是有了 RichBase，先来看写法：

{% highlight js %}
// Extensions definition
function Man() {
    Man.superclass.constructor.apply(this, arguments)
}

S.extend(Man, Base, {}, {
    ATTRS: {
        sexualOrientation: {
            value: 'female',
            setter: function(value) {
                return value === 'male' ? value : 'female'
            }
        },
        homosexual: {
            getter: function() {
                return this.get('sexualOrientation') === 'male'
            }
        }
    }
})

function Italian() {
    Italian.superclass.constructor.apply(this, argments)
}

S.extend(Italian, Base, {
    greeting: function() {
        console.log('Ciao, mangiato!')
    }
}, {
    ATTRS: {
        city: { value: 'Florence' }
    }
})


// Plugins definition, will be plugged into class dinamically.
function Painter() {
    Painter.superclass.constructor.apply(this, arguments)
}

S.extend(Painter, Base, {
    paint: function() { ... }
}, {
    ATTRS: {
        paints: { value: [] }
    }
})

function Sculptor() {
    Sculptor.superclass.constructor.apply(this, arguments)
}

S.extend(Sculptor, Base, {
    sculpt: function() { ... }
}, {
    ATTRS: {
        sculpts: { value: [] }
    }
})


// Class definition: Italian Renaissance man
var ItalianRenaissanceMan = RichBase.extend([Man, Italian], {
    greeting: function() {
        ItalianRenaissanceMan.superclass.greeting.call(this)
        console.log('I have no idea why I am so versatile!')
    }
}, {
    ATTRS: {
        fullname: { value: '' }
    }
}, 'ItalianRenaissanceMan')

// 达芬奇
var leonardo = new ItalianRenaissanceMan({
    fullname: 'Leonardo di ser Piero da Vinci'
})

leonardo.plug(
    new Painter({ paints: ['Mona Lisa', 'The Last Supper'] })
)

// 米开朗基罗
var michelangelo = new ItalianRenaissanceMan({
    fullname: 'Michelangelo di Lodovico Buonarroti Simoni'
})

michelangelo.plug([
    new Painter({ paints: ['Ceiling of Sistine Chapel'] }),
    new Sculptor({ sculpts: ['Pieta', 'David'] })
])
{% endhighlight %}

这是个比较详细的例子，展示了 RichBase 为应对 Base 的不足，所提供的几大特性：

- 从多个扩展（extension）继承
- 动态插入（plug）
- RichBase.extend 语法糖

### 多继承

RichBase.extend 的第一个参数，是 extensions，即扩展数组，可以指定多个类，RichBase 会帮你维护
好扩展与主类的关系，将扩展类里的 ATTRS 声明混入主类的 ATTRS，将扩展类里的方法混入主类的原型链，等等。

在此例中，我定义了两个类作为扩展类：

- Man
- Italian

即男人、意大利人，[达芬奇](http://en.wikipedia.org/wiki/Leonardo_da_Vinci) 和
[米开朗基罗](http://en.wikipedia.org/wiki/Michelangelo) 都是意大利人，是文艺复兴的中坚力量，
两位都多才多艺，都是画家、雕塑家、工程师，达芬奇还是音乐家、数学家、发明家，米开朗基罗还是诗人。

后来，对这种涉猎广泛，每一行还都做得屌炸天的人，称之为 [文艺复兴男](http://en.wikipedia.org/wiki/Renaissance_Man)。

所以我定义的这个类叫做 Italian Renaissance man，意大利文艺复兴男的意思。定义方法很简单，用
RichBase 继承 Man 与 Italian 即可。

extensions 这个参数是可以省略的，如果你只是想用 RichBase 定义一个类的话，可以这么写：

{% highlight js %}
var MyClass = RichBase.exnted(
    { ...methods... },
    { ...static methods... },
    'MyClass'
)
{% endhighlight %}

### 插件

每个文艺复兴男的技能点都加得不一样，为了简单写，达芬奇是个画家：

{% highlight js %}
leonardo.plug(
    new Painter({ paints: ['Mona Lisa', 'The Last Supper'] })
)
{% endhighlight %}

米开朗基罗是个画家、雕塑家：

{% highlight js %}
michelangelo.plug([
    new Painter({ paints: ['Ceiling of Sistine Chapel'] }),
    new Sculptor({ sculpts: ['Pieta', 'David'] })
])
{% endhighlight %}

其实达芬奇也是雕塑家，只是他的雕塑作品没有画作那么有名。他曾经有过一个巨型战马雕塑的设计，后来因为金主
变故而流产，还因此被米开朗基罗嘲讽了很多次。

言归正传，还可以在实例化的时候传入 plugs 属性：

{% highlight js %}
var leonardo = new ItalianRenaissanceMan({
    plugs: [ ... ]
})
{% endhighlight %}

### listeners

在实例化 RichBase 子类时，还可以传入 listeners 属性，在其中定义事件监听：

{% highlight js %}
var leonardo = new ItalianRenaissanceMan({
    listeners: {
        'paint': function() {
            cosnole.log('I am painting something awesome. It is gonna be legendary!')
        }
    }
})
{% endhighlight %}

RichBase 将在实例化的时候帮你绑定，所以通过参数传入的事件监听，会在你自己拿到实例再绑定的事件监听
之前：

{% highlight js %}
leonardo.on('paint', function() {
    console.log('Dude, too late. The paint is finished already.')
})

// 当 leonardo.fire('paint') 事件时，将在 console 中先后输出：
//
//     I am painting something awesome. It is gonna be legendary!
//     Dude, too late. The paint is finished already.
{% endhighlight %}

### _onSet*

在定义类的时候，还可以给 RichBase.extend 传 `_onSet*` 方法，使得在外部绑定的 `after*Change`
之前，类本身可以先行处理：

{% highlight js %}
var Man = RichBase.extend({
    _onSetSexualOrientation: function(e) {
        console.log('was: ' + e.prevValue + '; now: ' + e.nextValue)
    }
})
{% endhighlight %}

当属性值发生变更时，顺序依次是：

1. ATTRS 里的 setter 方法，即事前正规化
2. 类定义里的 `_onSetSexualOrientation` 方法
3. 实例化之后绑定的 `afterSexualOrientationChange` 事件

