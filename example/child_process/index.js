const path = require('path')
const { exec, execFile, fork } = require('child_process')

// const subProcess = exec('sh index.js', {
//   shell: '/bin/sh'
// }, (error, stdout, stderr) => {
//    if (error) {
//      console.log(error)
//      console.log(error.code)
//      console.log(error.signal)
//    }
//   console.log('stdout: ' + stdout)
//   console.log('stderr: ' + stderr)
// })
//
// subProcess.on('SIGTERM', (code) => {
//   console.log('code', code)
// })

// const subProcess = execFile('./.bin', {
//   encoding: 'utf8'
// })

const subProcess = fork('./child.js', {
  silent: true
})

subProcess.stdout.setEncoding('utf8')
subProcess.stdout.on('data', chunk => {
  console.log('chunk data: ', chunk)
})