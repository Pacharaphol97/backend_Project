const functions = require('firebase-functions');
const admin = require('firebase-admin');

const authorization = require('./authorization')
const manageuser = require('./manageuser')
const manageposition = require('./manageposition')

admin.initializeApp(functions.config().firebase);

//ส่วนการจัดการผู้ใช้งาน
exports.createuser = functions.https.onRequest((req,res) => {manageuser.createuser(req,res)})
exports.edituser = functions.https.onRequest((req,res) => {manageuser.edituser(req,res)})

exports.checkusertoken = functions.https.onRequest((req,res) => {manageuser.checkusertoken(req,res)})

//ส่วนจัดการตำแหน่งพนักงาน
exports.createposition = functions.https.onRequest((req,res) => {manageposition.createposition(req,res)})