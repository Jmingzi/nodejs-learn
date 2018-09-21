process.on('message', m => {
  console.log('子进程受到消息', m)
})

process.send({ name: 'cjh' })