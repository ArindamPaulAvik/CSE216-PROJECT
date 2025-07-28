import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';

function PublisherContract() {
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [contractLoading, setContractLoading] = useState(true);
  const [contractError, setContractError] = useState('');
  const [adminRequests, setAdminRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewForm, setRenewForm] = useState({
    renewalYears: '',
    newMinGuarantee: '',
    newRoyalty: ''
  });
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState('');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [publisherRequests, setPublisherRequests] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

  // Fetch publisher-requested renewal requests
  const fetchPublisherRequests = async (publisherId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/publishers/contract-renewal-requests?requestedBy=PUBLISHER&publisherId=${publisherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPublisherRequests(res.data);
    } catch (err) {
      setPublisherRequests([]);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  // Fetch admin and publisher requests when contract changes
  useEffect(() => {
    if (contract && contract.PUBLISHER_ID) {
      fetchAdminRequests(contract.PUBLISHER_ID);
      fetchPublisherRequests(contract.PUBLISHER_ID);
    }
  }, [contract]);

  const fetchContract = async () => {
    setContractLoading(true);
    setContractError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/publishers/my-contract`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContract(res.data);
    } catch (err) {
      setContractError('Failed to fetch contract details');
      setContract(null);
    } finally {
      setContractLoading(false);
    }
  };

  const fetchAdminRequests = async (publisherId) => {
    setRequestsLoading(true);
    setRequestsError('');
    try {
      const token = localStorage.getItem('token');
      const reqRes = await axios.get(`${BASE_URL}/publishers/contract-renewal-requests?requestedBy=ADMIN&publisherId=${publisherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminRequests(reqRes.data);
    } catch (err) {
      setRequestsError('Failed to fetch requests');
      setAdminRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setRejecting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/publishers/contract-renewal-requests/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      alert('Failed to reject request.');
    } finally {
      setRejecting(false);
    }
  };

  const handleAcceptAdminRequest = async (requestId) => {
    setAcceptingId(requestId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/publishers/contract-renewal-requests/${requestId}/accept-pub`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      alert('Failed to accept request.');
    } finally {
      setAcceptingId(null);
    }
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
            marginRight: '24px',
          }}
        >
          <FiArrowLeft />
        </motion.button>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Contract Details</h1>
      </motion.header>

      <main style={{ padding: '40px', maxWidth: 600, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <FiTrendingUp size={24} style={{ marginRight: '15px', color: '#ff6b6b' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Your Contract</h3>
          </div>
          {contractLoading ? (
            <div style={{ color: 'white', opacity: 0.8 }}>Loading contract...</div>
          ) : contractError ? (
            <div style={{ color: '#ff4757' }}>{contractError}</div>
          ) : contract ? (
            <>
              <div style={{
                textAlign: 'center',
                color: '#ff6b6b',
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '28px',
                letterSpacing: '1px',
              }}>
                {contract.PUBLISHER_NAME}
              </div>
              <div style={{
                textAlign: 'left',
                color: 'white',
                fontSize: '1.15rem',
                lineHeight: 2.1,
                marginBottom: '32px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                padding: '18px 24px',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
              }}>
                <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <strong>Contract ID:</strong> {contract.CONTRACT_ID}
                </div>
                <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <strong>Contract Date:</strong> {contract.CONTRACT_DATE ? new Date(contract.CONTRACT_DATE).toLocaleDateString() : ''}
                </div>
                <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <strong>Expiry Date:</strong> {(() => {
                    if (!contract.CONTRACT_DATE || !contract.CONTRACT_DURATION_DAYS) return '';
                    const start = new Date(contract.CONTRACT_DATE);
                    const expiry = new Date(start.getTime() + contract.CONTRACT_DURATION_DAYS * 24 * 60 * 60 * 1000);
                    return expiry.toLocaleDateString();
                  })()}
                </div>
                <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <strong>Royalty:</strong> {contract.ROYALTY}
                </div>
                <div style={{ marginBottom: '0' }}>
                  <strong>Min Guarantee:</strong> {contract.MIN_GUARANTEE}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginTop: '32px' }}>
                <button
                  style={{
                    background: 'linear-gradient(45deg, #42a5f5, #1976d2)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    cursor: requestsLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px 0 rgba(66,165,245,0.08)',
                    opacity: requestsLoading ? 0.5 : 1
                  }}
                  disabled={requestsLoading}
                  onClick={() => {
                    // Check for pending publisher-requested renewal
                    const hasPendingPublisherRequest = publisherRequests.some(r => r.STATUS === 'PENDING');
                    if (hasPendingPublisherRequest) {
                      setShowPendingModal(true);
                      return;
                    }
                    setRenewForm({
                      renewalYears: contract.CONTRACT_DURATION_DAYS || '',
                      newMinGuarantee: contract.MIN_GUARANTEE || '',
                      newRoyalty: contract.ROYALTY || ''
                    });
                    setShowRenewModal(true);
                  }}
                >
                  Renew Contract
                </button>
              </div>
              {/* Admin Requested Contract Renewal Requests Table */}
              {(() => {
                const pendingRequest = adminRequests.find(r => r.STATUS === 'PENDING' && r.REQUESTED_BY === 'ADMIN');
                if (pendingRequest) {
                  return (
                    <div style={{ marginTop: '36px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '18px 32px 18px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '18px', color: '#42a5f5', alignSelf: 'flex-start' }}>
                        Admin Requested Contract Renewal Request
                      </h3>
                      <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                          <tr style={{ background: 'rgba(66,165,245,0.08)' }}>
                            <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Request ID</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Request Date</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Renewal Years</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>New Min Guarantee</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>New Royalty</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key={pendingRequest.REQUEST_ID} style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px', color: 'white' }}>{pendingRequest.REQUEST_ID}</td>
                            <td style={{ padding: '10px', color: 'white' }}>{pendingRequest.REQUEST_DATE ? new Date(pendingRequest.REQUEST_DATE).toLocaleDateString() : ''}</td>
                            <td style={{ padding: '10px', color: 'white' }}>{pendingRequest.RENEWAL_YEARS}</td>
                            <td style={{ padding: '10px', color: 'white' }}>{pendingRequest.NEW_MIN_GUARANTEE}</td>
                            <td style={{ padding: '10px', color: 'white' }}>{pendingRequest.NEW_ROYALTY}</td>
                            <td style={{ padding: '10px', color: 'white' }}>{pendingRequest.STATUS}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', width: '100%' }}>
                        <button
                          style={{
                            background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 32px',
                            borderRadius: '8px',
                            cursor: acceptingId === pendingRequest.REQUEST_ID ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            boxShadow: '0 2px 8px 0 rgba(66,245,165,0.08)',
                            opacity: acceptingId === pendingRequest.REQUEST_ID ? 0.5 : 1
                          }}
                          disabled={acceptingId === pendingRequest.REQUEST_ID}
                          onClick={() => handleAcceptAdminRequest(pendingRequest.REQUEST_ID)}
                        >
                          {acceptingId === pendingRequest.REQUEST_ID ? 'Accepting...' : 'Accept request'}
                        </button>
                        <button
                          style={{
                            background: 'linear-gradient(45deg, #ff4757, #ff6b6b)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 32px',
                            borderRadius: '8px',
                            cursor: rejecting ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            boxShadow: '0 2px 8px 0 rgba(255,71,87,0.08)',
                            opacity: rejecting ? 0.5 : 1
                          }}
                          disabled={rejecting}
                          onClick={() => handleRejectRequest(pendingRequest.REQUEST_ID)}
                        >
                          {rejecting ? 'Rejecting...' : 'Reject request'}
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </>
          ) : (
            <div style={{ color: '#ff4757' }}>No contract found.</div>
          )}
        </motion.div>
      </main>
      {/* Renew Contract Modal */}
      {showRenewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '420px', color: '#1976d2', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '18px' }}>
              Renew Contract
            </h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setRenewLoading(true);
              setRenewError('');
              try {
                const token = localStorage.getItem('token');
                await axios.post(`${BASE_URL}/publishers/contract-renewal-requests`, {
                  publisherId: contract.PUBLISHER_ID,
                  renewalYears: renewForm.renewalYears,
                  newMinGuarantee: renewForm.newMinGuarantee,
                  newRoyalty: renewForm.newRoyalty,
                  requestedBy: 'PUBLISHER'
                }, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setShowRenewModal(false);
                fetchAdminRequests(contract.PUBLISHER_ID);
                fetchContract();
              } catch (err) {
                setRenewError('Failed to submit renewal request');
              } finally {
                setRenewLoading(false);
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
              {renewError && <div style={{ color: '#ff4757', marginBottom: '8px' }}>{renewError}</div>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(45deg, #42a5f5, #1976d2)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: renewLoading ? 'not-allowed' : 'pointer', opacity: renewLoading ? 0.5 : 1 }}
                  disabled={renewLoading}
                >
                  {renewLoading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  style={{ flex: 1, background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pending Publisher Request Modal */}
      {showPendingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '36px', width: '100%', maxWidth: '420px', color: '#ee5a24', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '18px' }}>
              Pending Request
            </h3>
            <p style={{ marginBottom: '24px', color: '#333' }}>There is already a pending renewal request from you to the admin. You cannot send another request until it is resolved.</p>
            <button
              onClick={() => setShowPendingModal(false)}
              style={{ background: 'linear-gradient(45deg, #ffa726, #ff7043)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Publisher Pending Request Box */}
      {publisherRequests.some(r => r.STATUS === 'PENDING') && (
        <div style={{
          margin: '36px auto 0 auto',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '18px 32px',
          color: 'white',
          maxWidth: 600,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
          fontSize: '1.05rem',
        }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '14px', color: '#42a5f5' }}>Your Pending Renewal Request</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ background: 'rgba(66,165,245,0.08)' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Request Date</th>
                <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Renewal Years</th>
                <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>New Min Guarantee</th>
                <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>New Royalty</th>
                <th style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#42a5f5' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {publisherRequests.filter(r => r.STATUS === 'PENDING').map(req => (
                <tr key={req.REQUEST_ID} style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px', color: 'white' }}>{req.REQUEST_DATE ? new Date(req.REQUEST_DATE).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '10px', color: 'white' }}>{req.RENEWAL_YEARS}</td>
                  <td style={{ padding: '10px', color: 'white' }}>{req.NEW_MIN_GUARANTEE}</td>
                  <td style={{ padding: '10px', color: 'white' }}>{req.NEW_ROYALTY}</td>
                  <td style={{ padding: '10px', color: 'white' }}>{req.STATUS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PublisherContract; 