const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis)

const client = redis.createClient()

client.onAsync('error').then(res => {
    console.log(res)
})

client.set('a', '1')
client.getAsync('a').then(res => {
    console.log(res)
})
