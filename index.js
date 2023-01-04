'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const cors = require('@fastify/cors')

module.exports = async function (fastify, opts) {

    // fastify.register(cors, {
    //     origin: true
    // })
    fastify.register(require('@fastify/cors'), (instance) => {
        return (req, callback) => {
          const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
          };


          // callback expects two parameters: error and options
          callback(null, corsOptions)
        }
      })
    // Place here your custom code!

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts)
    })

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts)
    })
}
