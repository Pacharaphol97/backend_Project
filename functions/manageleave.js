const admin = require('firebase-admin');

//ดึงประเภทการลางาน
const getTypeleave = (req,res) => {
    admin.firestore().collection('type').get().then(typeleave => {
        i = 0
        dataType = {data:[]}
        typeleave.forEach(doc => {
            dataType.data[i] = {
                id:doc.id,
                type:doc.data()
            }
            i++
        })
        res.send(dataType)
    })
}

//ขอข้อมูลการลางาน (พนักงาน)
const getLeave = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    admin.firestore().collection('personnel').doc(uid).collection('leave').orderBy("id", "desc").get().then(getleave => {
        i = 0
        dataLeave = {data:[]}
        getleave.forEach(doc => {
            dataLeave.data[i] = {
                id:doc.id,
                dataleave:doc.data()
            }
            i++
        })
        res.send(dataLeave)
    })
}

//เพิ่มข้อมูลการลางาน (พนักงาน)
const createleave = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    var data = {
        id:req.body.id,
        type_id:req.body.typeid,
        leave_date:admin.firestore.Timestamp.fromDate(new Date(req.body.leavedate)),
        leave_number:req.body.leavenumber
    }
    
    admin.firestore().collection('personnel').doc(uid).collection('leave').add(data).then(createleave => {
        res.send(createleave)
    })
}

//แก้ไขข้อมูลการลางาน (พนักงาน)
const editleave = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    var leaveid = req.body.leaveid
    admin.firestore().collection('personnel').doc(uid).collection('leave').doc(leaveid).get().then(getApprove => {
        var leavedata = getApprove.data()
        if(leavedata.approve_status){
            return res.json({
                error:'approve status',
                message: 'การอนุมัติได้รับการยืนยันแล้ว ไม่สามารถแก้ไขข้อมูลการขอลางานได้'
            })
        }
        var data = {
            type_id:req.body.typeid,
            leave_date:admin.firestore.Timestamp.fromDate(new Date(req.body.leavedate)),
            leave_number:req.body.leavenumber,
        }
        admin.firestore().collection('personnel').doc(uid).collection('leave').doc(leaveid).update(data).then(editleave => {
            res.send(editleave)
        })
    })
}

//ยกเลิกการลาของพนักงาน (พนักงาน)
const cancelleave = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var uid = req.body.uid
    var leaveid = req.body.leaveid
    admin.firestore().collection('personnel').doc(uid).collection('leave').doc(leaveid).get().then(getApprove => {
        var leavedata = getApprove.data()
        if(leavedata.approve_status){
            return res.json({
                error:'approve status',
                message: 'การอนุมัติได้รับการยืนยันแล้ว ไม่สามารถยกเลิกการขอลางานข้อมูลได้'
            })
        }
        admin.firestore().collection('personnel').doc(uid).collection('leave').doc(leaveid).delete().then(editleave => {
            res.send(editleave)
        })
    })
}

//อนุมัติคำขอลางานของพนักงาน (หัวหน้างาน)
const approveleave = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var personneluid = req.body.personneluid
    var leaveuid = req.body.leaveuid
    var data = {
        approve_status:req.body.approve
    }
    admin.firestore().collection('personnel').doc(personneluid).collection('leave').doc(leaveuid).update(data).then(approve => {
        res.send(approve)
    })
}

module.exports = {
    getTypeleave,
    getLeave,
    createleave,
    editleave,
    cancelleave,
    approveleave
}