## 中间件原理 —— Express与koa3

## Express中间件

### 概念

Express 是一个路由和中间件 Web 框架，其自身只具有最低程度的功能。

如果当前中间件函数没有结束请求/响应循环，那么它必须调用 next()，以将控制权传递给下一个中间件函数。否则，请求将保持挂起状态。

当调用了响应对象 (res) 的方法可以向客户机发送响应，并终止请求/响应循环。响应方法例如：

```js
res.send()
res.end()
res.render()
```

### 中间件类型

- 应用层中间件
- 路由器层中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

### 应用层中间件

主要是使用`app.use()`和`app.get()`来处理`IncomingMessage`，`next('route')`仅在`app.get()`时生效。

### 路由器层中间件

应用层中间件是将中间件绑定在app实例上，而路由器层中间件绑定在`express.Router()`实例上，用法

```js
router.use()
router.get()
```

最后还要将router挂载到app实例上才可以

```js
app.use('/', router)
```

### 错误处理中间件
