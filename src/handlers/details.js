'use strict'

let fs = require('fs')
let url = require('url')
let multiparty = require('multiparty')

let menu = require('../partial/menu')
let articlesDataPath = './data/articlesData.json'
let articlesDataJson = JSON.parse(fs.readFileSync(articlesDataPath, 'utf8'))

let currentArticle
let textBody = []
let deleteArticle = false

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.pathname.startsWith('/details/') && req.method === 'GET') {
    let paths = req.pathname.split('/')
    let id = paths[ paths.length - 1 ]

    for (let article of articlesDataJson) {
      if (article.id === id) {
        article.totalViews++
        currentArticle = article
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
      res.write(`
      <div>Title: ${currentArticle.articleName}</div>
      <div>Description: ${currentArticle.articleDescription}</div>
      <div>Total Views: ${currentArticle.totalViews}</div>
      <div><img src="${currentArticle.imagePath}" alt="img"></div>`)

      if (currentArticle.comments) {
        for (let comment of currentArticle.comments) {
          res.write(`
        <div>Comment from: ${comment.username}</div>
        <div>The comment: ${comment.comment}</div>
        `)
        }
      }

      res.write(`
      <form action="" method="POST" enctype="multipart/form-data">
            <input type="text" value="${currentArticle.id}" name="delete" hidden/>
      <input type="submit" value="${currentArticle.isNotDeleted ? 'DELETE' : 'RESTORE'}" />
      </form>`)

      res.write(`
      <form action="/details/${currentArticle.id}/comment" method="POST" enctype="multipart/form-data">
      
      <label for="commentUser">User: </label>
      <input type="text" name="commentUser" id="commentUser"/>
      
       <label for="comment">Comment: </label>
      <input type="text" name="comment" id="comment"/>
      
      <input type="submit" value="UPDATE" />
      </form>
      `)
      res.end()
    })
  } else if (req.pathname.startsWith('/details') && !req.pathname.endsWith('/comment') && req.method === 'POST') {
    let form = new multiparty.Form()
    form.parse(req)

    form.on('part', part => {
      if (part.name === 'delete') {
        deleteArticle = true

        part.on('data', data => {
          textBody.push(data.toString('binary'))
        })
        part.on('end', () => {

        })
      } else {
        part.resume()
      }
    })

    form.on('close', () => {
      if (deleteArticle) {
        deleteArticle = false
        for (let article of articlesDataJson) {
          if (article.id === textBody[ 0 ]) {
            currentArticle = article
            currentArticle.isNotDeleted = !currentArticle.isNotDeleted
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
          res.write(`<h1>Article Deleted.</h1>`)
          res.end()
        })
      }
    })
  } else {
    return true
  }
}
