import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { apiService } from './services/api.js';
import SecurityMiddleware from './utils/securityMiddleware.js';
import { SecurityUtils } from './utils/security.js';
import './App.css';
import LandingPage from './LandingPage';
import Auth from './Auth';
import VenueSearch from './VenueSearch';
import FeedbackModal from './FeedbackModal';
import InviteModal from './InviteModal';
import ProfilesPage from './ProfilesPage';
import ComedianProfile from './pages/ComedianProfile';
import VenueDetails from './pages/VenueDetails';
import InvitesAndTesting from './pages/InvitesAndTesting';
import NotFound from './pages/NotFound';

function AppContent() {
  console.log('AppContent component rendering...');
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('profiles');
  const [showModal, setShowModal] = useState(false);
  const [selectedComedian, setSelectedComedian] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [betaUser, setBetaUser] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  // Dropdown states
  const [showVenuesDropdown, setShowVenuesDropdown] = useState(false);
  const [showGroupsDropdown, setShowGroupsDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  
  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  
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
    console.log('Starting fetchData...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('Making API calls...');
      const [comediansRes, venuesRes, groupsRes] = await Promise.all([
        apiService.comedians.getAll(),
        apiService.venues.getAll(),
        apiService.groups.getAll()
      ]);
      
      console.log('API responses received:', { comediansRes, venuesRes, groupsRes });
      setComedians(comediansRes || []);
      setVenues(venuesRes || []);
      setGroups(groupsRes || []);
    } catch (err) {
      console.error('API Error - using fallback data:', err);
      setError('Failed to load data. Using fallback data.');
      console.error('Error fetching data:', err);
      
      // Use fallback data when server is not available
      setComedians([
        {
          id: 1,
          fullName: "Sarah Johnson",
          stage_name: "Sassy Sarah",
          comedy_specialty: ["Stand-up Comedy", "Observational Comedy"],
          experience_level: "Professional (10+ years)",
          rating: 4.8,
          location: "New York, NY",
          bio: "Known for sharp wit and observational humor. Regular at Comedy Cellar.",
          verified: true
        },
        {
          id: 2,
          fullName: "Mike Rodriguez",
          stage_name: "Mikey Laughs",
          comedy_specialty: ["Improv", "Character Work"],
          experience_level: "Advanced (5-9 years)",
          rating: 4.6,
          location: "Los Angeles, CA",
          bio: "UCB graduate specializing in character work and musical improv.",
          verified: true
        },
        {
          id: 3,
          fullName: "Jenny Chen",
          stage_name: "Joke-a-lot Jenny",
          comedy_specialty: ["Musical Comedy", "Piano Comedy"],
          experience_level: "Intermediate (2-4 years)",
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
      console.log('fetchData completed, setting loading to false');
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

  // Invite handlers
  const handleSendInvite = (inviteData) => {
    if (!user.verified) {
      alert('You must be verified before you can send invites. Please contact support for verification.');
      return;
    }

    const { method, contact, message } = inviteData;
    
    // In a real app, this would call an API to send the invite
    console.log('Sending invite:', inviteData);
    
    // Simulate API call
    setTimeout(() => {
      if (method === 'email') {
        alert(`Invite sent successfully to ${contact} via email!`);
      } else {
        alert(`Invite sent successfully to ${contact} via SMS!`);
      }
      setShowInviteModal(false);
    }, 1000);
  };

  // Venue dropdown handlers
  const handleVenuesClick = () => {
    setShowVenuesDropdown(!showVenuesDropdown);
  };

  const handleDropdownOption = (option) => {
    setShowVenuesDropdown(false);
    switch (option) {
      case 'search':
        setSelectedTab('venues');
        break;
      case 'availability':
        alert('Post Availability: This feature will let you post your availability for last-minute fill-ins!');
        break;
      case 'openmic':
        alert('Sign up for Open Mics: Find and register for open mic nights near you!');
        break;
      case 'plan-week':
        alert('Plan a Week of Open Mics: Create your weekly open mic schedule!');
        break;
      case 'city-tour':
        alert('Plan City Tour: Organize a comedy tour with your group across multiple cities!');
        break;
      default:
        setSelectedTab('venues');
    }
  };

  // Groups dropdown handlers
  const handleGroupsClick = () => {
    setShowGroupsDropdown(!showGroupsDropdown);
  };

  const handleGroupsDropdownOption = (option) => {
    setShowGroupsDropdown(false);
    switch (option) {
      case 'browse':
        setSelectedTab('groups');
        break;
      case 'join':
        alert('Join Group Chat: Browse available group chats and join conversations with fellow comedians!');
        break;
      case 'create':
        alert('Start Group Chat: Create an invite-only group chat for up to 10 comedians. Perfect for organizing shows, sharing material, or building comedy connections!');
        break;
      case 'podcast':
        alert('Schedule a Podcast: Coordinate with your comedy group to record podcasts, comedy sketches, or collaborative content!');
        break;
      case 'braindrain':
        alert('Brain Drain Session: Meet with fellow comedians to workshop new material, share jokes, and collaborate on fresh comedy content!');
        break;
      default:
        setSelectedTab('groups');
    }
  };

  // Messages dropdown handlers
  const handleMessagesClick = () => {
    setShowMessagesDropdown(!showMessagesDropdown);
  };

  const handleMessagesDropdownOption = (option) => {
    setShowMessagesDropdown(false);
    switch (option) {
      case 'browse':
        setSelectedTab('messages');
        break;
      case 'community-wall':
        alert('Community Wall: Leave messages, announcements, and updates for the entire comedy community to see!');
        break;
      case 'message-venue':
        alert('Message Venue: Contact venue managers and owners directly to discuss booking opportunities, show details, or networking!');
        break;
      default:
        setSelectedTab('messages');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVenuesDropdown && !event.target.closest('.venues-dropdown-container')) {
        setShowVenuesDropdown(false);
      }
      if (showGroupsDropdown && !event.target.closest('.groups-dropdown-container')) {
        setShowGroupsDropdown(false);
      }
      if (showMessagesDropdown && !event.target.closest('.messages-dropdown-container')) {
        setShowMessagesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVenuesDropdown, showGroupsDropdown, showMessagesDropdown]);

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
                  {user.verified && (
                    <button onClick={() => setShowInviteModal(true)} className="invite-btn">
                      📨 Send Invites
                    </button>
                  )}
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
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          🎤 Comedian Profiles
        </Link>
        <Link 
          to="/invites-testing" 
          className={location.pathname === '/invites-testing' ? 'nav-link active' : 'nav-link'}
        >
          📧 Invites & Testing
        </Link>
        <div className="venues-dropdown-container">
          <button 
            className={location.pathname.startsWith('/venues') || showVenuesDropdown ? 'nav-link active' : 'nav-link'} 
            onClick={handleVenuesClick}
          >
            🏛️ Venues {showVenuesDropdown ? '▲' : '▼'}
          </button>
          {showVenuesDropdown && (
            <div className="dropdown-menu">
              <Link to="/venues" className="dropdown-item" onClick={() => setShowVenuesDropdown(false)}>
                🔍 Search Venues
              </Link>
              <button onClick={() => handleDropdownOption('availability')} className="dropdown-item">
                📅 Post Availability for Fill-ins
              </button>
              <button onClick={() => handleDropdownOption('openmic')} className="dropdown-item">
                🎤 Sign up for Open Mics
              </button>
              <button onClick={() => handleDropdownOption('plan-week')} className="dropdown-item">
                📋 Plan a Week of Open Mics
              </button>
              <button onClick={() => handleDropdownOption('city-tour')} className="dropdown-item">
                🚌 Plan City Tour with Group
              </button>
            </div>
          )}
        </div>
        <div className="groups-dropdown-container">
          <button 
            className={selectedTab === 'groups' || showGroupsDropdown ? 'active' : ''} 
            onClick={handleGroupsClick}
          >
            👥 Groups {showGroupsDropdown ? '▲' : '▼'}
          </button>
          {showGroupsDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => handleGroupsDropdownOption('browse')} className="dropdown-item">
                👁️ Browse Groups
              </button>
              <button onClick={() => handleGroupsDropdownOption('join')} className="dropdown-item">
                🤝 Join Group Chat
              </button>
              <button onClick={() => handleGroupsDropdownOption('create')} className="dropdown-item">
                ✨ Start Group Chat (Invite Only)
              </button>
              <button onClick={() => handleGroupsDropdownOption('podcast')} className="dropdown-item">
                🎙️ Schedule a Podcast
              </button>
              <button onClick={() => handleGroupsDropdownOption('braindrain')} className="dropdown-item">
                🧠 Meet for Brain Drain Session
              </button>
            </div>
          )}
        </div>
        <div className="messages-dropdown-container">
          <button 
            className={selectedTab === 'messages' || showMessagesDropdown ? 'active' : ''} 
            onClick={handleMessagesClick}
          >
            💬 Messages {showMessagesDropdown ? '▲' : '▼'}
          </button>
          {showMessagesDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => handleMessagesDropdownOption('browse')} className="dropdown-item">
                📬 View Messages
              </button>
              <button onClick={() => handleMessagesDropdownOption('community-wall')} className="dropdown-item">
                📋 Community Wall
              </button>
              <button onClick={() => handleMessagesDropdownOption('message-venue')} className="dropdown-item">
                🏛️ Message Venue Manager
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        <Routes>
          <Route path="/" element={
            !user ? (
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
              // Show profiles for logged-in users
              <ProfilesPage 
                user={user}
                comedians={comedians}
                onUserUpdate={setUser}
              />
            )
          } />
          
          <Route path="/comedian/:id" element={<ComedianProfile />} />
          <Route path="/venue/:id" element={<VenueDetails />} />
          <Route path="/venues" element={<VenueSearch />} />
          <Route path="/invites-testing" element={<InvitesAndTesting />} />
          
          <Route path="/groups" element={
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
          } />
          
          <Route path="/messages" element={
            <div className="messages-section">
              <h2>💬 Messages</h2>
              <div className="messages-placeholder">
                <p>Your messages will appear here once you start connecting with other comedians.</p>
                <p>Click on any comedian profile to send them a message!</p>
              </div>
            </div>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
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
                <p><strong>Real Name:</strong> {selectedComedian.fullName || selectedComedian.name}</p>
                <p><strong>Specialties:</strong> {
                  Array.isArray(selectedComedian.comedy_specialty) 
                    ? selectedComedian.comedy_specialty.join(', ')
                    : selectedComedian.specialty || selectedComedian.comedy_specialty
                }</p>
                <p><strong>Experience:</strong> {selectedComedian.experience_level || selectedComedian.experience}</p>
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

      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)}
          onSendInvite={handleSendInvite}
          userInfo={user}
        />
      )}
    </div>
  );
}

// Main App component with Router
function App() {
  console.log('App component rendering...');
  return (
    <Router>
      <AppContent />
      <Analytics />
    </Router>
  );
}

export default App;
