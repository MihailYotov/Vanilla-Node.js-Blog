'use strict'

let http = require('http')
let port = 8080
let handlers = require('./handlers/dispatcher')

http.createServer((req, res) => {
  for (let handler of handlers) {
    let next = handler(req, res)

    if (!next) {
      break
    }
  }
})
  .listen(port)

console.log(`Server is listening on ${port}`)