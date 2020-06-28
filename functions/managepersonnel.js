const admin = require('firebase-admin');

//ดึงพนักงานทั้งหมด
const getallPersonnel = async(req,res) => {
    var i = 0
    var dataPersonnel = {data:[]}
    let personnel = await admin.firestore().collection('personnel').get()
    personnel.forEach(async doc => {
        let timestamp = await admin.firestore().collection('personnel').doc(doc.id).collection('timestamp').get()
        let leave = await admin.firestore().collection('personnel').doc(doc.id).collection('leave').get()
        dataPersonnel.data[i] = {
            id:doc.id,
            personnel:doc.data(),
            timestamp:timestamp.size,
            leave:leave.size
        }
        i++
        if(i == personnel.size){
            res.send(dataPersonnel)
        }
    })
}

//สร้างผู้ใช้งาน (ผู้ดูแลระบบ,ฝ่ายบุคคล)
const createPersonnel = (req,res) => {
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

    admin.firestore().collection('personnel').get().then(personnel => {
        let idcheck = true
        personnel.forEach(doc => {
            if(doc.data().personnel_id == req.body.id){
                idcheck = false
            }
        })

        if(idcheck){
            admin.auth().createUser(password).then((ref) => {
                var personnel = {
                    personnel_id: req.body.id,
                    personnel_email: req.body.email,
                    personnel_fullname:{
                        personnel_firstname: req.body.firstname,
                        personnel_lastname: req.body.lastname,
                        personnel_prefix: req.body.prefix
                    },
                    personnel_tel: req.body.phonenumber,
                    position_id: req.body.positionid,
                    leader_uid:req.body.leaderuid
                }
                admin.firestore().collection('personnel').doc(ref.uid).set(personnel).then((ref =>{
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
        }else{
            res.status(500).json({
                message: 'ID Error'
            })
        }
    })
}

//แก้ไขข้อมูลของพนักงาน (ฝ่ายบุคคล)
const editPersonnel = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var personnel = {
        personnel_fullname:{
            personnel_prefix: req.body.perfix,
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

//ย้ายสังกัดพนักงาน
const teamtransfer = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var uid = req.body.uid
    var data = {
        leader_uid:req.body.leaderuid
    }
    admin.firestore().collection('personnel').doc(uid).update(data).then(teamtransfer => {
        res.send(teamtransfer)
    })
}

//ปิดการเข้าสู่ระบบของผู้ใช้งาน (ผู้ดูแลระบบ)
const deletePersonnel = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var uid = req.body.uid
    admin.firestore().collection('personnel').doc(uid).delete().then(async deletePersonnel => {
        admin.auth().deleteUser(uid);
        let personnel = await admin.firestore().collection('personnel').get()
        personnel.forEach(async doc => {
            let Personnel = doc.data()
            if(uid == Personnel.leader_uid){
                await admin.firestore().collection('personnel').doc(doc.id).update({leader_uid:""})
            }
        })
        res.send(deletePersonnel)
    })
    
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
    getallPersonnel,
    createPersonnel,
    editPersonnel,
    teamtransfer,
    deletePersonnel,
    checkusertoken
}