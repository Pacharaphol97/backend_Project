const admin = require('firebase-admin');

//ขอข้อมูลและตำแหน่งของพนักงาน (พนักงาน)
const getPersonnel = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    admin.firestore().collection('personnel').doc(uid).get().then(getPersonnel => {
        if(!getPersonnel.exists){
            res.status(404).json({
                error:'Not Found',
                message:'No such document personnel'
            })
        }
        var personnel = getPersonnel.data()
        admin.firestore().collection('position').doc(personnel.position_id).get().then(getPosition => {
            var position = getPosition.data()
            var sendData = {
                personnel,
                position
            }
            res.send(sendData)
        })
    })
}

//ขอข้อมูลพนักงานในสังกัดทั้งหมด (หัวหน้างาน)
const getHenchman = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    admin.firestore().collection('personnel').where("leader_uid",'==',uid).get().then(getHenchman => {
        if(getHenchman.empty){
            res.status(404).json({
                error:'Not Found',
                message:'No matching documents'
            })
        }
        i = 0
        dataHenchman = {}
        getHenchman.forEach(doc => {
            dataHenchman[i] = {
                uid:doc.id,
                personnel:doc.data()
            }
            i++
        })
        res.send(dataHenchman)
    })
}

module.exports = {
    getHenchman,
    getPersonnel
}