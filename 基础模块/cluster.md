## cluster
被叫做集群，什么是集群？与分布式的区别？[戳此处](../基础概念/集群.md)

在了解了集群的概念后，未学习cluster之前，利用process模块实现集群怎样做？

思路：在多个子进程上启动服务监听同一个端口，或者在主进程上起服务，将监听的连接分发给多个子进程

> 当我尝试使用IPC通道传递http服务器句柄时，抛出了异常`ERR_INVALID_HANDLE_TYPE`
> An attempt was made to send an unsupported "handle" over an IPC communication channel to a child process. See subprocess.send() and process.send() for more information.

也就是说IPC只支持`net.socket`和`net.Server`传递

> 那在未使用`cluster`模块时想实现[http服务集群](#http服务集群)怎么做？

#### 实例1 主进程共享socket

```js
// main.js
const server = http.createServer()

server.on('connection', socket => {
  console.log('connection')
  for(let i = 0; i < 4; i++) {
    fork(path.resolve(__dirname, './child.js')).send('socket', socket)
  }
})

// child.js
process.on('message', (msg, socket) => {
  // console.log(msg, socket)
  if (socket) {
    setTimeout(() => {
      socket.end(`${msg} 子进程：${process.pid}`)
    }, 100)
  }
})
```

然后模拟客户端发起多次请求
```js
const net = require('net')

for(let i = 0; i < 5; i++) {
  net.createConnection(8888, 'localhost').on('data', data => {
    console.log(data.toString())
  })
}
// http socket0 子进程：28218
// http socket0 子进程：28218
// http socket1 子进程：28219
// http socket2 子进程：28220
// http socket3 子进程：28221
```

#### 实例2 子进程监听同一个端口

这种模式下，多个进程监听相同端口，当网络请求到来时，会进行抢占式调度，只有一个进程会抢到连接然后进行服务。

```js
// main.js
server.listen(8888, () => {
  console.log('server is start')
  work[0].send('http server0', server)
  work[2].send('http server2', server)
  work[1].send('http server1', server)
  work[3].send('http server3', server)

  server.close()
})

// child.js
process.on('message', (msg, server) => {
  // console.log(msg, socket)
  if (server) {
    server.on('connection', socket => {
      setTimeout(() => {
        socket.end(`${msg} 子进程：${process.pid}`)
      }, 100)
    })
  }
})
```

## http服务集群

我们通过在子进程中响应http请求即可实现http服务集群

```js
// child.js

const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Request handled by worker-' + process.pid)
})

process.on('message', (msg, socketServer) => {
  if (socketServer) {
    socketServer.on('connection', socket => {
      server.emit('connection', socket)
    })
  }
})
```

现在我们可以直接使用浏览器访问
```
http://localhost:8888
```

也可以改造客户端批量访问
```js
// client.js

for(let i = 0; i < 5; i++) {
  http.get('http://localhost:8888', res => {
    res.setEncoding('utf8')
    res.on('data', data => {
      console.log(data)
    })
    res.on('end', () => {
      console.log('end')
    })
  })
}
// Request handled by worker-28363
// end
// Request handled by worker-28361
// end
// Request handled by worker-28360
// end
// Request handled by worker-28363
// end
// Request handled by worker-28362
// end
```

## 使用cluster创建集群

在`cluster`中，被称为`主进程`与`工作进程`，组成如下

- Worker 类
    Worker对象包含了关于工作进程的所有public信息和方法。
    在一个主进程里，可以使用cluster.workers来获取Worker对象。
    在一个工作进程里，可以使用cluster.worker来获取Worker对象。
- `fork`
- `exit`
- `listening`
- `message`
- `online`
- `.fork()`
- `.isMaster`
- `.isWorker`
- `.worker`
- `.workers`

实例

```js
const cluster = require('cluster')

if (cluster.isMaster) {
  const cpus = require('os').cpus().length

  for(let i = 0; i < cpus; i ++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出 ${code} ${signal}`)
  })

  console.log(`workers ${cluster.workers}`)
} else {
  const http = require('http')

  const server = http.createServer()
  server.on('request', (req, res) => {
    res.end('hello world')
  }).listen(8888)

  console.log(`工作进程启动 ${process.pid}`)
}
// 工作进程启动 28511
// 工作进程启动 28513
// 工作进程启动 28514
// 工作进程启动 28512
```

在mac上，使用活动监视器来查看对应pid进程，然后关闭

```
工作进程 28512 已退出 null SIGTERM
```

关于[信号常量](http://nodejs.cn/api/os.html#os_signal_constants)

参考：[试玩NodeJS多进程](https://blog.csdn.net/hongchh/article/details/79898816)
