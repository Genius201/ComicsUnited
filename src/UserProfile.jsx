import React, { useState, useEffect } from 'react';
import { apiService } from './services/api.js';

const UserProfile = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    stage_name: '',
    email: '',
    comedy_specialty: [],
    experience_level: '',
    location: '',
    bio: '',
    phone: '',
    website: '',
    social_media: {
      instagram: '',
      twitter: '',
      tiktok: '',
      youtube: ''
    },
    availability: {
      open_mics: false,
      paid_gigs: false,
      collaboration: false,
      writing_partner: false
    },
    performance_info: {
      set_length: '',
      clean_content: false,
      travel_radius: '',
      booking_rate: ''
    }
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        stage_name: user.stage_name || '',
        email: user.email || '',
        comedy_specialty: Array.isArray(user.comedy_specialty) ? user.comedy_specialty : (user.comedy_specialty ? [user.comedy_specialty] : []),
        experience_level: user.experience_level || '',
        location: user.location || '',
        bio: user.bio || '',
        phone: user.phone || '',
        website: user.website || '',
        social_media: {
          instagram: user.social_media?.instagram || '',
          twitter: user.social_media?.twitter || '',
          tiktok: user.social_media?.tiktok || '',
          youtube: user.social_media?.youtube || ''
        },
        availability: {
          open_mics: user.availability?.open_mics || false,
          paid_gigs: user.availability?.paid_gigs || false,
          collaboration: user.availability?.collaboration || false,
          writing_partner: user.availability?.writing_partner || false
        },
        performance_info: {
          set_length: user.performance_info?.set_length || '',
          clean_content: user.performance_info?.clean_content || false,
          travel_radius: user.performance_info?.travel_radius || '',
          booking_rate: user.performance_info?.booking_rate || ''
        }
      });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleComedySpecialtyChange = (specialty) => {
    setFormData(prev => ({
      ...prev,
      comedy_specialty: prev.comedy_specialty.includes(specialty)
        ? prev.comedy_specialty.filter(s => s !== specialty)
        : [...prev.comedy_specialty, specialty]
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        ...formData,
        avatar: avatar,
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('comicsUnited_user', JSON.stringify(updatedUser));
      
      // Call parent update function
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const comedySpecialties = [
    'Stand-up Comedy',
    'Improv',
    'Sketch Comedy',
    'Musical Comedy',
    'Comedy Writing',
    'Storytelling',
    'Character Comedy',
    'Roast Comedy',
    'Clean Comedy',
    'Alternative Comedy'
  ];

  const experienceLevels = [
    'Beginner (0-1 years)',
    'Intermediate (2-4 years)',
    'Advanced (5-9 years)',
    'Professional (10+ years)',
    'Industry Veteran (15+ years)'
  ];

  if (!user) {
    return <div className="user-profile">Please log in to view your profile.</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar-container">
            {avatar ? (
              <img src={avatar} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                <span>📷</span>
              </div>
            )}
            {isEditing && (
              <label className="avatar-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  hidden 
                />
                <span className="upload-icon">📁</span>
              </label>
            )}
          </div>
        </div>
        
        <div className="profile-title">
          <h3>{formData.stage_name || formData.fullName}</h3>
          <p className="specialty">{Array.isArray(formData.comedy_specialty) ? formData.comedy_specialty.join(', ') : formData.comedy_specialty}</p>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-button"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? '💾 Saving...' : '💾 Save'}
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Basic Information */}
        <div className="profile-section">
          <h4>📋 Basic Information</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{formData.fullName}</span>
              )}
            </div>
            <div className="form-group">
              <label>Stage Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="stage_name"
                  value={formData.stage_name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{formData.stage_name}</span>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{formData.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="form-value">{formData.phone || 'Not provided'}</span>
              )}
            </div>
            <div className="form-group">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              ) : (
                <span className="form-value">{formData.location}</span>
              )}
            </div>
            <div className="form-group">
              <label>Website</label>
              {isEditing ? (
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              ) : (
                <span className="form-value">
                  {formData.website ? (
                    <a href={formData.website} target="_blank" rel="noopener noreferrer">
                      {formData.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Comedy Information */}
        <div className="profile-section">
          <h4>🎭 Comedy Information</h4>
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label>Comedy Specialties (Select all that apply)</label>
              {isEditing ? (
                <div className="checkbox-grid">
                  {comedySpecialties.map(specialty => (
                    <div key={specialty} className="checkbox-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.comedy_specialty.includes(specialty)}
                          onChange={() => handleComedySpecialtyChange(specialty)}
                        />
                        <span>{specialty}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="specialty-tags">
                  {formData.comedy_specialty.length > 0 ? 
                    formData.comedy_specialty.map(specialty => (
                      <span key={specialty} className="specialty-tag">{specialty}</span>
                    )) : 
                    <span className="form-value">No specialties selected</span>
                  }
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              {isEditing ? (
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleInputChange}
                >
                  <option value="">Select experience</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              ) : (
                <span className="form-value">{formData.experience_level}</span>
              )}
            </div>
            <div className="form-group form-group-full">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell other comedians about yourself..."
                />
              ) : (
                <span className="form-value bio-text">{formData.bio || 'No bio provided'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="profile-section">
          <h4>📱 Social Media</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Instagram</label>
              {isEditing ? (
                <input
                  type="text"
                  name="social_media.instagram"
                  value={formData.social_media.instagram}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              ) : (
                <span className="form-value">
                  {formData.social_media.instagram || 'Not provided'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Twitter</label>
              {isEditing ? (
                <input
                  type="text"
                  name="social_media.twitter"
                  value={formData.social_media.twitter}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              ) : (
                <span className="form-value">
                  {formData.social_media.twitter || 'Not provided'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>TikTok</label>
              {isEditing ? (
                <input
                  type="text"
                  name="social_media.tiktok"
                  value={formData.social_media.tiktok}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              ) : (
                <span className="form-value">
                  {formData.social_media.tiktok || 'Not provided'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>YouTube</label>
              {isEditing ? (
                <input
                  type="text"
                  name="social_media.youtube"
                  value={formData.social_media.youtube}
                  onChange={handleInputChange}
                  placeholder="Channel URL or @username"
                />
              ) : (
                <span className="form-value">
                  {formData.social_media.youtube || 'Not provided'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="profile-section">
          <h4>📅 Availability</h4>
          <div className="availability-grid">
            {Object.entries(formData.availability).map(([key, value]) => (
              <div key={key} className="availability-item">
                {isEditing ? (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name={`availability.${key}`}
                      checked={value}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ) : (
                  <div className={`availability-status ${value ? 'available' : 'unavailable'}`}>
                    {value ? '✅' : '❌'} {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Information */}
        <div className="profile-section">
          <h4>🎪 Performance Information</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Set Length</label>
              {isEditing ? (
                <input
                  type="text"
                  name="performance_info.set_length"
                  value={formData.performance_info.set_length}
                  onChange={handleInputChange}
                  placeholder="e.g., 5-10 minutes, 20 minutes"
                />
              ) : (
                <span className="form-value">
                  {formData.performance_info.set_length || 'Not specified'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Travel Radius</label>
              {isEditing ? (
                <input
                  type="text"
                  name="performance_info.travel_radius"
                  value={formData.performance_info.travel_radius}
                  onChange={handleInputChange}
                  placeholder="e.g., 50 miles, Statewide, National"
                />
              ) : (
                <span className="form-value">
                  {formData.performance_info.travel_radius || 'Not specified'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Booking Rate</label>
              {isEditing ? (
                <input
                  type="text"
                  name="performance_info.booking_rate"
                  value={formData.performance_info.booking_rate}
                  onChange={handleInputChange}
                  placeholder="e.g., $50-100, Negotiable"
                />
              ) : (
                <span className="form-value">
                  {formData.performance_info.booking_rate || 'Not specified'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                {isEditing ? (
                  <>
                    <input
                      type="checkbox"
                      name="performance_info.clean_content"
                      checked={formData.performance_info.clean_content}
                      onChange={handleInputChange}
                    />
                    <span>Clean Content Only</span>
                  </>
                ) : (
                  <div className={`clean-content ${formData.performance_info.clean_content ? 'yes' : 'no'}`}>
                    {formData.performance_info.clean_content ? '✅ Clean Content Only' : '❌ May Include Adult Content'}
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;