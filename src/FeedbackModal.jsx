import React, { useState } from 'react';
import { apiService } from './services/api.js';
import './FeedbackModal.css';

const FeedbackModal = ({ onClose, userInfo }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await apiService.submitFeedback({
        feedback: feedback.trim(),
        rating,
        category,
        user: userInfo?.fullName || 'Anonymous',
        userId: userInfo?.id || null,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="modal-overlay">
        <div className="feedback-modal">
          <div className="success-message">
            <h3>✅ Thank You!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="feedback-modal">
        <div className="modal-header">
          <h3>📝 Share Your Feedback</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select 
              id="category"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="ui">User Interface</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <select 
              id="rating"
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value))}
              required
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Good</option>
              <option value={3}>⭐⭐⭐ Average</option>
              <option value={2}>⭐⭐ Poor</option>
              <option value={1}>⭐ Very Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Your Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              rows={4}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;