import React, { useState } from 'react';
import './InviteModal.css';

const InviteModal = ({ onClose, onSendInvite, userInfo }) => {
  const [inviteData, setInviteData] = useState({
    method: 'email', // 'email' or 'phone'
    contact: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Contact validation
    if (!inviteData.contact.trim()) {
      newErrors.contact = inviteData.method === 'email' 
        ? 'Email address is required' 
        : 'Phone number is required';
    } else if (inviteData.method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteData.contact)) {
        newErrors.contact = 'Please enter a valid email address';
      }
    } else {
      // Basic phone number validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = inviteData.contact.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
        newErrors.contact = 'Please enter a valid phone number';
      }
    }

    // Message validation
    if (!inviteData.message.trim()) {
      newErrors.message = 'Please include a personal message with your invite';
    } else if (inviteData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInviteData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMethodChange = (method) => {
    setInviteData(prev => ({
      ...prev,
      method,
      contact: '' // Clear contact when switching methods
    }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSendInvite(inviteData);
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invite. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📨 Send Invite to Comics United</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p className="invite-description">
            Invite fellow comedians to join Comics United! You can send invites via email or phone number.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="method-selector">
              <button
                type="button"
                className={`method-btn ${inviteData.method === 'email' ? 'active' : ''}`}
                onClick={() => handleMethodChange('email')}
              >
                📧 Email
              </button>
              <button
                type="button"
                className={`method-btn ${inviteData.method === 'phone' ? 'active' : ''}`}
                onClick={() => handleMethodChange('phone')}
              >
                📱 Phone
              </button>
            </div>

            <div className="form-group">
              <label>
                {inviteData.method === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <input
                type={inviteData.method === 'email' ? 'email' : 'tel'}
                name="contact"
                value={inviteData.contact}
                onChange={handleInputChange}
                placeholder={
                  inviteData.method === 'email' 
                    ? 'comedian@example.com' 
                    : '+1 (555) 123-4567'
                }
                className={errors.contact ? 'error' : ''}
              />
              {errors.contact && <span className="error-text">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label>Personal Message</label>
              <textarea
                name="message"
                value={inviteData.message}
                onChange={handleInputChange}
                placeholder="Hey! I'm on Comics United - a great platform for comedians to network and collaborate. You should check it out!"
                rows="4"
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            <div className="invite-preview">
              <h4>Preview:</h4>
              <div className="preview-content">
                <p><strong>From:</strong> {userInfo?.stage_name || userInfo?.fullName} ({userInfo?.email})</p>
                <p><strong>To:</strong> {inviteData.contact || `[${inviteData.method}]`}</p>
                <p><strong>Message:</strong> {inviteData.message || '[Your message will appear here]'}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button 
                type="submit" 
                className="send-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : `Send ${inviteData.method === 'email' ? 'Email' : 'SMS'} Invite`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;