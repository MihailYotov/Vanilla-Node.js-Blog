'use strict'

let fs = require('fs')
let url = require('url')
let multiparty = require('multiparty')

let menu = require('../partial/menu')
let exampleJsonPath = './data/articlesData.json'
let exampleJson = JSON.parse(fs.readFileSync(exampleJsonPath, 'utf8'))

let filePath = './images/'
let imageName = ''
let imageBody = []
let tempObj = {}
tempObj.id = getUniqueId()
tempObj.isNotDeleted = true
tempObj.totalViews = 0
tempObj.comments = []
let emptyField = false

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/create' && req.method === 'GET') {
    fs.readFile('./views/create.html', (err, data) => {
      if (err) {
        console.log('Create err: ', err)
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(menu)
      res.write(data)
      res.end()
    })
  } else if (req.pathname === '/create' && req.method === 'POST') {
    let form = new multiparty.Form()
    form.parse(req)

    form.on('part', part => {
      if (!part.byteCount) {
        emptyField = true
      }

      if (part.filename) {
        imageName = part.filename
        part.setEncoding('binary')

        part.on('data', data => {
          imageBody.push(data.toString('binary'))
        })

        part.on('end', () => {

        })
      } else {
        part.on('data', data => {
          tempObj[ part.name ] = data.toString('binary')
        })

        part.on('end', () => {

        })
      }
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
        imageName = getUniqueId(imageName) + imageName
        tempObj.creationDate = new Date().getTime()
        tempObj.imagePath = filePath.substr(1) + imageName
        exampleJson.push(tempObj)

        fs.writeFile(filePath + imageName, imageBody, 'binary', err => {
          if (err) {
            throw err
          }
          fs.writeFile(exampleJsonPath, JSON.stringify(exampleJson), err => {
            if (err) {
              throw err
            }

            res.writeHead(201, {
              'Content-Type': 'text/html'
            })
            res.write(menu)
            res.write(`<h1>Article created.</h1>`)
            res.end()
          })
        })
      }
    })
  } else {
    return true
  }
}

function getUniqueId () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return s4() + s4() + s4()
}
