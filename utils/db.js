const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/testDB')

// const Contact = mongoose.model('Contact', {
//     nama: {
//         type: String,
//         required: true,
//     },
//     nohp: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     nickname: {
//         type: String,
//         required: false,
//     },
//     gameID: {
//         type: String,
//         required: false,
//     },
//     serverID: {
//         type: String,
//         required: false,
//     },
//     highRank: {
//         type: String,
//         required: false,
//     },
    
// })

// const contact1 = new Contact({
//     nama: 'Reyvaldi Zakaria',
//     nohp: '081328733023',
//     email: 'rey.zakaria123@gmail.com',
//     nickname: 'Re Angry React.',
//     gameID: '139336798',
//     serverID: '2697',
//     highRank: '75'

// })

// contact1.save().then((contact) => console.log(contact))

