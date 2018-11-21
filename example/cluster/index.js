const net = require('net')
const { fork } = require('child_process')
const path = require('path')

const server = net.createServer()

// (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   res.end('hello world')
// }

const work = []

for(let i = 0; i < 4; i++) {
  work.push(fork(path.resolve(__dirname, './child.js')))
}

// server.on('connection', socket => {
//   console.log('connection')
//   work[0].send('http socket0', socket)
//   work[2].send('http socket2', socket)
//   work[1].send('http socket1', socket)
//   work[3].send('http socket3', socket)
// })

server.listen(8888, () => {
  console.log('server is start')
  work[0].send('http server0', server)
  work[2].send('http server2', server)
  work[1].send('http server1', server)
  work[3].send('http server3', server)

  server.close()
})
