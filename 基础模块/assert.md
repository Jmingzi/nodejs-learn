> 本章延伸的[js中的等式比较]()

## 概述

什么是断言？断言就是用来捕获我们的条件语句的异常，很多时候，我们认为这个判断不会或者不可能出现错误，就可以用断言来处理万一发生异常了的后续。

node中的assert用于测试不变式，这里我们只学习说明`strict`模式，即

> 在v9.9.0中，新增的strict模式，所有的方法都会使用严格函数模式的等式。 所以 assert.deepEqual() 会等同于 assert.deepStrictEqual()。

```js
const assert = require('assert').strict
```

在日常的使用中，我们用它来处理我们认知上正确的东西，因为方法都不会返回true或false，所以用法上就不是`if (assert.ok(val))`这样。如果出错之后，就会中断当前进程的执行，抛出异常。

## 方法

- assert.deepStrictEqual 是否深度相等
- assert.notDeepStrictEqual 是否不深度相等
- assert.strictEqual 是否相等
- assert.notStrictEqual
- assert.ok 是否为真值
- assert.rejects 是否被reject
- assert.doesNotReject
- assert.throws
- assert.doesNotThrow

assert.AssertionError 类是`Error`的子类，表明断言的失败。 assert 模块抛出的所有错误都是 AssertionError 类的实例。

## deepStrictEqual

采用`Object.is`方法做的比较，通过[js中的等式比较](https://github.com/Jmingzi/nodejs-learn/blob/master/%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5/js%E4%B8%AD%E7%9A%84%E7%AD%89%E5%BC%8F%E6%AF%94%E8%BE%83.md)我们知道，是`同值`比较

还有其它特性，只比较可枚举属性。

这里有遇到一个坑，在做这些测试的时候一定要注意node的版本，在v8.11.4的版本里，assert的很多属性都是和文档里相反的，可以看到每个属性的版本历史。

在v8.11.4里，deepStrictEqual就是用的`===`方法而不是`同值`，切成v10.8.0之后，就完全符合了。

```js
assert.deepStrictEqual(NaN, NaN) // 通过
assert.deepStrictEqual(+0, -0) // 不通过
```

## strictEqual

它与`deepStrictEqual`的区别在于，`strictEqual`不会遍历去比较，有点类似`===`，但它的算法采用`同值`，而`deepStrictEqual`用作遍历比较，不会比较2个对象的引用是否一致，它的作用在于比较每一项的值是否一致，例子说明

```js
const pro = {a: 1}
const obj1 = Object.create(pro)
const obj2 = Object.create(pro)

assert.deepStrictEqual(obj1, obj2) // 通过
assert.strictEqual(obj1, obj2) // 不通过，因为引用不一样
```

## rejects

参数 

- block 
- error
- message

如果block为promise，等待promise完成；如果为一个函数，则立即调用该函数，且返回Promise，检查promise是否被reject

```js
assert.rejects(
  () => {
    throw '错误'
  }
).then(() => {
  // ...
}).catch(err => {
  console.log(err)  // 错误
})
```
