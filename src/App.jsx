import React, { useState, useEffect } from 'react';
import { apiService } from './services/api.js';
import './App.css';
import LandingPage from './LandingPage';
import Auth from './Auth';
import VenueSearch from './VenueSearch';
import FeedbackModal from './FeedbackModal';
import ProfilesPage from './ProfilesPage';

function App() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('profiles');
  const [showModal, setShowModal] = useState(false);
  const [selectedComedian, setSelectedComedian] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [betaUser, setBetaUser] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  // State for data from API
  const [comedians, setComedians] = useState([]);
  const [venues, setVenues] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('comicsUnited_user');
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
      
      // Use fallback data when server is not available
      setComedians([
        {
          id: 1,
          name: "Sarah Johnson",
          stage_name: "Sassy Sarah",
          specialty: "Stand-up Comedy",
          experience: "Professional (10+ years)",
          rating: 4.8,
          location: "New York, NY",
          bio: "Known for sharp wit and observational humor. Regular at Comedy Cellar.",
          verified: true
        },
        {
          id: 2,
          name: "Mike Rodriguez",
          stage_name: "Mikey Laughs",
          specialty: "Improv",
          experience: "Advanced (5-9 years)",
          rating: 4.6,
          location: "Los Angeles, CA",
          bio: "UCB graduate specializing in character work and musical improv.",
          verified: true
        },
        {
          id: 3,
          name: "Jenny Chen",
          stage_name: "Joke-a-lot Jenny",
          specialty: "Musical Comedy",
          experience: "Intermediate (2-4 years)",
          rating: 4.7,
          location: "Chicago, IL",
          bio: "Combines piano skills with comedy for unique musical performances.",
          verified: false
        }
      ]);

      setVenues([
        {
          id: 1,
          name: "The Laugh Track",
          location: "Manhattan, NY",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 200,
          description: "Premier comedy venue in the heart of NYC.",
          booking_contact: "bookings@laughtrack.com"
        },
        {
          id: 2,
          name: "Comedy Corner",
          location: "Hollywood, CA",
          type: "Bar with Comedy",
          rating: 4.2,
          capacity: 80,
          description: "Intimate setting perfect for trying new material.",
          booking_contact: "manager@comedycorner.com"
        }
      ]);

      setGroups([
        {
          id: 1,
          name: "NYC Stand-Up Writers",
          type: "Writing Group",
          members: 24,
          location: "New York, NY",
          description: "Weekly meetups to workshop new material and collaborate on jokes."
        },
        {
          id: 2,
          name: "Improv Alliance",
          type: "Performance Group",
          members: 12,
          location: "Los Angeles, CA",
          description: "Professional improv troupe looking for experienced performers."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('comicsUnited_user', JSON.stringify(userData));
    setBetaUser(true);
    localStorage.setItem('betaUser', 'true');
    setShowAuth(false); // Close auth modal after successful login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('comicsUnited_user');
    localStorage.removeItem('betaUser');
    setBetaUser(false);
  };

  const handleComedianClick = (comedian) => {
    setSelectedComedian(comedian);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComedian(null);
  };

  const handleSendMessage = (message) => {
    alert(`Message sent to ${selectedComedian.stage_name}: "${message}"`);
    closeModal();
  };

  // Show auth modal if requested
  if (showAuth) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* Beta Banner */}
      {betaUser && (
        <div className="beta-banner">
          🚀 You're using Comics United Beta! 
          <button 
            onClick={() => setShowFeedback(true)}
            className="feedback-btn"
          >
            Share Feedback
          </button>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🎭 Comics United</h1>
            <p>Professional Networking Platform for Comedians</p>
          </div>
          <div className="auth-section">
            {user ? (
              // Logged in user info
              <>
                <div className="user-info">
                  <span className="welcome-text">Welcome back,</span>
                  <span className="user-name">{user.stage_name || user.fullName}!</span>
                </div>
                <div className="auth-buttons">
                  <button onClick={handleLogout} className="logout-btn">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              // Not logged in - show auth buttons
              <div className="auth-buttons">
                <button 
                  onClick={() => setShowAuth(true)} 
                  className="signup-btn"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => setShowAuth(true)} 
                  className="signin-btn"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button 
          className={selectedTab === 'profiles' ? 'active' : ''} 
          onClick={() => setSelectedTab('profiles')}
        >
          🎤 Comedian Profiles
        </button>
        <button 
          className={selectedTab === 'venues' ? 'active' : ''} 
          onClick={() => setSelectedTab('venues')}
        >
          🏛️ Venues
        </button>
        <button 
          className={selectedTab === 'groups' ? 'active' : ''} 
          onClick={() => setSelectedTab('groups')}
        >
          👥 Groups
        </button>
        <button 
          className={selectedTab === 'messages' ? 'active' : ''} 
          onClick={() => setSelectedTab('messages')}
        >
          💬 Messages
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {!user ? (
          // Show welcome content for non-logged-in users
          <div className="welcome-section">
            <div className="welcome-content">
              <h2>🎭 Welcome to Comics United</h2>
              <p>The premier professional networking platform for comedians.</p>
              
              <div className="feature-highlights">
                <div className="feature-item">
                  <h3>🎤 Connect with Comedians</h3>
                  <p>Network with verified comedy professionals nationwide</p>
                </div>
                <div className="feature-item">
                  <h3>🏛️ Find Venues</h3>
                  <p>Discover open mic nights and comedy venues in every city</p>
                </div>
                <div className="feature-item">
                  <h3>👥 Join Groups</h3>
                  <p>Collaborate with writing groups and performance troupes</p>
                </div>
              </div>
              
              <div className="cta-section">
                <p>Ready to grow your comedy career?</p>
                <button 
                  onClick={() => setShowAuth(true)} 
                  className="cta-button"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Show regular content for logged-in users
          <>
            {selectedTab === 'profiles' && (
              <ProfilesPage 
                user={user}
                comedians={comedians}
                onUserUpdate={setUser}
              />
            )}

        {selectedTab === 'venues' && (
          <VenueSearch />
        )}

        {selectedTab === 'groups' && (
          <div className="groups-section">
            <h2>👥 Collaboration Groups</h2>
            <div className="groups-grid">
              {groups.map(group => (
                <div key={group.id} className="group-card">
                  <h3>{group.name}</h3>
                  <div className="group-info">
                    <p><strong>Type:</strong> {group.type}</p>
                    <p><strong>Members:</strong> {group.members}</p>
                    <p><strong>Location:</strong> {group.location}</p>
                  </div>
                  <div className="group-description">
                    <p>{group.description}</p>
                  </div>
                  <button className="join-group-btn">Join Group</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'messages' && (
          <div className="messages-section">
            <h2>💬 Messages</h2>
            <div className="messages-placeholder">
              <p>Your messages will appear here once you start connecting with other comedians.</p>
              <p>Click on any comedian profile to send them a message!</p>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 Comics United - Connecting Comedians Professionally</p>
        {betaUser && (
          <button 
            onClick={() => setShowFeedback(true)}
            className="footer-feedback-btn"
          >
            💬 Beta Feedback
          </button>
        )}
      </footer>

      {/* Modals */}
      {showModal && selectedComedian && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedComedian.stage_name}</h3>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="comedian-details">
                <p><strong>Real Name:</strong> {selectedComedian.name}</p>
                <p><strong>Specialty:</strong> {selectedComedian.specialty}</p>
                <p><strong>Experience:</strong> {selectedComedian.experience}</p>
                <p><strong>Location:</strong> {selectedComedian.location}</p>
                <p><strong>Rating:</strong> ⭐ {selectedComedian.rating}</p>
                <p><strong>Bio:</strong> {selectedComedian.bio}</p>
              </div>
              <div className="message-form">
                <h4>Send a Message</h4>
                <textarea 
                  placeholder={`Send a message to ${selectedComedian.stage_name}...`}
                  rows="4"
                  id="messageText"
                ></textarea>
                <button 
                  onClick={() => {
                    const message = document.getElementById('messageText').value;
                    if (message.trim()) {
                      handleSendMessage(message);
                    }
                  }}
                  className="send-message-btn"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <FeedbackModal 
          onClose={() => setShowFeedback(false)}
          userInfo={user}
        />
      )}
    </div>
  );
}

export default App;