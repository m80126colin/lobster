const express    = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const _          = require('lodash')
const moment     = require('moment')

const fs         = require('fs')
const path       = require('path')
const opn        = require('opn')
const yaml       = require('yamljs')
const json2csv   = require('json2csv')
const jwt        = require('jsonwebtoken')

/**
 *  configs
 */
const port       = 5566
const secret     = '<secret>'

/**
 *  Problem operations
 */
const readRaw = () => {
  return yaml.load(`${__dirname}/problem.yml`)
}

/**
 *  route_problem
 *  @route {GET} /problem
 */
const route_problem = (req, res) => {
  // read problem config
  const raw = readRaw()
  // collection of options
  const options = _(raw.options)
    .sortBy(ans => ans)
    .sortedUniq()
    .value()
  // make index of options
  const optidx = _.reduce(options, (dict, val, key) => {
    dict[val] = key
    return dict
  }, {})
  // index of options
  const selector = _.range(options.length - 1)
  // make problems and its selections
  const probset = _(raw.problems)
    .map(prob => {
      const ans = optidx[ prob.answer ]
      return [
        {
          source: prob.source,
          selections: selector
        },
        ans
      ]
    })
    .unzip()
    .value()
  // return json
  res.json({
    options:  options,
    problems: probset[0],
    token:    jwt.sign({
      options: options,
      answer:  probset[1]
    }, secret)
  }).end()
}

/**
 *  route_answer
 *  @route {GET} /answer
 */
const route_answer = (req, res) => {
  if (req.query.token && req.query.check) {
    const data   = jwt.verify(req.query.token, secret)
    const result = _.zipWith(req.query.check, data.answer,
      (check, ans) => {
        return _.assign(
          {},
          check,
          {
            ok:     ans === parseInt(check.select),
            answer: data.options[ ans ],
            select: data.options[ check.select ]
          }
        )
      })
    res.json(result).end()
  }
  else {
    res.status(400).end()
  }
}

/**
 *  route_get_list
 *  @route {GET} /list
 */
const route_get_list = (req, res) => {
  const raw = readRaw()
  res.json(raw).end()
}

/**
 *  route_post_list
 *  @route {POST} /list
 */
const route_post_list = (req, res) => {
  const data = yaml.stringify(req.body)
  fs.writeFile('problem.yml', data, 'utf-8', err => {
    res.status(200).end()
  })
}

/**
 *  route_post_table
 *  @route {POST} /table
 */
const route_post_table = (req, res) => {
  const data   = req.body
  const fields = _.keys(_.head(data))
  console.log(fields)
  // data to csv
  json2csv({ data: data, fields: fields }, (err, csv) => {
    // use timestamp as file name
    const filename = `${moment(new Date()).format('x')}.csv`
    // write file
    const fp = path.join(__dirname, 'dist', 'static', filename)
    // return link
    fs.writeFile(fp, csv, 'utf-8', err2 => {
      res.json({
        link: `/static/${filename}`
      }).end()
    })
  })
}

/**
 *
 *
 */
const route_post_upload = (req, res) => {
  const data     = req.body
  console.log(data)
  const file     = req.files.source
  console.log(file)
  const filename = file.name
  console.log(`filename: ${filename}`)
  const fp = path.join(__dirname, 'dist', 'static', filename)
  file.mv(fp, err => {
    res.json({
      source: filename,
      answer: data.answer
    }).end()
  })
}

/**
 * route
 */
const app = express()

app
// body-parser for application/json and application/x-www-form-urlencoded
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))
// upload files
.use(fileUpload())
// static file for Vue.js
.use('/', express.static(`${__dirname}/dist`))
// static file for download file
.use('/download', express.static(`${__dirname}/download`))
// GET routes
.get('/problem', route_problem)
.get('/answer',  route_answer)
.get('/list',    route_get_list)
// POST routes
.post('/list',   route_post_list)
.post('/table',  route_post_table)
.post('/upload', route_post_upload)
// listen
.listen(port, () => {
  opn(`http://localhost:${port}`)
})