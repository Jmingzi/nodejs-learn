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
PUT /articles/id/like：点赞文章
DELETE /articles/id/like：取消点赞
POST /articles/aid/comments 在某篇文章中创建评论
DELETE /comments/cid 删除评论
```

RESTful 中使用 GET、POST、PUT 和 DELETE 来表示资源的查询、创建、更改、删除，并且除了 POST 其他三种请求都具备幂等性（多次请求的效果相同）。需要注意的是 POST 和 PUT 最大的区别就是幂等性，所以 PUT 也可以用于创建操作。

将 id 放在 URL 中而不是 Query Param 的其中一个好处是可以表示资源之间的层级关系。

在Query Param中，更多的是做信息筛选过滤，尽可能的暴露更多的查询条件给客户端，让客户端自行组合条件去筛选

```
/users/?offset=10&limit=10
/articles/?cursor=2015-01-01 15:20:30&limit=10
/users/?page=2&pre_page=20
```

## 响应

http状态码

- 200：请求成功
- 201：创建、修改成功
- 204：删除成功
- 400：参数错误
- 401：未登录
- 403：禁止访问
- 404：未找到
- 500：系统错误

除了使用http 状态码之外，还应自己包一层业务逻辑的错误信息

例如请求成功后，但是业务逻辑不允许

```js
// 成功
{
  code: 100,
  data: '成功时才存在该字段',
  msg: '成功'
}
// 失败
{
  code: -1001,
  msg: '错误信息提示'
}
```

----
延伸阅读

- [我所认为的RESTful API最佳实践](https://www.scienjus.com/my-restful-api-best-practices/#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E7%94%A8-RESTful)
- [怎样用通俗的语言解释REST，以及RESTful？](https://www.zhihu.com/question/28557115)
- [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

