import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <input
        type="text"
        placeholder="Search by tag or filename..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#28a745', color: 'white' }}>Search</button>
    </form>
  );
}

export default SearchBar;