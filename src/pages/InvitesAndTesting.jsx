import React, { useState } from 'react';
import InviteModal from '../InviteModal';
import './InvitesAndTesting.css';
import './InvitesAndTesting.css';

const InvitesAndTesting = ({ user }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [testingFeatures] = useState([
    {
      id: 1,
      name: "Beta Feedback System",
      description: "Test our new feedback collection system for beta users",
      status: "active",
      link: "#feedback"
    },
    {
      id: 2,
      name: "Venue Search Enhancement",
      description: "Try our improved venue search with 50-state coverage",
      status: "active",
      link: "/venues"
    },
    {
      id: 3,
      name: "Comedian Profile Updates",
      description: "Test the new comedian profile features and verification system",
      status: "active",
      link: "/"
    },
    {
      id: 4,
      name: "Group Chat Integration",
      description: "Preview upcoming group messaging features",
      status: "coming-soon",
      link: "#groups"
    },
    {
      id: 5,
      name: "Mobile App Preview",
      description: "Get early access to our mobile app beta",
      status: "coming-soon",
      link: "#mobile"
    }
  ]);

  const handleSendInvite = (inviteData) => {
    // Here you would typically send the invite via API
    console.log('Sending invite:', inviteData);
    
    // For demo purposes, we'll show a success message
    alert(`Invite sent successfully to ${inviteData.contact}!`);
    setShowInviteModal(false);
  };

  const handleTestFeature = (feature) => {
    if (feature.status === 'coming-soon') {
      alert('This feature is coming soon! Stay tuned for updates.');
      return;
    }

    if (feature.link.startsWith('#')) {
      // Handle internal features
      switch (feature.link) {
        case '#feedback':
          alert('Opening feedback system...');
          break;
        case '#groups':
          alert('Group chat features coming soon!');
          break;
        case '#mobile':
          alert('Mobile app preview will be available soon!');
          break;
        default:
          alert('Feature activated!');
      }
    } else {
      // Navigate to external links
      window.location.href = feature.link;
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/?invite=${user?.id || 'demo'}&ref=beta-testing`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('Invite link copied to clipboard!');
    });
  };

  return (
    <div className="invites-testing-page">
      <div className="page-header">
        <h1>🚀 Invites & Beta Testing</h1>
        <p>Invite colleagues and test the latest features of Comics United</p>
      </div>

      {/* Invite Section */}
      <section className="invite-section">
        <div className="section-header">
          <h2>📨 Send Invitations</h2>
          <p>Help grow the comedy community by inviting fellow comedians</p>
        </div>

        <div className="invite-actions">
          <div className="invite-method">
            <h3>Personal Invites</h3>
            <p>Send personalized invitations via email or phone</p>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="invite-btn primary"
              disabled={!user}
            >
              📧 Send Personal Invite
            </button>
          </div>

          <div className="invite-method">
            <h3>Share Invite Link</h3>
            <p>Copy and share your unique invite link</p>
            <button 
              onClick={copyInviteLink}
              className="invite-btn secondary"
            >
              🔗 Copy Invite Link
            </button>
          </div>

          <div className="invite-method">
            <h3>Social Media</h3>
            <p>Share on your social platforms</p>
            <div className="social-buttons">
              <button className="social-btn twitter">
                🐦 Share on Twitter
              </button>
              <button className="social-btn facebook">
                📘 Share on Facebook
              </button>
              <button className="social-btn linkedin">
                💼 Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section className="testing-section">
        <div className="section-header">
          <h2>🧪 Beta Testing</h2>
          <p>Test new features and help us improve Comics United</p>
        </div>

        <div className="testing-features">
          {testingFeatures.map(feature => (
            <div key={feature.id} className={`feature-card ${feature.status}`}>
              <div className="feature-info">
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                <div className="feature-status">
                  <span className={`status-badge ${feature.status}`}>
                    {feature.status === 'active' ? '✅ Active' : '🚧 Coming Soon'}
                  </span>
                </div>
              </div>
              <div className="feature-actions">
                <button 
                  onClick={() => handleTestFeature(feature)}
                  className={`test-btn ${feature.status === 'active' ? 'active' : 'disabled'}`}
                  disabled={feature.status !== 'active'}
                >
                  {feature.status === 'active' ? 'Test Now' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beta Tester Info */}
      <section className="beta-info-section">
        <div className="section-header">
          <h2>🏆 Beta Tester Rewards</h2>
          <p>Benefits for our valued beta testers</p>
        </div>

        <div className="rewards-grid">
          <div className="reward-item">
            <div className="reward-icon">🎭</div>
            <h3>Early Access</h3>
            <p>Be the first to try new features before public release</p>
          </div>
          <div className="reward-item">
            <div className="reward-icon">💎</div>
            <h3>Premium Features</h3>
            <p>Free access to premium features during beta period</p>
          </div>
          <div className="reward-item">
            <div className="reward-icon">🏅</div>
            <h3>Beta Badge</h3>
            <p>Special recognition badge on your profile</p>
          </div>
          <div className="reward-item">
            <div className="reward-icon">🎪</div>
            <h3>Direct Input</h3>
            <p>Your feedback directly shapes the platform's future</p>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <div className="section-header">
          <h2>💬 Share Your Feedback</h2>
          <p>Help us improve by sharing your experience</p>
        </div>

        <div className="feedback-quick-actions">
          <button className="feedback-btn bug-report">
            🐛 Report a Bug
          </button>
          <button className="feedback-btn feature-request">
            💡 Suggest Feature
          </button>
          <button className="feedback-btn general-feedback">
            📝 General Feedback
          </button>
        </div>
      </section>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)}
          onSendInvite={handleSendInvite}
          userInfo={user}
        />
      )}
    </div>
  );
};

export default InvitesAndTesting;