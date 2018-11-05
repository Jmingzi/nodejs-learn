## 前言

curl 是一个命令行工具，命令行是指shell命令吗？应该说命令行包含shell。

类似于jquery等库，可以这样理解为`curl`为shell里的工具库方法，如果要系统的学习是没有必要的，因为会忘记，对于工具最好的的学习方式就是先熟练常用场景下的使用方式，再向外扩展。

## 常用场景

查看网络请求过程
```shell
# 整个通信过程 + 网页内容
curl -v iming.work

# 更详细的通信过程
# 打印的都是十六进制编码内容
curl --trace output.txt iming.work

# 将打印结果转化为ascii字符了
curl --trace-ascii output.txt iming.work
```

`-o / -O`命令
```shell
# 打开网页
curl iming.work

# 保存到文件
curl -o [filename] iming.work

# 下载文件
curl -O http://www.baidu.com/img/bdlogo.gif
```

查看响应

```shell
# 响应+网页代码一起
curl -i iming.work
curl -I iming.work
```






