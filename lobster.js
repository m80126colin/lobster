const _       = require('lodash')

const opn     = require('opn')
const yaml    = require('yamljs')
const express = require('express')
const jwt     = require('jsonwebtoken')

/**
 * configs
**/

const port    = 5566
const secret  = '<secret>'

/**
 * route_problem
**/

const route_problem = (req, res) => {
  // read problem config
  const problems = yaml.load(`${__dirname}/problem.yml`)
  // collection of options
  const options  = _(problems)
    .map(prob => prob.answer)
    .sortBy(ans => ans)
    .sortedUniq()
    .value()
  // make index of options
  const optidx   = _.reduce(options, (dict, val, key) => {
    dict[val] = key
    return dict
  }, {})
  // index of options
  const selector = _.range(options.length - 1)
  // make problems and its selections
  const probset  = _(problems)
    .map(prob => {
      const ans = optidx[ prob.answer ]
      return [
        {
          source: prob.source,
          selections: _(selector)
            .shuffle()
            .take(3)
            .map(num => (num >= ans) ? num + 1 : num)
            .concat(ans)
            .shuffle()
            .value()
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
 * route_answer
**/

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
 * route
**/

const app = express()

app
.use('/', express.static(`${__dirname}/dist`))
.get('/problem', route_problem)
.get('/answer',  route_answer)
.listen(port, () => {
  opn(`http://localhost:${port}`)
})