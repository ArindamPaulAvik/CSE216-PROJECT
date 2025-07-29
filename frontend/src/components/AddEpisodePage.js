import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEpisodePage() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episodeLink: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Debug logging
      console.log('BASE_URL:', BASE_URL);
      console.log('Token exists:', !!token);
      console.log('Form data:', formData);
      
      // First test if the main server is accessible
      const mainTestResponse = await fetch(`${BASE_URL}/api/submissions-test`, {
        method: 'GET'
      });
      
      console.log('Main server test status:', mainTestResponse.status);
      if (mainTestResponse.status !== 200) {
        console.error('Main server not accessible');
        const mainTestText = await mainTestResponse.text();
        console.error('Main test response:', mainTestText);
        alert('Server not accessible. Please check server status.');
        return;
      }

      // Now test if the submissions endpoint is accessible
      const testResponse = await fetch(`${BASE_URL}/api/submissions/test-simple`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      console.log('Test endpoint status:', testResponse.status);
      if (testResponse.status !== 200) {
        console.error('Submissions router not accessible');
        const debugText = await testResponse.text();
        console.error('Test response:', debugText);
        
        // Try the catch-all route to see if requests reach the router at all
        const catchAllResponse = await fetch(`${BASE_URL}/api/submissions/anything`, {
          method: 'GET'
        });
        console.log('Catch-all route status:', catchAllResponse.status);
        const catchAllText = await catchAllResponse.text();
        console.log('Catch-all response:', catchAllText);
        
        alert('Submissions endpoint not accessible. Please check server status.');
        return;
      }

      // Now try the actual episode submission
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('episodeLink', formData.episodeLink);

      console.log('Making episode submission request...');
      const response = await fetch(`${BASE_URL}/api/submissions/episode`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('Episode submission response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        navigate('/manage-content');
      } else {
        const errorText = await response.text();
        console.error('Failed to add episode. Status:', response.status);
        console.error('Error response:', errorText);
        
        // Show user-friendly error
        alert(`Failed to add episode: ${response.status} - ${errorText}`);
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
          <form onSubmit={handleSubmit}>
            {/* Episode Information Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem' }}>Episode Information</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Title *
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
                  placeholder="Enter episode title"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Description *
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
                  placeholder="Enter episode description"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Link to Episode *
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
                  placeholder="Enter link to episode"
                />
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
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(45deg, #ffa726, #ff9800)',
                  color: '#fff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Episode'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEpisodePage; 