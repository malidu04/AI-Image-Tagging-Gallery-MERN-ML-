const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data'); // ✅ use node form-data
const path = require('path');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class MLService {
  constructor() {
    this.timeout = 30000; // 30 seconds timeout
  }

  async analyzeImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(file.path), {
        filename: file.filename,
        contentType: file.mimetype
      });

      const response = await axios.post(`${ML_SERVICE_URL}/analyze`, formData, {
        headers: {
          ...formData.getHeaders() // ✅ get proper headers
        },
        timeout: this.timeout
      });

      return response.data;
    } catch (error) {
      console.error('ML Service Error:', error.message);

      if (error.code === 'ECONNREFUSED') {
        throw new Error('ML service is not available');
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('ML service timeout');
      }

      throw new Error(`ML service error: ${error.message}`);
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      return { status: 'unavailable', error: error.message };
    }
  }

  async getAvailableModels() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/models`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get available models: ${error.message}`);
    }
  }
}

module.exports = new MLService();
