// utils/fileUtils.js - File system utilities
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const createUploadsDir = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Created uploads directory');
    } catch (error) {
      console.error('❌ Failed to create uploads directory:', error.message);
      process.exit(1);
    }
  }
};

// Delete file safely
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to delete file:', error.message);
    return false;
  }
};

// Get file stats
const getFileStats = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath);
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get file stats:', error.message);
    return null;
  }
};

// Check if file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

// Get file extension
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

// Validate image file extension
const isValidImageExtension = (filename) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = getFileExtension(filename);
  return validExtensions.includes(ext);
};

// Format file size in human readable format
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Clean up old files (older than specified days)
const cleanupOldFiles = (directory, daysOld = 30) => {
  try {
    const files = fs.readdirSync(directory);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = getFileStats(filePath);
      
      if (stats && stats.mtime < cutoffDate) {
        if (deleteFile(filePath)) {
          deletedCount++;
        }
      }
    });
    
    console.log(`🧹 Cleaned up ${deletedCount} old files`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Failed to cleanup old files:', error.message);
    return 0;
  }
};

module.exports = {
  createUploadsDir,
  deleteFile,
  getFileStats,
  fileExists,
  getFileExtension,
  isValidImageExtension,
  formatFileSize,
  cleanupOldFiles
};