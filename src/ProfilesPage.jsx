import React, { useState, useEffect } from 'react';
import { apiService } from './services/api.js';
import UserProfile from './UserProfile';
import ComedianSearch from './ComedianSearch';
import ProfileView from './ProfileView';
import ConnectionRequests from './ConnectionRequests';
import SavedProfiles from './SavedProfiles';
import './ProfilesPage.css';

const ProfilesPage = ({ user, comedians = [], onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('my-profile');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      // Load user's connection requests
      const requests = JSON.parse(localStorage.getItem(`connectionRequests_${user.id}`) || '[]');
      setConnectionRequests(requests);
      
      // Load user's saved profiles
      const saved = JSON.parse(localStorage.getItem(`savedProfiles_${user.id}`) || '[]');
      setSavedProfiles(saved);
      
      // Load user's approved connections
      const userConnections = JSON.parse(localStorage.getItem(`connections_${user.id}`) || '[]');
      setConnections(userConnections);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileView = (comedian) => {
    setSelectedProfile(comedian);
    setActiveTab('profile-view');
  };

  const handleConnectionRequest = async (targetUser, message) => {
    const request = {
      id: Date.now(),
      fromUser: user,
      toUserId: targetUser.id,
      toUserName: targetUser.stage_name || targetUser.name,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Add to sender's outgoing requests
      const senderRequests = JSON.parse(localStorage.getItem(`connectionRequests_${user.id}`) || '[]');
      senderRequests.push(request);
      localStorage.setItem(`connectionRequests_${user.id}`, JSON.stringify(senderRequests));
      
      // Add to receiver's incoming requests
      const receiverRequests = JSON.parse(localStorage.getItem(`connectionRequests_${targetUser.id}`) || '[]');
      receiverRequests.push({ ...request, type: 'incoming' });
      localStorage.setItem(`connectionRequests_${targetUser.id}`, JSON.stringify(receiverRequests));
      
      setConnectionRequests(senderRequests);
      
      alert(`Connection request sent to ${targetUser.stage_name || targetUser.name}!`);
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const handleRequestResponse = async (requestId, response) => {
    try {
      const requests = [...connectionRequests];
      const requestIndex = requests.findIndex(req => req.id === requestId);
      
      if (requestIndex !== -1) {
        requests[requestIndex].status = response;
        
        if (response === 'approved') {
          // Add to both users' connections
          const newConnection = {
            userId: requests[requestIndex].fromUser.id,
            userData: requests[requestIndex].fromUser,
            connectedAt: new Date().toISOString()
          };
          
          const userConnections = [...connections, newConnection];
          setConnections(userConnections);
          localStorage.setItem(`connections_${user.id}`, JSON.stringify(userConnections));
        }
        
        setConnectionRequests(requests);
        localStorage.setItem(`connectionRequests_${user.id}`, JSON.stringify(requests));
      }
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const handleSaveProfile = (comedian) => {
    const saved = [...savedProfiles];
    const existingIndex = saved.findIndex(p => p.id === comedian.id);
    
    if (existingIndex === -1) {
      saved.push({
        ...comedian,
        savedAt: new Date().toISOString(),
        notes: ''
      });
      setSavedProfiles(saved);
      localStorage.setItem(`savedProfiles_${user.id}`, JSON.stringify(saved));
      alert(`${comedian.stage_name || comedian.name} saved to your profiles!`);
    } else {
      alert('Profile already saved!');
    }
  };

  const handleRemoveSavedProfile = (comedianId) => {
    const filtered = savedProfiles.filter(p => p.id !== comedianId);
    setSavedProfiles(filtered);
    localStorage.setItem(`savedProfiles_${user.id}`, JSON.stringify(filtered));
  };

  const handleUpdateProfileNotes = (comedianId, notes) => {
    const updated = savedProfiles.map(p => 
      p.id === comedianId ? { ...p, notes } : p
    );
    setSavedProfiles(updated);
    localStorage.setItem(`savedProfiles_${user.id}`, JSON.stringify(updated));
  };

  const isConnected = (comedianId) => {
    return connections.some(conn => conn.userId === comedianId);
  };

  const hasPendingRequest = (comedianId) => {
    return connectionRequests.some(req => 
      req.toUserId === comedianId && req.status === 'pending'
    );
  };

  const tabs = [
    { id: 'my-profile', label: '👤 My Profile', icon: '👤' },
    { id: 'search', label: '🔍 Find Comedians', icon: '🔍' },
    { id: 'requests', label: '📬 Requests', icon: '📬', badge: connectionRequests.filter(r => r.type === 'incoming' && r.status === 'pending').length },
    { id: 'saved', label: '⭐ Saved Profiles', icon: '⭐', badge: savedProfiles.length },
    { id: 'connections', label: '🤝 My Connections', icon: '🤝', badge: connections.length }
  ];

  return (
    <div className="profiles-page">
      <div className="profiles-header">
        <h2>🎤 Comedian Profiles</h2>
        <p>Connect, discover, and grow your comedy network</p>
      </div>

      {/* Tab Navigation */}
      <div className="profiles-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="profiles-content">
        {activeTab === 'my-profile' && (
          <UserProfile 
            user={user} 
            onUserUpdate={onUserUpdate}
          />
        )}

        {activeTab === 'search' && (
          <ComedianSearch 
            comedians={comedians}
            currentUser={user}
            onProfileView={handleProfileView}
            onConnectionRequest={handleConnectionRequest}
            onSaveProfile={handleSaveProfile}
            isConnected={isConnected}
            hasPendingRequest={hasPendingRequest}
          />
        )}

        {activeTab === 'profile-view' && selectedProfile && (
          <ProfileView 
            profile={selectedProfile}
            currentUser={user}
            onConnectionRequest={handleConnectionRequest}
            onSaveProfile={handleSaveProfile}
            onBack={() => setActiveTab('search')}
            isConnected={isConnected(selectedProfile.id)}
            hasPendingRequest={hasPendingRequest(selectedProfile.id)}
          />
        )}

        {activeTab === 'requests' && (
          <ConnectionRequests 
            requests={connectionRequests}
            currentUser={user}
            onRequestResponse={handleRequestResponse}
          />
        )}

        {activeTab === 'saved' && (
          <SavedProfiles 
            savedProfiles={savedProfiles}
            onRemoveProfile={handleRemoveSavedProfile}
            onUpdateNotes={handleUpdateProfileNotes}
            onProfileView={handleProfileView}
          />
        )}

        {activeTab === 'connections' && (
          <div className="connections-section">
            <h3>🤝 My Connections</h3>
            {connections.length === 0 ? (
              <div className="empty-state">
                <p>No connections yet. Start by sending connection requests to other comedians!</p>
                <button 
                  className="cta-button"
                  onClick={() => setActiveTab('search')}
                >
                  Find Comedians
                </button>
              </div>
            ) : (
              <div className="connections-grid">
                {connections.map(connection => (
                  <div key={connection.userId} className="connection-card">
                    <div className="connection-header">
                      <h4>{connection.userData.stage_name || connection.userData.fullName}</h4>
                      <span className="connection-date">
                        Connected {new Date(connection.connectedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="connection-info">
                      <p><strong>Specialty:</strong> {connection.userData.comedy_specialty}</p>
                      <p><strong>Experience:</strong> {connection.userData.experience_level}</p>
                      <p><strong>Location:</strong> {connection.userData.location}</p>
                    </div>
                    <div className="connection-actions">
                      <button 
                        className="view-button"
                        onClick={() => handleProfileView(connection.userData)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilesPage;