import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    stage_name: '',
    comedy_specialty: '',
    experience_level: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName || !formData.stage_name || !formData.comedy_specialty || !formData.experience_level) {
        setError('Please fill in all required fields');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Demo credentials check
      if (isLogin && formData.email === 'demo@comicsunited.com' && formData.password === 'password123') {
        const demoUser = {
          id: 1,
          email: 'demo@comicsunited.com',
          fullName: 'Demo User',
          stage_name: 'Demo Comic',
          comedy_specialty: 'Stand-up Comedy',
          experience_level: 'Professional (10+ years)',
          location: 'New York, NY'
        };
        
        localStorage.setItem('comicsUnited_user', JSON.stringify(demoUser));
        onLogin(demoUser);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem('comicsUnited_users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          localStorage.setItem('comicsUnited_user', JSON.stringify(user));
          onLogin(user);
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Signup logic
        const users = JSON.parse(localStorage.getItem('comicsUnited_users') || '[]');
        
        if (users.find(u => u.email === formData.email)) {
          setError('An account with this email already exists');
          return;
        }

        const newUser = {
          id: users.length + 1,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          stage_name: formData.stage_name,
          comedy_specialty: formData.comedy_specialty,
          experience_level: formData.experience_level,
          location: formData.location,
          created_at: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('comicsUnited_users', JSON.stringify(users));
        localStorage.setItem('comicsUnited_user', JSON.stringify(newUser));
        onLogin(newUser);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      fullName: '',
      stage_name: '',
      comedy_specialty: '',
      experience_level: '',
      location: ''
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🎭 Comics United</h1>
            <h2>{isLogin ? 'Welcome Back!' : 'Join the Community'}</h2>
            <p>
              {isLogin 
                ? 'Sign in to connect with comedy professionals' 
                : 'Create your profile and start networking'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your legal name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stage_name">Stage Name *</label>
                  <input
                    type="text"
                    id="stage_name"
                    name="stage_name"
                    value={formData.stage_name}
                    onChange={handleInputChange}
                    placeholder="Your comedy stage name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comedy_specialty">Comedy Specialty *</label>
                  <select
                    id="comedy_specialty"
                    name="comedy_specialty"
                    value={formData.comedy_specialty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your specialty</option>
                    {comedySpecialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="experience_level">Experience Level *</label>
                  <select
                    id="experience_level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State (optional)"
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {isLogin && (
              <div className="demo-credentials">
                <p><strong>Try the demo:</strong></p>
                <p>Email: demo@comicsunited.com</p>
                <p>Password: password123</p>
              </div>
            )}
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button 
                type="button" 
                onClick={toggleAuthMode}
                className="toggle-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="auth-footer">
            <p>✅ Background verified profiles</p>
            <p>🔒 Secure and private</p>
            <p>🎪 Comedy industry focused</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;