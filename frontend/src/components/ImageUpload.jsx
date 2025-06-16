import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import '../App.css';

function ImageUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File is too large. Max size is 5MB.');
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Invalid file type. Please select an image.');
        return;
      }
      setFile(selectedFile);
      setError('');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');
    setMessage('');

    try {
      const res = await uploadImage(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      setMessage(res.data.message || 'Upload successful!');
      if (res.data.warning) {
        setError(res.data.warning);
      }
      onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.details || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setFile(null);
      document.getElementById('file-input').value = null;
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload New Image</h2>
      <div className="upload-form">
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          disabled={uploading}
        />
        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? `Uploading... ${progress}%` : 'Upload & Analyze'}
        </button>
      </div>
      {uploading && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ImageUpload;