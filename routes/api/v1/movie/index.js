'use strict'
const Movie = require('../../../../lib/movie.js')
module.exports = async function (fastify, opts) {
  fastify.get('/:mode', async function (request, reply) {
    const drama  = new Movie()
    const page = request.query.page ? request.query.page : 1
    const tmdb = request.query.tmdb
    // console.log(page)
    const mode = request.params.mode
    const data = await drama.index(mode, page, tmdb ? true:false)
    return data
  })
}
