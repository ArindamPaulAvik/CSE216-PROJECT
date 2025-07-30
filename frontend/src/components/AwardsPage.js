import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';

function AwardsPage() {
  const [awards, setAwards] = useState([]);
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${BASE_URL}/awards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAwards(res.data);
        setFilteredAwards(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAwards(awards);
    } else {
      const filtered = awards.filter(award =>
        award.AWARD_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.AWARDING_BODY.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAwards(filtered);
    }
  }, [searchTerm, awards]);

  const AwardCard = ({ award, index }) => {
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
        onClick={() => navigate(`/award/${award.AWARD_ID}`)}
        className="award-card"
      >
        <div className="award-card-inner">
          <div className="award-image-container">
            <motion.img
              src={`${BASE_URL}/awards/${award.IMG}`}
              alt={award.AWARD_NAME}
              className="award-image"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              onError={(e) => {
                e.target.src = '/images/default-award.png';
              }}
            />
            <div className="award-overlay">
              <motion.div
                className="award-info"
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="award-name">{award.AWARD_NAME}</h3>
                <p className="award-body">{award.AWARDING_BODY}</p>
                <p className="award-role">View Details</p>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="award-details"
            whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
            transition={{ duration: 0.3 }}
          >
            <p className="award-name-bottom">{award.AWARD_NAME}</p>
            <div className="award-stats">
              <span className="stat-item">🏆 {award.AWARDING_BODY}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="awards-page">
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
            🏆 Awards
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover prestigious awards and their remarkable achievements
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
                placeholder="Search awards or awarding bodies..."
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

        {/* Awards Grid */}
        <motion.div
          className="awards-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredAwards.length > 0 ? (
            filteredAwards.map((award, index) => (
              <AwardCard key={award.AWARD_ID} award={award} index={index} />
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
                <h3>No awards found</h3>
                <p>Try adjusting your search query</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .awards-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 40px 20px;
          margin-top: 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
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
          margin-bottom: 8px;
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
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
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

        .awards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 80px 25px;
          padding: 0 0 20px 0;
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
          color: #ffd700;
        }

        .no-results-content h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: white;
        }

        .no-results-content p {
          font-size: 1rem;
        }

        .award-card {
          cursor: pointer;
        }

        .award-card-inner {
          background: linear-gradient(145deg, #2a2a1e, #3a3a2a);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 215, 0, 0.1);
          transition: all 0.4s ease;
        }

        .award-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .award-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .award-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .award-card:hover .award-overlay {
          opacity: 1;
        }

        .award-info h3 {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 5px 0;
        }

        .award-body {
          color: #ffd700;
          font-size: 0.9rem;
          margin: 0 0 5px 0;
          font-weight: 500;
        }

        .award-role {
          color: #b0b0b0;
          font-size: 0.9rem;
          margin: 0;
        }

        .award-details {
          padding: 20px;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 215, 0, 0.1);
        }

        .award-name-bottom {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f5f5f5;
          margin: 0 0 10px 0;
        }

        .award-stats {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .stat-item {
          font-size: 0.85rem;
          color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .awards-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 60px 20px;
          }
        }

        @media (max-width: 768px) {
          .awards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 50px 20px;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .award-image-container {
            height: 240px;
          }

          .awards-page {
            padding: 30px 15px;
          }
        }

        @media (max-width: 480px) {
          .awards-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 10px 10px 20px 10px;
          }

          .page-title {
            font-size: 2rem;
          }

          .awards-page {
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

export default AwardsPage;
