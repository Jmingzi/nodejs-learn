const http = require('http')

const server = http.createServer((req, res) => {
  let body = ''

  req.setEncoding('utf8')
  req.on('data', chunk => {
    body += chunk
  })

  req.on('end', () => {
    try {
      const data = JSON.parse(body)
      // 响应一些信息给用户。
      res.write(typeof data)
      res.end()
    } catch (er) {
      // json 解析失败。
      res.statusCode = 400
      return res.end(`错误: ${er.message}`)
    }
  })
})

server.listen(8088)