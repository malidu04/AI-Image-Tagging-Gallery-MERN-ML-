import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadImage = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getImages = async (search = '', tag = '', page = 1, limit = 20) => {
  try {
    const response = await api.get('/api/images', { 
      params: { search, tag, page, limit } 
    });
    // The backend now returns an object { images: [], pagination: {} }
    // We return this whole object to the component.
    return response.data; 
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const deleteImage = (id) => {
  return api.delete(`/api/images/${id}`);
};

export default api;