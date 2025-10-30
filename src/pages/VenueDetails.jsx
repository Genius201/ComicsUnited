import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api.js';
import './VenueDetails.css';

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const venues = await apiService.venues.getAll();
        const foundVenue = venues.find(v => 
          v.id.toString() === id || 
          v.name.toLowerCase().replace(/\s+/g, '-') === id
        );
        
        if (foundVenue) {
          setVenue(foundVenue);
        } else {
          setError('Venue not found');
        }
      } catch (err) {
        setError('Failed to load venue details');
        console.error('Error fetching venue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="venue-details loading">
        <div className="loading-spinner">Loading venue details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="venue-details error">
        <div className="error-message">
          <h2>Venue Not Found</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="venue-details not-found">
        <div className="not-found-message">
          <h2>Venue Not Found</h2>
          <p>The venue you're looking for doesn't exist.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-details">
      <div className="venue-header">
        <div className="venue-image">
          {venue.image ? (
            <img src={venue.image} alt={venue.name} />
          ) : (
            <div className="default-venue-image">🎭</div>
          )}
        </div>
        <div className="venue-info">
          <h1>{venue.name}</h1>
          <div className="venue-location">
            <i className="location-icon">📍</i>
            <span>{venue.address}, {venue.city}, {venue.state}</span>
          </div>
          <div className="venue-type">
            <span className="type-tag">{venue.type}</span>
          </div>
        </div>
      </div>

      <div className="venue-content">
        <section className="description-section">
          <h3>About This Venue</h3>
          <p>{venue.description || 'No description available.'}</p>
        </section>

        <div className="venue-grid">
          <section className="contact-section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              {venue.phone && (
                <div className="contact-item">
                  <strong>📞 Phone:</strong> 
                  <a href={`tel:${venue.phone}`}>{venue.phone}</a>
                </div>
              )}
              {venue.email && (
                <div className="contact-item">
                  <strong>📧 Email:</strong> 
                  <a href={`mailto:${venue.email}`}>{venue.email}</a>
                </div>
              )}
              {venue.website && (
                <div className="contact-item">
                  <strong>🌐 Website:</strong> 
                  <a href={venue.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </section>

          <section className="features-section">
            <h3>Venue Features</h3>
            <div className="features-grid">
              {venue.capacity && (
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Capacity: {venue.capacity}</span>
                </div>
              )}
              {venue.stage_size && (
                <div className="feature-item">
                  <span className="feature-icon">🎪</span>
                  <span>Stage: {venue.stage_size}</span>
                </div>
              )}
              {venue.sound_system && (
                <div className="feature-item">
                  <span className="feature-icon">🎵</span>
                  <span>Sound System Available</span>
                </div>
              )}
              {venue.lighting && (
                <div className="feature-item">
                  <span className="feature-icon">💡</span>
                  <span>Professional Lighting</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {venue.open_mic_nights && venue.open_mic_nights.length > 0 && (
          <section className="open-mic-section">
            <h3>Open Mic Schedule</h3>
            <div className="open-mic-list">
              {venue.open_mic_nights.map((night, index) => (
                <div key={index} className="open-mic-item">
                  <div className="mic-day">{night.day}</div>
                  <div className="mic-time">{night.time}</div>
                  {night.host && <div className="mic-host">Hosted by: {night.host}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {venue.upcoming_shows && venue.upcoming_shows.length > 0 && (
          <section className="shows-section">
            <h3>Upcoming Shows</h3>
            <div className="shows-list">
              {venue.upcoming_shows.map((show, index) => (
                <div key={index} className="show-item">
                  <div className="show-date">{show.date}</div>
                  <div className="show-title">{show.title}</div>
                  <div className="show-performers">{show.performers}</div>
                  {show.ticket_price && (
                    <div className="show-price">Tickets: {show.ticket_price}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="booking-section">
          <h3>Book This Venue</h3>
          <p>Interested in performing or booking this venue?</p>
          <div className="booking-actions">
            {venue.phone && (
              <a href={`tel:${venue.phone}`} className="booking-btn call-btn">
                📞 Call Venue
              </a>
            )}
            {venue.email && (
              <a href={`mailto:${venue.email}?subject=Booking Inquiry`} className="booking-btn email-btn">
                📧 Send Email
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default VenueDetails;