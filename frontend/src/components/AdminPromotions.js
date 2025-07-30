import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';

const BASE_URL = 'https://cse216-project.onrender.com';

function AdminPromotions() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    promoCode: '',
    discountRate: '',
    startDate: '',
    endDate: '',
    description: '',
    subscriptionTypeId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchPromotions(), fetchSubscriptionTypes()]);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/promotions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      throw error;
    }
  };

  const fetchSubscriptionTypes = async () => {
    try {
      
      // Try the main endpoint first
      let response = await fetch(`${BASE_URL}/promotions/subscription-types`);
      
      if (!response.ok) {
        setSubscriptionTypes([]);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSubscriptionTypes(data);
    } catch (error) {
      setSubscriptionTypes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPromo 
        ? `${BASE_URL}/promotions/${editingPromo.PROMOTION_ID}`
        : `${BASE_URL}/promotions`;
      
      const method = editingPromo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchPromotions();
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save promotion');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
      const response = await fetch(`${BASE_URL}/promotions/${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        await fetchPromotions();
      } else {
        throw new Error('Failed to delete promotion');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      promoCode: '',
      discountRate: '',
      startDate: '',
      endDate: '',
      description: '',
      subscriptionTypeId: ''
    });
    setEditingPromo(null);
    setShowForm(false);
  };

  const startEdit = (promo) => {
    setFormData({
      promoCode: promo.PROMO_CODE || '',
      discountRate: promo.DISCOUNT_RATE || '',
      startDate: promo.START_DATE ? promo.START_DATE.split('T')[0] : '',
      endDate: promo.END_DATE ? promo.END_DATE.split('T')[0] : '',
      description: promo.DESCRIPTION || '',
      subscriptionTypeId: promo.SUBSCRIPTION_TYPE_ID || ''
    });
    setEditingPromo(promo);
    setShowForm(true);
  };

  const filteredPromotions = promotions.filter(promo =>
    promo.PROMO_CODE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '1.5rem' }}>Loading promotions...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => navigate('/marketing-admin-frontpage')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '600'
            }}
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Promotions Management</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Manage promotional codes and discounts</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiPlus /> Add Promotion
        </button>
      </div>

      <div style={{ padding: '40px' }}>
        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(255,71,87,0.2)',
            border: '1px solid rgba(255,71,87,0.3)',
            color: '#ff4757',
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <strong>Error:</strong> {error}
            <button
              onClick={() => setError(null)}
              style={{ marginLeft: '18px', textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >Dismiss</button>
          </div>
        )}

        {/* Search and Refresh */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '30px', gap: '16px' }}>
          <div style={{ flex: '1', position: 'relative', minWidth: '240px' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'white', opacity: 0.6, pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                padding: '12px 40px 12px 36px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flexShrink: 0 }}>
            <button
              onClick={fetchData}
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >🔄 Refresh</button>
          </div>
        </div>

        {/* Promotions List */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Code</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Discount</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Start Date</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>End Date</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Subscription Type</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'white', opacity: 0.7 }}>
                      {promotions.length === 0 ? 'No promotions found' : 'No promotions match your search'}
                    </td>
                  </tr>
                ) : (
                  filteredPromotions.map((promo) => (
                    <tr key={promo.PROMOTION_ID} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'white' }}>
                      <td style={{ padding: '18px', fontWeight: '600' }}>{promo.PROMO_CODE}</td>
                      <td style={{ padding: '18px' }}>{promo.DISCOUNT_RATE}%</td>
                      <td style={{ padding: '18px' }}>{promo.START_DATE ? new Date(promo.START_DATE).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ padding: '18px' }}>{promo.END_DATE ? new Date(promo.END_DATE).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ padding: '18px' }}>{promo.DESCRIPTION}</td>
                      <td style={{ padding: '18px' }}>{promo.SUBSCRIPTION_TYPE_DESCRIPTION || 'All'}</td>
                      <td style={{ padding: '18px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => startEdit(promo)}
                            style={{ padding: '8px', background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          >✏️</button>
                          <button
                            onClick={() => handleDelete(promo.PROMOTION_ID)}
                            style={{ padding: '8px', background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '420px', color: '#ee5a24' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '18px' }}>
              {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Promo Code"
                value={formData.promoCode}
                onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                required
              />
              <input
                type="number"
                placeholder="Discount Rate (%)"
                value={formData.discountRate}
                onChange={(e) => setFormData({...formData, discountRate: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                min="0"
                max="100"
                required
              />
              <input
                type="date"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                required
              />
              <input
                type="date"
                placeholder="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                rows="3"
              />
              <select
                value={formData.subscriptionTypeId}
                onChange={(e) => setFormData({...formData, subscriptionTypeId: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              >
                <option value="">All Subscription Types</option>
                {subscriptionTypes.map((type) => (
                  <option key={type.SUBSCRIPTION_TYPE_ID} value={type.SUBSCRIPTION_TYPE_ID}>
                    {type.DESCRIPTION || `Type ${type.SUBSCRIPTION_TYPE_ID}`}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  {editingPromo ? 'Update' : 'Create'} Promotion
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ flex: 1, background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPromotions;
