const admin = require('firebase-admin');

//ดึงข้อมูลข่าวสารประชาสัมพันธ์
const getPublicRelations = (req,res) => {
    admin.firestore().collection('public_relations').orderBy("publicrelations_id", "desc").get().then(PublicRelations => {
        i = 0
        dataPublicRelations = {data:[]}
        PublicRelations.forEach(doc => {
            dataPublicRelations.data[i] = {
                id:doc.id,
                PublicRelations:doc.data()
            }
            i++
        })
        res.send(dataPublicRelations)
    })
}

//เพิ่มข่าวสารประชาสัมพันธ์ (ฝ่ายบุคคล)
const createPublicRelations = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var data = {
        publicrelations_id:req.body.id,
        publicrelations_date:admin.firestore.Timestamp.fromDate(new Date(req.body.timepost)),
        publicrelations_topic:req.body.topic,
        publicrelations_detail:req.body.detail,
        personnel_uid:req.body.uid
    }

    admin.firestore().collection('public_relations').add(data).then(createPublicRelations => {
        res.send(createPublicRelations)
    })
}

const editPublicRelations = (req,res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Required',
            message: 'Method Not Allowed'
        })
    }
    var data = {
        publicrelations_topic:req.body.topic,
        publicrelations_detail:req.body.detail,
    }
    admin.firestore().collection('public_relations').doc(req.body.uid).update(data).then(editPublicRelations => {
        res.send(editPublicRelations)
    })
}

module.exports = {
    getPublicRelations,
    createPublicRelations,
    editPublicRelations
}