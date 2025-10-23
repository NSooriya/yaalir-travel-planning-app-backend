const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHandler');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();

// Generate itinerary based on preferences
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { travelers, duration, budget, interests } = req.body;

    const heritage = await readJSON('heritage.json');
    const crafts = await readJSON('crafts.json');

    // Pre-defined packages based on proximity and realistic travel
    const packages = {
      '3': {
        name: 'Chennai Weekend Package',
        description: 'Perfect for a weekend getaway - All locations within 60km radius',
        days: [
          {
            day: 1,
            region: 'Chennai City',
            places: ['Fort St. George', 'San Thome Basilica'],
            estimatedCost: 2500
          },
          {
            day: 2,
            region: 'Mahabalipuram',
            places: ['Mahabalipuram Group of Monuments', 'Shore Temple', 'Pancha Rathas'],
            estimatedCost: 3000
          },
          {
            day: 3,
            region: 'Mahabalipuram & Return',
            places: ["Arjuna's Penance", 'Kanchipuram Silk Sarees'],
            estimatedCost: 2500
          }
        ]
      },
      '5': {
        name: 'Temple Circuit Package',
        description: 'Chennai to Thanjavur temple trail - Southern heritage highlights',
        days: [
          {
            day: 1,
            region: 'Chennai Arrival',
            places: ['Fort St. George', 'San Thome Basilica'],
            estimatedCost: 2500
          },
          {
            day: 2,
            region: 'Mahabalipuram',
            places: ['Mahabalipuram Group of Monuments', 'Shore Temple', 'Pancha Rathas'],
            estimatedCost: 3000
          },
          {
            day: 3,
            region: 'Travel to Thanjavur (340km)',
            places: ['Gangaikonda Cholapuram'],
            estimatedCost: 3500
          },
          {
            day: 4,
            region: 'Thanjavur',
            places: ['Brihadeeswara Temple', 'Thanjavur Maratha Palace', 'Thanjavur Paintings'],
            estimatedCost: 2800
          },
          {
            day: 5,
            region: 'Return Journey',
            places: ['Swamimalai Bronze Sculptures'],
            estimatedCost: 2000
          }
        ]
      },
      '7': {
        name: 'Grand Heritage Tour',
        description: 'Complete Tamil Nadu heritage experience - Chennai to Madurai',
        days: [
          {
            day: 1,
            region: 'Chennai',
            places: ['Fort St. George', 'San Thome Basilica'],
            estimatedCost: 2500
          },
          {
            day: 2,
            region: 'Mahabalipuram',
            places: ['Mahabalipuram Group of Monuments', 'Shore Temple', 'Pancha Rathas', "Arjuna's Penance"],
            estimatedCost: 3200
          },
          {
            day: 3,
            region: 'Travel to Thanjavur (340km)',
            places: ['Gangaikonda Cholapuram'],
            estimatedCost: 3500
          },
          {
            day: 4,
            region: 'Thanjavur',
            places: ['Brihadeeswara Temple', 'Thanjavur Maratha Palace', 'Thanjavur Paintings'],
            estimatedCost: 2800
          },
          {
            day: 5,
            region: 'Travel to Madurai (190km)',
            places: ['Chettinad Mansions'],
            estimatedCost: 3000
          },
          {
            day: 6,
            region: 'Madurai',
            places: ['Meenakshi Amman Temple', 'Thirumalai Nayak Palace'],
            estimatedCost: 2500
          },
          {
            day: 7,
            region: 'Return Journey',
            places: ['Bhavani Jamakalam'],
            estimatedCost: 2000
          }
        ]
      },
      '10': {
        name: 'Ultimate Tamil Nadu Experience',
        description: 'Complete circuit covering all major destinations from north to south',
        days: [
          {
            day: 1,
            region: 'Chennai',
            places: ['Fort St. George', 'San Thome Basilica'],
            estimatedCost: 2500
          },
          {
            day: 2,
            region: 'Mahabalipuram',
            places: ['Mahabalipuram Group of Monuments', 'Shore Temple', 'Pancha Rathas'],
            estimatedCost: 3200
          },
          {
            day: 3,
            region: 'Travel to Thanjavur',
            places: ['Gangaikonda Cholapuram', 'Kanchipuram Silk Sarees'],
            estimatedCost: 3500
          },
          {
            day: 4,
            region: 'Thanjavur',
            places: ['Brihadeeswara Temple', 'Thanjavur Maratha Palace', 'Thanjavur Paintings'],
            estimatedCost: 2800
          },
          {
            day: 5,
            region: 'Thanjavur Area',
            places: ['Swamimalai Bronze Sculptures', 'Thanjavur Bobblehead Dolls'],
            estimatedCost: 2500
          },
          {
            day: 6,
            region: 'Travel to Madurai',
            places: ['Chettinad Mansions'],
            estimatedCost: 3000
          },
          {
            day: 7,
            region: 'Madurai',
            places: ['Meenakshi Amman Temple', 'Thirumalai Nayak Palace'],
            estimatedCost: 2500
          },
          {
            day: 8,
            region: 'Kanyakumari (240km)',
            places: ['Vivekananda Rock Memorial', 'Thiruvalluvar Statue'],
            estimatedCost: 3500
          },
          {
            day: 9,
            region: 'Tirunelveli & Crafts',
            places: ['Pattamadai Silky Mats', 'Tirunelveli Wheat Halwa'],
            estimatedCost: 2500
          },
          {
            day: 10,
            region: 'Return Journey',
            places: ['Bhavani Jamakalam'],
            estimatedCost: 2000
          }
        ]
      }
    };

    const selectedPackage = packages[duration.toString()];
    
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid duration selected' });
    }

    const allData = [...heritage, ...crafts];

    // Build itinerary with actual place details
    const itinerary = selectedPackage.days.map(day => {
      const placesWithDetails = day.places.map(placeName => {
        const place = allData.find(p => p.name === placeName);
        if (place) {
          return {
            name: place.name,
            location: place.location,
            category: place.category,
            duration: place.duration || '2-3 hours',
            entry_fee: place.entry_fee || place.priceRange || 'Free',
            image: place.image
          };
        }
        return null;
      }).filter(p => p !== null);

      return {
        day: day.day,
        region: day.region,
        places: placesWithDetails,
        estimatedCost: day.estimatedCost * travelers
      };
    });

    const totalCost = itinerary.reduce((sum, day) => sum + day.estimatedCost, 0);

    res.json({
      itinerary,
      summary: {
        travelers,
        duration: parseInt(duration),
        packageName: selectedPackage.name,
        description: selectedPackage.description,
        totalPlaces: itinerary.reduce((sum, day) => sum + day.places.length, 0),
        estimatedTotalCost: totalCost,
        budgetMatch: totalCost <= parseInt(budget)
      }
    });
  } catch (error) {
    console.error('Generate itinerary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save itinerary
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { title, duration, estimatedCost, description, details, itineraryData } = req.body;
    const userId = req.user.userId;

    const users = await readJSON('users.json');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Support both chatbot format and original format
    const savedItinerary = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      title: title || itineraryData?.summary?.packageName || 'Custom Itinerary',
      duration: duration || itineraryData?.summary?.duration,
      estimatedCost: estimatedCost || itineraryData?.summary?.estimatedTotalCost,
      description: description || itineraryData?.summary?.description,
      details: details || {},
      itinerary: itineraryData?.itinerary || []
    };

    users[userIndex].itineraries.push(savedItinerary);
    await writeJSON('users.json', users);

    res.json({ message: 'Itinerary saved', itinerary: savedItinerary });
  } catch (error) {
    console.error('Save itinerary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user itineraries
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const users = await readJSON('users.json');
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ itineraries: user.itineraries });
  } catch (error) {
    console.error('Get itineraries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to calculate cost
function calculateDayCost(places, travelers, duration) {
  // Base cost varies by trip duration (longer trips = more efficient per day)
  let baseCost = duration <= 3 ? 2000 : duration <= 7 ? 1500 : 1200; // Per person per day
  
  places.forEach(place => {
    if (place.entry_fee) {
      // Extract numeric value from entry fee string
      const feeMatch = place.entry_fee.match(/₹(\d+)/);
      if (feeMatch) {
        baseCost += parseInt(feeMatch[1]);
      }
    }
    if (place.priceRange) {
      // For crafts, add estimated shopping budget
      baseCost += 500; // Estimated craft viewing/shopping cost
    }
  });
  
  return baseCost * travelers;
}

module.exports = router;
