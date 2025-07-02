// src/pages/ShowList.js
import React, { useEffect, useState } from 'react';
import { fetchShows } from '../services/api';

function ShowList() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetchShows()
      .then((res) => setShows(res.data))
      .catch((err) => console.error('Error fetching shows:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📺 All Shows</h2>
      {shows.length === 0 ? (
        <p>No shows found.</p>
      ) : (
        <ul>
          {shows.map(show => (
            <li key={show.SHOW_ID} style={{ marginBottom: '15px' }}>
              <img src={show.THUMBNAIL} alt={show.TITLE} width="150" />
              <div><strong>{show.TITLE}</strong></div>
              <div>{show.DESCRIPTION}</div>
              <div>Rating: {show.RATING} ⭐</div>
              <div>Released: {show.RELEASE_DATE}</div>
              <div>Duration: {show.DURATION} min</div>
              <div>Seasons: {show.SEASON_COUNT}</div>
              <div>Category: {show.CATEGORY_NAME}</div>
              <div>Publisher: {show.PUBLISHER_NAME}</div>
              <div>Age Rating: {show.AGE_RESTRICTION_LEVEL}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowList;
