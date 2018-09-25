console.log(self)

self.onmessage = e => {
  console.log('儿子收到短信：', e.data)
  self.postMessage('我是儿子')
}

importScripts('./import.js')

console.log(a)