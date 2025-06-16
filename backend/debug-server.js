// debug-server.js - Load modules step by step to find the issue
const express = require('express');

console.log('✅ Express loaded');

const cors = require('cors');
console.log('✅ CORS loaded');

const path = require('path');
console.log('✅ Path loaded');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('✅ Express app created');

// Try loading your custom modules one by one
console.log('🔍 Attempting to load database config...');
try {
  const connectDB = require('./config/database');
  console.log('✅ Database config loaded');
} catch (error) {
  console.error('❌ Error loading database config:', error.message);
  process.exit(1);
}

console.log('🔍 Attempting to load file utils...');
try {
  const { createUploadsDir } = require('./utils/fileUtils');
  console.log('✅ File utils loaded');
} catch (error) {
  console.error('❌ Error loading file utils:', error.message);
  process.exit(1);
}

console.log('🔍 Attempting to load server utils...');
try {
  const { gracefulShutdown } = require('./utils/serverUtils');
  console.log('✅ Server utils loaded');
} catch (error) {
  console.error('❌ Error loading server utils:', error.message);
  process.exit(1);
}

console.log('🔍 Attempting to load upload middleware...');
try {
  const { uploadMiddleware } = require('./middleware/uploadMiddleware');
  console.log('✅ Upload middleware loaded');
} catch (error) {
  console.error('❌ Error loading upload middleware:', error.message);
  process.exit(1);
}

console.log('🔍 Attempting to load image controller...');
try {
  const imageController = require('./controllers/imageController');
  console.log('✅ Image controller loaded');
} catch (error) {
  console.error('❌ Error loading image controller:', error.message);
  process.exit(1);
}

console.log('🔍 Attempting to load image routes...');
try {
  const imageRoutes = require('./routes/imageRoutes');
  console.log('✅ Image routes loaded');
} catch (error) {
  console.error('❌ Error loading image routes:', error.message);
  console.error('Full error stack:', error.stack);
  process.exit(1);
}

// Basic middleware
app.use(cors());
app.use(express.json());

console.log('✅ Basic middleware applied');

// Try to apply your routes
console.log('🔍 Attempting to apply image routes...');
try {
  app.use('/api', imageRoutes);
  console.log('✅ Image routes applied');
} catch (error) {
  console.error('❌ Error applying image routes:', error.message);
  console.error('Full error stack:', error.stack);
  process.exit(1);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running!' });
});

console.log('✅ Health check route added');

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
});

console.log('✅ All modules loaded successfully!');