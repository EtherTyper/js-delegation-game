'use strict'

let { Candidate, Candidates } = require('./src/types.js')

module.exports = Object.assign(require('./src/client.js'), {
  allocation: require('./src/allocation.json'),
  Candidate,
  Candidates
})
