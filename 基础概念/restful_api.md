## 概述
REST和RESTful API在概念上是2种东西，REST不是单词`rest`，REST是一种概念，用来描述“资源在网络中以某种表现形式进行状态转移”，RESTful API是用来实践这种概念的软件架构风格规范。

通俗来说，RESTful API有3个特征

- 看uri就知道资源是什么
- 看http method就知道要干什么
- 看http status就知道结构如何

详细来说，它的特征体现在以下几个方面

- 协议与版本
- 路径
- 请求与参数
- 响应
- 返回结果

## 协议与版本

协议总是使用https，域名是类似`example.com/api/v1/`，或者`api.example.com/v1/`

## 路径

在RESTful中，每个url都代表一种资源，所以只能是名词，而且所用的名词往往与数据库表的名称对应，且名词使用复数，因为代表这一类资源的集合

```
https://example.com/api/v1/articles
https://example.com/api/v1/comments
```

## 请求与参数

对url的请求都必须使用http动词

```
GET /articles 文章列表
GET /articles/id 文章详情
POST /articles 创建文章
PUT /articles/id 修改文章
DELETE /articles/id 删除文章
```

RESTful 中使用 GET、POST、PUT 和 DELETE 来表示资源的查询、创建、更改、删除，并且除了 POST 其他三种请求都具备幂等性（多次请求的效果相同）。需要注意的是 POST 和 PUT 最大的区别就是幂等性，所以 PUT 也可以用于创建操作。

将 id 放在 URL 中而不是 Query Param 的其中一个好处是可以表示资源之间的层级关系。



