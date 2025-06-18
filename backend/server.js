// route-test-server.js - Test routes one by one to find the issue
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const { createUploadsDir } = require('./utils/fileUtils');
const { gracefulShutdown } = require('./utils/serverUtils');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create uploads directory if it doesn't exist
createUploadsDir();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test routes one by one 
console.log('Testing routes one by one...');

// Let's manually define each route to see which one fails
const imageController = require('./controllers/imageController');
const { uploadMiddleware } = require('./middleware/uploadMiddleware');

// Test 1: Simple route without parameters
console.log('Adding route: GET /api/test');
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

// Test 2: Route with simple path
console.log('Adding route: GET /api/images');
try {
  app.get('/api/images', imageController.getImages);
  console.log('✅ GET /api/images added successfully');
} catch (error) {
  console.error('❌ Error adding GET /api/images:', error.message);
}

// Test 7: GET tags route
console.log('Adding route: GET /api/tags');
try {
  app.get('/api/tags', imageController.getTags);
  console.log('✅ GET /api/tags added successfully');
} catch (error) {
  console.error('❌ Error adding GET /api/tags:', error.message);
}

// Test 3: Route with parameter
console.log('Adding route: GET /api/images/:id');
try {
  app.get('/api/images/:id', imageController.getImageById);
  console.log('✅ GET /api/images/:id added successfully');
} catch (error) { 
  console.error('❌ Error adding GET /api/images/:id:', error.message);
} 

// Test 4: POST route with middleware
console.log('Adding route: POST /api/upload');
try {
  app.post('/api/upload', uploadMiddleware, imageController.uploadImage);
  console.log('✅ POST /api/upload added successfully');
} catch (error) {
  console.error('❌ Error adding POST /api/upload:', error.message);
}

// Test 5: DELETE route with parameter
console.log('Adding route: DELETE /api/images/:id');
try {
  app.delete('/api/images/:id', imageController.deleteImage);
  console.log('✅ DELETE /api/images/:id added successfully');
} catch (error) {
  console.error('❌ Error adding DELETE /api/images/:id:', error.message);
}

// Test 6: PUT route with nested parameter
console.log('Adding route: PUT /api/images/:id/tags');
try {
  app.put('/api/images/:id/tags', imageController.updateImageTags);
  console.log('✅ PUT /api/images/:id/tags added successfully');
} catch (error) {
  console.error('❌ Error adding PUT /api/images/:id/tags:', error.message);
}



// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
console.log('Starting server...');
app.listen(PORT, () => {
  console.log(`🚀 Route test server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${path.resolve('uploads')}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);