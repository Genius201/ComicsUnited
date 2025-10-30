import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api.js';
import './ComedianProfile.css';

function ComedianProfile() {
  const { id } = useParams();
  const [comedian, setComedian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComedian = async () => {
      try {
        setLoading(true);
        const comedians = await apiService.comedians.getAll();
        const foundComedian = comedians.find(c => 
          c.id.toString() === id || 
          c.name.toLowerCase().replace(/\s+/g, '-') === id
        );
        
        if (foundComedian) {
          setComedian(foundComedian);
        } else {
          setError('Comedian not found');
        }
      } catch (err) {
        setError('Failed to load comedian profile');
        console.error('Error fetching comedian:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComedian();
  }, [id]);

  if (loading) {
    return (
      <div className="comedian-profile loading">
        <div className="loading-spinner">Loading comedian profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comedian-profile error">
        <div className="error-message">
          <h2>Profile Not Found</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!comedian) {
    return (
      <div className="comedian-profile not-found">
        <div className="not-found-message">
          <h2>Comedian Not Found</h2>
          <p>The comedian profile you're looking for doesn't exist.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="comedian-profile">
      <div className="profile-header">
        <div className="profile-image">
          {comedian.profile_image ? (
            <img src={comedian.profile_image} alt={comedian.name} />
          ) : (
            <div className="default-avatar">{comedian.name.charAt(0)}</div>
          )}
        </div>
        <div className="profile-info">
          <h1>{comedian.name}</h1>
          <div className="specialties">
            {comedian.comedy_specialty && comedian.comedy_specialty.map((specialty, index) => (
              <span key={index} className="specialty-tag">{specialty}</span>
            ))}
          </div>
          <div className="location">
            <i className="location-icon">📍</i>
            {comedian.location}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="bio-section">
          <h3>About</h3>
          <p>{comedian.bio || 'No bio available.'}</p>
        </section>

        <section className="contact-section">
          <h3>Contact Information</h3>
          <div className="contact-info">
            {comedian.email && (
              <div className="contact-item">
                <strong>Email:</strong> <a href={`mailto:${comedian.email}`}>{comedian.email}</a>
              </div>
            )}
            {comedian.phone && (
              <div className="contact-item">
                <strong>Phone:</strong> <a href={`tel:${comedian.phone}`}>{comedian.phone}</a>
              </div>
            )}
            {comedian.social_media && (
              <div className="contact-item">
                <strong>Social Media:</strong> {comedian.social_media}
              </div>
            )}
          </div>
        </section>

        {comedian.upcoming_gigs && comedian.upcoming_gigs.length > 0 && (
          <section className="gigs-section">
            <h3>Upcoming Shows</h3>
            <div className="gigs-list">
              {comedian.upcoming_gigs.map((gig, index) => (
                <div key={index} className="gig-item">
                  <div className="gig-date">{gig.date}</div>
                  <div className="gig-venue">{gig.venue}</div>
                  <div className="gig-location">{gig.location}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ComedianProfile;