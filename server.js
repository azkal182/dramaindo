// const express = require("express"),
//   bodyParser = require("body-parser"),
//   swaggerJsdoc = require("swagger-jsdoc"),
//   swaggerUi = require("swagger-ui-express");


  import express from "express";
  import { Dramaindo } from './index.js';


  const app = express()
const port = 3000
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };




  app.get('/latest', async (req, res)=>{
    const series = new Dramaindo()
    const data = await series.index('latest')
    res.json(data);
});



app.get('/api/series/:mode', async (req, res)=>{
    // console.log(req.params)
    const series = new Dramaindo()
    const data = await series.index(req.params.mode)
    res.json(data);
});

  app.get('/hello', (req, res)=>{
    // res.set('Content-Type', 'text/html');
    res.json({name: 'azkal'});
});


//   const specs = swaggerJsdoc(options);
//   app.use(
//     "/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(specs)
//   );


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
