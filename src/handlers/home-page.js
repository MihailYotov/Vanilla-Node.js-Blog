'use strict'

let fs = require('fs')
let url = require('url')

let menu = require('../partial/menu')
let articlesDataPath = './data/articlesData.json'
let articlesDataJson = JSON.parse(fs.readFileSync(articlesDataPath, 'utf8'))

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/' && req.method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        console.log('Index err: ', err)
      }

      let currentArticlesView = sortArticlesByViews(articlesDataJson).slice(0, 6)

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(menu)
      res.write(data)
      for (let article of currentArticlesView) {
        if (article.isNotDeleted) {
          let formateDate = formatDate(article.creationDate)
          res.write(`<div>'Title: '${article.articleName}/ 'Date: ' ${formateDate}/ <a href='details/${article.id}'>Details</a></div>`)
        }
      }
      res.end()
    })
  } else {
    return true
  }
}

function sortArticlesByViews (array) {
  array.sort(function (a, b) {
    a = new Date(a.totalViews)
    b = new Date(b.totalViews)
    return b - a
  })
  return array
}

function formatDate (inputDate) {
  let d = new Date(inputDate)
  let datestring = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
    d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) +
    ('0' + d.getSeconds()).slice(-2)
  return datestring
}
