const admin = require('firebase-admin');

//บันทึกเวลาเข้างาน
const timestamp = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    var time = req.body.timestamp
    var data = {
        timestamp : admin.firestore.Timestamp.fromDate(new Date(time))
    }
    admin.firestore().collection('personnel').doc(uid).collection('timestamp').add(data).then(timestamp => {
        res.send(timestamp)
    })
}

module.exports = {
    timestamp
}