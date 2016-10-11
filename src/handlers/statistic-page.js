'use strict'

let fs = require('fs')
let url = require('url')

let articlesDataPath = './data/articlesData.json'
let articlesDataJson = JSON.parse(fs.readFileSync(articlesDataPath, 'utf8'))

let totalNumbersOfComments = 0
let totalNumbersOfViews = 0

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/stats' && req.method === 'GET') {
    if (req.headers[ 'my-authorization' ] === 'Admin') {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(`<h1>Admin\`s Page</h1>`)

      for (let article of articlesDataJson) {
        let formateDate = formatDate(article.creationDate)
        totalNumbersOfComments += article.comments.length
        totalNumbersOfViews += article.totalViews
        res.write(`<div>'Title: '${article.articleName}/ 'Date: ' ${formateDate}/ <a href='details/${article.id}'>Details</a></div>`)
      }
      res.write(`<h2>Total Numbers Of Comments - ${totalNumbersOfComments}</h2>`)
      res.write(`<h2>Total Numbers Of Views - ${totalNumbersOfViews}</h2>`)

      totalNumbersOfComments = 0
      totalNumbersOfViews = 0

      res.end()
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/html'
      })
      res.write('You must be Admin')
      res.end()
    }
  } else {
    return true
  }
}

function formatDate (inputDate) {
  let d = new Date(inputDate)
  let datestring = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
    d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) +
    ('0' + d.getSeconds()).slice(-2)
  return datestring
}
