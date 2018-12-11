使用koa作为node中间件服务

## API

```js
/**
 * 创建表
 */

db.createTable(tableName)

/**
 * 插入数据
 */

db.set(key, value)

/**
 * 保存数据
 */

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
```

/**
 * 删除数据
 */

db.delete(id)
```

### 资料

- [koa手册](http://17koa.com/koa-generator-examples/basic/README.html)
- [debug](https://github.com/visionmedia/debug)
- [koa请求代理](https://github.com/koa-grace/koa-grace-proxy)proxy
- [request模块](https://github.com/request/request)
