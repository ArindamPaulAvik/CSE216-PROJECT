import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';

function ActorsPage() {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/actors', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setActors(res.data))
      .catch(console.error);
  }, []);

  const ActorCard = ({ actor, index }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
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
            src={`/actors/${actor.PICTURE}`}
            alt={actor.NAME}
            className="actor-image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              e.target.src = '/images/default-actor.png';
            }}
          />
          <div className="actor-overlay">
            <motion.div
              className="actor-info"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="actor-name">{actor.NAME}</h3>
              <p className="actor-role">View Profile</p>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="actor-details"
          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
          transition={{ duration: 0.3 }}
        >
          <p className="actor-name-bottom">{actor.NAME}</p>
          <div className="actor-stats">
            <span className="stat-item">✨ Actor</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

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
        </motion.div>

        {/* Actor Grid */}
        <motion.div
          className="actors-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {actors.map((actor, index) => (
            <ActorCard key={actor.ACTOR_ID} actor={actor} index={index} />
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .actors-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .page-header {
          text-align: center;
          margin-bottom: 60px;
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

        .actors-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px 20px;
          padding: 20px 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .actor-card {
          cursor: pointer;
        }

        .actor-card-inner {
          background: linear-gradient(145deg, #1e1e2e, #2a2a3a);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }

        .actor-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .actor-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .actor-overlay {
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

        .actor-card:hover .actor-overlay {
          opacity: 1;
        }

        .actor-info h3 {
          color: #ffffff;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 5px 0;
        }

        .actor-role {
          color: #b0b0b0;
          font-size: 0.9rem;
          margin: 0;
        }

        .actor-details {
          padding: 20px;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .actor-name-bottom {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f5f5f5;
          margin: 0 0 10px 0;
        }

        .actor-stats {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .stat-item {
          font-size: 0.85rem;
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .actors-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px 15px;
          }
        }

        @media (max-width: 768px) {
          .actors-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 15px;
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
        }

        @media (max-width: 480px) {
          .actors-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px 10px;
          }

          .page-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </Layout>
  );
}

export default ActorsPage;
