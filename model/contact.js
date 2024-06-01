const mongoose = require('mongoose')

const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: false,
    },
    gameID: {
        type: String,
        required: false,
    },
    serverID: {
        type: String,
        required: false,
    },
    highRank: {
        type: Number,
        required: false,
    },
    
})

module.exports = Contact