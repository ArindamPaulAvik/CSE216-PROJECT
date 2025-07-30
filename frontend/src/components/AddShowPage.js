import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddShowPage() {
  const navigate = useNavigate();
  const BASE_URL = 'https://cse216-project.onrender.com';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teaser: '',
    categoryType: 'Movie',
    movieLink: ''
  });
  
  const [bannerFile, setBannerFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'banner') {
      setBannerFile(file);
    } else if (type === 'thumbnail') {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('teaser', formData.teaser);
      formDataToSend.append('categoryType', formData.categoryType);
      if (formData.categoryType === 'Movie') {
        formDataToSend.append('movieLink', formData.movieLink);
      }
      if (bannerFile) {
        formDataToSend.append('banner', bannerFile);
      }
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }
      const response = await fetch(`${BASE_URL}/api/submissions/show`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      if (response.ok) {
        navigate('/manage-content');
      } else {
        console.error('Failed to add show');
      }
    } catch (error) {
      console.error('Error adding show:', error);
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
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Add New Show</h1>
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
            {/* Text Fields Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem' }}>Show Information</h3>
              {/* Category Type Dropdown */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Category Type *
                </label>
                <select
                  name="categoryType"
                  value={formData.categoryType}
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
                >
                  <option value="Movie" style={{ background: '#2a2a2a', color: '#fff' }}>Movie</option>
                  <option value="Series" style={{ background: '#2a2a2a', color: '#fff' }}>Series</option>
                </select>
              </div>
              {/* Link to Movie (only if Movie is selected) */}
              {formData.categoryType === 'Movie' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                    Link to movie *
                  </label>
                  <input
                    type="url"
                    name="movieLink"
                    value={formData.movieLink}
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
                    placeholder="Enter link to movie"
                  />
                </div>
              )}
              
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
                  placeholder="Enter show title"
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
                  placeholder="Enter show description"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Trailer URL *
                </label>
                <input
                  type="url"
                  name="teaser"
                  value={formData.teaser}
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
                  placeholder="Enter trailer URL"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem' }}>Images</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Banner Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'banner')}
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
                />
                {bannerFile && (
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#8cf' }}>
                    Selected: {bannerFile.name}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
                  Thumbnail Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'thumbnail')}
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
                />
                {thumbnailFile && (
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#8cf' }}>
                    Selected: {thumbnailFile.name}
                  </div>
                )}
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
                {isSubmitting ? 'Adding...' : 'Add Show'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddShowPage; 
