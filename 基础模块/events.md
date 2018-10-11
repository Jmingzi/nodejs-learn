> 关于事件循环，此前分析过2次，也记录过，分别为  
> [js世界里的进程、线程、协程和eventloop](https://github.com/Jmingzi/nodejs-learn/blob/master/%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5/%E8%BF%9B%E7%A8%8B%E5%92%8C%E7%BA%BF%E7%A8%8B.md?1536919745275)    
> [WebWorker与事件循环](../基础概念/web_worker.md)  
> 回过头来再看时，发现还是没能真正理解它，于是就有了第三篇[浏览器环境和Node环境中的事件循环](../基础概念/eventloop.md)  
> 每一次的理解都会让我对它有新的认识。

## 概念

应该称之为事件订阅与触发器，它是一个类`EventEmitter`，nodejs中很多api都具有这个类的属性和方法

例如

```js
server.on('request', () => {})

readStream.on('data', chunk => {})
```

模式都是`EventEmitter`的实例用on去注册一个回调函数，绑定到相应的事件上，`request`，`data`等。

事件由实例的`emit`触发，例如`eventEmitter.emit('data')`

#### 注意点

- emit可传入多个参数，第一个参数为事件名称，后续的参数会被当作回调的参数传入
- 回调内的this就是实例本身，如果用剪头函数则不是，为空的对象
- 事件回调的调用是按注册的顺序同步调用
- on注册的回调可以被调用多次，once注册的只会被调用一次
- 应当为所有的`EventEmitter`实例注册`error`事件

## EventEmitter 类

实例的方法

- on(name, listener)
- once(name, listener)
- prependListener(name, listener)
- prependOnceListener(name, listener)
  ```js
  // 以上方法都是添加事件监听器
  const myEE = new EventEmitter()
  myEE.on('foo', () => console.log('a'))
  myEE.prependListener('foo', () => console.log('b'))
  myEE.emit('foo')
  // b
  // a
  ```

- off(name, listener)
- removeAllListener(name)
  ```js
  // 移除事件监听器
  const callback = (stream) => {
    console.log('已连接')
  }
  server.on('connection', callback)
  server.off('connection', callback)
  ```

- emit(name[, ...args])

- listenerCount(name)   返回正在监听的名为 name 的事件的监听器的数量
- listeners(name)   返回名为 name 的事件的监听器数组的副本

### `newListener`和`removeListener`事件

当实例`on()`监听时，会触发实例的`newListener`事件，同理，当实例`off()`时，会触发`removeListener`事件

```js
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在前面插入一个新的监听器。
    myEmitter.on('event', () => {
      console.log('B')
    })
  }
})
myEmitter.on('event', () => {
  console.log('A')
})
myEmitter.emit('event')
// B
// A
```



