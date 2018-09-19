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

