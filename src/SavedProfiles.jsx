import React, { useState } from 'react';

const SavedProfiles = ({ 
  savedProfiles, 
  onRemoveProfile, 
  onUpdateNotes, 
  onProfileView 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('savedAt');
  const [editingNotes, setEditingNotes] = useState(null);
  const [newNotes, setNewNotes] = useState('');

  const filteredProfiles = savedProfiles
    .filter(profile => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        (profile.stage_name && profile.stage_name.toLowerCase().includes(query)) ||
        (profile.name && profile.name.toLowerCase().includes(query)) ||
        (profile.specialty && profile.specialty.toLowerCase().includes(query)) ||
        (profile.comedy_specialty && profile.comedy_specialty.toLowerCase().includes(query)) ||
        (profile.location && profile.location.toLowerCase().includes(query)) ||
        (profile.notes && profile.notes.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.stage_name || a.name).localeCompare(b.stage_name || b.name);
        case 'specialty':
          return (a.specialty || a.comedy_specialty || '').localeCompare(b.specialty || b.comedy_specialty || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        case 'savedAt':
        default:
          return new Date(b.savedAt) - new Date(a.savedAt);
      }
    });

  const handleEditNotes = (profileId, currentNotes) => {
    setEditingNotes(profileId);
    setNewNotes(currentNotes || '');
  };

  const handleSaveNotes = (profileId) => {
    onUpdateNotes(profileId, newNotes);
    setEditingNotes(null);
    setNewNotes('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setNewNotes('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ProfileCard = ({ profile }) => (
    <div className="saved-profile-card">
      <div className="profile-card-header">
        <div className="profile-basic-info">
          <div className="profile-avatar-small">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.stage_name || profile.name} />
            ) : (
              <div className="avatar-placeholder">🎭</div>
            )}
          </div>
          
          <div className="profile-details">
            <h4>{profile.stage_name || profile.name}</h4>
            <p className="profile-specialty">
              {profile.specialty || profile.comedy_specialty}
            </p>
            <p className="profile-location">📍 {profile.location}</p>
            <p className="saved-date">
              Saved on {formatDate(profile.savedAt)}
            </p>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="view-button"
            onClick={() => onProfileView(profile)}
            title="View Full Profile"
          >
            👁️ View
          </button>
          <button 
            className="remove-button"
            onClick={() => {
              if (window.confirm(`Remove ${profile.stage_name || profile.name} from saved profiles?`)) {
                onRemoveProfile(profile.id);
              }
            }}
            title="Remove from Saved"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="profile-notes-section">
        <div className="notes-header">
          <h5>📝 Your Notes</h5>
          {editingNotes !== profile.id && (
            <button 
              className="edit-notes-button"
              onClick={() => handleEditNotes(profile.id, profile.notes)}
            >
              ✏️ Edit
            </button>
          )}
        </div>
        
        {editingNotes === profile.id ? (
          <div className="notes-editor">
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Add your notes about this comedian..."
              rows={3}
              maxLength={500}
            />
            <div className="notes-actions">
              <small>{newNotes.length}/500 characters</small>
              <div className="action-buttons">
                <button 
                  className="save-notes-button"
                  onClick={() => handleSaveNotes(profile.id)}
                >
                  💾 Save
                </button>
                <button 
                  className="cancel-notes-button"
                  onClick={handleCancelEdit}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="notes-display">
            {profile.notes ? (
              <p className="notes-text">{profile.notes}</p>
            ) : (
              <p className="no-notes">No notes added yet. Click Edit to add your thoughts about this comedian.</p>
            )}
          </div>
        )}
      </div>

      {/* Additional Profile Info */}
      <div className="profile-summary">
        {profile.bio && (
          <p className="profile-bio">
            {profile.bio.length > 100 
              ? `${profile.bio.substring(0, 100)}...` 
              : profile.bio
            }
          </p>
        )}
        
        {profile.availability && (
          <div className="availability-indicators">
            {Object.entries(profile.availability).map(([key, value]) => 
              value && (
                <span key={key} className="availability-tag">
                  {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="saved-profiles">
      <div className="saved-profiles-header">
        <h3>⭐ Saved Profiles</h3>
        <p>Your private collection of comedian profiles and notes</p>
      </div>

      {savedProfiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h4>No saved profiles yet</h4>
          <p>Start building your network by saving interesting comedian profiles you discover.</p>
          <div className="empty-actions">
            <button className="cta-button">
              🔍 Search Comedians
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="saved-profiles-controls">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search saved profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="sort-section">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="savedAt">Date Saved (Newest)</option>
                <option value="name">Name (A-Z)</option>
                <option value="specialty">Specialty</option>
                <option value="location">Location</option>
              </select>
            </div>
            
            <div className="profiles-count">
              <span>{filteredProfiles.length} of {savedProfiles.length} profiles</span>
            </div>
          </div>

          {/* Profiles Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="no-results">
              <h4>No profiles match your search</h4>
              <p>Try adjusting your search terms or clear the search to see all saved profiles.</p>
            </div>
          ) : (
            <div className="saved-profiles-grid">
              {filteredProfiles.map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="saved-profiles-stats">
            <div className="stat-item">
              <span className="stat-number">{savedProfiles.length}</span>
              <span className="stat-label">Total Saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {savedProfiles.filter(p => p.notes && p.notes.trim()).length}
              </span>
              <span className="stat-label">With Notes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {new Set(savedProfiles.map(p => p.location)).size}
              </span>
              <span className="stat-label">Locations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {new Set(savedProfiles.map(p => p.specialty || p.comedy_specialty)).size}
              </span>
              <span className="stat-label">Specialties</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedProfiles;