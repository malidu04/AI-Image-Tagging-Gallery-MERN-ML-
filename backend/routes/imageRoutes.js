const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

router.post('/upload', uploadMiddleware, imageController.uploadMiddleware);

router.get('/images', imageController.getImages);

router.get('/tags', imageController.getTags);

router.get('/images/:id', imageController.getImageById);

router.delete('/images/:id', imageController.deleteImage);

router.put('/images/:id/tags', imageController.updateImageTags);

module.exports = router;