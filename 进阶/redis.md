## 概述

redis是基于`BSD协议`的，关于[各种协议的介绍](http://www.runoob.com/w3cnote/open-source-license.html)

redis的操作是原子性的（要么完全成功、要么完全失败）

redis支持五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及zset(sorted set：有序集合)。

## node_redis

redis分为redis-server和redis-cli，这里的node_redis仅仅是client，服务还是要自己单独起的，否则你会看到这样的报错
```
Unhandled rejection Error: Redis connection to 127.0.0.1:811 failed - connect ECONNREFUSED 127.0.0.1:811
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1163:14)
```

mac下操作redis

```
brew install redis

# 启动
brew services start redis

# 或
redis-server /usr/local/etc/redis.conf

# 关闭
brew services stop redis
redis-cli shutdown
```

node_redis也继承了`EventEmitter`，所以事件都是以回调的形式，改为`Promise`的话可以借用[bluebird](https://github.com/petkaantonov/bluebird)库
```js
bluebird.promisifyAll(redis)
```

这样你就可以用promise为所欲为了

```js
client.onAsync('error').then(err => {
    console.log(err)
})
```

## node_redis命令

### hash commands



-----

## redis原生命令

详细分为

- 对`redis 键`的相关操作
- 对`string`的相关操作
- 对`hash`的相关操作
- 对`list`的相关操作
- 对`set`的相关操作
- 对`zset`的相关操作

### 对`redis 键`的相关操作

命令|描述
-----|-----
`DEL` key|key存在时删除
`EXISTS` key|检查key是否存在
`EXPIRE` key seconds|为key设置过期时间seconds
`EXPIREAT` key timestamp|同上，timestamp为`UNIX`时间戳
`PEXPIRE` key milliseconds|单位毫秒
`PEXPIREAT` key milli-timestamp|同上
`KEYS` pattern|根据pattern匹配查找
`PERSIST` key|移除过期时间
`PTIL` key|返回剩余的过期时间，单位毫秒
`TIL` key|同上，单位秒
`RENAME` key newkey|重命名
`TYPE` key|返回key的类型

