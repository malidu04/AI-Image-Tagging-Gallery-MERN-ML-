import React from 'react';
import '../App.css';

const API_URL = 'http://localhost:5000';

function Image({ image, onDelete, onTagClick }) {
    const imageUrl = `${API_URL}/${image.path}`;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            onDelete(image._id);
        }
    };

    return (
        <div className="image-card">
            <img src={imageUrl} alt={image.originalName} className="image-display" />
            <div className="image-details">
                <p className="image-name" title={image.originalName}>
                    {image.originalName}
                </p>
                <div className="tags-container">
                    {image.tags?.map((tag, index) => (
                        <span key={index} className="tag" onClick={() => onTagClick(tag)}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <button className="delete-button" onClick={handleDelete}>
                &times;
            </button>
        </div>
    );
}

export default Image;