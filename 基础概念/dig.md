## 前言

目前DNS查询工具有3个
- dig
- host
- nslookup

这3个工具都是linux系统下自带的，由于dig工具记录非常详细，所以这里只学习dig。

```
# 输入
dig -h
```
我们可以看到dig下的参数，基本使用结构如下

```
dig [@global-server] [domain] [q-type] [q-class] {q-opt} {d-opt}
```

- @global-server
    我们可以指定dns解析服务器去解析domain

- domain
    需要查询的域名

- q-type 等同于 `q-opt` 里的 `-t`
    域名解析的类型，例如（A记录，CNAME，NS记录等等，后面详解）

- q-class 等同于 `q-opt` 里的 `-c`
    指定查询的类型，一般都是因特网(in)

- q-opt 命令选项

- d-opt 查询参数

最常用的当然是`[q-type]`和`{d-opt}`

实例：

```
# 查看域名解析的全过程
dig +trace iming.work

# 简化全过程
dig +short iming.work

# 查询ns记录
dig ns iming.work

# 查询A记录
dig a iming.work
```

参考

- [dig](https://ftp.isc.org/isc/bind/9.11.0a1/doc/arm/man.dig.html)
- [Linux命令：使用dig命令解析域名](https://blog.csdn.net/reyleon/article/details/12976889)
- [dig 命令](https://www.ibm.com/support/knowledgecenter/zh/ssw_aix_72/com.ibm.aix.cmds2/dig.htm)
- [Linux下的dig 命令详解](http://blog.51cto.com/41961/238942)
