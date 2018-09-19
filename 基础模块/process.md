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

```
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






