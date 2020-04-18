const admin = require('firebase-admin');

//ดึงข้อมูลกำหนดการ
const getSchedule = (req,res) => {
    admin.firestore().collection('schedule').orderBy("schedule_id", "desc").get().then(Schedule => {
        i = 0
        dataSchedule = {data:[]}
        Schedule.forEach(doc => {
            dataSchedule.data[i] = {
                id:doc.id,
                Schedule:doc.data()
            }
            i++
        })
        res.send(dataSchedule)
    })
}

//เพิ่มกำหนดการ (หัวหน้างาน)
const createSchedule = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var data = {
        schedule_id:req.body.id,
        schedulecreate_date:admin.firestore.Timestamp.fromDate(new Date(req.body.create_date)),
        scheduledetermine_date:admin.firestore.Timestamp.fromDate(new Date(req.body.determine_date)),
        schedule_topic:req.body.topic,
        schedule_detail:req.body.detail,
        personnel_uid:req.body.uid
    }
    admin.firestore().collection('schedule').add(data).then(createSchedule => {
        res.send(createSchedule)
    })
}

//แก้ไขกำหนดการ (หัวหน้างาน)
const editSchedule = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    
}

module.exports = {
    getSchedule,
    createSchedule
}