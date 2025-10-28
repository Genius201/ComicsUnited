import React, { useState } from 'react';
import './Feedback.css';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    category: '',
    message: '',
    email: '',
    suggestions: '',
    bugReport: false
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'User Interface/Design',
    'Authentication System', 
    'Comedian Profiles',
    'Venue Reviews',
    'Messaging System',
    'Collaboration Rooms',
    'Performance/Speed',
    'Mobile Experience',
    'General Feedback',
    'Bug Report'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const feedbackData = {
      ...feedback,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      id: Date.now()
    };

    try {
      // In a real app, this would go to your feedback API
      console.log('Beta Feedback Submitted:', feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(feedbackData);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFeedback({
          rating: 5,
          category: '',
          message: '',
          email: '',
          suggestions: '',
          bugReport: false
        });
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        {submitted ? (
          <div className="feedback-success">
            <div className="success-icon">✅</div>
            <h3>Thank You for Your Feedback!</h3>
            <p>Your input helps us improve Comics United for the comedy community.</p>
          </div>
        ) : (
          <>
            <div className="feedback-header">
              <h2>🎭 Beta Feedback</h2>
              <p>Help us improve Comics United!</p>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-section">
                <label>Overall Experience Rating</label>
                <div className="rating-stars">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${star <= feedback.rating ? 'active' : ''}`}
                      onClick={() => setFeedback(prev => ({...prev, rating: star}))}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="rating-text">{feedback.rating}/5</span>
                </div>
              </div>

              <div className="form-section">
                <label>Feedback Category</label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback(prev => ({...prev, category: e.target.value}))}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Your Feedback</label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({...prev, message: e.target.value}))}
                  placeholder="What did you like? What could be improved? Any issues you encountered?"
                  required
                  rows={4}
                />
              </div>

              <div className="form-section">
                <label>Suggestions for Improvement</label>
                <textarea
                  value={feedback.suggestions}
                  onChange={(e) => setFeedback(prev => ({...prev, suggestions: e.target.value}))}
                  placeholder="Any specific features or changes you'd like to see?"
                  rows={3}
                />
              </div>

              <div className="form-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={feedback.bugReport}
                    onChange={(e) => setFeedback(prev => ({...prev, bugReport: e.target.checked}))}
                  />
                  This is a bug report
                </label>
              </div>

              <div className="form-section">
                <label>Email (optional - for follow-up)</label>
                <input
                  type="email"
                  value={feedback.email}
                  onChange={(e) => setFeedback(prev => ({...prev, email: e.target.value}))}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Feedback
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;