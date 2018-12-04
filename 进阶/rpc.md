## 概念

使用rpc有2种场景

- 本地客户端调用远程服务上的函数
- 服务之间互相调用

实现rpc需要具备的条件

- 传输协议，可以是tcp、http、http2，连接需要考虑到合适关闭。连接可以是按需连接，调用结束后就断掉，也可以是长连接，多个远程过程调用共享同一个连接。
- 服务的发现和寻址，通俗的说就是可调用的rpc函数
- 通信格式标准，也就是自定义的通讯协议
- 数据序列化或反序列化

参考：[谁能用通俗的语言解释一下什么是 RPC 框架？](https://www.zhihu.com/question/25536695)

## 原理

![](../images/rpc.png)

- 调用方（Client）通过本地的 RPC 代理（Proxy）调用相应的接口
- 本地代理将 RPC 的服务名，方法名和参数等等信息转换成一个标准的 RPC Request 对象交给 RPC 框架
- RPC 框架采用 RPC 协议（RPC Protocol）将 RPC Request 对象序列化成二进制形式，然后通过 TCP 通道传递给服务提供方 （Server）
- 服务端（Server）收到二进制数据后，将它反序列化成 RPC Request 对象
- 服务端（Server）根据 RPC Request 中的信息找到本地对应的方法，传入参数执行，得到结果，并将结果封装成 RPC Response 交给 RPC 框架
- RPC 框架通过 RPC 协议（RPC Protocol）将 RPC Response 对象序列化成二进制形式，然后通过 TCP 通道传递给服务调用方（Client）
- 调用方（Client）收到二进制数据后，将它反序列化成 RPC Response 对象，并且将结果通过本地代理（Proxy）返回给业务代码

## 还需要额外考虑的点

- 需要定义完整的可扩展的rpc协议，所谓协议就是通讯数据格式的约定。例如版本号、数据类型、数据格式等
- 在Node中使用buffer来序列化，那就涉及buffer读写和切割的性能问题，以及多字节编码的字节序问题
- 数据包的接收处理，何时才知道响应包发送完成？socket本身就拥有stream的特性，我们可以利用`data`或`readable`事件来处理，甚至可以利用socket的双工流特性重写转换

了解完上述之后再来看这篇文章就清晰很多了：[聊聊 Node.js RPC（一）— 协议](https://www.yuque.com/egg/nodejs/dklip5)

> 拓展知识：[soa](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E6%9C%8D%E5%8A%A1%E7%9A%84%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84)、[Zookeeper的功能以及工作原理](http://www.cnblogs.com/felixzh/p/5869212.html)、[zookeeper-study](https://github.com/wacxt/zookeeper-study)
