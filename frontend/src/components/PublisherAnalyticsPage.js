import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import {
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function ThumbnailImage({ src, alt, hasValidThumbnail }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const handleImageError = () => {
    if (!imageError) { // Prevent infinite loop
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show placeholder if no valid thumbnail or image failed to load
  if (!hasValidThumbnail || imageError) {
    return (
      <div style={{
        width: '60px',
        height: '90px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        border: '2px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: 'rgba(255,255,255,0.5)'
      }}>
        🎬
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {!imageLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60px',
          height: '90px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.5)',
          zIndex: 1
        }}>
          Loading...
        </div>
      )}
      <img 
        src={src}
        alt={alt}
        style={{
          width: '60px',
          height: '90px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '2px solid rgba(255,255,255,0.2)',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}

function PublisherAnalyticsPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('monthly'); // 'monthly' (30) or 'weekly' (7)
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataType, setDataType] = useState('all'); // 'all', 'royalty', 'total', 'min_guarantee'
  const [shows, setShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(true);
  const [showsError, setShowsError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const days = mode === 'monthly' ? 30 : 7;
    const token = localStorage.getItem('token');
    axios.post(`${BASE_URL}/publishers/publisher-earnings`, {
        days
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setStats(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to fetch earnings: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      });
  }, [mode]);

  useEffect(() => {
    setShowsLoading(true);
    setShowsError('');
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/publishers/my-shows`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setShows(Array.isArray(res.data) ? res.data : []);
        setShowsLoading(false);
      })
      .catch(err => {
        setShowsError(`Failed to fetch shows: ${err.response?.data?.message || err.message}`);
        setShowsLoading(false);
      });
  }, []);

  // Prepare chart data with three datasets
  const allDatasets = [
    {
      label: 'Royalty',
      data: stats.map(row => parseFloat(row.royalty) || 0),
      borderColor: '#ffa726', // Orange
      backgroundColor: 'rgba(255, 167, 38, 0.1)',
      fill: false,
      tension: 0.4,
      pointBackgroundColor: '#ffa726',
      pointBorderColor: '#ffa726',
      pointHoverRadius: 6,
    },
    {
      label: 'Min Guarantee',
      data: stats.map(row => parseFloat(row.min_guarantee) || 0),
      borderColor: '#42a5f5', // Blue
      backgroundColor: 'rgba(66, 165, 245, 0.1)',
      fill: false,
      tension: 0.4,
      pointBackgroundColor: '#42a5f5',
      pointBorderColor: '#42a5f5',
      pointHoverRadius: 6,
    },
    {
      label: 'Total',
      data: stats.map(row => parseFloat(row.total) || 0),
      borderColor: '#66bb6a', // Green
      backgroundColor: 'rgba(102, 187, 106, 0.1)',
      fill: false,
      tension: 0.4,
      pointBackgroundColor: '#66bb6a',
      pointBorderColor: '#66bb6a',
      pointHoverRadius: 6,
    }
  ];

  let filteredDatasets = allDatasets;
  if (dataType === 'royalty') filteredDatasets = [allDatasets[0]];
  else if (dataType === 'min_guarantee') filteredDatasets = [allDatasets[1]];
  else if (dataType === 'total') filteredDatasets = [allDatasets[2]];

  const earningsChartData = {
    labels: stats.map(row => {
      const date = new Date(row.date);
      return date.toLocaleDateString();
    }),
    datasets: filteredDatasets
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 16,
            weight: 'bold',
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Publisher Earnings Analytics',
        color: '#fff',
        font: {
          size: 24,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#fff',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
          },
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#fff',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
          },
          maxTicksLimit: 10,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
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
          <FiArrowLeft />
        </motion.button>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Analytics</h1>
      </motion.header>
      
      {/* Controls Row: Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '12px',
        margin: '20px 40px',
      }}>
        <select
          id="mode"
          value={mode}
          onChange={e => setMode(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            outline: 'none',
            minWidth: '200px',
            fontSize: '14px'
          }}
        >
          <option value="monthly">Monthly (Last 30 Days)</option>
          <option value="weekly">Weekly (Last 7 Days)</option>
        </select>
        <select
          id="dataType"
          value={dataType}
          onChange={e => setDataType(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            outline: 'none',
            minWidth: '200px',
            fontSize: '14px'
          }}
        >
          <option value="all">All</option>
          <option value="royalty">Royalty</option>
          <option value="min_guarantee">Min Guarantee</option>
          <option value="total">Total</option>
        </select>
      </div>
      
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '18px',
          padding: '60px 0'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            borderTopColor: '#ffa726',
            animation: 'spin 1s ease-in-out infinite'
          }}></div>
          <div style={{ marginTop: '20px' }}>Loading analytics...</div>
        </div>
      ) : error ? (
        <div style={{ 
          color: '#ff4757', 
          textAlign: 'center', 
          fontSize: '16px',
          padding: '40px',
          background: 'rgba(255, 71, 87, 0.1)',
          margin: '20px 40px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 71, 87, 0.3)'
        }}>
          {error}
        </div>
      ) : stats.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '16px',
          padding: '60px 40px',
          background: 'rgba(255, 255, 255, 0.05)',
          margin: '20px 40px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>📊</div>
          No data available for the selected period.
        </div>
      ) : (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '15px', 
          padding: '30px', 
          border: '1px solid rgba(255,255,255,0.1)',
          margin: '20px 40px',
          height: '500px'
        }}>
          <Line data={earningsChartData} options={chartOptions} />
        </div>
      )}
      
      {/* My Content Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '15px', 
        padding: '30px', 
        border: '1px solid rgba(255,255,255,0.1)',
        margin: '20px 40px',
        marginTop: '40px'
      }}>
        <h2 style={{
          margin: '0 0 30px 0',
          fontSize: '1.8rem',
          fontWeight: '700',
          color: '#fff',
          textAlign: 'center'
        }}>
          My Content
        </h2>
        
        {showsLoading ? (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '18px',
            padding: '40px 0'
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              borderTopColor: '#ffa726',
              animation: 'spin 1s ease-in-out infinite'
            }}></div>
            <div style={{ marginTop: '20px' }}>Loading your content...</div>
          </div>
        ) : showsError ? (
          <div style={{ 
            color: '#ff4757', 
            textAlign: 'center', 
            fontSize: '16px',
            padding: '40px',
            background: 'rgba(255, 71, 87, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 71, 87, 0.3)'
          }}>
            {showsError}
          </div>
        ) : shows.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '16px',
            padding: '60px 40px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🎬</div>
            No content available.
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#fff'
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderBottom: '2px solid rgba(255,255,255,0.2)'
                }}>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '16px',
                    borderRight: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    Show Details
                  </th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '16px',
                    borderRight: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    Watch Count
                  </th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    Income ($)
                  </th>
                </tr>
              </thead>
              <tbody>
              {shows.map((show, index) => {
  // Better thumbnail URL handling
  let thumbnailSrc = '';
  let hasValidThumbnail = false;
  
  if (show.THUMBNAIL && show.THUMBNAIL.trim() !== '') {
    if (/^https?:\/\//i.test(show.THUMBNAIL)) {
      // Already a full URL
      thumbnailSrc = show.THUMBNAIL;
      hasValidThumbnail = true;
    } else {
      // Relative path - construct full URL
      const cleanPath = show.THUMBNAIL.replace(/^\/+/, '');
      thumbnailSrc = `${BASE_URL}/shows/${cleanPath}`;
      hasValidThumbnail = true;
    }
  }

  return (
    <tr 
      key={show.SHOW_ID} 
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    >
      <td style={{
        padding: '15px',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        verticalAlign: 'top'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <ThumbnailImage 
            src={thumbnailSrc}
            alt={show.TITLE}
            hasValidThumbnail={hasValidThumbnail}
          />
          <div>
            <div style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '5px',
              color: '#fff'
            }}>
              {show.TITLE}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#ffa726',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              ⭐ {show.RATING ? parseFloat(show.RATING).toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td style={{
        padding: '15px',
        textAlign: 'center',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        fontWeight: '600',
        fontSize: '16px',
        color: '#42a5f5'
      }}>
        {show.WATCH_COUNT ? show.WATCH_COUNT.toLocaleString() : '0'}
      </td>
      <td style={{
        padding: '15px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '16px',
        color: '#66bb6a'
      }}>
        ${show.INCOME ? parseFloat(show.INCOME).toFixed(2) : '0.00'}
      </td>
    </tr>
  );
})}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PublisherAnalyticsPage;