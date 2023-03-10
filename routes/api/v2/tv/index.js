const admin = require("firebase-admin");
const serviceAccount = require("../../../../firebase/akun.json");
const port = 2000;

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
module.exports = async function (fastify, opts) {
 fastify.get("/latest", async function (request, res) {
  try {
   let response = [];

   await db
    .collection("series")
    .orderBy("datePublished", "desc")
    .limit(24)
    .get()
    .then((data) => {
     let docs = data.docs;
     docs.map((doc) => {
      const selectedData = {
       name: doc.data().title,
       id: doc.data().id,
       datePublished: doc.data().datePublished,
       director: doc.data().director,
       categories: doc.data().categories,
       episode: doc.data().episode,
       genres: doc.data().genres,
       poster: doc.data().poster,
       rating: doc.data().rating,
       reviewCount: doc.data().reviewCount,
       trailer: doc.data().trailer,
       TMDB: doc.data().TMDB,
      };

      response.push(selectedData);
     });

     return response;
    });
   //console.log(response)
   //return response;
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });
 
 fastify.get("/popular", async function (request, res) {
  try {
   let response = [];

   await db
    .collection("series")
    .orderBy("rating", "desc")
    .limit(24)
    .get()
    .then((data) => {
     let docs = data.docs;
     docs.map((doc) => {
      const selectedData = {
       name: doc.data().title,
       id: doc.data().id,
       datePublished: doc.data().datePublished,
       director: doc.data().director,
       categories: doc.data().categories,
       episode: doc.data().episode,
       genres: doc.data().genres,
       poster: doc.data().poster,
       rating: doc.data().rating,
       reviewCount: doc.data().reviewCount,
       trailer: doc.data().trailer,
       TMDB: doc.data().TMDB,
      };

      response.push(selectedData);
     });

     return response;
    });
   //console.log(response)
   //return response;
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });
 
 fastify.get("/country/:country", async function (request, res) {
  try {
   let response = [];
let query = []
if (request.params.country == 'korea')
{
 query = ['Korea', 'South Korea']
} else if (request.params.country == 'china')
{
 query = ['China']
} else if (request.params.country == 'west')
{
 query = ['West']
} else if (request.params.country == 'asian')
{
 query = ['Asian']
}
   await db
    .collection("series")
    .where('categories', 'array-contains-any', query)
    
    .limit(24)
    .get()
    .then((data) => {
     let docs = data.docs;
     docs.map((doc) => {
      const selectedData = {
       name: doc.data().title,
       id: doc.data().id,
       datePublished: doc.data().datePublished,
       director: doc.data().director,
       categories: doc.data().categories,
       episode: doc.data().episode,
       genres: doc.data().genres,
       poster: doc.data().poster,
       rating: doc.data().rating,
       reviewCount: doc.data().reviewCount,
       trailer: doc.data().trailer,
       TMDB: doc.data().TMDB,
      };

      response.push(selectedData);
     });

     return response;
    });
   //console.log(response)
   //return response;
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });
};
