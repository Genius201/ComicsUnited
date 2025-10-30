import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    specialty: [],
    experience: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleSpecialtyChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specialty: checked 
        ? [...prev.specialty, value]
        : prev.specialty.filter(s => s !== value)
    }));
    // Clear error when user selects specialties
    if (errors.specialty) {
      setErrors(prev => ({
        ...prev,
        specialty: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.specialty || formData.specialty.length === 0) {
        newErrors.specialty = 'Please select at least one comedy specialty';
      }
      if (!formData.experience) {
        newErrors.experience = 'Please select your experience level';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up logic - create new user
        const newUser = {
          id: Date.now(),
          email: formData.email,
          name: formData.name,
          specialty: formData.specialty,
          experience: formData.experience,
          verified: false,
          rating: 0,
          joinDate: new Date().toISOString()
        };

        // In a real app, you'd call your API here
        console.log('Creating user:', newUser);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert('Account created successfully! Please check your email to verify your account.');
        setIsSignUp(false);
        setFormData({
          email: '',
          password: '',
          name: '',
          specialty: [],
          experience: ''
        });
      } else {
        // Sign in logic
        console.log('Signing in:', { email: formData.email, password: formData.password });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login
        const mockUser = {
          id: 1,
          name: formData.name || 'Comedy Professional',
          email: formData.email,
          verified: true,
          specialty: ['Stand-up'],
          rating: 4.8
        };
        
        onLogin(mockUser);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎭 Comics United</h1>
          <p>{isSignUp ? 'Join the Comedy Community' : 'Welcome Back!'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={!isSignUp ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button 
            className={isSignUp ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && <div className="error-message">{errors.general}</div>}
          
          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label>Comedy Specialties (Select all that apply)</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Stand-up Comedy"
                      checked={formData.specialty.includes("Stand-up Comedy")}
                      onChange={handleSpecialtyChange}
                    />
                    Stand-up Comedy
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Improv"
                      checked={formData.specialty.includes("Improv")}
                      onChange={handleSpecialtyChange}
                    />
                    Improv
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Sketch Comedy"
                      checked={formData.specialty.includes("Sketch Comedy")}
                      onChange={handleSpecialtyChange}
                    />
                    Sketch Comedy
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Comedy Writing"
                      checked={formData.specialty.includes("Comedy Writing")}
                      onChange={handleSpecialtyChange}
                    />
                    Comedy Writing
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Musical Comedy"
                      checked={formData.specialty.includes("Musical Comedy")}
                      onChange={handleSpecialtyChange}
                    />
                    Musical Comedy
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Roast Comedy"
                      checked={formData.specialty.includes("Roast Comedy")}
                      onChange={handleSpecialtyChange}
                    />
                    Roast Comedy
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Clean Comedy"
                      checked={formData.specialty.includes("Clean Comedy")}
                      onChange={handleSpecialtyChange}
                    />
                    Clean Comedy
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Storytelling"
                      checked={formData.specialty.includes("Storytelling")}
                      onChange={handleSpecialtyChange}
                    />
                    Storytelling
                  </label>
                </div>
                {errors.specialty && <span className="field-error">{errors.specialty}</span>}
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={errors.experience ? 'error' : ''}
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5-10 years)</option>
                  <option value="professional">Professional (10+ years)</option>
                </select>
                {errors.experience && <span className="field-error">{errors.experience}</span>}
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span>
                <span className="spinner"></span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isSignUp ? (
            <p>
              By signing up, you agree to our background verification process and 
              <a href="#"> Terms of Service</a>.
            </p>
          ) : (
            <p>
              Forgot your password? <a href="#">Reset it here</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;