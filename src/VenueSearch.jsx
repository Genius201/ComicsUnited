import React, { useState, useMemo } from 'react';
import './VenueSearch.css';
import './VenueSearch.css';

const VenueSearch = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [venueType, setVenueType] = useState('');
  const [openMicOnly, setOpenMicOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive venue database organized by state and city
  const venueDatabase = {
    "NY": {
      "New York City": [
        {
          id: 1,
          name: "The Comedy Cellar",
          address: "117 MacDougal St, Greenwich Village",
          type: "Comedy Club",
          rating: 4.9,
          capacity: 146,
          phone: "(212) 254-3480",
          website: "comedycellar.com",
          description: "World-famous underground comedy club in Greenwich Village",
          openMic: {
            available: false,
            reason: "Invitation only - industry professionals"
          }
        },
        {
          id: 2,
          name: "Eastville Comedy Club",
          address: "85-15 Northern Blvd, Jackson Heights",
          type: "Comedy Club",
          rating: 4.6,
          capacity: 200,
          phone: "(718) 565-1415",
          website: "eastvillecomedy.com",
          description: "Queens comedy club with regular open mic nights",
          openMic: {
            available: true,
            nights: ["Tuesday", "Sunday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$5 drink minimum",
            spots: 15,
            setLength: "5 minutes"
          }
        },
        {
          id: 3,
          name: "Ha! Comedy Club",
          address: "163 E 33rd St, Manhattan",
          type: "Comedy Club",
          rating: 4.3,
          capacity: 120,
          phone: "(212) 696-5233",
          website: "hacomedyclub.com",
          description: "Manhattan comedy club with weekly open mic",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "7:30 PM",
            signup: "6:30 PM in person",
            cost: "2 drink minimum",
            spots: 20,
            setLength: "4 minutes"
          }
        },
        {
          id: 4,
          name: "Broadway Comedy Club",
          address: "318 W 53rd St, Times Square",
          type: "Comedy Club",
          rating: 4.4,
          capacity: 175,
          phone: "(212) 757-2323",
          website: "broadwaycomedyclub.com",
          description: "Times Square area comedy club with open mic opportunities",
          openMic: {
            available: true,
            nights: ["Thursday"],
            time: "8:00 PM",
            signup: "Online or in-person",
            cost: "$15 cover + 2 drink minimum",
            spots: 12,
            setLength: "5 minutes"
          }
        },
        {
          id: 5,
          name: "The Creek and The Cave",
          address: "10-93 Jackson Ave, Long Island City",
          type: "Comedy Club",
          rating: 4.7,
          capacity: 80,
          phone: "(718) 706-8783",
          website: "thecreeklic.com",
          description: "Queens venue known for supporting new comedians",
          openMic: {
            available: true,
            nights: ["Tuesday", "Wednesday", "Sunday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$10 cover + 1 drink minimum",
            spots: 25,
            setLength: "6 minutes"
          }
        },
        {
          id: 6,
          name: "Stand Up NY",
          address: "236 W 78th St, Upper West Side",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 100,
          phone: "(212) 595-0850",
          website: "standupny.com",
          description: "Upper West Side comedy club with regular open mics",
          openMic: {
            available: true,
            nights: ["Monday", "Wednesday"],
            time: "8:30 PM",
            signup: "7:30 PM same day",
            cost: "$10 cover + 2 drink minimum",
            spots: 18,
            setLength: "5 minutes"
          }
        },
        {
          id: 7,
          name: "Gotham Comedy Club",
          address: "208 W 23rd St, Chelsea",
          type: "Comedy Club",
          rating: 4.6,
          capacity: 300,
          phone: "(212) 367-9000",
          website: "gothamcomedyclub.com",
          description: "Premier Chelsea comedy club with showcase opportunities",
          openMic: {
            available: true,
            nights: ["Sunday"],
            time: "7:00 PM",
            signup: "6:00 PM same day",
            cost: "$25 cover + 2 drink minimum",
            spots: 10,
            setLength: "3 minutes"
          }
        }
      ],
      "Albany": [
        {
          id: 8,
          name: "Funny Bone Albany",
          address: "1 Crossgates Mall Rd, Albany",
          type: "Comedy Club",
          rating: 4.2,
          capacity: 200,
          phone: "(518) 313-7662",
          website: "albany.funnybone.com",
          description: "National comedy club chain with local open mics",
          openMic: {
            available: true,
            nights: ["Thursday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$8 cover + 1 drink minimum",
            spots: 15,
            setLength: "5 minutes"
          }
        }
      ],
      "Buffalo": [
        {
          id: 9,
          name: "Helium Comedy Club Buffalo",
          address: "30 Mississippi St, Buffalo",
          type: "Comedy Club",
          rating: 4.4,
          capacity: 180,
          phone: "(716) 842-0022",
          website: "buffalo.heliumcomedy.com",
          description: "Buffalo's premier comedy destination",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:30 PM",
            signup: "7:30 PM same day",
            cost: "$10 cover + 2 drink minimum",
            spots: 18,
            setLength: "5 minutes"
          }
        }
      ],
      "Rochester": [
        {
          id: 10,
          name: "Comedysportz Rochester",
          address: "274 N Goodman St, Rochester",
          type: "Improv Theater",
          rating: 4.3,
          capacity: 120,
          phone: "(585) 427-0477",
          website: "rochestercomedy.com",
          description: "Interactive improv comedy theater",
          openMic: {
            available: true,
            nights: ["Wednesday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$5 cover",
            spots: 12,
            setLength: "6 minutes"
          }
        }
      ]
    },
    "CA": {
      "Los Angeles": [
        {
          id: 11,
          name: "The Comedy Store",
          address: "8433 Sunset Blvd, West Hollywood",
          type: "Comedy Club",
          rating: 4.9,
          capacity: 450,
          phone: "(323) 650-6268",
          website: "thecomedystore.com",
          description: "Legendary comedy club on the Sunset Strip",
          openMic: {
            available: true,
            nights: ["Tuesday"],
            time: "8:00 PM",
            signup: "Lottery system online",
            cost: "$25 cover + 2 drink minimum",
            spots: 8,
            setLength: "3 minutes"
          }
        },
        {
          id: 12,
          name: "The Laugh Factory Hollywood",
          address: "8001 Sunset Blvd, West Hollywood",
          type: "Comedy Club",
          rating: 4.8,
          capacity: 280,
          phone: "(323) 656-1336",
          website: "laughfactory.com",
          description: "Famous Sunset Strip comedy club",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:00 PM",
            signup: "Online registration required",
            cost: "$20 cover + 2 drink minimum",
            spots: 10,
            setLength: "3 minutes"
          }
        },
        {
          id: 13,
          name: "Flappers Comedy Club",
          address: "102 E Magnolia Blvd, Burbank",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 165,
          phone: "(818) 845-9721",
          website: "flapperscomedy.com",
          description: "Burbank comedy club with multiple open mic nights",
          openMic: {
            available: true,
            nights: ["Monday", "Wednesday", "Friday"],
            time: "8:30 PM",
            signup: "6:00 PM same day",
            cost: "$10 cover + 2 drink minimum",
            spots: 20,
            setLength: "5 minutes"
          }
        },
        {
          id: 14,
          name: "The Ice House",
          address: "24 N Mentor Ave, Pasadena",
          type: "Comedy Club",
          rating: 4.6,
          capacity: 200,
          phone: "(626) 577-1894",
          website: "icehousecomedy.com",
          description: "Historic Pasadena comedy club since 1960",
          openMic: {
            available: true,
            nights: ["Tuesday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$15 cover + 2 drink minimum",
            spots: 18,
            setLength: "4 minutes"
          }
        },
        {
          id: 15,
          name: "The Improv Hollywood",
          address: "8162 Melrose Ave, Hollywood",
          type: "Comedy Club",
          rating: 4.7,
          capacity: 300,
          phone: "(323) 651-2583",
          website: "improv.com/hollywood",
          description: "Part of the famous Improv comedy club chain",
          openMic: {
            available: true,
            nights: ["Sunday"],
            time: "8:00 PM",
            signup: "Online or early arrival",
            cost: "$20 cover + 2 drink minimum",
            spots: 12,
            setLength: "5 minutes"
          }
        }
      ],
      "San Diego": [
        {
          id: 16,
          name: "American Comedy Co.",
          address: "818 Sixth Ave, Downtown",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 250,
          phone: "(619) 795-3858",
          website: "americancomedyco.com",
          description: "Downtown San Diego comedy club with ocean views",
          openMic: {
            available: true,
            nights: ["Wednesday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$10 cover + 2 drink minimum",
            spots: 18,
            setLength: "5 minutes"
          }
        },
        {
          id: 17,
          name: "Comedy Palace",
          address: "8878 Clairemont Mesa Blvd, Clairemont",
          type: "Comedy Club",
          rating: 4.4,
          capacity: 180,
          phone: "(858) 573-9067",
          website: "comedypalace.com",
          description: "San Diego's comedy headquarters since 1978",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$8 cover + 2 drink minimum",
            spots: 20,
            setLength: "5 minutes"
          }
        }
      ],
      "San Francisco": [
        {
          id: 18,
          name: "The Punchline San Francisco",
          address: "444 Battery St, Financial District",
          type: "Comedy Club",
          rating: 4.6,
          capacity: 220,
          phone: "(415) 397-7573",
          website: "punchlinecomedyclub.com",
          description: "San Francisco's premier comedy club since 1978",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:30 PM",
            signup: "7:30 PM same day",
            cost: "$15 cover + 2 drink minimum",
            spots: 16,
            setLength: "4 minutes"
          }
        },
        {
          id: 19,
          name: "Cobb's Comedy Club",
          address: "915 Columbus Ave, North Beach",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 400,
          phone: "(415) 928-4320",
          website: "cobbscomedy.com",
          description: "North Beach comedy institution with bay views",
          openMic: {
            available: true,
            nights: ["Tuesday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$12 cover + 2 drink minimum",
            spots: 18,
            setLength: "5 minutes"
          }
        }
      ]
    },
    "IL": {
      "Chicago": [
        {
          id: 20,
          name: "Second City Chicago",
          address: "1616 N Wells St, Old Town",
          type: "Comedy Theater",
          rating: 4.8,
          capacity: 290,
          phone: "(312) 337-3992",
          website: "secondcity.com",
          description: "World-famous improv and sketch comedy theater",
          openMic: {
            available: true,
            nights: ["Tuesday"],
            time: "10:30 PM",
            signup: "9:30 PM same day",
            cost: "$10 cover",
            spots: 12,
            setLength: "8 minutes"
          }
        },
        {
          id: 21,
          name: "Zanies Comedy Club Chicago",
          address: "1548 N Wells St, Old Town",
          type: "Comedy Club",
          rating: 4.6,
          capacity: 300,
          phone: "(312) 337-4027",
          website: "chicago.zanies.com",
          description: "Chicago's premier comedy club in Old Town",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$15 cover + 2 drink minimum",
            spots: 16,
            setLength: "5 minutes"
          }
        },
        {
          id: 22,
          name: "Laugh Factory Chicago",
          address: "3175 N Broadway, Lakeview",
          type: "Comedy Club",
          rating: 4.4,
          capacity: 400,
          phone: "(773) 327-3175",
          website: "chicago.laughfactory.com",
          description: "Chicago location of the famous Laugh Factory chain",
          openMic: {
            available: true,
            nights: ["Wednesday"],
            time: "8:30 PM",
            signup: "Online preferred",
            cost: "$18 cover + 2 drink minimum",
            spots: 14,
            setLength: "4 minutes"
          }
        },
        {
          id: 23,
          name: "The Hideout",
          address: "1354 W Wabansia Ave, Bucktown",
          type: "Bar with Comedy",
          rating: 4.3,
          capacity: 75,
          phone: "(773) 227-4433",
          website: "hideoutchicago.com",
          description: "Intimate venue with experimental comedy nights",
          openMic: {
            available: true,
            nights: ["Thursday"],
            time: "9:30 PM",
            signup: "8:30 PM same day",
            cost: "$5 cover",
            spots: 10,
            setLength: "6 minutes"
          }
        }
      ]
    },
    "TX": {
      "Austin": [
        {
          id: 24,
          name: "Cap City Comedy Club",
          address: "8120 Research Blvd, North Austin",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 320,
          phone: "(512) 467-2333",
          website: "capcitycomedy.com",
          description: "Austin's premier comedy destination",
          openMic: {
            available: true,
            nights: ["Sunday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$10 cover + 2 drink minimum",
            spots: 20,
            setLength: "5 minutes"
          }
        },
        {
          id: 25,
          name: "The New Movement Theater",
          address: "616 Lavaca St, Downtown",
          type: "Improv Theater",
          rating: 4.4,
          capacity: 99,
          phone: "(512) 819-9622",
          website: "newmovementtheater.com",
          description: "Experimental comedy and improv theater",
          openMic: {
            available: true,
            nights: ["Monday", "Wednesday"],
            time: "8:30 PM",
            signup: "7:30 PM same day",
            cost: "$5 cover",
            spots: 15,
            setLength: "6 minutes"
          }
        }
      ],
      "Dallas": [
        {
          id: 26,
          name: "Hyena's Comedy Nightclub Dallas",
          address: "320 Singleton Blvd, West Dallas",
          type: "Comedy Club",
          rating: 4.3,
          capacity: 240,
          phone: "(214) 941-7500",
          website: "hyenascomedy.com/dallas",
          description: "Dallas comedy club with regular open mic nights",
          openMic: {
            available: true,
            nights: ["Tuesday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$12 cover + 2 drink minimum",
            spots: 18,
            setLength: "5 minutes"
          }
        }
      ],
      "Houston": [
        {
          id: 27,
          name: "The Secret Group",
          address: "2101 Polk St, Midtown",
          type: "Comedy Theater",
          rating: 4.6,
          capacity: 150,
          phone: "(713) 229-8840",
          website: "thesecretgrouphtx.com",
          description: "Houston's premier alternative comedy venue",
          openMic: {
            available: true,
            nights: ["Monday", "Thursday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$8 cover",
            spots: 16,
            setLength: "5 minutes"
          }
        }
      ]
    },
    "FL": {
      "Miami": [
        {
          id: 28,
          name: "Miami Improv",
          address: "3390 Mary St, Coconut Grove",
          type: "Comedy Club",
          rating: 4.4,
          capacity: 300,
          phone: "(305) 441-8200",
          website: "miamiimprov.com",
          description: "Miami's premier comedy club in Coconut Grove",
          openMic: {
            available: true,
            nights: ["Wednesday"],
            time: "8:30 PM",
            signup: "7:30 PM same day",
            cost: "$15 cover + 2 drink minimum",
            spots: 15,
            setLength: "4 minutes"
          }
        }
      ],
      "Orlando": [
        {
          id: 29,
          name: "SAK Comedy Lab",
          address: "29 S Orange Ave, Downtown Orlando",
          type: "Improv Theater",
          rating: 4.7,
          capacity: 180,
          phone: "(407) 648-0001",
          website: "sak.com",
          description: "Interactive improv comedy theater in downtown Orlando",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$10 cover",
            spots: 14,
            setLength: "5 minutes"
          }
        }
      ]
    },
    "PA": {
      "Philadelphia": [
        {
          id: 30,
          name: "Punch Line Philly",
          address: "33 E Laurel St, Fishtown",
          type: "Comedy Club",
          rating: 4.5,
          capacity: 180,
          phone: "(215) 606-6188",
          website: "punchlinephilly.com",
          description: "Premier comedy club in Fishtown Philadelphia",
          openMic: {
            available: true,
            nights: ["Monday"],
            time: "8:00 PM",
            signup: "7:00 PM same day",
            cost: "$12 cover + 2 drink minimum",
            spots: 20,
            setLength: "5 minutes"
          }
        },
        {
          id: 31,
          name: "Helium Comedy Club Philadelphia",
          address: "2031 Sansom St, Center City",
          type: "Comedy Club",
          rating: 4.7,
          capacity: 400,
          phone: "(215) 496-9001",
          website: "philadelphia.heliumcomedy.com",
          description: "Upscale comedy club in Center City Philadelphia",
          openMic: {
            available: true,
            nights: ["Tuesday"],
            time: "8:30 PM",
            signup: "7:30 PM same day",
            cost: "$15 cover + 2 drink minimum",
            spots: 15,
            setLength: "4 minutes"
          }
        }
      ]
    }
  };

  // Get unique states
  const states = Object.keys(venueDatabase).sort();

  // Get cities for selected state
  const cities = selectedState ? Object.keys(venueDatabase[selectedState]).sort() : [];

  // Get filtered venues
  const filteredVenues = useMemo(() => {
    let venues = [];
    
    if (selectedState && selectedCity) {
      venues = venueDatabase[selectedState][selectedCity] || [];
    } else if (selectedState) {
      // Get all venues from all cities in the state
      venues = Object.values(venueDatabase[selectedState]).flat();
    } else {
      // Get all venues from all states
      venues = Object.values(venueDatabase).flatMap(state => 
        Object.values(state).flat()
      );
    }

    // Apply filters
    if (venueType) {
      venues = venues.filter(venue => venue.type === venueType);
    }

    if (openMicOnly) {
      venues = venues.filter(venue => venue.openMic.available);
    }

    if (searchTerm) {
      venues = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return venues.sort((a, b) => b.rating - a.rating);
  }, [selectedState, selectedCity, venueType, openMicOnly, searchTerm]);

  const venueTypes = [...new Set(Object.values(venueDatabase).flatMap(state => 
    Object.values(state).flat().map(venue => venue.type)
  ))].sort();

  return (
    <div className="venue-search">
      <div className="search-header">
        <h2>🎪 Find Comedy Venues & Open Mics</h2>
        <p>Discover comedy venues and open mic opportunities nationwide</p>
      </div>

      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="state-select">State:</label>
            <select 
              id="state-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="city-select">City:</label>
            <select 
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-select">Venue Type:</label>
            <select 
              id="type-select"
              value={venueType}
              onChange={(e) => setVenueType(e.target.value)}
            >
              <option value="">All Types</option>
              {venueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search-input">Search:</label>
            <input
              type="text"
              id="search-input"
              placeholder="Search venues, locations, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={openMicOnly}
                onChange={(e) => setOpenMicOnly(e.target.checked)}
              />
              Open Mics Only
            </label>
          </div>
        </div>
      </div>

      <div className="results-summary">
        <h3>Found {filteredVenues.length} venues</h3>
        {selectedState && <span className="filter-tag">State: {selectedState}</span>}
        {selectedCity && <span className="filter-tag">City: {selectedCity}</span>}
        {venueType && <span className="filter-tag">Type: {venueType}</span>}
        {openMicOnly && <span className="filter-tag">Open Mics Only</span>}
      </div>

      <div className="venues-grid">
        {filteredVenues.map(venue => (
          <div key={venue.id} className="venue-card">
            <div className="venue-header">
              <h3>{venue.name}</h3>
              <div className="venue-rating">
                ⭐ {venue.rating}
              </div>
            </div>

            <div className="venue-info">
              <p className="venue-address">📍 {venue.address}</p>
              <p className="venue-type">🎭 {venue.type}</p>
              <p className="venue-capacity">👥 Capacity: {venue.capacity}</p>
              <p className="venue-phone">📞 {venue.phone}</p>
              {venue.website && (
                <p className="venue-website">
                  🌐 <a href={`https://${venue.website}`} target="_blank" rel="noopener noreferrer">
                    {venue.website}
                  </a>
                </p>
              )}
            </div>

            <div className="venue-description">
              <p>{venue.description}</p>
            </div>

            <div className="open-mic-info">
              {venue.openMic.available ? (
                <div className="open-mic-details">
                  <h4>🎤 Open Mic Details:</h4>
                  <p><strong>Nights:</strong> {venue.openMic.nights.join(', ')}</p>
                  <p><strong>Show Time:</strong> {venue.openMic.time}</p>
                  <p><strong>Signup:</strong> {venue.openMic.signup}</p>
                  <p><strong>Cost:</strong> {venue.openMic.cost}</p>
                  <p><strong>Spots Available:</strong> {venue.openMic.spots}</p>
                  <p><strong>Set Length:</strong> {venue.openMic.setLength}</p>
                </div>
              ) : (
                <div className="no-open-mic">
                  <p>🚫 No Open Mic Available</p>
                  {venue.openMic.reason && <p className="reason">{venue.openMic.reason}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="no-results">
          <h3>No venues found matching your criteria</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default VenueSearch;