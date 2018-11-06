> 本文相关[curl工具](../基础概念/curl.md)、[套接字](../基础概念/socket.md)、[IPC](../基础概念/ipc.md)

## 前言

net模块主要由`net.Server类`，`net.Socket类`和net上的几个方法组成

`net.Server`用于创建 TCP 或 IPC server，`net.Socket`是TCP 或 UNIX Socket 的抽象（在Windows上使用命名管道，而UNIX使用域套接字）。

> 我们在讲IPC通信机制时讲过匿名管道pipe，其中还有具名管道`FIFO`，具体可查看相关章节

## 实例

服务端用net.Server类创建服务后，客户端利用`createConnection()`进行连接。

server.js

```js
server.on('connection', socket => {
  socket.setEncoding('utf8')
  socket.on('data', chunk => {
    console.log('服务端收到消息', chunk)
  })

  console.log('有新的客户端连接')
  socket.write('reply from 服务端')
  socket.pipe(socket)
})

server.on('listening', () => {
  console.log('绑定了listening')
})

server.listen(8124, () => {
  console.log(server.address())
  console.log(`server is start on : ${server.address().port}`)
})
```

client.js
```js
const client = net.createConnection({ port: 8124 }, () => {
  console.log('客户端创建连接')
  client.write('客户端的消息 hello ym')
})

client.on('close', () => {
  console.log('客户端连接关闭')
})

client.on('connect', () => {
  console.log('客户端连接成功')
})
```

