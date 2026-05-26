const mongoose = require('mongoose');

const inferenceSchema = new mongoose.Schema({
    provider: { 
        type: String, 
        required: true 
    },
    model: { 
        type: String,
        required: true 
    },
    sessionId: { 
        type: String, 
        required: true 
    },
    latency: { 
        type: Number, 
        required: false 
    },
    tokenUsage: {
         prompt: Number,
         completion: Number,
         total: Number
     },
    inputPreview: String,
    outputPreview: { 
        type: String, 
        default: null 
    },
    status: { 
        type: String, 
        enum: ['success', 'error'], 
        required: true 
    },
    error: { 
        type: String, 
        default: null 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const InferenceLog = mongoose.model('Inference', inferenceSchema);

module.exports = InferenceLog;