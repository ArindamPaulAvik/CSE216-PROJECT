import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import './Rating.css';

const Rating = ({ episodeId, showAverageRating = true }) => {
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoadingUserRating, setIsLoadingUserRating] = useState(true);
  const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    if (episodeId) {
      fetchUserRating();
      fetchAverageRating();
    }
  }, [episodeId]);

  const fetchUserRating = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoadingUserRating(true);
      
      if (!token) {
        setIsLoadingUserRating(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/ratings/user/episode/${episodeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.rating) {
        setUserRating(response.data.rating.RATING_VALUE);
        // Reset editing state when user rating is found
        setIsEditing(false);
        setSelectedRating(0);
        setHoveredStar(0);
      } else {
        // No existing rating found
        setUserRating(null);
        setIsEditing(false);
        setSelectedRating(0);
        setHoveredStar(0);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      // Reset states on error
      setUserRating(null);
      setIsEditing(false);
      setSelectedRating(0);
      setHoveredStar(0);
    } finally {
      setIsLoadingUserRating(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ratings/episode/${episodeId}/average`);
      
      if (response.data.success) {
        setAverageRating(parseFloat(response.data.averageRating));
        setTotalRatings(response.data.totalRatings);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const submitRating = async () => {
    if (selectedRating === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setModalMessage('Please log in to rate episodes');
        setShowSuccessModal(true);
        return;
      }

      setIsSubmitting(true);
      
      await axios.post(`${BASE_URL}/ratings/episode/${episodeId}`, {
        ratingValue: selectedRating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserRating(selectedRating);
      setSelectedRating(0);
      setIsEditing(false);
      setShowConfirmModal(false);
      fetchAverageRating(); // Refresh average rating
      
      setModalMessage(userRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      setModalMessage('Failed to submit rating. Please try again.');
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      setIsSubmitting(true);
      
      await axios.delete(`${BASE_URL}/ratings/episode/${episodeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserRating(null);
      setSelectedRating(0);
      setIsEditing(false);
      setIsLoadingUserRating(false); // Reset loading state
      fetchAverageRating(); // Refresh average rating
      
      setModalMessage('Rating removed successfully!');
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error deleting rating:', error);
      setModalMessage('Failed to remove rating. Please try again.');
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating) => {
    if (isSubmitting) return;
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (selectedRating === 0) return;
    setShowConfirmModal(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedRating(userRating || 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRating(0);
    setHoveredStar(0);
  };

  const renderStars = (rating, interactive = false, size = 'medium') => {
    const stars = [];
    const starSize = size === 'large' ? '2rem' : size === 'small' ? '1rem' : '1.5rem';
    
    for (let i = 1; i <= 10; i++) {
      let filled = false;
      
      if (interactive) {
        // For interactive stars, show selection or hover state
        filled = i <= (hoveredStar || selectedRating);
      } else {
        // For display-only stars (average rating)
        filled = i <= rating;
      }
      
      const StarIcon = filled ? AiFillStar : AiOutlineStar;
      
      stars.push(
        <motion.span
          key={i}
          style={{
            display: 'inline-block',
            fontSize: starSize,
            color: filled ? '#ffd700' : '#666',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.2s ease',
            userSelect: 'none',
            marginRight: '2px'
          }}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onMouseEnter={() => interactive && setHoveredStar(i)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
          onClick={() => interactive && handleStarClick(i)}
        >
          <StarIcon />
        </motion.span>
      );
    }
    return stars;
  };

  return (
    <motion.div 
      className="rating-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* User Rating Section */}
      <div className="user-rating-section">
        <h4 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.1rem' }}>
          Rate this Episode
        </h4>
        
        {/* Show loading state while fetching user rating */}
        {isLoadingUserRating && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
              Loading your rating...
            </span>
          </div>
        )}

        {/* Show existing rating if not editing and not loading */}
        {!isLoadingUserRating && userRating && !isEditing && (
          <div className="existing-rating">
            <div className="user-rating-display">
              <span style={{ color: '#ccc', fontSize: '0.9rem', marginRight: '10px' }}>
                Your rating:
              </span>
              <span style={{ color: '#ffd700', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {userRating}/10
              </span>
            </div>
            <div className="existing-rating-stars" style={{ margin: '8px 0' }}>
              {renderStars(userRating, false)}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <motion.button
                onClick={handleEdit}
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Rating
              </motion.button>
              <motion.button
                onClick={deleteRating}
                disabled={isSubmitting}
                style={{
                  background: 'transparent',
                  border: '1px solid #e74c3c',
                  color: '#e74c3c',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{ backgroundColor: '#e74c3c', color: '#fff' }}
                whileTap={{ scale: 0.98 }}
              >
                Remove
              </motion.button>
            </div>
          </div>
        )}

        {/* Show rating interface when no rating exists or editing and not loading */}
        {!isLoadingUserRating && (!userRating || isEditing) && (
          <div className="rating-interface">
            <div className="user-rating-stars">
              {renderStars(0, true)}
            </div>
            
            <div className="rating-info" style={{ marginTop: '10px' }}>
              {selectedRating > 0 ? (
                <span style={{ color: '#ffd700', fontSize: '0.9rem' }}>
                  Selected: {selectedRating}/10
                </span>
              ) : (
                <span style={{ color: '#999', fontSize: '0.9rem' }}>
                  Click stars to select rating (1-10)
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <motion.button
                onClick={handleSubmit}
                disabled={selectedRating === 0 || isSubmitting}
                style={{
                  background: selectedRating > 0 
                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                    : '#555',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: selectedRating > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: '500',
                  opacity: selectedRating > 0 ? 1 : 0.6
                }}
                whileHover={selectedRating > 0 ? { scale: 1.02 } : {}}
                whileTap={selectedRating > 0 ? { scale: 0.98 } : {}}
              >
                {isEditing ? 'Update Rating' : 'Submit Rating'}
              </motion.button>

              {isEditing && (
                <motion.button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  style={{
                    background: 'transparent',
                    border: '1px solid #6c757d',
                    color: '#6c757d',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  whileHover={{ backgroundColor: '#6c757d', color: '#fff' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>

      {isSubmitting && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ color: '#fff', fontSize: '0.9rem' }}>Submitting...</div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #444',
                minWidth: '300px',
                textAlign: 'center'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.2rem' }}>
                Confirm Rating
              </h3>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                {isEditing ? 'Update' : 'Submit'} your rating of {selectedRating}/10 for this episode?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <motion.button
                  onClick={submitRating}
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm'}
                </motion.button>
                <motion.button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  style={{
                    background: 'transparent',
                    border: '1px solid #6c757d',
                    color: '#6c757d',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  whileHover={{ backgroundColor: '#6c757d', color: '#fff' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success/Error Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #444',
                minWidth: '300px',
                textAlign: 'center'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 style={{ 
                color: modalMessage.includes('successfully') ? '#28a745' : '#e74c3c', 
                marginBottom: '15px', 
                fontSize: '1.2rem' 
              }}>
                {modalMessage.includes('successfully') ? '✓ Success' : '✗ Error'}
              </h3>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                {modalMessage}
              </p>
              <motion.button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Rating;
