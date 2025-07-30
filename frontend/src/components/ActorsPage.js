import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';

function ActorsPage() {
  const [actors, setActors] = useState([]);
  const [filteredActors, setFilteredActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const BASE_URL = 'https://cse216-project.onrender.com';


  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${BASE_URL}/actors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setActors(res.data);
        setFilteredActors(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredActors(actors);
    } else {
      const filtered = actors.filter(actor =>
        actor.NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredActors(filtered);
    }
  }, [searchTerm, actors]);

  const ActorCard = ({ actor, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
      once: true, 
      amount: 0.3,
      margin: "0px 0px -100px 0px"
    });

    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.7, opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: (index % 4) * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.08,
          rotateY: 5,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/actor/${actor.ACTOR_ID}`)}
        className="actor-card"
      >
        <div className="actor-card-inner">
          <div className="actor-image-container">
            <motion.img
              src={`${BASE_URL}/actors/${actor.PICTURE}`}
              alt={actor.NAME}
              className="actor-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              onError={(e) => {
                e.target.src = `${BASE_URL}/actors/${actor.PICTURE}`;
              }}
            />
            {/* Glass overlay with actor info */}
            <div className="actor-glass-overlay">
              <motion.div
                className="actor-glass-content"
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="actor-glass-name">{actor.NAME}</h3>
                <p className="actor-glass-role">Actor</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="actors-page">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            🎬 Actors
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover talented actors and their amazing performances
          </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="search-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="search-bar">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search actors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Actor Grid */}
        <motion.div
          className="actors-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredActors.length > 0 ? (
            filteredActors.map((actor, index) => (
              <ActorCard key={actor.ACTOR_ID} actor={actor} index={index} />
            ))
          ) : (
            <div className="no-results">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="no-results-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                <h3>No actors found</h3>
                <p>Try adjusting your search query</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .actors-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 40px 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: #a0a0a0;
          margin-top: 10px;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .search-container {
          max-width: 600px;
          margin: 10px auto 0;
          margin-bottom: 8px; /* Add small bottom margin */
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          padding: 10px 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
        }

        .search-icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          color: #a0a0a0;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          padding: 8px 0;
          outline: none;
        }

        .search-input::placeholder {
          color: #a0a0a0;
        }

        .clear-search {
          background: none;
          border: none;
          color: #a0a0a0;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .clear-search:hover {
          color: white;
        }

        .clear-search svg {
          width: 18px;
          height: 18px;
        }

        .actors-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 80px 25px;
          padding: 0 0 20px 0; /* Remove top padding */
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 10px;
        }

        .no-results {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        .no-results-content {
          text-align: center;
          color: #a0a0a0;
        }

        .no-results-content svg {
          margin-bottom: 20px;
          color: #8b5cf6;
        }

        .no-results-content h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: white;
        }

        .no-results-content p {
          font-size: 1rem;
        }

        .actor-card {
          cursor: pointer;
        }

        .actor-card-inner {
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.08) 0%, 
            rgba(255, 160, 122, 0.08) 100%);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(15px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          position: relative;
        }

        .actor-image-container {
          position: relative;
          height: 350px;
          overflow: hidden;
          border-radius: 20px;
        }

        .actor-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        /* Glass overlay design similar to ShowCard */
        .actor-glass-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.15) 0%, 
            rgba(255, 160, 122, 0.15) 100%);
          backdrop-filter: blur(15px) saturate(140%);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 
            0 -4px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .actor-glass-content {
          text-align: center;
        }

        .actor-glass-name {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.5px;
        }

        .actor-glass-role {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          opacity: 0.9;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .actors-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 60px 20px; /* Larger vertical gap for tablet */
          }
        }

        @media (max-width: 768px) {
          .actors-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 50px 20px; /* Larger vertical gap for mobile */
          }

          .page-title {
            font-size: 2.5rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .actor-image-container {
            height: 240px;
          }

          .actors-page {
            padding: 30px 15px;
          }
        }

        @media (max-width: 480px) {
          .actors-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 10px 10px 20px 10px;
          }

          .page-title {
            font-size: 2rem;
          }

          .actors-page {
            padding: 20px 10px;
          }

          .search-container {
            margin: 20px auto 0;
          }

          .search-bar {
            padding: 8px 15px;
          }
        }
      `}</style>
    </Layout>
  );
}

export default ActorsPage;
