child_process 模块可以衍生出子进程，我们可以用子进程来做一些事情从而不影响主进程。

## 创建进程的几种方法

### 异步方法

- .exec()
- .execFile()
- .fork()
- .spawn()

前三种都是通过`.spawn()`实现的，调用以上方法后都会返回`ChildProcess`的实例，这些实例实现了 Node.js `EventEmitter` API，允许父进程注册监听器函数，在子进程生命周期期间，当特定的事件发生时会调用这些函数。

> child_process.exec() 和 child_process.execFile() 函数可以额外指定一个可选的 callback 函数，当子进程结束时会被调用。

### child_process.exec(command[, options][, callback])

`exec`会创建`shell`去执行命令，执行完成后将stdout、stderr作为参数传入回调方法。

参数解析

- command `<string>` 参数使用空格分隔
- options
    - cwd `<string>` 子进程的当前工作路径
    - env `<object>` 环境变量键值对
    - encoding `'utf8'`
    - shell `<string>` 执行的命令，默认为`/bin/sh`
    - killSignal `<string>` 默认为`SIGTERM`
- callback 进程被终止时调用
    - error `Error`
    - stdout
    - stderr

```js
const { exec } = require('child_process')
// 列出当前目录下的文件或目录
const subProcess = exec('ls', (error, stdout, stderr) => {
   if (error) {
     console.log(error.code)    // 子进程退出码exitCode
     console.log(error.signal)  // 退出信号
   }
  console.log('stdout: ' + stdout)
  console.log('stderr: ' + typeof stderr)
})
// 在process那章中的信号事件列表，监听 SIGTERM 和 SIGINT可以阻止默认的行为
subProcess.on('SIGTERM', () => {
  console.log('signal')
})
```

### child_process.execFile(file[, args][, options][, callback])

多了一个参数`args` `<string[]>` 是一个数组，元素都是字符串

在mac上，一般使用`execFile`来代替`exec`，因为他不需要创建`shell`来运行命令

在windows上是不能直接使用这个方法的，必须使用`exec`或`spawn`来代替，并将`.bat`或`.cmd`作为参数传入

```js
// 以buffer的形式输出npm的版本号
const subProcess = execFile('npm', ['-v'], {
  encoding: 'buffer'
})

subProcess.stdout.on('data', chunk => {
  console.log(chunk)    // <Buffer 36 2e 34 2e 31 0a>
})

// String.fromCodePoint(0x36) "6"
```

例如可以手动执行shell文件或nodejs文件

创建.bin文件，声明执行脚本`#!/usr/bin/env node`
```sh
#!/usr/bin/env node

console.log('this is node env')
```

`execFile`options参数没有shell选项
```
const subProcess = execFile('./.bin', {
  encoding: 'utf8'
}, err => {
  err && console.log(err)
})
```

注意，我们会发现没有权限执行，献给文件赋上可执行权限

```
chomd +x ./.bin
```

### ChildProcess类

ChildProcess的实例用来表示当前创建的子进程，通过以上的方法创建

##### 1. subprocess.connected

表明是否仍可以从一个子进程发送和接收消息，调用`subprocess.connected()`设为false，不再发送或接受消息

##### 2. subprocess.killed

表明该子进程是否已成功接收到 `subprocess.kill()` 的信号。 该属性不代表子进程是否已被终止

##### 3. subprocess.stdio


