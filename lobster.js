const express = require('express')
const yaml    = require('yamljs')
const opn     = require('opn')


const port = 5566
let app    = express()

app
.use('/', express.static(`${__dirname}/dist`))
.post('/', (req, res) => {})
.listen(port, () => {
  opn(`http://localhost:${port}`)
})