const admin = require('firebase-admin');

//สร้างตำแหน่งพนักงาน (ผู้ดูแลระบบ)
const createposition = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var position = {
        position_name: req.body.positionname,
        permission: req.body.permission
    }
    admin.firestore().collection('position').doc(req.body.id).set(position).then((ref) => {
        res.status(200).json({ref})
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error)
    })
}

const positiontransfer = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(500).json({
            message: 'Not allowed'
        })
    }
    var uid = req.body.uid
    var data = {
        position_id:req.body.positionid
    }
    admin.firestore().collection('personnel').doc(uid).update(data).then(positiontransfer => {
        res.send(positiontransfer)
    })
}

module.exports = {
    createposition,
    positiontransfer
}