## 1.概念
node是基于v8的，也就注定和浏览器类似，单线程的。但是node的作用大多作为服务器，单线程的情况下一旦出现异常，整个程序就挂掉了，所以为了保证程序的稳定性，多进程的使用也就很有必要了。

node中的进程有process和child_process

## 2.process

### 2.1 process的属性

#### 2.1.1 process.config
