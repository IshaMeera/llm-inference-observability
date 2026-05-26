const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sessionId:{
        type: String,
        required: true,
        index: true
     },
     role:{
        type: String,
        enum: ['user', 'assistant'],
        required: true
     },
     content:{
        type: String,
        required: true
     },
     sequence:{
        type: Number,
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);