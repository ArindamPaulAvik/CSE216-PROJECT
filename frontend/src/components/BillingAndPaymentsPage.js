import React from 'react';
import { useNavigate } from 'react-router-dom';

function BillingAndPaymentsPage() {
  const navigate = useNavigate();
  
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleProfile = () => {
    console.log('Profile clicked');
  };

  const handleBack = () => {
    navigate('/publisher-frontpage');
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
          justifyContent: 'space-between',
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
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Billing and Payments</h1>
        </div>
        
      </header>

      {/* Main Content */}
      <div
        style={{
          padding: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Top Row: Billing Details & Income */}
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '40px',
        }}>
          {/* Your Billing Details Box */}
          <div style={{
            flex: '1',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: '260px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              margin: '0 0 15px 0',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#fff'
            }}>
              Your Billing Details
            </h2>
            <p style={{ opacity: 0.7, fontSize: '1rem' }}>
              (Billing info will appear here)
            </p>
          </div>
          {/* Income Box */}
          <div style={{
            flex: '1',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: '260px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              margin: '0 0 15px 0',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#fff'
            }}>
              Income
            </h2>
            <p style={{ opacity: 0.7, fontSize: '1rem' }}>
              (Income summary will appear here)
            </p>
          </div>
        </div>
        {/* All Transactions Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          minHeight: '220px',
          boxSizing: 'border-box'
        }}>
          <h2 style={{
            margin: '0 0 15px 0',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#fff'
          }}>
            All Transactions
          </h2>
          <p style={{ opacity: 0.7, fontSize: '1rem' }}>
            (Transaction history will appear here)
          </p>
        </div>
      </div>
    </div>
  );
}

export default BillingAndPaymentsPage;