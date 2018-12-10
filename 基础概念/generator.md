`Generator`应该被称为迭代生成器，涉及的概念：

- 迭代器 [Symbol.iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
- [yield](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield)和[yield*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*)

Generator函数的作用是
- 产生迭代器对象
- 维护迭代器的状态

例如：
```js
function* test() {
    yield 1
    yield* [1, 2]
}
const result = test()
```

test为Generator函数，result为返回的**迭代器对象**，yield为**执行暂停**关键词。

在`ES6`中，默认内置迭代器对象的类型有String，Array，TypedArray，Map 和 Set 都内置可迭代对象，因为它们的原型对象都有一个 Symbol.iterator 方法。：

```js
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1
    yield 2
    yield 3
}

for (let k of myIterable) {
    console.log(k)  // 1, 2, 3
}
```

`yield*`可以暂停执行另一个拥有迭代器的对象，例如：

```
function* test() {
    yield 1
}

function* test2() {
    yield* test()
}
const result = test2()
result.next()
// {value: 1, done: false}
```

