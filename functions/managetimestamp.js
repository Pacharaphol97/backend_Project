const admin = require('firebase-admin');

//ดึงเวลาเข้างาน ออกงาน
const gettimestamp = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    admin.firestore().collection('personnel').doc(uid).collection('timestamp').orderBy("timestamp_in", "desc").get().then(timestamp =>{
        i = 0
        datatimestamp = {data:[]}
        timestamp.forEach(doc => {
            datatimestamp.data[i] = {
                id:doc.id,
                datatimestamp:doc.data()
            }
            i++
        })
        res.send(datatimestamp)
    })
}

//บันทึกเวลาเข้างาน ออกงาน
const timestamp = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    var time = admin.firestore.Timestamp.fromDate(new Date(req.body.timestamp))
    admin.firestore().collection('personnel').doc(uid).get().then(timestampID => {
        var timestamp = timestampID.data()
        if(timestamp.timestamp_uid){
            admin.firestore().collection('personnel').doc(uid).collection('timestamp').doc(timestamp.timestamp_uid).get().then(checkday => {
                var timein = checkday.data().timestamp_in
                var datein = new Date(timein._seconds * 1000);
                var dayin = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(datein)
                var dateout = new Date(time._seconds * 1000);
                var dayout = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dateout)
                if(dayin == dayout){
                    var datatimestamp = {
                        timestamp_out : time
                    }
                    admin.firestore().collection('personnel').doc(uid).collection('timestamp').doc(timestamp.timestamp_uid).update(datatimestamp).then(timeout =>{
                        admin.firestore().collection('personnel').doc(uid).update({timestamp_uid:""}).then(timestampuid => {
                            res.send(timestampuid)
                        })
                    })
                }else{
                    var datatimestamp = {
                        timestamp_in : time
                    }
                    admin.firestore().collection('personnel').doc(uid).collection('timestamp').add(datatimestamp).then(savetimestamp => {
                        var timestampuid = {
                            timestamp_uid : savetimestamp.id
                        }
                        admin.firestore().collection('personnel').doc(uid).update(timestampuid).then(timestampuid => {
                            res.send(timestampuid)
                        })
                    })
                }
            })
        }else{
            var datatimestamp = {
                timestamp_in : time
            }
            admin.firestore().collection('personnel').doc(uid).collection('timestamp').add(datatimestamp).then(savetimestamp => {
                var timestampuid = {
                    timestamp_uid : savetimestamp.id
                }
                admin.firestore().collection('personnel').doc(uid).update(timestampuid).then(timestampuid => {
                    res.send(timestampuid)
                })
            })
        }
    })
}

const editTimestamp = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    var idtimestamp = req.body.idtimestamp
    var data = {
        timestamp_in:admin.firestore.Timestamp.fromDate(new Date(req.body.timestamp_in)),
        timestamp_out:admin.firestore.Timestamp.fromDate(new Date(req.body.timestamp_out))
    }
    admin.firestore().collection('personnel').doc(uid).collection('timestamp').doc(idtimestamp).update(data).then(timestamp => {
        res.send(timestamp)
    })
}

module.exports = {
    gettimestamp,
    timestamp,
    editTimestamp
}