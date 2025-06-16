import React, { useState, useEffect, useCallback } from 'react';
import ImageUpload from './components/ImageUpload.jsx';
import ImageList from './components/ImageList.jsx';
import SearchBar from './components/SearchBar.jsx';
import { getImages, deleteImage as apiDeleteImage } from './services/api';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  // --- NEW STATE FOR PAGINATION ---
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback will now depend on the 'page' state
  const fetchImages = useCallback(async (search = '', tag = '', requestedPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Pass the requested page to the API
      const response = await getImages(search, tag, requestedPage);

      // --- UPDATED LOGIC TO HANDLE OBJECT RESPONSE ---
      if (response && Array.isArray(response.images)) {
        // If it's the first page, replace the images. Otherwise, append them.
        setImages(prevImages => 
          requestedPage === 1 ? response.images : [...prevImages, ...response.images]
        );
        setPagination(response.pagination);
      } else {
        console.error("API response is not in the expected format:", response);
        setError("Received an invalid response from the server.");
        setImages([]);
        setPagination(null);
      }
    } catch (err) {
      setError('Failed to fetch images. Please make sure the backend server is running.');
      console.error(err);
      setImages([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchImages('', '', 1); // Fetch the first page on initial load
  }, [fetchImages]);

  // --- HANDLER UPDATES TO RESET PAGE ---
  const handleUploadSuccess = () => {
    setPage(1); // Reset to page 1
    fetchImages('', '', 1); 
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteImage(id);
      // Refetch the current view after deleting
      setPage(1);
      fetchImages('', '', 1);
    } catch (err) {
      setError('Failed to delete image.');
      console.error(err);
    }
  };

  const handleSearch = (searchTerm) => {
    setPage(1); // Reset to page 1 for a new search
    fetchImages(searchTerm, '', 1);
  };

  const handleTagClick = (tag) => {
    setPage(1); // Reset to page 1 for a new tag filter
    fetchImages('', tag, 1);
  };

  // --- NEW HANDLER FOR "LOAD MORE" ---
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    // Fetch the next page of images (re-using the current search/tag filters)
    fetchImages(
      pagination?.search || '', 
      pagination?.tag || '', 
      nextPage
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📸 Image Analysis Gallery</h1>
        <p>Upload an image to automatically tag it using a machine learning model.</p>
      </header>
      <main>
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
        <SearchBar onSearch={handleSearch} />
        {error && <p className="error-message">{error}</p>}

        <ImageList
          images={images}
          onDelete={handleDelete}
          onTagClick={handleTagClick}
        />

        {/* --- UI FOR LOADING AND LOAD MORE BUTTON --- */}
        {loading && <p>Loading...</p>}

        {!loading && pagination && pagination.page < pagination.pages && (
          <div className="load-more-container">
            <button onClick={handleLoadMore} className="load-more-button">
              Load More
            </button>
          </div>
        )}

      </main>
      <footer>
        <p>Backend by Node.js | Frontend by React</p>
      </footer>
    </div>
  );
}

export default App;