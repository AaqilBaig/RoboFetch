const mongoose = require('mongoose')

const medicalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    x: Number,
    y: Number
})

module.exports = mongoose.model('Medical', medicalSchema)