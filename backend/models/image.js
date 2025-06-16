// models/Image.js - Image model schema
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  confidence: {
    type: Object,
    default: {}
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better search performance
imageSchema.index({ tags: 1 });
imageSchema.index({ originalName: 'text', tags: 'text' });
imageSchema.index({ uploadDate: -1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;