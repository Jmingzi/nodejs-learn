// const net = require('net')
const http = require('http')

for(let i = 0; i < 5; i++) {
  // net.createConnection(8888, 'localhost').on('data', data => {
  //   console.log(data.toString())
  // })
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
