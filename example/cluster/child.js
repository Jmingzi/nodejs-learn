// process.on('message', (msg, server) => {
//   // console.log(msg, socket)
//   if (server) {
//     server.on('connection', socket => {
//       setTimeout(() => {
//         socket.end(`${msg} 子进程：${process.pid}`)
//       }, 100)
//     })
//   }
// })

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
