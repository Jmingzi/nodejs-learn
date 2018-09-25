## 概述
web Worker会创建线程，和浏览器运行的的其他线程一样，可以与主线程进行数据传输而不影响主线程的运行

在worker运行的脚本内，全局对象不是`window`而是`DedicatedWorkerGlobalScope`，所以我们可以使用全局对象的属性和在

## worker的限制

我们可以在控制台查看worker全局对象的属性发现：

跟`ServiceWorker`对象的属性很相似，简要列出几个：

```js
self.caches // 缓存api
self.close()    // 关闭线程
self.location   // 主线程的location
self.postMessage()  // 发送消息
slef.Blob
slef.importScripts()    // 下载js文件，同步执行
self.onmessage  // 事件接收
```

## worker的分类

- 专用worker `Worker`，全局对象`DedicatedWorkerGlobalScope`
- 共享worker `SharedWorker`，全局对象`SharedWorkerGlobalScope`
- 服务worker `ServiceWorker`

## worker中数据的接收与发送

> 在主页面与 worker 之间传递的数据是通过拷贝，而不是共享来完成的。传递给 worker 的对象需要经过序列化，接下来在另一端还需要反序列化。页面与 worker 不会共享同一个实例，最终的结果就是在每次通信结束时生成了数据的一个副本。大部分浏览器使用结构化拷贝来实现该特性。

什么是结构化拷贝？

> 结构化克隆算法是由HTML5规范定义的用于复制复杂JavaScript对象的算法

支持的类型js类型

对象类型|注意
----|-----
基础类型|
Array|
Object|
RegExp|lastIndex 字段不会被保留。
Blob|
File|
FileList|
ArrayBuffer|
ImageData|
Map|
Set|

不支持的类型

- `Error`
- `Function`
- `HTMLElement`
- 原形链上的属性也不会被追踪以及复制

详细请见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/The_structured_clone_algorithm)

例子来查看下

```js
// 1. 传递函数
const worker = new Worker('./worker.js')
worker.postMessage(() => {})
// Uncaught DOMException: Failed to execute 'postMessage' on 'Worker': ()=>{} could not be cloned.

// 2. 传递原型链
const worker = new Worker('./worker.js')
const Person = function () {
  this.name = 'ym'
}
Person.prototype.age = 18
worker.postMessage(new Person())
// {
//    name: 'ym',
//    __proto__: Object
// }
```

