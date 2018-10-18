## 概述

redis是基于`BSD协议`的，关于[各种协议的介绍](http://www.runoob.com/w3cnote/open-source-license.html)

redis的操作是原子性的（要么完全成功、要么完全失败）

Redis支持五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及zset(sorted set：有序集合)。

## redis命令

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

