const Image = require('../models/image');
const mlService = require('../services/mlService');
const { deleteFile } = require('../utils/fileUtils');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No File Uploaded' });
        }

        console.log('File uploaded:', req.file.filename);

        try {

            const mlResult = await mlService.analyzeImage(req.file);
            const { tags, confidence } = mlResult;

            const newImage = new Image({
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                tags: tags,
                confidence: confidence,
                fileSize: req.file.size,
                mimeType: req.file.mimetype
            });

            await newImage.save();

            res.json({
                success: true,
                image: newImage,
                message: 'Image Uploaded and Analyzed Successfully'
            });
        } catch (mlError) {
            console.error('ML Service Error:', mlError.message);

            const newImage = new Image({
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                tags: ['unanalyzed'],
                confidence: {},
                fileSize: req.file.size,
                mimeType: req.file.mimetype
            });

            await newImage.save();

            res.json({
                success: true,
                image: newImage,
                message: 'Image uploaded but ML analysis failed',
                warning: 'ML service unavailable'
            });
        }
    } catch (error) {
        console.error('Upload error', error);

        if(req.file && req.file.path) {
            deleteFile(req.file.path);
        }
        res.status(500).json({ error: 'upload failed', details: error.message });
    }
};

const getImages = async (req, res) => {
    try {
        const { tag, search, page = 1, limit = 20 } = req.query;
        let query = {};

        if(tag && tag != 'all') {
            query.tags = { $in: [tag] };
        }

        if(search) {
            query.$or = [
                { tags: { $regex: search, $options: 'i' } },
                { originalName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [images, totla] = await Promise.all([
            Image.find(query)
                .sort({ uploadDate: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Image.countDocuments(query)
        ]);

        res.json({
            images,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get Images Error:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
};

const getTags = async (req, res) => {
  try {
    const tags = await Image.distinct('tags');
    const filteredTags = tags.filter(tag => tag !== 'unanalyzed');
    res.json(filteredTags.sort());
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Get image by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    deleteFile(image.path);

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// Update image tags manually
const updateImageTags = async (req, res) => {
  try {
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }

    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { tags: tags },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ message: 'Tags updated successfully', image });
  } catch (error) {
    console.error('Update tags error:', error);
    res.status(500).json({ error: 'Failed to update tags' });
  }
};

module.exports = {
  uploadImage,
  getImages,
  getTags,
  getImageById,
  deleteImage,
  updateImageTags
};