const express = require('express');
const router = express.Router();
const InferenceLog = require('../models/inference.model.js');

router.get('/', async (req, res) => {
    try{
        const logs = await InferenceLog.find();
        const total = logs.length;
        const validLogs = logs.filter(
        (log) =>
            typeof log.latency === "number"
        );

        const avgLatency =
        validLogs.length > 0

            ? Math.round(
                validLogs.reduce(
                (sum, log) =>
                    sum + log.latency,
                0
                ) / validLogs.length
            )

            : 0;
        const errorRate = logs.filter(log => log.status === 'error').length;
        const throughput = total;
        const recentLogs =
        logs
            .slice(-8)
            .reverse()
            .map((log) => ({

            model:
                log.model,

            latency:
                log.latency,

            status:
                log.status,

            timestamp:
                new Date(
                log.timestamp
                )
                .toLocaleTimeString(),

            }));

            const providerUsage = Object.values(logs.reduce((acc,log)=>{
              if(!acc[log.provider]){acc[log.provider]={provider: log.provider, count:0}}
                acc[log.provider].count++;
                return acc;
              },{}));

        res.json({ total, avgLatency, errorRate, throughput, latencyTrend: logs.map((log) => ({
            timestamp: new Date(
                log.timestamp
            ).toLocaleTimeString(),

            latency:
                log.latency || 0,
            })),
                recentLogs,
                providerUsage
    });
    }catch(err){
        console.error('Error fetching analytics data:', err);
        res.status(500).json({ message: 'Analytics data not available' });
    }
})

module.exports = router;