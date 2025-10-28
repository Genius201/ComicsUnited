import React, { useState } from 'react';

const ProfileView = ({ 
  profile, 
  currentUser, 
  onConnectionRequest, 
  onSaveProfile, 
  onBack, 
  isConnected, 
  hasPendingRequest 
}) => {
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [showFullBio, setShowFullBio] = useState(false);

  const handleConnectionRequest = () => {
    if (connectionMessage.trim()) {
      onConnectionRequest(profile, connectionMessage);
      setShowConnectionModal(false);
      setConnectionMessage('');
    }
  };

  const formatSocialHandle = (platform, handle) => {
    if (!handle) return null;
    
    const baseUrls = {
      instagram: 'https://instagram.com/',
      twitter: 'https://twitter.com/',
      tiktok: 'https://tiktok.com/@',
      youtube: 'https://youtube.com/'
    };

    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
    const isUrl = handle.startsWith('http');
    
    return {
      display: handle,
      url: isUrl ? handle : `${baseUrls[platform]}${cleanHandle}`
    };
  };

  const getAvailabilityStatus = (availability) => {
    if (!availability) return [];
    return Object.entries(availability)
      .filter(([key, value]) => value)
      .map(([key, value]) => ({
        key,
        label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      }));
  };

  return (
    <div className="profile-view">
      {/* Header with Back Button */}
      <div className="profile-view-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Search
        </button>
        <div className="header-actions">
          <button 
            className="save-profile-button"
            onClick={() => onSaveProfile(profile)}
          >
            ⭐ Save Profile
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-hero">
        <div className="profile-avatar-large">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.stage_name || profile.name} />
          ) : (
            <div className="avatar-placeholder-large">
              <span>🎭</span>
            </div>
          )}
        </div>
        
        <div className="profile-title">
          <h2>{profile.stage_name || profile.name}</h2>
          <div className="profile-subtitle">
            <span className="specialty">{
              Array.isArray(profile.comedy_specialty) 
                ? profile.comedy_specialty.join(', ')
                : profile.comedy_specialty || profile.specialty || 'Not specified'
            }</span>
            {profile.verified && <span className="verified-badge">✅ Verified</span>}
          </div>
          <div className="profile-location">
            📍 {profile.location}
          </div>
          {profile.rating && (
            <div className="profile-rating">
              ⭐ {profile.rating} ({profile.reviews || 0} reviews)
            </div>
          )}
        </div>
        
        <div className="profile-actions">
          {isConnected ? (
            <div className="connected-status">
              <span className="status-icon">🤝</span>
              <span>Connected</span>
              <p>You can now send messages!</p>
            </div>
          ) : hasPendingRequest ? (
            <div className="pending-status">
              <span className="status-icon">⏳</span>
              <span>Request Sent</span>
              <p>Waiting for approval</p>
            </div>
          ) : (
            <button 
              className="connect-button-large"
              onClick={() => setShowConnectionModal(true)}
            >
              🤝 Send Connection Request
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content-detailed">
        {/* Bio Section */}
        {profile.bio && (
          <div className="profile-section">
            <h3>📝 About</h3>
            <div className="bio-content">
              <p className={`bio-text ${!showFullBio && profile.bio.length > 300 ? 'truncated' : ''}`}>
                {showFullBio || profile.bio.length <= 300 
                  ? profile.bio 
                  : `${profile.bio.substring(0, 300)}...`
                }
              </p>
              {profile.bio.length > 300 && (
                <button 
                  className="show-more-button"
                  onClick={() => setShowFullBio(!showFullBio)}
                >
                  {showFullBio ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Experience & Specialty */}
        <div className="profile-section">
          <h3>🎭 Comedy Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Specialties:</span>
              <div className="specialty-tags">
                {Array.isArray(profile.comedy_specialty) ? 
                  profile.comedy_specialty.map(specialty => (
                    <span key={specialty} className="specialty-tag">{specialty}</span>
                  )) : 
                  <span className="info-value">{profile.comedy_specialty || profile.specialty || 'Not specified'}</span>
                }
              </div>
            </div>
            <div className="info-item">
              <span className="info-label">Experience:</span>
              <span className="info-value">{profile.experience || profile.experience_level}</span>
            </div>
            {profile.performance_info?.set_length && (
              <div className="info-item">
                <span className="info-label">Typical Set Length:</span>
                <span className="info-value">{profile.performance_info.set_length}</span>
              </div>
            )}
            {profile.performance_info?.clean_content !== undefined && (
              <div className="info-item">
                <span className="info-label">Content Type:</span>
                <span className="info-value">
                  {profile.performance_info.clean_content ? '✅ Clean Content' : '🔞 May Include Adult Content'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        {profile.availability && getAvailabilityStatus(profile.availability).length > 0 && (
          <div className="profile-section">
            <h3>📅 Availability</h3>
            <div className="availability-tags">
              {getAvailabilityStatus(profile.availability).map(item => (
                <span key={item.key} className="availability-tag">
                  ✅ {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Performance Information */}
        {profile.performance_info && (
          <div className="profile-section">
            <h3>🎪 Performance Details</h3>
            <div className="info-grid">
              {profile.performance_info.travel_radius && (
                <div className="info-item">
                  <span className="info-label">Travel Radius:</span>
                  <span className="info-value">{profile.performance_info.travel_radius}</span>
                </div>
              )}
              {profile.performance_info.booking_rate && (
                <div className="info-item">
                  <span className="info-label">Booking Rate:</span>
                  <span className="info-value">{profile.performance_info.booking_rate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media */}
        {profile.social_media && (
          <div className="profile-section">
            <h3>📱 Social Media</h3>
            <div className="social-links">
              {Object.entries(profile.social_media).map(([platform, handle]) => {
                if (!handle) return null;
                const social = formatSocialHandle(platform, handle);
                return (
                  <a 
                    key={platform} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`social-link ${platform}`}
                  >
                    <span className="social-icon">
                      {platform === 'instagram' && '📷'}
                      {platform === 'twitter' && '🐦'}
                      {platform === 'tiktok' && '🎵'}
                      {platform === 'youtube' && '📹'}
                    </span>
                    <span className="social-handle">{social.display}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Information (only show if connected) */}
        {isConnected && (
          <div className="profile-section">
            <h3>📞 Contact Information</h3>
            <div className="contact-info">
              {profile.email && (
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${profile.email}`} className="contact-link">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.phone && (
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href={`tel:${profile.phone}`} className="contact-link">
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile.website && (
                <div className="contact-item">
                  <span className="contact-label">Website:</span>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Connection Request Modal */}
      {showConnectionModal && (
        <div className="modal-overlay">
          <div className="connection-modal">
            <div className="modal-header">
              <h3>🤝 Send Connection Request</h3>
              <button 
                className="close-button"
                onClick={() => setShowConnectionModal(false)}
              >
                ❌
              </button>
            </div>
            
            <div className="modal-content">
              <div className="request-target">
                <p>Sending request to:</p>
                <div className="target-info">
                  <strong>{profile.stage_name || profile.name}</strong>
                  <span>{
                    Array.isArray(profile.comedy_specialty) 
                      ? profile.comedy_specialty.join(', ')
                      : profile.comedy_specialty || profile.specialty || 'Not specified'
                  }</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  placeholder="Hi! I'd love to connect and potentially collaborate..."
                  rows={4}
                  maxLength={500}
                />
                <small>{connectionMessage.length}/500 characters</small>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowConnectionModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="send-request-button"
                  onClick={handleConnectionRequest}
                  disabled={!connectionMessage.trim()}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;