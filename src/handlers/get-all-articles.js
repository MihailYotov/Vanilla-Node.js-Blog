'use strict'

let fs = require('fs')
let url = require('url')

let menu = require('../partial/menu')
let articlesDataPath = './data/articlesData.json'
let articlesDataJson = JSON.parse(fs.readFileSync(articlesDataPath, 'utf8'))

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  articlesDataJson = sortByDate(articlesDataJson)
  if (req.pathname === '/getall' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.write(menu)
    res.write(`<h1>Articles: </h1>`)

    for (let article of articlesDataJson) {
      if (article.isNotDeleted) {
        let formateDate = formatDate(article.creationDate)
        res.write(`<div>'Title: '${article.articleName}/ 'Date: ' ${formateDate}/ <a href="details/${article.id}">Details</a></div>`)
      }
    }

    res.end()
  } else {
    return true
  }
}

function sortByDate (array) {
  array.sort(function (a, b) {
    a = new Date(a.creationDate)
    b = new Date(b.creationDate)
    return a > b ? -1 : a < b ? 1 : 0
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
