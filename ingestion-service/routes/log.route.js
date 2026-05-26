const express = require('express');
const router = express.Router();
const InferenceLog = require('../models/inference.model.js');

router.post('/', async (req, res) => {
    try{ 
        await InferenceLog.create(req.body);

        console.log('Received log data:', req.body);

        res.status(200).json({ message: 'Log data received successfully' });
    } catch (error) {
        
        console.error('Error creating inference log:', error);

        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;