import React, { useState } from 'react';
import './LandingPage.css';
import Auth from './Auth';

const LandingPage = ({ onLogin }) => {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <Auth onLogin={onLogin} />;
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>🎭 Comics United</h1>
            <h2>Professional Networking for Comedians</h2>
            <p>
              Connect, collaborate, and grow your comedy career with verified professionals 
              in the industry. Join the premier networking platform built by comedians, for comedians.
            </p>
            
            <div className="hero-buttons">
              <button 
                className="cta-button primary"
                onClick={() => setShowAuth(true)}
              >
                Get Started Free
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </button>
            </div>

            <div className="trust-indicators">
              <span className="trust-item">✅ Background Verified</span>
              <span className="trust-item">🔒 Secure Platform</span>
              <span className="trust-item">🎪 Comedy Focused</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="feature-preview">
              <div className="preview-card">
                <h3>🎤 Comedian Profiles</h3>
                <p>Verified profiles with ratings and specialties</p>
              </div>
              <div className="preview-card">
                <h3>🏛️ Venue Network</h3>
                <p>Connect with venues and read authentic reviews</p>
              </div>
              <div className="preview-card">
                <h3>💬 Secure Messaging</h3>
                <p>Private communication with industry professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2>Why Comedians Choose Comics United</h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎭</div>
              <h3>Professional Networking</h3>
              <p>Connect with verified comedians, writers, and industry professionals safely and securely.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <h3>Career Growth</h3>
              <p>Find collaboration opportunities, mentorship, and resources to advance your comedy career.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎪</div>
              <h3>Venue Discovery</h3>
              <p>Discover new venues, read authentic reviews, and connect directly with bookers and managers.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h3>Safety First</h3>
              <p>Background verification and professional standards ensure a safe networking environment.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">💡</div>
              <h3>Collaboration Rooms</h3>
              <p>Join specialized groups for writers, improvisers, and performers to share ideas and projects.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <h3>Industry Recognition</h3>
              <p>Build your reputation through community ratings and verified achievement badges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join the Comedy Community?</h2>
          <p>Start networking with verified comedy professionals today</p>
          
          <div className="cta-buttons">
            <button 
              className="cta-button primary large"
              onClick={() => setShowAuth(true)}
            >
              Create Your Profile
            </button>
          </div>

          <div className="demo-info">
            <p>
              <strong>Try our demo:</strong> Login with <code>demo@comicsunited.com</code> / <code>password123</code>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎭 Comics United</h3>
            <p>Professional networking platform for the comedy community</p>
          </div>
          
          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li>Comedian Profiles</li>
              <li>Venue Reviews</li>
              <li>Secure Messaging</li>
              <li>Collaboration Rooms</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li>Stand-up Comedians</li>
              <li>Improv Performers</li>
              <li>Sketch Writers</li>
              <li>Comedy Venues</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Get Started</h4>
            <button 
              className="footer-cta"
              onClick={() => setShowAuth(true)}
            >
              Join Now
            </button>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Comics United - Connecting Comedians Professionally</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;