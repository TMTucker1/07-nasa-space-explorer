// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Find the button and gallery elements
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Find space facts elements
const spaceFactElement = document.getElementById('spaceFact');
const newFactButton = document.getElementById('newFactBtn');

// Find modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeButton = document.querySelector('.close-button');

// NASA API configuration
const API_KEY = 'Y5dg3UfjDOXb91rX1eXnWNlvUvw1WrBDpaHg0tFr';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// Array of space facts from NASA science
const spaceFacts = [
  "Venus is the hottest planet in our solar system with surface temperatures reaching 900°F (475°C) - hot enough to melt lead!",
  "A day on Venus is longer than its year! Venus takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
  "Jupiter's Great Red Spot is a giant storm that has been raging for at least 350 years and is bigger than Earth.",
  "Saturn's moon Titan has lakes and rivers, but they're made of liquid methane and ethane instead of water.",
  "Mars has the largest volcano in the solar system - Olympus Mons is about 13.6 miles (22 km) high, nearly three times taller than Mount Everest.",
  "Neptune's winds can reach speeds of up to 1,200 mph (2,000 km/h) - faster than the speed of sound on Earth!",
  "A teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "The Sun converts 4 million tons of matter into energy every second through nuclear fusion.",
  "There are more stars in the universe than grains of sand on all the beaches on Earth.",
  "Mercury experiences temperature swings of over 1,000°F (540°C) between its day and night sides.",
  "Europa, one of Jupiter's moons, has twice as much water as Earth's oceans beneath its icy surface.",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but they won't collide for about 4.5 billion years.",
  "Uranus rotates on its side with an axial tilt of 98 degrees, likely due to a massive collision billions of years ago.",
  "The International Space Station travels at 17,500 mph (28,000 km/h) and orbits Earth every 90 minutes.",
  "Black holes can spin up to 1,000 times per second, warping space-time around them.",
  "The coldest place in the solar system isn't Pluto - it's the shadowed craters near the Moon's south pole at -414°F (-248°C).",
  "Jupiter acts as a 'cosmic vacuum cleaner' protecting inner planets by capturing asteroids and comets with its massive gravity.",
  "A single lightning bolt on Jupiter can be up to 1,000 times more powerful than lightning on Earth.",
  "The asteroid belt contains less mass than Earth's Moon, despite having millions of asteroids.",
  "Pluto's largest moon, Charon, is so big relative to Pluto that they orbit around a point in space between them."
];

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Modal event listeners
// Close modal when clicking the X button
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
  }
});

// Function to open modal with image details
function openModal(imageData) {
  // Set the modal content
  modalImage.src = imageData.url;
  modalImage.alt = imageData.title;
  modalTitle.textContent = imageData.title;
  modalDate.textContent = imageData.date;
  modalExplanation.textContent = imageData.explanation;
  
  // Show the modal
  modal.style.display = 'block';
}

// Function to display a random space fact
function displayRandomFact() {
  // Get a random index from the spaceFacts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  
  // Display the random fact
  spaceFactElement.textContent = spaceFacts[randomIndex];
}

// Initialize the page with a random fact
displayRandomFact();

// Add click event listener to the "New Fact" button
newFactButton.addEventListener('click', displayRandomFact);

// Add click event listener to the button
button.addEventListener('click', async () => {
  // Get the selected date values
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Show loading message
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading amazing space images...</p>
    </div>
  `;
  
  try {
    // Call the NASA API to get space images
    await fetchSpaceImages(startDate, endDate);
  } catch (error) {
    // Show error message if something goes wrong
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>Sorry, we couldn't load the space images. Please try again later.</p>
      </div>
    `;
    console.error('Error fetching space images:', error);
  }
});

// Function to fetch images from NASA API
async function fetchSpaceImages(startDate, endDate) {
  // Build the API URL with our parameters
  const apiUrl = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  
  // Make the API request
  const response = await fetch(apiUrl);
  
  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  // Convert the response to JSON
  const data = await response.json();
  
  // Display the images in the gallery
  displayImages(data);
}

// Function to display images in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  
  // Check if we got any images
  if (!images || images.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔭</div>
        <p>No images found for the selected date range.</p>
      </div>
    `;
    return;
  }
  
  // Create HTML for each image
  images.forEach(imageData => {
    // Create a gallery item element
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    if (imageData.media_type === 'image') {
      // Handle images normally
      galleryItem.innerHTML = `
        <img src="${imageData.url}" alt="${imageData.title}" />
        <p><strong>${imageData.title}</strong> (${imageData.date})</p>
        <p style="color: #666; font-style: italic;">Click image for details</p>
      `;
      
      // Add click event listener to the image
      const img = galleryItem.querySelector('img');
      img.addEventListener('click', () => {
        openModal(imageData);
      });
    } else if (imageData.media_type === 'video') {
      // Handle videos with placeholder and link
      galleryItem.innerHTML = `
        <div class="video-placeholder">
          <div class="video-icon">🎥</div>
          <p>Video Content</p>
        </div>
        <p><strong>${imageData.title}</strong> (${imageData.date})</p>
        <p style="color: #666; font-style: italic;">Click image for details</p>
        <a href="${imageData.url}" target="_blank" class="video-link">
          🎬 Watch Video
        </a>
      `;
      
      // Add click event listener to the placeholder
      const placeholder = galleryItem.querySelector('.video-placeholder');
      placeholder.addEventListener('click', () => {
        openModal(imageData);
      });
    }
    
    // Add the item to the gallery
    gallery.appendChild(galleryItem);
  });
  
  // If no items were displayed, show a message
  if (gallery.children.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔭</div>
        <p>No content found for the selected date range.</p>
      </div>
    `;
  }
}
