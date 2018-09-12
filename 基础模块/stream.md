## 1. 前言
当我尝试去看process.stdin和process.stdout的概念时，发现它是基于stream的，似乎node中很多都是基于此的。

stream是什么呢？是处理系统缓存的一种方式，在node中，处理缓存有2种方式：
- 等所有数据缓存完毕，一次性从缓存中读取
- 采用stream的方式，接受一块数据，就读取一块数据

很明显，在处理较大文件时stream的方式更好。

可读流和可写流都会在一个内部的缓冲器中存储数据，可以分别使用`writable.writableBuffer`或`readable.readableBuffer`来获取

可缓冲的数据的数量取决于传入流构造函数的`highWaterMark`的值，例如`fs.createReadStream(path, { highWaterMark: 12 })`，缓冲区最多为12个字节。

当调用`stream.push(chunk)`时，数据会被缓冲到可读流中。如果消费程序没有调用`stream.read()`，那这些数据会停留在内部中直到被消费。

一旦内部的可读缓冲大小达到了`highWaterMark`，就会暂停读取数据，直到缓冲区中的数据被消费。

当反复的调用`writable.write(chunk)`方法时，数据就会被写入到可写流中，同理。

`stream.pipe()`的作用是为了限制数据缓冲到可读写流中，保证内存不会被占用完全。

因为Duplex和Transform是可读写的，所以他们各自维护着两个相互独立的内部缓冲区用于读写，这样他们可以独立的读写数据。

很多时候，我们不直接使用`stream`，更多的使用场景是在使用其它支持流的类中。

stream的有点还在于处理异步io的友好性，例如：在异步读写文件时的回调地狱中，如果改用stream

```js
// 都是回调
fs.readFile(tmp, (err, data) => {
    fs.writeFile(tmp, err => {
    })
})

// stream
const readStream = fs.createReadStream(path.resolve(__dirname, '../../README.md'))
const writeStream = fs.createWriteStream(path.resolve(__dirname, '../../test.md'))

readStream.on('data', chunk => {
  writeStream.write(chunk)
})

readStream.on('end', () => {
  writeStream.end()
})
```

从上面的例子可以看出，所有的流都是`EventEmitter`的实例，stream流可以理解为生产者消费者，但数据被读取消费时才会继续生产，而不是一次性读取完。

node中部署了Stream接口的如下：
- 文件读写
- http请求的读写
- tcp连接
- 标准的输入输出

## 2. Stream分类

有4种stream类型

- Readable 可读流 `stream.Readable`
- Writable 可写流 `stream.Writable`
- Duplex `stream.Duplex` 双工读写流，例如net.socket()
- Transform `stream.Transform` 转化流，在读写的过程中可以对数据进行修改

每个类分别有自己的属性和方法，上述说的4种node中部署了Stream接口，都是基于这些类的实例。

### 2.1 可读流

可以想象成它是数据的生产者，支持可读流的有
- fs.createReadStream()
- 客户端http响应
- 服务端http请求
- process.stdin
- process.stdout

可读流的2种模式：
- flowing  数据自动获取以及通过`EventEmitter`尽可能快的提供给消费者
- paused 手动获取数据`stream.push(chunk)`及手动读取数据`stream.read()`

所有流默认都是`paused`模式，可以切换到`flowing`模式

- 新增`data`事件处理函数
- 调用`stream.resume()`方法
- 调用`stream.pipe()`方法将数据发送到可写流

从`flowing`模式切换到`paused`模式：

- 没有`pipe`，调用`stream.paused()`
- 有`pipe`，调用`stream.unpipe()`

可读流的3种状态切换：
```js
// 使用paused()
readStream.on('data', chunk => {
  process.stdout.write(chunk)
})
readStream.paused()

// 使用pipe()
console.log(readStream._readableState.flowing) // null
readStream.pipe(process.stdout)
console.log(readStream._readableState.flowing)  // true
readStream.unpipe()
console.log(readStream._readableState.flowing)  // false
```

可读流的属性和方法，还有`EventEmitter`事件，我们可以打印`readStream`

```js
// 可以看到是ReadStream类的实例
ReadStream {
  _readableState: // _readableState是ReadableState的实例
   ReadableState {
     objectMode: false,
     highWaterMark: 65536,
     buffer: BufferList { head: null, tail: null, length: 0 },
     length: 0,
     pipes: null,
     pipesCount: 0,
     flowing: null,
     ended: false,
     endEmitted: false,
     reading: false,
     sync: true,
     needReadable: false,
     emittedReadable: false,
     readableListening: false,
     resumeScheduled: false,
     destroyed: false,
     defaultEncoding: 'utf8',
     awaitDrain: 0,
     readingMore: false,
     decoder: null,
     encoding: null },
  readable: true,   // 表示可读
  domain: null,
  _events: { end: [Function] },     // EventEmitter事件函数
  _eventsCount: 1,      // 事件的数量
  _maxListeners: undefined,
  path: '/Users/yangming/Documents/github/nodejs-learn/README.md',
  fd: null,     // 文件描述符
  flags: 'r',   // 模式
  mode: 438,
  start: undefined,
  end: Infinity,
  autoClose: true,
  pos: undefined,
  bytesRead: 0 }
```

