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
};
