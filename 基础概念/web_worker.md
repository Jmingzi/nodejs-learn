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

## Worker构造函数

```js
new Worker(aURL[, options])
```

aURL为字符串，必须为同源下的可执行js文件或`Data URL`，什么是`Data URL`？

> Data URLs 由四个部分组成：前缀(data:)、指示数据类型的MIME类型、如果非文本则为可选的base64标记、数据本身：

```js
data:[<mediatype>][;base64],<data>
```

完整示例：

```js
const sub = function(e) {
    console.log(`i am from data urls, ${e.data}`)
}
const url = encodeURIComponent(`onmessage=${sub.toString()}`)

const worker = new Worker(`data:text/javascript;charset=US-ASCII,${url}`)
worker.postMessage('hi')
// 输出 i am from data urls, hi
```

我们可以利用`URL.createObjectURL`来创建Data urls，它接受一个Blob对象或者File对象

```js
const sub = function(e) {
    console.log(`i am from data urls, ${e.data}`)
}
const url = `onmessage=${sub.toString()}`
const blob = new Blob([url], { type: 'text/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
worker.postMessage('hi')
URL.revokeObjectURL(url) // 释放已经存在的 URL 对象
// 输出 i am from data urls, hi
```

详细请见[data_URIs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs)、[Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

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

举几个例子来实践下

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

