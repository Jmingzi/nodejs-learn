const path = require('path')
const fs = require('fs')
// const stream = require('stream')

const readStream = fs.createReadStream(path.resolve(__dirname, '../../README.md'), { highWaterMark: 1 })
// const writeStream = fs.createWriteStream(path.resolve(__dirname, '../../test.md'))
// const readable = new stream.Readable()
// readStream.on('readable', () => {
//   console.log(`readable: ${readStream.read()}`)
// })

readStream.setEncoding('utf-8')
readStream.on('data', chunk => {
  console.log(chunk)
})
readStream.on('end', () => {
  console.log('end')
})
readStream.pause()
console.log(readStream.isPaused())

// const { PassThrough, Writable } = require('stream')
// const pass = new PassThrough()
// const writable = new Writable()
//
// pass.pipe(writable)
// pass.unpipe(writable)
// // readableFlowing 现在为 false。
//
// pass.on('data', (chunk) => {
//   console.log(chunk.toString())
//   console.log(pass._readableState.flowing)
//   pass.paused()
// })
// pass.write('ok') // 不会触发 'data' 事件。
// pass.resume() // 必须调用它才会触发 'data' 事件。
