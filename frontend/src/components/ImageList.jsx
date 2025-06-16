import React from 'react';
import Image from './Image.jsx';
import '../App.css';

function ImageList({ images, onDelete, onTagClick }) {
  if (!images || images.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No images found. Try uploading one!</p>;
  }

  return (
    <div className="image-list">
      {images.map((image) => (
        <Image
          key={image._id}
          image={image}
          onDelete={onDelete}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}

export default ImageList;