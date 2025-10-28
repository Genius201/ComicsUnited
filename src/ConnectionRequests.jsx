import React, { useState } from 'react';

const ConnectionRequests = ({ requests, currentUser, onRequestResponse }) => {
  const [activeTab, setActiveTab] = useState('incoming');

  const incomingRequests = requests.filter(req => req.type === 'incoming' && req.status === 'pending');
  const outgoingRequests = requests.filter(req => req.type !== 'incoming');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  const handleResponse = (requestId, response) => {
    onRequestResponse(requestId, response);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const RequestCard = ({ request, showActions = false, isOutgoing = false }) => (
    <div className={`request-card ${request.status}`}>
      <div className="request-header">
        <div className="user-info">
          <div className="user-avatar">
            {request.fromUser?.avatar ? (
              <img src={request.fromUser.avatar} alt={request.fromUser.stage_name} />
            ) : (
              <div className="avatar-placeholder">🎭</div>
            )}
          </div>
          <div className="user-details">
            <h4>{request.fromUser?.stage_name || request.fromUser?.fullName || request.toUserName}</h4>
            <p className="user-specialty">
              {request.fromUser?.comedy_specialty || request.fromUser?.specialty || 'Comedian'}
            </p>
            <p className="user-location">
              📍 {request.fromUser?.location || 'Location not specified'}
            </p>
          </div>
        </div>
        
        <div className="request-status">
          <span className={`status-badge ${request.status}`}>
            {request.status === 'pending' && '⏳ Pending'}
            {request.status === 'approved' && '✅ Approved'}
            {request.status === 'rejected' && '❌ Rejected'}
          </span>
          <small className="request-date">
            {formatDate(request.timestamp)}
          </small>
        </div>
      </div>

      {request.message && (
        <div className="request-message">
          <p><strong>Message:</strong> "{request.message}"</p>
        </div>
      )}

      <div className="request-footer">
        <div className="request-type">
          {isOutgoing ? (
            <span>📤 Sent to {request.toUserName}</span>
          ) : (
            <span>📥 From {request.fromUser?.stage_name || request.fromUser?.fullName}</span>
          )}
        </div>

        {showActions && request.status === 'pending' && (
          <div className="request-actions">
            <button 
              className="approve-button"
              onClick={() => handleResponse(request.id, 'approved')}
            >
              ✅ Approve
            </button>
            <button 
              className="reject-button"
              onClick={() => handleResponse(request.id, 'rejected')}
            >
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="connection-requests">
      <div className="requests-header">
        <h3>📬 Connection Requests</h3>
        <p>Manage your connection requests and build your network</p>
      </div>

      {/* Tab Navigation */}
      <div className="requests-tabs">
        <button 
          className={`tab-button ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          📥 Incoming
          {incomingRequests.length > 0 && (
            <span className="tab-badge">{incomingRequests.length}</span>
          )}
        </button>
        <button 
          className={`tab-button ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          📤 Outgoing
          {outgoingRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="tab-badge">{outgoingRequests.filter(r => r.status === 'pending').length}</span>
          )}
        </button>
        <button 
          className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          ✅ Approved
          {approvedRequests.length > 0 && (
            <span className="tab-badge">{approvedRequests.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="requests-content">
        {activeTab === 'incoming' && (
          <div className="incoming-requests">
            <div className="tab-header">
              <h4>📥 Incoming Requests</h4>
              <p>Requests from other comedians who want to connect with you</p>
            </div>
            
            {incomingRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h4>No incoming requests</h4>
                <p>When other comedians want to connect with you, their requests will appear here.</p>
              </div>
            ) : (
              <div className="requests-list">
                {incomingRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'outgoing' && (
          <div className="outgoing-requests">
            <div className="tab-header">
              <h4>📤 Outgoing Requests</h4>
              <p>Requests you've sent to other comedians</p>
            </div>
            
            {outgoingRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📤</div>
                <h4>No outgoing requests</h4>
                <p>Start connecting with other comedians by searching for profiles and sending requests.</p>
              </div>
            ) : (
              <div className="requests-list">
                {outgoingRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    isOutgoing={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="approved-requests">
            <div className="tab-header">
              <h4>✅ Approved Connections</h4>
              <p>Successfully connected comedians you can now message</p>
            </div>
            
            {approvedRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🤝</div>
                <h4>No approved connections</h4>
                <p>Once requests are approved, you'll be able to message these comedians directly.</p>
              </div>
            ) : (
              <div className="requests-list">
                {approvedRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    isOutgoing={request.type !== 'incoming'}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="requests-stats">
        <div className="stat-item">
          <span className="stat-number">{incomingRequests.length}</span>
          <span className="stat-label">Pending Incoming</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{outgoingRequests.filter(r => r.status === 'pending').length}</span>
          <span className="stat-label">Pending Outgoing</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{approvedRequests.length}</span>
          <span className="stat-label">Total Connections</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{rejectedRequests.length}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequests;