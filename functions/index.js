const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require("cors")({ origin: true });

const authorization = require('./authorization')
const personnel = require('./personnel')
const manageuser = require('./manageuser')
const manageposition = require('./manageposition')

admin.initializeApp(functions.config().firebase);

//ส่วนพนักงาน และหัวหน้างาน
exports.getPersonnel = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        personnel.getPersonnel(req,res)
    })
})
exports.getHenchman = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        personnel.getHenchman(req,res)
    })
})

//ส่วนการจัดการผู้ใช้งาน
exports.createuser = functions.https.onRequest((req,res) => {manageuser.createuser(req,res)})
exports.edituser = functions.https.onRequest((req,res) => {manageuser.edituser(req,res)})
exports.checkusertoken = functions.https.onRequest((req,res) => {manageuser.checkusertoken(req,res)})

//ส่วนจัดการตำแหน่งพนักงาน
exports.createposition = functions.https.onRequest((req,res) => {manageposition.createposition(req,res)})