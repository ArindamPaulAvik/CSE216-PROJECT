import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // or wherever you store JWT

    axios.get('http://localhost:5000/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFavorites(res.data.favorites);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to load favorites');
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>{error}</p>;

  if (favorites.length === 0) return <p>No favorites added yet.</p>;

  return (
    <div>
      <h1>Your Favorites</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {favorites.map(show => (
          <li key={show.SHOW_ID} style={{ marginBottom: '20px' }}>
            <img src={`/showS/${show.THUMBNAIL}`} alt={show.TITLE} style={{ width: '150px', borderRadius: '10px' }} />
            <h3>{show.TITLE}</h3>
            <p>{show.DESCRIPTION}</p>
            <p><strong>Rating:</strong> {show.RATING}</p>
            <p><strong>Genres:</strong> {show.GENRES || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
