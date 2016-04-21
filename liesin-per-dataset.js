var fs = require('fs')
var path = require('path')
var H = require('highland')
var neo4j = require('spacetime-db-neo4j')

function stats (config, dirs, tools, callback) {
  var query = fs.readFileSync(path.join(__dirname, 'liesin-per-dataset.cypher'), 'utf8')

  neo4j.query(query, (err, results) => {
    if (err) {
      callback(err)
      return
    }

    H(results)
      .map((result) => ({
        type: 'log',
        obj: result
      }))
      .map(H.curry(tools.writer.writeObject))
      .nfcall([])
      .series()
      .errors(callback)
      .done(callback)
  })
}

// ==================================== API ====================================

module.exports.steps = [
  stats
]
