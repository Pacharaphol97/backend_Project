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

module.exports = {
    createposition
}