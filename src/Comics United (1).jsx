import React, { useState, useEffect } from 'react';
import { apiService } from './services/api.js';
import './App.css';
import Auth from './Auth';
import FeedbackModal from './FeedbackModal';

function App() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('profiles');
  const [showModal, setShowModal] = useState(false);
  const [selectedComedian, setSelectedComedian] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [betaUser, setBetaUser] = useState(false);
  
  // State for data from API
  const [comedians, setComedians] = useState([]);
  const [venues, setVenues] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    const savedBetaStatus = localStorage.getItem('betaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setBetaUser(savedBetaStatus === 'true');
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [comediansRes, venuesRes, groupsRes] = await Promise.all([
        apiService.comedians.getAll(),
        apiService.venues.getAll(),
        apiService.groups.getAll()
      ]);
      
      setComedians(comediansRes.data);
      setVenues(venuesRes.data);
      setGroups(groupsRes.data);
    } catch (err) {
      setError('Failed to load data. Please make sure the server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setBetaUser(true); // All users are beta users for now
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('betaUser', 'true');
  };

  const handleLogout = () => {
    setUser(null);
    setBetaUser(false);
    localStorage.removeItem('user');
    localStorage.removeItem('betaUser');
  };

  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Beta Feedback Received:', feedbackData);
    // In a real app, this would be sent to your analytics/feedback API
    
    // Store feedback locally for demo
    const existingFeedback = JSON.parse(localStorage.getItem('betaFeedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('betaFeedback', JSON.stringify(existingFeedback));
  };

  const openProfile = (comedian) => {
    setSelectedComedian(comedian);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComedian(null);
  };

  const sendMessage = async (toId, subject, message) => {
    try {
      const messageData = {
        from_id: 1, // Current user ID (would come from auth)
        to_id: toId,
        subject,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        thread_id: Date.now() // Simple thread ID generation
      };
      
      await apiService.messages.send(messageData);
      alert('Message sent successfully!');
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    }
  };

  const addReview = async (venueId, rating, reviewText) => {
    try {
      const reviewData = {
        venue_id: venueId,
        comedian_id: 1, // Current user ID (would come from auth)
        rating,
        review: reviewText,
        date: new Date().toISOString().split('T')[0],
        helpful_votes: 0
      };
      
      await apiService.reviews.create(reviewData);
      alert('Review added successfully!');
    } catch (err) {
      alert('Failed to add review: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="App loading">
        <div className="loading-spinner">
          <h2>🎭 Loading Comics United...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App error">
        <div className="error-message">
          <h2>⚠️ Connection Error</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-btn">
            Try Again
          </button>
          <div className="server-info">
            <p><strong>To start the server:</strong></p>
            <code>npm run dev</code>
            <p>This will start both the client and JSON server.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication page if user is not logged in
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {betaUser && (
        <div className="beta-banner">
          🧪 <strong>BETA VERSION</strong> - Help us improve Comics United! 
          <button 
            className="feedback-trigger"
            onClick={() => setShowFeedback(true)}
          >
            Share Feedback
          </button>
        </div>
      )}
      
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🎭 Comics United</h1>
            <p>Professional Networking Platform for Comedians</p>
          </div>
          <div className="user-section">
            <span className="welcome-text">Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <div className="server-status">
          <span className="status-indicator online"></span>
          Connected to server
        </div>
      </header>

      <nav className="main-nav">
        <button 
          className={selectedTab === 'profiles' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setSelectedTab('profiles')}
        >
          Comedian Profiles ({comedians.length})
        </button>
        <button 
          className={selectedTab === 'venues' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setSelectedTab('venues')}
        >
          Venue Reviews ({venues.length})
        </button>
        <button 
          className={selectedTab === 'groups' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setSelectedTab('groups')}
        >
          Collaboration Rooms ({groups.length})
        </button>
      </nav>

      <main className="main-content">
        {selectedTab === 'profiles' && (
          <div className="profiles-section">
            <h2>Verified Comedians</h2>
            <div className="profiles-grid">
              {comedians.map(comedian => (
                <div key={comedian.id} className="profile-card">
                  <div className="profile-header">
                    <img 
                      src={comedian.profileImage} 
                      alt={comedian.name}
                      className="profile-image"
                    />
                    <div className="profile-title">
                      <h3>{comedian.name}</h3>
                      {comedian.verified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                  </div>
                  <div className="profile-details">
                    <p><strong>Rating:</strong> ⭐ {comedian.rating}/5</p>
                    <p><strong>Location:</strong> {comedian.location}</p>
                    <p><strong>Experience:</strong> {comedian.yearsExperience} years</p>
                    <p><strong>Specialties:</strong> {comedian.specialties.join(', ')}</p>
                    <p className="bio">{comedian.bio}</p>
                  </div>
                  <div className="profile-actions">
                    <button onClick={() => openProfile(comedian)} className="view-btn">
                      View Profile
                    </button>
                    {comedian.verified && (
                      <button 
                        onClick={() => sendMessage(comedian.id, 'Hello!', 'Hi there! I\'d like to connect.')}
                        className="contact-btn"
                      >
                        Send Message
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'venues' && (
          <div className="venues-section">
            <h2>Comedy Venues</h2>
            <div className="venues-grid">
              {venues.map(venue => (
                <div key={venue.id} className="venue-card">
                  <h3>{venue.name}</h3>
                  <p><strong>Location:</strong> {venue.location}</p>
                  <p><strong>Address:</strong> {venue.address}</p>
                  <p><strong>Capacity:</strong> {venue.capacity} people</p>
                  <p><strong>Rating:</strong> ⭐ {venue.rating}/5 ({venue.reviews} reviews)</p>
                  <p><strong>Open Mic:</strong> {venue.open_mic_nights.join(', ')}</p>
                  <p>{venue.description}</p>
                  <div className="amenities">
                    <strong>Amenities:</strong>
                    <div className="amenities-list">
                      {venue.amenities.map((amenity, index) => (
                        <span key={index} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                  </div>
                  <div className="venue-actions">
                    <button 
                      onClick={() => addReview(venue.id, 5, 'Great venue!')}
                      className="review-btn"
                    >
                      Write Review
                    </button>
                    <button className="book-btn">
                      Contact: {venue.phone}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'groups' && (
          <div className="groups-section">
            <h2>Collaboration Rooms</h2>
            <div className="groups-grid">
              {groups.map(room => (
                <div key={room.id} className="group-card">
                  <h3>{room.name}</h3>
                  <p><strong>Members:</strong> {room.members}</p>
                  <p><strong>Category:</strong> {room.category}</p>
                  <p><strong>Focus:</strong> {room.topic}</p>
                  <p><strong>Schedule:</strong> {room.meeting_schedule}</p>
                  <p>{room.description}</p>
                  <div className="group-actions">
                    <button className="join-btn">Join Room</button>
                    <button className="view-btn">View Discussions</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal for profile details */}
      {showModal && selectedComedian && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedComedian.name}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <img 
                src={selectedComedian.profileImage} 
                alt={selectedComedian.name}
                className="modal-profile-image"
              />
              {selectedComedian.verified && (
                <p className="verification-status">
                  ✅ Background Check Verified on {selectedComedian.verified_date}
                </p>
              )}
              <p><strong>Rating:</strong> ⭐ {selectedComedian.rating}/5</p>
              <p><strong>Location:</strong> {selectedComedian.location}</p>
              <p><strong>Experience:</strong> {selectedComedian.yearsExperience} years</p>
              <p><strong>Specialties:</strong> {selectedComedian.specialties.join(', ')}</p>
              <p><strong>Bio:</strong> {selectedComedian.bio}</p>
              
              {selectedComedian.social_media && (
                <div className="social-media">
                  <h4>Connect on Social:</h4>
                  {selectedComedian.social_media.instagram && (
                    <p>📸 Instagram: {selectedComedian.social_media.instagram}</p>
                  )}
                  {selectedComedian.social_media.twitter && (
                    <p>🐦 Twitter: {selectedComedian.social_media.twitter}</p>
                  )}
                  {selectedComedian.social_media.website && (
                    <p>🌐 Website: {selectedComedian.social_media.website}</p>
                  )}
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  onClick={() => sendMessage(selectedComedian.id, 'Connection Request', 'Hi! I\'d like to connect with you.')}
                  className="contact-btn"
                >
                  Send Private Message
                </button>
                <button 
                  onClick={() => sendMessage(selectedComedian.id, 'Collaboration Proposal', 'I have an interesting collaboration idea to discuss.')}
                  className="collab-btn"
                >
                  Propose Collaboration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>© 2025 Comics United - Connecting Comedians Professionally</p>
        <p>API Server: localhost:3001 | Client: localhost:3000</p>
        {betaUser && (
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
            Beta Version - Your feedback shapes our future! 
            <button 
              onClick={() => setShowFeedback(true)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                marginLeft: '0.5rem'
              }}
            >
              Give Feedback
            </button>
          </p>
        )}
      </footer>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}

export default App;