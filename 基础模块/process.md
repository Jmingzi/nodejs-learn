> 基础知识，[进程和线程](../基础概念/进程和线程.md)

## 1.概念
node是基于v8的，也就注定和浏览器类似，单线程的。但是node的作用大多作为服务器，单线程的情况下一旦出现异常，整个程序就挂掉了，所以为了保证程序的稳定性，多进程的使用也就很有必要了。

node中的进程有process和child_process

## 2.process

process是全局对象的一个属性，作用一般用来获取node进程相关的信息，而不是用来新建进程。

### 2.1 process的属性

#### 2.1.1 命令行参数

- process.argv，返回一个数组，参数含义如下
    - 为当前node版本的路径与`process.execPath`一致
    - 当前js文件的路径
    - 其余参数

```js
console.log('argv: ', process.argv)
console.log('argv[0]:', process.argv[0])
console.log('argv0:', process.argv0)
console.log('execPath:', process.execPath)

➜  process git:(master) ✗ node index.js a=1 b=2
argv:  [ '/Users/yangming/.nvm/versions/node/v8.11.4/bin/node',
  '/Users/yangming/Documents/github/nodejs-learn/example/process/index.js',
  'a=1',
  'b=2' ]
argv[0]: /Users/yangming/.nvm/versions/node/v8.11.4/bin/node
argv0: node
execPath: /Users/yangming/.nvm/versions/node/v8.11.4/bin/node
```

- process.argv0，跟`argv[0]`是不一样的概念

```
 bash -c 'exec -a customArgv0 node'
 > process.argv0
 'customArgv0'
```

- process.execArgv

返回node启动时内部定义的参数选项，参数选项的具体可以`node -h`查看

这些选项在process.argv属性返回的数组中不会出现，并且这些选项中不会包括Node.js的可执行脚本名称或者任何在脚本名称后面出现的选项。 这些选项在创建子进程时是有用的，因为他们包含了与父进程一样的执行环境信息。

#### 2.1.2 标准的输入输出

- process.stdin 表示标准的输入字符，何为标准？我想是stream的形式就称为标准

它的返回连接到`stdin (fd 0)`的流，它是一个Duplex流，除非 `fd 0`指向一个文件，在这种情况下它是一个`Readable`流。

> 关于fd表示文件描述符，当我们`fs.open`一个文件时，就会返回fd。详情请戳[文件描述符](./fd.md)

```js
process.stdin.setEncoding('utf8')

// 网上全是这样的demo，我们在stream那章学习过，要避免使用`readable`事件和`readable.read()`方法
// process.stdin.on('readable', () => {
//   const chunk = process.stdin.read()
//   if (chunk !== null) {
//     process.stdout.write(`data: ${chunk}`)
//   }
// })
process.stdin.on('data', chunk => {
  process.stdout.write(`data: ${chunk}`)
})

process.stdin.on('end', () => {
  process.stdout.write('end')
})
```

- process.stdout 同理，它的返回连接到`fd 1`的流，除非 fd 1 指向一个文件，在这种情况下它是一个可写流。

```js
fs.createReadStream('index.js').pipe(process.stdout)
```

- process.stderr 文件描述符为2，除非 fd 2指向一个文件，在这种情况下它是一个可写流

process.stdout and process.stderr 与 Node.js 中其他 streams 在重要的方面有不同:

- 他们分别使用内部的 console.log() 和 console.error()。

- 他们不能被关闭 (调用end()将会抛出异常)。

- 他们永远不会触发 'finish' 事件。

#### 2.1.3 环境变量

就和普通的对象一样
```
process.env

{
  PWD: '/Users/yangming/Documents/github/nodejs-learn/example/process',
  OLDPWD: '/Users/yangming/Documents/github/nodejs-learn/example',
  rvm_prefix: '/Users/yangming',
  rvm_path: '/Users/yangming/.rvm',
  rvm_bin_path: '/Users/yangming/.rvm/bin',
  _system_type: 'Darwin',
  _system_name: 'OSX',
  _system_version: '10.13',
  _system_arch: 'x86_64',
}
```

新增`process.env.test`，删除`delete process.env.test`

----

### 2.2 process的方法

#### 2.2.1 process.kill(pid, signal)

process.kill()方法将signal发送给pid标识的进程，signal默认为`'SIGTERM'`

signal event如下
```
SIGHUP 默认的绑定行为是结束Node.js，但是一旦给它绑定了新的监听器，默认行为会被移除。
SIGINT `<Ctrl>+C`触发
SIGTERM 在非windows平台绑定了默认的监听器，这样进程以代码128 + signal number结束之前，可以重置终端模式。  如果这两个事件任意一个绑定了新的监听器，原有默认的行为会被移除(Node.js不会结束)。
```
详细请戳[信号事件](http://nodejs.cn/api/process.html#process_signal_events)

#### 2.2.2 process.exit([code])

以结束状态码code指示Node.js同步终止进程。 如果code未提供，此exit方法要么使用'success' 状态码 0，要么使用process.exitCode属性值，前提是此属性已被设置。 Node.js在所有'exit'事件监听器都被调用了以后，才会终止进程。

**注意点**

应该避免显示的调用`process.exit()`，因为会丢弃异步操作，进程一般会自然结束，我们只需要设置`process.exitCode`来告诉系统以哪种code结束进程即可。

进程的退出码

- 0，正常退出
- 1，发生未捕获错误
- 5，V8执行错误
- 8，不正确的参数
- 128 + 信号值，如果Node接受到退出信号（比如SIGKILL或SIGHUP），它的退出码就是128加上信号值。由于128的二进制形式是10000000, 所以退出码的后七位就是信号值。

#### 2.2.3 process.chdir(directory)

变更Node.js进程的当前工作目录

当前工作路径即`process.env.PWD`或`process.cwd()`得到

```js
console.log(`Starting directory: ${process.cwd()}`)
try {
  process.chdir('../stream')
  console.log(`New directory: ${process.cwd()}`)
} catch (err) {
  console.error(`chdir: ${err}`)
}
```

#### 2.2.4 process.emitWarning(warning[, type[, code]][, ctor])

用于发出定制的或应用特定的进程警告，参数：

- warning <string> | <Error> 发出的警告。
- type <string> 如果 warning 是String, type 是警告类型的名字。 默认值: Warning。
- code <string> 当前警告的唯一标识符。
- ctor <Function> 如果warning是String，ctor是可选的function，用于限制生成的堆栈信息。默认process.emitWarning

warning可以理解为是一个Error对象，包含`name` `message` `code` `stack`

----

### 2.3 process的事件

#### 2.3.1 'exit'

'exit' 事件监听器的回调函数只允许同步操作，因为异步操作会被丢弃，因为非本次事件循环的事件都不在执行

```js
process.on('exit', code => {
  setTimeout(() => {
    console.log('该函数不会被执行')
  }, 0)
})
```

#### 2.3.2 'warning'

任何时候Node.js发出进程告警，都会触发'warning'事件

```js
process.on('warning', (warning) => {
  console.warn(warning.name);    // 打印告警名称
  console.warn(warning.message); // 打印告警信息
  console.warn(warning.stack);   // 打印堆栈信息
});
```

可以配合`process.emitWarning()`使用

----

### 2.4 IPC相关

- process.connected
- process.channel
- process.disconnect()
- 'message' 事件
- 'disconnect' 事件

具体请戳[创建进程child_process](child_process.md)



