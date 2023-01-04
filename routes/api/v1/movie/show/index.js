'use strict'
const Movie = require('../../../../../lib/movie.js')
module.exports = async function (fastify, opts) {
    fastify.get('/:id', async function (request, reply) {
        const movie = new Movie()
        const query = request.params.id
        const data = await movie.showData(query)
        return data
    })
}
