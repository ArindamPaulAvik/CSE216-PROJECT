import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const imagePaths = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
];

function Register() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userFirstname: '',
    userLastname: '',
    countryId: 'BD',
  });

  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % imagePaths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      if (response.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundImage: `url(${imagePaths[currentImageIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 1s ease-in-out',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: '40px',
        borderRadius: '8px',
        color: 'white',
        width: '400px',
        boxSizing: 'border-box',
        boxShadow: '0 0 15px rgba(0,0,0,0.7)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>

        <label>Email:</label>
        <input name="email" type="email" required value={formData.email} onChange={handleChange}
          style={{ width: '100%', marginBottom: '15px', padding: '8px' }} />

        <label>Password:</label>
        <input name="password" type="password" required value={formData.password} onChange={handleChange}
          style={{ width: '100%', marginBottom: '15px', padding: '8px' }} />

        <label>First Name:</label>
        <input name="userFirstname" type="text" required value={formData.userFirstname} onChange={handleChange}
          style={{ width: '100%', marginBottom: '15px', padding: '8px' }} />

        <label>Last Name:</label>
        <input name="userLastname" type="text" required value={formData.userLastname} onChange={handleChange}
          style={{ width: '100%', marginBottom: '15px', padding: '8px' }} />

        <label>Country:</label>
        <select name="countryId" value={formData.countryId} onChange={handleChange}
          style={{ width: '100%', marginBottom: '25px', padding: '8px' }}>
          <option value="BD">Bangladesh</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="IN">India</option>
          <option value="CA">Canada</option>
        </select>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{
          width: '100%', padding: '10px', backgroundColor: '#e50914',
          border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer'
        }}>Register</button>
                    <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              border: '1px solid #e50914',
              color: '#e50914',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Return to Login
          </button>
      </form>

      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 999
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '10px',
            textAlign: 'center', animation: 'fadeIn 0.3s ease-in-out',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)', maxWidth: '300px'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>🎉 Registration Successful!</h3>
            <p style={{ marginBottom: '20px', color: '#555' }}>You can now login.</p>
            <button onClick={handleCloseModal} style={{
              padding: '10px 20px', backgroundColor: '#e50914',
              border: 'none', color: 'white', borderRadius: '5px',
              fontWeight: 'bold', cursor: 'pointer'
            }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
