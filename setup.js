const fs   = require('fs')
const path = require('path')

fs.readFile(path.join(__dirname, 'problem.tmp.yml'), (err, data) => {
  if (err) console.log(err)
  fs.writeFile(path.join(__dirname, 'problem.yml'), data, err2 => {
    if (err2) console.log(err2)
  })
})