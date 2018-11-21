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
