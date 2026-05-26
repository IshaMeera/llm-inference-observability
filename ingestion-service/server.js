require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');

const app = express();
app.use(cors());
app.use(express.json());

const logRoutes = require('./routes/log.route.js');
const chatRoutes = require('./routes/chat.route.js');
const analyticsRoutes = require('./routes/analytics.route.js');

connectDB();

app.use('/logs', logRoutes);
app.use('/chats', chatRoutes);
app.use('/analytics', analyticsRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Ingestion service is running on port ${process.env.PORT}`);
});