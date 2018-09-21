> 以下均未考虑windows

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
```js
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

### child_process.fork(modulePath[, args][, options])
`child_process.fork()` 方法是 `child_process.spawn()` 的一个特殊情况，专门用于衍生新的 Node.js 进程。 跟 `child_process.spawn()` 一样返回一个 ChildProcess 对象。 返回的 ChildProcess 会有一个额外的内置的通信通道，它允许消息在父进程和子进程之间来回传递。 详见 subprocess.send()。

- modulePath `<string>` 子进程运行的文件路径
- args `<array>`
- options
    - execPath 用来创建子进程的可执行文件，默认是`/usr/local/bin/node`，因为默认是用的父进程的`execPath`
    - execArgv 要传给执行路径的字符参数列表，默认为`process.execArgv`
    - silent 默认是false，即子进程的stdio从父进程继承。如果是true，则直接pipe向子进程的child.stdin、child.stdout等。
    - stdio 如果声明了stdio，则会覆盖silent选项的设置。

下面用例子来说明以上参数

```js
// 例子1，execPath
const subProcess = fork('./.bin', {
  execPath: '/bin/sh',
  silent: true
})

subProcess.stdout.on('data', chunk => {
  console.log(chunk)
})
```

```js
// 例子2，silent
const subProcess = fork('./child.js', {
  // 表示stdin、 stdout 和 stderr 会被导流到父进程中
  silent: true
})
// 在父进程中定义的标准输出
subProcess.stdout.setEncoding('utf8')
subProcess.stdout.on('data', chunk => {
  console.log('chunk data: ', chunk)
})

// console.log('chunk data: this is child')
// 如果设置为silent: false，那么子进程中将不存在subProcess.stdout，输出将在子进程中完成
```

`stdio`参数在`spawn`方法时说明

### child_process.spawn(command[, args][, options])

上面的三个方法都是基于此的，所以我们可以用这个方法为所欲为了

- command
- args `<Array>`
- options
    - argv0
    - stdio
    - detached
    - shell `<boolean>` | `<string>` ，默认为false，表示没有shell。设置为true或可执行路径，表示在shell上运行。

#### 1. options.stdio

用于配置子进程与父进程之间建立的管道，取值如下：

- 'pipe' - 等同于 ['pipe', 'pipe', 'pipe'] （默认）
-  'ignore' - 等同于 ['ignore', 'ignore', 'ignore']
-  'inherit' - 等同于 [process.stdin, process.stdout, process.stderr] 或 [0,1,2]

默认情况下，子进程的 stdin、 stdout 和 stderr 会重定向到 ChildProcess 对象上相应的 subprocess.stdin、 subprocess.stdout 和 subprocess.stderr 流。 这等同于将 options.stdio 设为 ['pipe', 'pipe', 'pipe']。

例子1，验证`stdio: 'inherit'`

依然是`.bin`文件
```sh
echo 'sh env from child'
```

child.js内容
```js
const ls = spawn('sh', ['./.bin'], {
  stdio: 'inherit'
})
// 此时管道没有被指向到父进程，所以ls.stdout为空
// 输出'sh env from child'
```

例子2，验证`stdio: 'pipe'` 其实也就是默认的

```js
const ls = spawn('sh', ['./.bin'], {
  stdio: 'inherit'
})

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})
// 输出 'stdout: sh env from child'
```

### 建立IPC

子进程通过`fork()`或`exec()`创建时，父子进程之间会建立IPC通道，此时可以利用`subProcess.send`发送消息到子进程，当子进程是`node`进程时，可以用`'message'`事件接受消息

#### subProcess.send(message[, sendHandle[, options]][, callback])

- message `<object>` 键值对形式的消息，例如`{ name: 'ym' }`
- sendHandle `<Handle>` 一般用来发送创建server对象
- options `<Object>`
- callback `<Function>`

返回`<boolean>`

例子：

```js
// parent.js
const { fork } = require('child_process')
const ls = fork('./child2.js')

ls.on('message', m => {
  console.log('父进程收到消息', m)
})

ls.send({ name: 'ym' })
```
```js
// child.js
process.on('message', m => {
  console.log('子进程受到消息', m)
})

process.send({ name: 'cjh' })
```
输出
```
子进程受到消息 { name: 'ym' }
父进程收到消息 { name: 'cjh' }
```

-----

### 同步方法

大部分时候，子进程的创建是异步的。也就是说，它不会阻塞当前的事件循环，这对于性能的提升很有帮助。

当然，有的时候，同步的方式会更方便（阻塞事件循环），比如通过子进程的方式来执行shell脚本时。

- spawnSync()
- execSync()
- execFileSync()
