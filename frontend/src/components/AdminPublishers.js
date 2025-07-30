import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';


function AdminPublishers() {
  const navigate = useNavigate();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewForm, setRenewForm] = useState({
    renewalYears: '',
    newMinGuarantee: '',
    newRoyalty: ''
  });
  const [renewPublisher, setRenewPublisher] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPendingListModal, setShowPendingListModal] = useState(false);
  const [showAdminPendingModal, setShowAdminPendingModal] = useState(false);
  const [publisherPendingRequests, setPublisherPendingRequests] = useState([]);
  const [adminPendingRequests, setAdminPendingRequests] = useState([]);
  const [showRedDot, setShowRedDot] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [adminCompletedRequests, setAdminCompletedRequests] = useState([]);
  const [allAdminRequests, setAllAdminRequests] = useState([]);
  const [completedFilter, setCompletedFilter] = useState('ALL');
  const [rejectingId, setRejectingId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  
const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    fetchPublishers();
    fetchPublisherPendingRequests();
    fetchAllAdminRequests();
  }, []);

  const fetchPublishers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/publishers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch publishers');
      const data = await response.json();
      setPublishers(data);
    } catch (err) {
      setError('Failed to load publishers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/publishers/contract-renewal-requests?status=PENDING&requestedBy=ADMIN`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch admin pending requests');
      const data = await response.json();
      setAdminPendingRequests(data);
    } catch (err) {
      setAdminPendingRequests([]);
    }
  };

  const fetchPublisherPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/publishers/contract-renewal-requests?status=PENDING&requestedBy=PUBLISHER`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch publisher pending requests');
      const data = await response.json();
      setPublisherPendingRequests(data);
      // Show red dot if any request has is_seen_admin === 0
      setShowRedDot(data.some(req => req.IS_SEEN_ADMIN === 0));
    } catch (err) {
      setPublisherPendingRequests([]);
      setShowRedDot(false);
    }
  };

  // Mark publisher requests as seen by admin
  const markPublisherRequestsSeen = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/publishers/contract-renewal-requests/mark-seen`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {}
  };

  const fetchAllAdminRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/publishers/contract-renewal-requests?requestedBy=ADMIN`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch admin requests');
      const data = await response.json();
      setAllAdminRequests(data);
      setAdminCompletedRequests(data.filter(req => req.STATUS !== 'PENDING'));
    } catch (err) {
      setAllAdminRequests([]);
      setAdminCompletedRequests([]);
    }
  };

  // Mark admin accepted requests as seen
  const markAdminCompletedSeen = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/publishers/contract-renewal-requests/mark-seen-accepted`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {}
  };

  const handleRejectPublisherRequest = async (requestId) => {
    setRejectingId(requestId);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/publishers/contract-renewal-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      alert('Failed to reject request.');
    } finally {
      setRejectingId(null);
    }
  };

  const handleAcceptPublisherRequest = async (requestId) => {
    setAcceptingId(requestId);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/publishers/contract-renewal-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      alert('Failed to accept request.');
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredPublishers = publishers.filter(pub =>
    pub.PUBLISHER_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.CONTRACT_ID?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div style={{ fontSize: '1.5rem' }}>Loading publishers...</div>
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
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Manage Publishers</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>View and manage publisher contracts</p>
          </div>
        </div>
        <button
          onClick={async () => {
            setShowPendingListModal(true);
            setShowRedDot(false);
            await markPublisherRequestsSeen();
            fetchPublisherPendingRequests();
          }}
          style={{
            background: 'linear-gradient(45deg, #42a5f5, #1976d2)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            marginLeft: '18px',
            position: 'relative'
          }}
        >
          Pending Requests
          {showRedDot && (
            <span style={{
              position: 'absolute',
              top: 6,
              right: 10,
              width: 12,
              height: 12,
              background: 'red',
              borderRadius: '50%',
              display: 'inline-block',
              border: '2px solid white',
              zIndex: 10
            }} />
          )}
        </button>
        <button
          onClick={() => {
            fetchAdminPendingRequests();
            setShowAdminPendingModal(true);
          }}
          style={{
            background: 'linear-gradient(45deg, #ffa726, #ff7043)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            marginLeft: '12px'
          }}
        >
          Requested
        </button>
        <button
          onClick={async () => {
            setShowCompletedModal(true);
            await markAdminCompletedSeen();
            await fetchAllAdminRequests();
          }}
          style={{
            background: 'linear-gradient(45deg, #66bb6a, #388e3c)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            marginLeft: '12px',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          Completed
          {allAdminRequests.some(req => req.REQUESTED_BY === 'ADMIN' && req.IS_SEEN_ADMIN === 0) && (
            <span style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '25%',
              height: '25%',
              minWidth: 10,
              minHeight: 10,
              maxWidth: 18,
              maxHeight: 18,
              background: '#b71c1c',
              borderRadius: '50%',
              display: 'inline-block',
              border: '2px solid white',
              zIndex: 10,
              boxShadow: '0 0 2px #b71c1c'
            }} />
          )}
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
              placeholder="Search publishers..."
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
              onClick={fetchPublishers}
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

        {/* Publishers List */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Publisher ID</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Person ID</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Contract ID</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Publisher Name</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Contract Date</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Contract Duration (days)</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Royalty</th>
                  <th style={{ textAlign: 'left', padding: '18px' }}>Min Guarantee</th>
                  <th style={{ textAlign: 'center', padding: '18px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublishers.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: 'white', opacity: 0.7 }}>
                      {publishers.length === 0 ? 'No publishers found' : 'No publishers match your search'}
                    </td>
                  </tr>
                ) : (
                  filteredPublishers.map((pub) => {
                    const hasPendingPublisherRequest = publisherPendingRequests.some(
                      req => req.PUBLISHER_ID === pub.PUBLISHER_ID && req.STATUS === 'PENDING'
                    );
                    // Check for pending admin-requested renewal for this publisher
                    const hasPendingAdminRequest = adminPendingRequests.some(
                      req => String(req.PUBLISHER_ID) === String(pub.PUBLISHER_ID) && req.STATUS === 'PENDING' && req.REQUESTED_BY === 'ADMIN'
                    );
                    return (
                      <tr key={pub.PUBLISHER_ID} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'white' }}>
                        <td style={{ padding: '18px', fontWeight: '600' }}>{pub.PUBLISHER_ID}</td>
                        <td style={{ padding: '18px' }}>{pub.PERSON_ID}</td>
                        <td style={{ padding: '18px' }}>{pub.CONTRACT_ID}</td>
                        <td style={{ padding: '18px' }}>{pub.PUBLISHER_NAME}</td>
                        <td style={{ padding: '18px' }}>{pub.CONTRACT_DATE ? new Date(pub.CONTRACT_DATE).toLocaleDateString() : ''}</td>
                        <td style={{ padding: '18px' }}>{pub.CONTRACT_DURATION_DAYS}</td>
                        <td style={{ padding: '18px' }}>{pub.ROYALTY}</td>
                        <td style={{ padding: '18px' }}>{pub.MIN_GUARANTEE}</td>
                        <td style={{ padding: '18px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            {hasPendingPublisherRequest ? (() => {
                              const req = publisherPendingRequests.find(
                                r => r.PUBLISHER_ID === pub.PUBLISHER_ID && r.STATUS === 'PENDING'
                              );
                              return (
                                <>
                                  <button
                                    style={{ padding: '8px', background: 'linear-gradient(45deg, #43e97b, #38f9d7)', color: 'white', border: 'none', borderRadius: '6px', cursor: acceptingId === req.REQUEST_ID ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: acceptingId === req.REQUEST_ID ? 0.5 : 1 }}
                                    disabled={acceptingId === req.REQUEST_ID}
                                    onClick={() => handleAcceptPublisherRequest(req.REQUEST_ID)}
                                  >{acceptingId === req.REQUEST_ID ? 'Accepting...' : 'Accept'}</button>
                                  <button
                                    style={{ padding: '8px', background: 'linear-gradient(45deg, #ff4757, #ff6b6b)', color: 'white', border: 'none', borderRadius: '6px', cursor: rejectingId === req.REQUEST_ID ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: rejectingId === req.REQUEST_ID ? 0.5 : 1 }}
                                    disabled={rejectingId === req.REQUEST_ID}
                                    onClick={() => handleRejectPublisherRequest(req.REQUEST_ID)}
                                  >{rejectingId === req.REQUEST_ID ? 'Rejecting...' : 'Reject'}</button>
                                </>
                              );
                            })() : (
                              <button
                                style={{
                                  padding: '8px',
                                  background: 'linear-gradient(45deg, #42a5f5, #1976d2)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: hasPendingAdminRequest ? 'not-allowed' : 'pointer',
                                  opacity: hasPendingAdminRequest ? 0.5 : 1,
                                  fontWeight: 600
                                }}
                                disabled={hasPendingAdminRequest}
                                onClick={() => {
                                  if (hasPendingAdminRequest) return;
                                  setRenewPublisher(pub);
                                  setRenewForm({
                                    renewalYears: '',
                                    newMinGuarantee: pub.MIN_GUARANTEE,
                                    newRoyalty: pub.ROYALTY
                                  });
                                  setShowRenewModal(true);
                                }}
                              >Renew</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Renew Contract Modal */}
      {showRenewModal && renewPublisher && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '420px', color: '#1976d2', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '18px' }}>
              Renew Contract
            </h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${BASE_URL}/publishers/contract-renewal-requests`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    publisherId: renewPublisher.PUBLISHER_ID,
                    renewalYears: renewForm.renewalYears,
                    newMinGuarantee: renewForm.newMinGuarantee,
                    newRoyalty: renewForm.newRoyalty
                  })
                });
                if (response.ok) {
                  setShowRenewModal(false);
                  setRenewPublisher(null);
                  setShowSuccessModal(true);
                  fetchPublisherPendingRequests();
                  fetchAdminPendingRequests();
                } else {
                  throw new Error('Failed to submit renewal request');
                }
              } catch (err) {
                setError('Failed to submit renewal request');
                setShowRenewModal(false);
                setRenewPublisher(null);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="number"
                placeholder="Renewal Years"
                value={renewForm.renewalYears}
                onChange={e => setRenewForm({ ...renewForm, renewalYears: e.target.value })}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                min="1"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="New Min Guarantee"
                value={renewForm.newMinGuarantee}
                onChange={e => setRenewForm({ ...renewForm, newMinGuarantee: e.target.value })}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                min="0"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="New Royalty"
                value={renewForm.newRoyalty}
                onChange={e => setRenewForm({ ...renewForm, newRoyalty: e.target.value })}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                min="0"
                required
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(45deg, #42a5f5, #1976d2)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => { setShowRenewModal(false); setRenewPublisher(null); }}
                  style={{ flex: 1, background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pending Request Modal */}
      {showPendingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '420px', color: '#ee5a24', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '18px' }}>
              Pending Request
            </h3>
            <p style={{ marginBottom: '24px', color: '#333' }}>There is already a pending renewal request for this publisher. You cannot send another request until it is resolved.</p>
            <button
              onClick={() => setShowPendingModal(false)}
              style={{ background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '420px', color: '#42a5f5', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '18px' }}>
              Request Sent
            </h3>
            <p style={{ marginBottom: '24px', color: '#333' }}>Renewal request sent successfully!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{ background: 'linear-gradient(45deg, #42a5f5, #1976d2)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Publisher Requested Pending Requests Modal (now for publisher requests) */}
      {showPendingListModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '900px', color: '#333', textAlign: 'center', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '18px', color: '#1976d2' }}>
              Publisher Requested Pending Renewal Requests
            </h3>
            {publisherPendingRequests.length === 0 ? (
              <div style={{ margin: '24px 0', color: '#888' }}>No publisher requested pending requests.</div>
            ) : (
              <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(66,165,245,0.08)' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Request ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Publisher ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Request Date</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Renewal Years</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New Min Guarantee</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New Royalty</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Requested By</th>
                  </tr>
                </thead>
                <tbody>
                  {publisherPendingRequests.map(req => (
                    <tr key={req.REQUEST_ID} style={{ background: '#f9f9f9' }}>
                      <td style={{ padding: '10px' }}>{req.REQUEST_ID}</td>
                      <td style={{ padding: '10px' }}>{req.PUBLISHER_ID}</td>
                      <td style={{ padding: '10px' }}>{req.REQUEST_DATE ? new Date(req.REQUEST_DATE).toLocaleDateString() : ''}</td>
                      <td style={{ padding: '10px' }}>{req.RENEWAL_YEARS}</td>
                      <td style={{ padding: '10px' }}>{req.NEW_MIN_GUARANTEE}</td>
                      <td style={{ padding: '10px' }}>{req.NEW_ROYALTY}</td>
                      <td style={{ padding: '10px' }}>{req.REQUESTED_BY}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              onClick={() => setShowPendingListModal(false)}
              style={{ background: 'linear-gradient(45deg, #42a5f5, #1976d2)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Admin Requested Pending Requests Modal (now for admin requests) */}
      {showAdminPendingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '900px', color: '#333', textAlign: 'center', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '18px', color: '#ff7043' }}>
              Admin Requested Pending Renewal Requests
            </h3>
            {adminPendingRequests.length === 0 ? (
              <div style={{ margin: '24px 0', color: '#888' }}>No admin requested pending requests.</div>
            ) : (
              <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,167,38,0.08)' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Request ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Publisher ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Request Date</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Renewal Years</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New Min Guarantee</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New Royalty</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Requested By</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPendingRequests.map(req => (
                    <tr key={req.REQUEST_ID} style={{ background: '#f9f9f9' }}>
                      <td style={{ padding: '10px' }}>{req.REQUEST_ID}</td>
                      <td style={{ padding: '10px' }}>{req.PUBLISHER_ID}</td>
                      <td style={{ padding: '10px' }}>{req.REQUEST_DATE ? new Date(req.REQUEST_DATE).toLocaleDateString() : ''}</td>
                      <td style={{ padding: '10px' }}>{req.RENEWAL_YEARS}</td>
                      <td style={{ padding: '10px' }}>{req.NEW_MIN_GUARANTEE}</td>
                      <td style={{ padding: '10px' }}>{req.NEW_ROYALTY}</td>
                      <td style={{ padding: '10px' }}>{req.REQUESTED_BY}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              onClick={() => setShowAdminPendingModal(false)}
              style={{ background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Admin Accepted Requests Modal */}
      {showCompletedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '900px', color: '#333', textAlign: 'center', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '18px', color: '#388e3c' }}>
              Admin Requested Completed Renewal Requests
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '18px' }}>
              <button onClick={() => setCompletedFilter('ALL')} style={{ background: completedFilter === 'ALL' ? '#388e3c' : '#e0e0e0', color: completedFilter === 'ALL' ? 'white' : '#333', padding: '8px 18px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>All</button>
              <button onClick={() => setCompletedFilter('APPROVED')} style={{ background: completedFilter === 'APPROVED' ? '#388e3c' : '#e0e0e0', color: completedFilter === 'APPROVED' ? 'white' : '#333', padding: '8px 18px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Accepted</button>
              <button onClick={() => setCompletedFilter('REJECTED')} style={{ background: completedFilter === 'REJECTED' ? '#388e3c' : '#e0e0e0', color: completedFilter === 'REJECTED' ? 'white' : '#333', padding: '8px 18px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Rejected</button>
            </div>
            {adminCompletedRequests.filter(req => completedFilter === 'ALL' ? true : req.STATUS === completedFilter).length === 0 ? (
              <div style={{ margin: '24px 0', color: '#888' }}>No admin requested completed requests.</div>
            ) : (
              <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(102,187,106,0.08)' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Request ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Publisher ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Request Date</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Renewal Years</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New Min Guarantee</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New Royalty</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Requested By</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCompletedRequests
                    .filter(req => completedFilter === 'ALL' ? true : req.STATUS === completedFilter)
                    .map(req => (
                      <tr key={req.REQUEST_ID} style={{ background: '#f9f9f9' }}>
                        <td style={{ padding: '10px' }}>{req.REQUEST_ID}</td>
                        <td style={{ padding: '10px' }}>{req.PUBLISHER_ID}</td>
                        <td style={{ padding: '10px' }}>{req.REQUEST_DATE ? new Date(req.REQUEST_DATE).toLocaleDateString() : ''}</td>
                        <td style={{ padding: '10px' }}>{req.RENEWAL_YEARS}</td>
                        <td style={{ padding: '10px' }}>{req.NEW_MIN_GUARANTEE}</td>
                        <td style={{ padding: '10px' }}>{req.NEW_ROYALTY}</td>
                        <td style={{ padding: '10px' }}>{req.REQUESTED_BY}</td>
                        <td style={{ padding: '10px' }}>{req.STATUS}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            <button
              onClick={() => setShowCompletedModal(false)}
              style={{ background: 'linear-gradient(45deg, #66bb6a, #388e3c)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPublishers; 
