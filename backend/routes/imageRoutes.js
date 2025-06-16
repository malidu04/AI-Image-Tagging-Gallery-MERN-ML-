// routes/imageRoutes.js - Image-related API routes
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

// Upload and analyze image
router.post('/upload', uploadMiddleware, imageController.uploadImage);

// Get all images with optional filtering
router.get('/images', imageController.getImages);
 
// Get unique tags
router.get('/tags', imageController.getTags);

// Get single image by ID
router.get('/images/:id', imageController.getImageById);

// Delete image
router.delete('/images/:id', imageController.deleteImage);

// Update image tags manually
router.put('/images/:id/tags', imageController.updateImageTags);

module.exports = router;