`EventEmitter`事件有
- readable 在流的状态有更新时触发，当到达数据流尾部时，也会触发，此时表示没有数据可读
  ```js
  readStream.on('readable', () => {
    console.log(`readable: ${readStream.read()}`)   // null
  })

  readStream.on('data', chunk => {
    console.log(chunk)  // value
  })
  readStream.push(new Buffer('a'))
  readStream.on('end', () => {
    console.log('end')  // end
  })
  ```
  打印如下，`readStream.read()`始终为null，是因为`readable`和`data`事件的作用一致，但`data`先触发，已经将缓冲区的数据读取出来，那之后在`read`，肯定就没有数据了。
  一般来说，应避免使用`readable`事件和`readable.read()`方法，使用`readable.pipe()`或`data`事件代替。
  ```
  <Buffer 61>
  readable: null
  <Buffer 23>
  <Buffer 20>
  <Buffer 6e>
  <Buffer 6f>
  <Buffer 64>
  <Buffer 65>
  <Buffer 6a>
  <Buffer 73>
  <Buffer 2d>
  <Buffer 6c>
  <Buffer 65>
  <Buffer 61>
  <Buffer 72>
  <Buffer 6e>
  readable: null
  end
  ```
- close
- data 对于非对象模式的流，chunk可以为字符串和buffer。如果是对象模式，chunk可以为null以外的任何数据类型
  ```js
  // 设置编码之后，chunk就是字符串；否则就是buffer
  readStream.setEncoding('utf-8')
  readStream.on('data', chunk => {
    console.log(chunk)
  })
  readStream.on('end', () => {
    console.log('end')
  })
  ```
- end
- error

可读流的方法
- pipe(destination[, options])
  - destination 为数据写入的目标，是Writable的实例
  - options { end: Boolean }

  例如数据流的管道操作
  ```js
  const r = fs.createReadStream('file.txt')
  const z = zlib.createGzip()
  const w = fs.createWriteStream('file.txt.gz')
  r.pipe(z).pipe(w)
  ```

- paused()
- isPaused()
- resume()  表示继续开始消费数据
  ```
  new stream.Readable()
  .resume()
  .on('end', () => {})
  ```
  他们之间的相互作用
    ```js
    const readable = new stream.Readable()

    readable.isPaused() // === false
    readable.pause()
    readable.isPaused() // === true
    readable.resume()
    readable.isPaused() // === false
    ```
----

### 2.2 可写流

同理，可写流可以想象成数据的消费者。

可写流的`EventEmitter`事件
- pipe 监听可读流pipe事件触发时触发
- drain 在`writable.write(chunk)`返回false时，会触发
- unpipe
- error
- close
- finish

可写流的方法
- writable.write()
- writable.end()
- writable.destroy()
- writable.setDefaultEncoding()

例如创建http服务器
```js
const http = require('http')

const server = http.createServer((req, res) => {
  // request为客户端请求对象 http.IncomingMessagede 实例
  // response为服务端响应数据 http.ServerResponse 实例
  let body = ''

  // req为可读流，可以设置编码
  // res为可写流
  req.setEncoding('utf8')
  // 转换为flowing模式
  req.on('data', chunk => {
    body += chunk // 这里的chunk为字符串，不存在自动转码的问题
  })

  // 可读流的end事件
  req.on('end', () => {
    try {
      const data = JSON.parse(body)
      // writable.write()
      res.write(typeof data)
      // writable.end()
      res.end()
    } catch (er) {
      res.statusCode = 400
      return res.end(`错误: ${er.message}`)
    }
  })
})

server.listen(8088)

// $ curl localhost:8088 -d "{}"
// object
// $ curl localhost:8088 -d "\"foo\""
// string
// $ curl localhost:8088 -d "not json"
// 错误: Unexpected token o in JSON at position 1
```

### 2.3 读写流

读写流为`stream.Duplex`和`stream.Transform`

读写流内部都有自己的实现方法
- writable._write(chunk, encoding, callback)
- reabable._read(size)

但是Transform有额外的转换方法，为了将输入和输出的数据关联起来

- Transform._transform(chunk, encoding, callback)
- Transform._flush(callback)

对于可读写流在实际例子中的作用与实现还有待验证。

> node中的2个核心Stream和EventEmitter，几乎所有的类都继承了它们。

参考：

- [理解 Node.js Stream 模块](https://zhangxiang958.github.io/2018/09/01/%E7%90%86%E8%A7%A3%20Node.js%20Stream%20%E6%A8%A1%E5%9D%97/#more)
- [Stream](http://nodejs.cn/api/stream.html#stream_stream)
- [模块/stream.md](https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/stream.md)
- [Node.js 中流操作实践](https://juejin.im/post/5b950c4ae51d450e7f52c634?utm_source=gold_browser_extension)