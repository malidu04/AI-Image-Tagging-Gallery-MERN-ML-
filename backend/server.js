const express = require('express');
const cors = require('cors');
const connectDB = require('.config/database');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');
const { createUploadsDir } = require('./utils/fileUtils');
const { gracefulShutdown } = require('./utils/fileUtils');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

createUploadsDir();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', imageRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend server is running!' });
});

app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(error.status || 500).json({
        error: error.message || 'Internal Server Error',
        ...PORT(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })})

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Upload directory: ${path.resolve('uploads')}`);
    console.log(`Server URL: http://localhost:${PORT}`);
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);