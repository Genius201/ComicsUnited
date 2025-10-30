import React, { useState, useEffect } from 'react';
import VenueSearch from './VenueSearch';

const ComedianSearch = ({ 
  comedians, 
  currentUser, 
  onProfileView, 
  onConnectionRequest, 
  onSaveProfile,
  isConnected,
  hasPendingRequest 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    specialty: '',
    experience: '',
    venue: '',
    availability: ''
  });
  const [showVenueSearch, setShowVenueSearch] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filteredComedians, setFilteredComedians] = useState(comedians);

  useEffect(() => {
    filterComedians();
  }, [searchQuery, filters, comedians, selectedVenue]);

  const filterComedians = () => {
    let filtered = [...comedians];

    // Filter out current user
    if (currentUser) {
      filtered = filtered.filter(comedian => comedian.id !== currentUser.id);
    }

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(comedian => 
        (comedian.stage_name && comedian.stage_name.toLowerCase().includes(query)) ||
        (comedian.name && comedian.name.toLowerCase().includes(query)) ||
        (comedian.specialty && comedian.specialty.toLowerCase().includes(query)) ||
        (comedian.location && comedian.location.toLowerCase().includes(query)) ||
        (comedian.bio && comedian.bio.toLowerCase().includes(query))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(comedian => 
        comedian.location && comedian.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Specialty filter
    if (filters.specialty) {
      filtered = filtered.filter(comedian => {
        const comedianSpecialties = Array.isArray(comedian.comedy_specialty) 
          ? comedian.comedy_specialty 
          : comedian.comedy_specialty 
          ? [comedian.comedy_specialty] 
          : [comedian.specialty].filter(Boolean);
        return comedianSpecialties.includes(filters.specialty);
      });
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter(comedian => 
        comedian.experience === filters.experience
      );
    }

    // Venue filter (if selected from venue search)
    if (selectedVenue) {
      // Filter comedians who have performed at this venue or are associated with it
      // For now, we'll filter by location proximity to the venue
      const venueLocation = selectedVenue.city || selectedVenue.location;
      if (venueLocation) {
        filtered = filtered.filter(comedian => 
          comedian.location && comedian.location.toLowerCase().includes(venueLocation.toLowerCase())
        );
      }
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(comedian => {
        if (!comedian.availability) return false;
        return comedian.availability[filters.availability];
      });
    }

    setFilteredComedians(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      specialty: '',
      experience: '',
      venue: '',
      availability: ''
    });
    setSearchQuery('');
    setSelectedVenue(null);
  };

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    setShowVenueSearch(false);
    setFilters(prev => ({
      ...prev,
      venue: venue.name
    }));
  };

  const getUniqueValues = (field) => {
    const values = comedians
      .map(comedian => comedian[field])
      .filter(value => value && value.trim())
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    return values;
  };

  const getUniqueLocations = () => {
    const locations = comedians
      .map(comedian => {
        if (!comedian.location) return null;
        // Extract city from "City, State" format
        const parts = comedian.location.split(',');
        return parts[0] ? parts[0].trim() : comedian.location;
      })
      .filter(location => location)
      .filter((location, index, array) => array.indexOf(location) === index)
      .sort();
    return locations;
  };

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

  const availabilityOptions = [
    { key: 'open_mics', label: 'Open Mics' },
    { key: 'paid_gigs', label: 'Paid Gigs' },
    { key: 'collaboration', label: 'Collaboration' },
    { key: 'writing_partner', label: 'Writing Partner' }
  ];

  return (
    <div className="comedian-search">
      <div className="search-header">
        <h3>🔍 Find Comedians</h3>
        <p>Discover and connect with fellow comedians in your area and beyond</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, specialty, location, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-button">🔍</button>
      </div>

      {/* Filters */}
      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Location</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {getUniqueLocations().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Specialty</label>
            <select
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
            >
              <option value="">All Specialties</option>
              {comedySpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Experience</label>
            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <option value="">All Levels</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <option value="">Any Availability</option>
              {availabilityOptions.map(option => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="venue-filter-button"
            onClick={() => setShowVenueSearch(true)}
          >
            🏛️ Filter by Venue
          </button>
          {selectedVenue && (
            <div className="selected-venue">
              <span>📍 {selectedVenue.name}</span>
              <button onClick={() => setSelectedVenue(null)}>❌</button>
            </div>
          )}
          <button className="clear-filters-button" onClick={clearFilters}>
            🗑️ Clear All Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="search-summary">
        <p>Found {filteredComedians.length} comedian{filteredComedians.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Results Grid */}
      <div className="comedians-grid">
        {filteredComedians.length === 0 ? (
          <div className="no-results">
            <h4>No comedians found</h4>
            <p>Try adjusting your search criteria or clearing filters.</p>
          </div>
        ) : (
          filteredComedians.map(comedian => (
            <div key={comedian.id} className="comedian-card">
              <div className="comedian-avatar">
                {comedian.avatar ? (
                  <img src={comedian.avatar} alt={comedian.stage_name} />
                ) : (
                  <div className="avatar-placeholder">
                    <span>🎭</span>
                  </div>
                )}
              </div>
              
              <div className="comedian-info">
                <div className="comedian-header">
                  <h4>{comedian.stage_name || comedian.name}</h4>
                  {comedian.verified && <span className="verified-badge">✅</span>}
                </div>
                
                <div className="comedian-details">
                  <p><strong>Specialties:</strong> {
                    Array.isArray(comedian.comedy_specialty) 
                      ? comedian.comedy_specialty.join(', ')
                      : comedian.comedy_specialty || comedian.specialty || 'Not specified'
                  }</p>
                  <p><strong>Experience:</strong> {comedian.experience || comedian.experience_level}</p>
                  <p><strong>Location:</strong> {comedian.location}</p>
                  {comedian.rating && (
                    <p><strong>Rating:</strong> ⭐ {comedian.rating}</p>
                  )}
                </div>
                
                {comedian.bio && (
                  <p className="comedian-bio">
                    {comedian.bio.length > 100 
                      ? `${comedian.bio.substring(0, 100)}...` 
                      : comedian.bio
                    }
                  </p>
                )}

                {/* Availability indicators */}
                {comedian.availability && (
                  <div className="availability-indicators">
                    {Object.entries(comedian.availability).map(([key, value]) => 
                      value && (
                        <span key={key} className="availability-tag">
                          {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
              
              <div className="comedian-actions">
                <button 
                  className="view-profile-button"
                  onClick={() => onProfileView(comedian)}
                >
                  👁️ View Profile
                </button>
                
                <div className="action-buttons">
                  {isConnected(comedian.id) ? (
                    <span className="connected-status">🤝 Connected</span>
                  ) : hasPendingRequest(comedian.id) ? (
                    <span className="pending-status">⏳ Request Sent</span>
                  ) : (
                    <button 
                      className="connect-button"
                      onClick={() => {
                        const message = prompt('Add a message with your connection request:');
                        if (message !== null) {
                          onConnectionRequest(comedian, message);
                        }
                      }}
                    >
                      🤝 Connect
                    </button>
                  )}
                  
                  <button 
                    className="save-button"
                    onClick={() => onSaveProfile(comedian)}
                  >
                    ⭐ Save
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Venue Search Modal */}
      {showVenueSearch && (
        <div className="modal-overlay">
          <div className="venue-search-modal">
            <div className="modal-header">
              <h3>🏛️ Select a Venue</h3>
              <button 
                className="close-button"
                onClick={() => setShowVenueSearch(false)}
              >
                ❌
              </button>
            </div>
            <div className="modal-content">
              <VenueSearch 
                onVenueSelect={handleVenueSelect}
                searchMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComedianSearch;