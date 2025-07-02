import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const imagePaths = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
];

function Login() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % imagePaths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token); // Save JWT token here
        navigate('/frontpage'); // Redirect on successful login
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#1e1e1e',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <img
        src={imagePaths[currentImageIndex]}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          objectPosition: '37% 0%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 0,
          transition: 'opacity 1s ease-in-out',
          opacity: 1
        }}
      />
      <div style={{ display: 'flex', flex: 1, zIndex: 1 }}>
        <div style={{
          width: '75%',
          height: '70%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            width: '220px',
            height: '220px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '70px',
            zIndex: 2
          }}>
            <img
              src="/images/logo.png"
              alt="App Logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        <div style={{
          width: '25%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '40px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Log In</h2>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: '12px', marginBottom: '15px', borderRadius: '4px',
                border: 'none', fontSize: '16px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: '12px', marginBottom: '15px', borderRadius: '4px',
                border: 'none', fontSize: '16px'
              }}
            />
            <button type="submit" style={{
              padding: '12px',
              backgroundColor: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Log In
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

          <div style={{ color: '#ccc', marginTop: '15px', textAlign: 'center' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#0d6efd', textDecoration: 'none' }}>
              Register here
            </a>
          </div>
        </div>
      </div>

      <div style={{
        height: '18px',
        width: '100%',
        backgroundColor: '#000',
        color: '#ccc',
        textAlign: 'center',
        padding: '16px 0',
        fontSize: '15px',
        zIndex: 1
      }}>
        Wrong portal? Go{' '}
        <button
          onClick={() => alert("Redirect logic goes here")}
          style={{
            color: '#0d6efd',
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          here →
        </button>
      </div>
    </div>
  );
}

export default Login;
