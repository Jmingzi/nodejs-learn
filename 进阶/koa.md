使用koa作为node中间件服务

> 不提供客户端使用，因为涉及key的权限认证

## Usage

```
npm i @xm/db --save
```

## API
查询用redis做缓存

```js
/**
 * 权限、账户等
 */

db.init()

/**
 * 创建表
 */

db.createTable(tableName)

/**
 * 新增或更新数据
 */

db.set(key, value)
db.save(data)

/**
 * 查询详情
 */

db.get(id)

/**
 * 查询列表
 */

db.equal('type', 1)
db.asc()
db.limit(0, 10)
db.find()

/**
 * 删除数据
 */

db.delete(id)
```

## 服务构成

- 内存监控
- 日志处理
- 负载均衡

### 资料

- [koa手册](http://17koa.com/koa-generator-examples/basic/README.html)
- [debug](https://github.com/visionmedia/debug)
- [koa请求代理](https://github.com/koa-grace/koa-grace-proxy)proxy
- [request模块](https://github.com/request/request)
