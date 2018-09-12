// const http = require('http')
//
// const server = http.createServer((req, res) => {
//   let body = ''
//
//   req.setEncoding('utf8')
//   req.on('data', chunk => {
//     body += chunk
//   })
//
//   req.on('end', () => {
//     try {
//       const data = JSON.parse(body)
//       // 响应一些信息给用户。
//       res.write(typeof data)
//       res.end()
//     } catch (er) {
//       // json 解析失败。
//       res.statusCode = 400
//       return res.end(`错误: ${er.message}`)
//     }
//   })
// })
//
// server.listen(8088)

const net = require('net');
const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});