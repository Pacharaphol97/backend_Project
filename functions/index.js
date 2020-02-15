const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.test = functions.https.onRequest((req,res) =>{
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    db.collection('admin').doc('default').get().then(snapshot => {
        res.status(200).json({
            message: 'It worked',
            test: snapshot.data()
        })
    })
})