'use strict'

let home = require('./home-page')
let getAll = require('./get-all-articles')
let create = require('./create-article')
let details = require('./details')
let comment = require('./comment')
let staticFiles = require('./static-files')
let statisticPage = require('./statistic-page')

module.exports = [
  home,
  getAll,
  create,
  details,
  comment,
  statisticPage,
  staticFiles
]
