const mongoose = require('mongoose')

const medicalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rackNo : {
        type: Number,
        required: true
    },
    quantity: {
        type: Number
    },
    stock: {
        type: Number
    }
})

module.exports = mongoose.model('Medical', medicalSchema)