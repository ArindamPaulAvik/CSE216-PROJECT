import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEpisodePage() {
  const navigate = useNavigate();
  const BASE_URL = 'https://cse216-project.onrender.com';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episodeLink: ''
  });
  
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch series for the current publisher
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching series from:', `${BASE_URL}/publishers/my-shows`);
        
        const response = await fetch(`${BASE_URL}/publishers/my-shows`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const shows = await response.json();
          console.log('All shows received:', shows);
          
          // Filter for series (CATEGORY_ID 2 represents series)
          const seriesShows = shows.filter(show => 
            show.CATEGORY_ID === 2 && show.REMOVED === 0
          );
          
          console.log('Filtered series:', seriesShows);
          setSeries(seriesShows);
          
          if (seriesShows.length === 0) {
            setError('No series found. Please submit and get approval for a series first before adding episodes.');
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch shows:', response.status, errorText);
          setError(`Failed to fetch series: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Error fetching series:', error);
        setError(`Network error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [BASE_URL]);

  const handleBack = () => {
    navigate('/manage-content');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeriesChange = (e) => {
    setSelectedSeries(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSeries) {
      alert('Please select a series for the episode.');
      return;
    }
    
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication required. Please log in.');
        return;
      }
  
      // Send as JSON instead of FormData
      const episodeData = {
        title: formData.title,
        description: formData.description,
        episodeLink: formData.episodeLink,
        showId: selectedSeries
      };
  
      console.log('Submitting episode data:', episodeData);
  
      const response = await fetch(`${BASE_URL}/api/submissions/episode`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'  // This is crucial
        },
        body: JSON.stringify(episodeData)  // Send as JSON string
      });
  
      console.log('Episode submission response status:', response.status);
  
      if (response.ok) {
        const result = await response.json();
        console.log('Episode submitted successfully:', result);
        alert('Episode submitted successfully!');
        navigate('/manage-content');
      } else {
        const errorText = await response.text();
        console.error('Failed to submit episode:', response.status, errorText);
        alert(`Failed to submit episode: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <header
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '600',
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Add New Episode</h1>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          
          {/* Loading State */}
          {loading && (
            <div style={{
              background: 'rgba(0, 123, 255, 0.1)',
              border: '1px solid rgba(0, 123, 255, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              color: '#007bff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>🔄 Loading your series...</div>
              <div style={{ fontSize: '14px' }}>Please wait while we fetch your available series.</div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              color: '#dc3545'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>⚠️ Error</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>{error}</p>
              {series.length === 0 && (
                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={() => navigate('/add-show')}
                    style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      border: '1px solid rgba(220, 53, 69, 0.5)',
                      borderRadius: '5px',
                      padding: '8px 15px',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Go to Add Show →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success State - Series Found */}
          {!loading && !error && series.length > 0 && (
            <div style={{
              background: 'rgba(40, 167, 69, 0.1)',
              border: '1px solid rgba(40, 167, 69, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              color: '#28a745'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>✅ Series Available</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                Found {series.length} series available for episode creation.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Episode Information Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem' }}>Episode Information</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Series *
                </label>
                <select
                  value={selectedSeries}
                  onChange={handleSeriesChange}
                  required
                  disabled={loading || series.length === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: loading || series.length === 0 ? 'rgba(100,100,100,0.1)' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: loading || series.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">
                    {loading ? 'Loading series...' : 
                     series.length === 0 ? 'No series available' : 
                     'Select a series'}
                  </option>
                  {series.map(show => (
                    <option key={show.SHOW_ID} value={show.SHOW_ID}>
                      {show.TITLE}
                    </option>
                  ))}
                </select>
                
                {selectedSeries && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {series.find(s => s.SHOW_ID == selectedSeries)?.THUMBNAIL && (
                      <img 
                        src={`${BASE_URL}/shows/${series.find(s => s.SHOW_ID == selectedSeries)?.THUMBNAIL}`} 
                        alt="Series thumbnail" 
                        style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '5px' }} 
                      />
                    )}
                    <span style={{ color: '#8cf', fontSize: '14px' }}>
                      Selected: {series.find(s => s.SHOW_ID == selectedSeries)?.TITLE}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Episode Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="Enter episode title (e.g., Episode 1: The Beginning)"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Episode Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter episode description..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Episode Link *
                </label>
                <input
                  type="url"
                  name="episodeLink"
                  value={formData.episodeLink}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="https://example.com/episode-link"
                />
                <div style={{ marginTop: '5px', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                  Provide a direct link to where the episode can be viewed
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading || series.length === 0}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSubmitting || loading || series.length === 0 ? 
                    'rgba(100, 100, 100, 0.5)' : 
                    'linear-gradient(45deg, #ffa726, #ff9800)',
                  color: '#fff',
                  cursor: isSubmitting || loading || series.length === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  opacity: isSubmitting || loading || series.length === 0 ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Add Episode'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEpisodePage;
