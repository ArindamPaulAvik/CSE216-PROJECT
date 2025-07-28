import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';

function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';


  const [formData, setFormData] = useState({
    price: '',
    description: '',
    durationDays: '',
    isActive: 1
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/offers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      setOffers(data);
    } catch (err) {
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingOffer 
        ? `${BASE_URL}/offers/${editingOffer.SUBSCRIPTION_TYPE_ID}`
        : `${BASE_URL}/offers`;
      const method = editingOffer ? 'PUT' : 'POST';
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          price: formData.price,
          description: formData.description,
          durationDays: formData.durationDays,
          isActive: formData.isActive
        })
      });
      if (response.ok) {
        await fetchOffers();
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save offer');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/offers/${deleteId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        await fetchOffers();
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        throw new Error('Failed to delete offer');
      }
    } catch (error) {
      setError(error.message);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({ price: '', description: '', durationDays: '', isActive: 1 });
    setEditingOffer(null);
    setShowForm(false);
  };

  const startEdit = (offer) => {
    setFormData({
      price: offer.PRICE || '',
      description: offer.DESCRIPTION || '',
      durationDays: offer.DURATION_DAYS || '',
      isActive: offer.IS_ACTIVE === null ? 1 : offer.IS_ACTIVE
    });
    setEditingOffer(offer);
    setShowForm(true);
  };

  const filteredOffers = offers.filter(offer =>
    offer.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div style={{ fontSize: '1.5rem' }}>Loading offers...</div>
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
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Manage Offers</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Manage subscription offers and plans</p>
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
          <FiPlus /> Add Offer
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
              placeholder="Search offers..."
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
              onClick={fetchOffers}
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

        {/* Offers List */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Price</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Duration (days)</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Active</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'white', opacity: 0.7 }}>
                      {offers.length === 0 ? 'No offers found' : 'No offers match your search'}
                    </td>
                  </tr>
                ) : (
                  filteredOffers.map((offer) => (
                    <tr key={offer.SUBSCRIPTION_TYPE_ID} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'white' }}>
                      <td style={{ padding: '18px', fontWeight: '600' }}>{offer.DESCRIPTION}</td>
                      <td style={{ padding: '18px' }}>{offer.PRICE}</td>
                      <td style={{ padding: '18px' }}>{offer.DURATION_DAYS}</td>
                      <td style={{ padding: '18px' }}>{offer.IS_ACTIVE ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '18px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => startEdit(offer)}
                            style={{ padding: '8px', background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          >✏️</button>
                          <button
                            onClick={() => handleDelete(offer.SUBSCRIPTION_TYPE_ID)}
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
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                min="0"
                required
              />
              <input
                type="number"
                placeholder="Duration (days)"
                value={formData.durationDays}
                onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                min="1"
                required
              />
              <select
                value={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: parseInt(e.target.value)})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  {editingOffer ? 'Update' : 'Create'} Offer
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
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '380px', color: '#ee5a24', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '18px' }}>
              Confirm Delete
            </h3>
            <p style={{ marginBottom: '24px', color: '#333' }}>Are you sure you want to delete this offer?</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={confirmDelete}
                style={{ background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                style={{ background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOffers; 