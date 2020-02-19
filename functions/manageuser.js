const admin = require('firebase-admin');

//สร้างผู้ใช้งาน (ผู้ดูแลระบบ,ฝ่ายบุคคล)
const createuser = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var password = {
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false
    }
    admin.auth().createUser(password).then((ref) => {
        var personnel = {
            personnel_email: req.body.email,
            personnel_fullname:{
                personnel_firstname: req.body.firstname,
                personnel_lastname: req.body.lastname
            },
            personnel_tel: req.body.phonenumber,
            position_id: req.body.positionid,
            uid: ref.uid
        }
        admin.firestore().collection('personnel').doc(req.body.id).set(personnel).then((ref =>{
            console.log(ref)
            res.status(200).json({ref})
        })).catch((error) => {
            admin.auth().deleteUser(ref.uid)
            console.log(error)
            res.status(500).send(error)
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error)
    })
}

//แก้ไขข้อมูลของผู้ใช้งาน (พนักงาน)
const edituser = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var personnel = {
        personnel_fullname:{
            personnel_firstname: req.body.firstname,
            personnel_lastname: req.body.lastname
        },
        personnel_tel: req.body.phonenumber
    }
    admin.firestore().collection('personnel').doc(req.body.id).update(personnel).then((ref) => {
        console.log(ref)
        res.status(200).json({ref})
    }).catch((error) => {
        console.log(error)
        res.status(500).send({error})
    })
}

//ปิดการเข้าสู่ระบบของผู้ใช้งาน (ผู้ดูแลระบบ)
const disableduser = (req,res) => {

}

//เช็คโทเคนผู้ใช้งาน
const checkusertoken = (req , res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var token = req.body.token
    admin.auth().verifyIdToken(token,true).then((payload) => {
        res.status(200).json({
            payload
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            error
        })
    })
}

module.exports = {
    createuser,
    edituser,
    disableduser,
    checkusertoken
}