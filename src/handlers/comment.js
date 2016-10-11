'use strict'

let fs = require('fs')
let url = require('url')
let multiparty = require('multiparty')

let menu = require('../partial/menu')
let articlesDataPath = './data/articlesData.json'
let articlesDataJson = JSON.parse(fs.readFileSync(articlesDataPath, 'utf8'))

let emptyField = false
let currentArticle
let textBody = []
let commentObj = {}

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.pathname.endsWith('/comment') && req.method === 'POST') {
    let paths = req.pathname.split('/')
    let id = paths[ paths.length - 2 ]
    let form = new multiparty.Form()
    form.parse(req)

    form.on('part', part => {
      if (!part.byteCount) {
        emptyField = true
      }
      part.on('data', data => {
        textBody.push(data.toString('binary'))
      })
      part.on('end', () => {

      })
    })

    form.on('close', () => {
      if (emptyField) {
        emptyField = false
        res.writeHead(400, {
          'Content-Type': 'text/html'
        })
        res.write(menu)
        res.write(`<h1>All fields are mentadory.</h1>`)
        res.end()
      } else {
        commentObj.username = textBody[ 0 ]
        commentObj.comment = textBody[ 1 ]
        commentObj.creationDate = new Date().getTime()

        for (let article of articlesDataJson) {
          if (article.id === id) {
            currentArticle = article

            if (!currentArticle.comments) {
              currentArticle.comments = []
            }
            currentArticle.comments.push(commentObj)
            break
          }
        }
        fs.writeFile(articlesDataPath, JSON.stringify(articlesDataJson), err => {
          if (err) {
            throw err
          }
          res.writeHead(200, {
            'Content-Type': 'text/html'
          })
          res.write(menu)
          res.write(`<h1>Comment created.</h1>`)
          res.end()
        })
      }
    })
  } else {
    return true
  }
}
