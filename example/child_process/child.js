const { fork } = require('child_process')
const ls = fork('./child2.js')

ls.on('message', m => {
  console.log('父进程收到消息', m)
})

ls.send({ name: 'ym' })