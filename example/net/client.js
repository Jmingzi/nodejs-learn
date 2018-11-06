const net = require('net')

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

client.setEncoding('utf8')
client.on('data', (chunk) => {
  console.log(chunk)
})

client.on('drain', () => {

})

client.on('end', () => {

})

client.on('error', () => {

})

client.on('ready', () => {
  console.log('客户端ready')
})
