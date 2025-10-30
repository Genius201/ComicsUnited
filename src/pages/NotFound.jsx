import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🎭</div>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for seems to have left the stage!</p>
        <div className="not-found-actions">
          <Link to="/" className="home-btn">
            🏠 Go Home
          </Link>
          <button onClick={() => window.history.back()} className="back-btn">
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;