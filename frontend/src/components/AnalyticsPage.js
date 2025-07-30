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

function AnalyticsPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('monthly');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statType, setStatType] = useState('user'); // 'user' or 'income'
  
  const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    setLoading(true);
    setError('');
    const days = mode === 'monthly' ? 30 : 7;
    const token = localStorage.getItem('token');
    
    let url = `${BASE_URL}/user-join-stats`;
    if (statType === 'income') {
      url = `${BASE_URL}/income-stats`;
    }
    
    axios.post(url, { days }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const statsData = Array.isArray(res.data) ? res.data : [];
        setStats(statsData);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to fetch stats: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      });
  }, [mode, statType]);

  // Debug: Log stats whenever they change
  useEffect(() => {
    console.log('Stats updated:', stats);
    console.log('Stats length:', stats.length);
    if (stats.length > 0) {
      console.log('First stat item:', stats[0]);
      console.log('Available keys:', Object.keys(stats[0]));
    }
  }, [stats]);

  // Prepare chart data - fixed to match backend response
  // Chart data for user joins
  const userChartData = {
    labels: stats.map(row => {
      const date = new Date(row.join_date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'New Users',
        data: stats.map(row => parseInt(row.new_users) || 0),
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255,107,107,0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Cumulative Users',
        data: stats.map(row => parseInt(row.cumulative_users) || 0),
        borderColor: '#66bb6a',
        backgroundColor: 'rgba(102,187,106,0.2)',
        yAxisID: 'y1',
      }
    ]
  };

  // Chart data for income
  const incomeChartData = {
    labels: stats.map(row => {
      const date = new Date(row.transaction_day);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Income',
        data: stats.map(row => parseFloat(row.daily_income) || 0),
        borderColor: '#ffa726',
        backgroundColor: 'rgba(255, 193, 7, 0.3)',
        yAxisID: 'y',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#222',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'User Join Statistics',
        color: '#222',
        font: {
          size: 22,
          weight: 'bold',
        },
      },
      tooltip: {
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        titleColor: '#222',
        bodyColor: '#222',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'New Users',
          color: '#222',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#222',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Cumulative Users',
          color: '#222',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#222',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      x: {
        ticks: {
          color: '#222',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        title: {
          color: '#222',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      padding: '0',
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          marginBottom: '30px',
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
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>User Analytics</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>User Growth & Engagement Insights</p>
        </div>
      </motion.header>
      
      {/* Controls Row: Reload and Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '12px',
        margin: '0 40px 20px 40px',
      }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(45deg, #ffa726, #ff7043)',
            border: 'none',
            color: 'white',
            padding: '8px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            marginRight: '8px'
          }}
        >
          Reload
        </button>
        <select
          id="mode"
          value={mode}
          onChange={e => setMode(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.8)',
            color: '#333',
            outline: 'none',
            minWidth: '180px'
          }}
        >
          <option value="monthly">Monthly (Last 30 Days)</option>
          <option value="weekly">Weekly (Last 7 Days)</option>
        </select>
        <select
          id="statType"
          value={statType}
          onChange={e => setStatType(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.8)',
            color: '#333',
            outline: 'none',
            minWidth: '180px'
          }}
        >
          <option value="user">User Joins</option>
          <option value="income">Income</option>
        </select>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: '#ff4757', textAlign: 'center', fontSize: '16px' }}>{error}</div>
      ) : stats.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: '16px' }}>No data available for the selected period.</div>
      ) : (
        <div style={{ 
          background: 'rgba(255, 249, 196, 0.6)',
          borderRadius: '10px', 
          padding: '30px', 
          border: '1px solid rgba(255,255,255,0.1)',
          marginTop: '20px',
          marginLeft: '40px',
          marginRight: '40px',
        }}>
          <Line data={statType === 'income' ? incomeChartData : userChartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
