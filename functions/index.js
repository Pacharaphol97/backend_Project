const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require("cors")({ origin: true });

const authorization = require('./authorization')
const personnel = require('./personnel')
const manageuser = require('./manageuser')
const manageposition = require('./manageposition')
const managetimestamp = require('./managetimestamp')
const manageleave = require('./manageleave')
const managepublicrelations = require('./managepublicrelations')
const manageschedule = require('./manageschedule')

admin.initializeApp(functions.config().firebase);

//ส่วนพนักงาน และหัวหน้างาน
exports.getPersonnel = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        personnel.getPersonnel(req,res)
    })
})
exports.getHenchman = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        personnel.getHenchman(req,res)
    })
})
exports.getTypeleave = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageleave.getTypeleave(req,res)
    })
})
exports.getLeave = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageleave.getLeave(req,res)
    })
})
exports.createleave = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageleave.createleave(req,res)
    })
})
exports.editleave = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageleave.editleave(req,res)
    })
})
exports.cancelleave = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageleave.cancelleave(req,res)
    })
})
exports.approveleave = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageleave.approveleave(req,res)
    })
})
exports.getPublicRelations = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        managepublicrelations.getPublicRelations(req,res)
    })
})
exports.getSchedule = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageschedule.getSchedule(req,res)
    })
})
exports.createSchedule = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        manageschedule.createSchedule(req,res)
    })
})

//ส่วนฝ่ายบุคคล
exports.createPublicRelations = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        managepublicrelations.createPublicRelations(req,res)
    })
})

//ส่วนการจัดการผู้ใช้งาน
exports.createuser = functions.https.onRequest((req,res) => {manageuser.createuser(req,res)})
exports.edituser = functions.https.onRequest((req,res) => {manageuser.edituser(req,res)})
exports.checkusertoken = functions.https.onRequest((req,res) => {manageuser.checkusertoken(req,res)})

//ส่วนจัดการตำแหน่งพนักงาน
exports.createposition = functions.https.onRequest((req,res) => {manageposition.createposition(req,res)})

//ส่วนจัดการเวลาเข้างาน-ออกงาน
exports.timestamp = functions.https.onRequest((req,res) => {
    cors(req,res,() => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        managetimestamp.timestamp(req,res)
    })
})