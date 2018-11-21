const util = require('util')
const child = require('child_process')

const execFile = util.promisify(child.execFile)
const exec = util.promisify(child.exec)

// execFile(`${__dirname}/test.js`).then((stdout, stderr) => {
//   console.log('then', stdout)
// }).catch(err => {
//   console.log(err)
// })

exec('ls', (err, data) => {
  console.log(data)
})
