// services/mlService.js - ML service integration
const axios = require('axios');
const fs = require('fs');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class MLService {
  constructor() {
    this.timeout = 30000; // 30 seconds timeout
  }

  async analyzeImage(file) {
    try {
      const formData = new FormData();
      const imageBuffer = fs.readFileSync(file.path);
      const blob = new Blob([imageBuffer], { type: file.mimetype });
      formData.append('image', blob, file.filename);

      const response = await axios.post(`${ML_SERVICE_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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