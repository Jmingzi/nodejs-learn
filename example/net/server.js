const net = require('net')
const server = new net.Server()

server.on('close', err => {
  console.log(err)
})

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
