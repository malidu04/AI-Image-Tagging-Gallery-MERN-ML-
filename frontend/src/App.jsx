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
        <div className="header-container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7ZM12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="logo-text">
                <h1>AI Vision Gallery</h1>
                <span className="logo-tagline">Intelligent Image Analysis</span>
              </div>
            </div>
            
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{images.length}</span>
                <span className="stat-label">Images</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">AI</span>
                <span className="stat-label">Powered</span>
              </div>
            </div>
          </div>
          
          <div className="header-description">
            <p>
              <span className="highlight">Transform your images</span> with cutting-edge machine learning. 
              Upload, analyze, and discover patterns in your visual content with our advanced AI tagging system.
            </p>
          </div>
          
          <div className="header-features">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <span>Smart Tagging</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔍</div>
              <span>Instant Search</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Real-time Analysis</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <span>Visual Intelligence</span>
            </div>
          </div>
        </div>
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

      <footer className="App-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7ZM12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9Z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h4>AI Vision Gallery</h4>
                  <p>Empowering visual discovery through artificial intelligence</p>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h5>Technology Stack</h5>
              <div className="tech-stack">
                <div className="tech-item">
                  <span className="tech-icon">⚛️</span>
                  <span>React.js</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🟢</span>
                  <span>Node.js</span>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h5>Features</h5>
              <ul className="feature-list">
                <li>AI-Powered Image Analysis</li>
                <li>Intelligent Auto-Tagging</li>
                <li>Advanced Search & Filtering</li>
                <li>Real-time Processing</li>
              </ul>
            </div>

            <div className="footer-section">
              <h5>Performance</h5>
              <div className="performance-stats">
                <div className="perf-item">
                  <span className="perf-value">99.9%</span>
                  <span className="perf-label">Accuracy</span>
                </div>
                <div className="perf-item">
                  <span className="perf-value">&lt;2s</span>
                  <span className="perf-label">Analysis Time</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <p>&copy; {new Date().getFullYear()} AI Vision Gallery. Powered by machine learning excellence.</p>
            </div>
            <div className="footer-bottom-right">
              <div className="footer-badges">
                <span className="badge">ML Powered</span>
                <span className="badge">Real-time</span>
                <span className="badge">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;