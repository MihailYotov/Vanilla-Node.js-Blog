'use strict'

let fs = require('fs')
let url = require('url')

function getContentType (url) {
  let contentType = 'text/plain'

  if (url.endsWith('.css')) {
    contentType = 'text/css'
  } else if (url.endsWith('.js')) {
    contentType = 'application/javascript'
  }

  return contentType
}

function checkPathName (pathName) {
  let isValid = false
  if (!pathName.endsWith('.js')) {
    isValid = true
  }
  // if (pathName.indexOf('/content/') > -1
  //   && (pathName.endsWith('.html') || pathName.endsWith('.css') || pathName.endsWith('.js') || pathName.endsWith('.jpg'))
  //   || pathName.startsWith('/images/')
  //   || pathName.startsWith('/download/')) {
  //   isValid = true
  // }

  return isValid
}

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.method === 'GET') {
    let isValid = checkPathName(req.pathname)

    if (isValid) {
      fs.readFile('.' + req.pathname, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.write('404 Not Found - Static-files - readFile')
          res.end()
          return true
        }
        let contentType = getContentType(req.pathname)

        res.writeHead(200, {
          'Content-Type': contentType
        })

        res.write(data)
        res.end()
      })
    } else {
      res.writeHead(404)
      res.write('404 Not Found Or Forbidden')
      res.end()
      return true
    }
  } else {
    return true
  }
}
