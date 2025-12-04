
var map = L.map('map', {
    center: [30, -81],
    zoom: 2.5,
    maxZoom: 4,
    minZoom: 2.5,
    zoomSnap: 0.4,
    scrollWheelZoom: false // disable zooming via mouse wheel/trackpad scroll
});

var bounds = map.getBounds();
map.setMaxBounds(bounds);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Ensure wheel zoom is disabled (defensive, in case of re-init elsewhere)
map.scrollWheelZoom.disable();

let selectedCountry = null;
let currentCountryData = null;
let countriesInfoData = null;
const countryCodes = { "Canada": "CA", "United States": "US", 
    "Mexico": "MX", "Belize": "BZ", "Guatemala": "GT", "El Salvador": "SV", 
    "Honduras": "HN", "Nicaragua": "NI", "Costa Rica": "CR", "Panama": "PA", 
    "Bahamas": "BS", "Cuba": "CU", "Jamaica": "JM", "Haiti": "HT", 
    "Dominican Republic": "DO", "Antigua and Barbuda": "AG", "Dominica": "DM", 
    "Saint Lucia": "LC", "Saint Vincent and the Grenadines": "VC", 
    "Barbados": "BB", "Grenada": "GD", "Trinidad and Tobago": "TT", 
    "Colombia": "CO", "Venezuela": "VE", "Guyana": "GY", "Suriname": "SR", 
    "Brazil": "BR", "Ecuador": "EC",  "Peru": "PE", "Bolivia": "BO", 
     "Paraguay": "PY", "Chile": "CL", "Argentina": "AR", "Uruguay": "UY"
};

function updateCountryDetails(properties, countryInfo) {
    const detailsContainer = document.getElementById('details-container');
    const detailsTemplate = document.getElementById('details-template');
    const noSelection = detailsContainer.querySelector('.no-selection');
    const detailsHeader = document.querySelector('#country-header h2');
    const headerContainer = document.querySelector('#country-header');
    
    if (!detailsContainer || !detailsTemplate) {
        console.error('Details container or template not found');
        return;
    }
    

    if (noSelection) {
        noSelection.style.display = 'none';
    }
    detailsTemplate.style.display = 'block';
    if (detailsHeader) {
        const countryName = properties.name;
        const code = countryCodes[countryName];

        detailsHeader.textContent = countryName;
        if (code) {
            headerContainer.style.backgroundImage = `url("https://flagcdn.com/${code.toLowerCase()}.svg")`;
            headerContainer.style.backgroundSize = 'cover';         
            headerContainer.style.backgroundPosition = 'center'; // baseline for subtle parallax
            headerContainer.style.backgroundRepeat = 'no-repeat';
            // Use CSS class to control header text color on selection
            headerContainer.classList.add('selected');
            headerContainer.style.color = '';                 
            headerContainer.style.padding = '40px 16px';            
            headerContainer.style.backgroundBlendMode = 'overlay';
            headerContainer.style.boxShadow = 'inset 0 0 0 1000px rgba(0,0,0,0.25)';
        } else {
            headerContainer.style.backgroundImage = '';
            headerContainer.style.boxShadow = '';
            headerContainer.classList.remove('selected');
            headerContainer.style.color = '';
            headerContainer.style.padding = '';
        }
    }
 
    const animalDisplay = Array.isArray(countryInfo.animal) 
        ? countryInfo.animal.join(', ') 
        : countryInfo.animal || 'Unknown';
    
    const languageDisplay = countryInfo['official language'] || 'Unknown';
    
    document.getElementById('detail-capital').textContent = countryInfo.capital || 'Unknown';
    document.getElementById('detail-language').textContent = languageDisplay;
    document.getElementById('detail-day').textContent = countryInfo['national day'] || 'Unknown';
    document.getElementById('detail-day-info').textContent = countryInfo['national day info'] || '';
    document.getElementById('detail-anthem').textContent = countryInfo.anthem || 'Unknown';
    document.getElementById('detail-animal').textContent = animalDisplay;
    document.getElementById('detail-dish').textContent = countryInfo.dish || 'Unknown';
    document.getElementById('detail-tree').textContent = countryInfo.tree || 'Unknown';
    document.getElementById('detail-species').textContent = countryInfo['endangered species']|| 'Unknown';
    
    // Update Spotify embed if song URL exists
    if (countryInfo.song) {
        const spotifyEmbed = document.getElementById('spotify-embed');
        if (spotifyEmbed) {
            // Convert track URL to embed URL
            // Example: https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W?si=...
            // becomes: https://open.spotify.com/embed/track/53iuhJlwXhSER5J2IYYv1W?utm_source=generator
            const trackMatch = countryInfo.song.match(/\/track\/([a-zA-Z0-9]+)/);
            if (trackMatch) {
                const trackId = trackMatch[1];
                spotifyEmbed.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
            }
        }
        
        // Show and setup like button
        const likeContainer = document.getElementById('song-like-container');
        const likeBtn = document.getElementById('like-song-btn');
        if (likeContainer && likeBtn) {
            likeContainer.style.display = 'block';
            
            // Check if song is already liked
            const likedSongs = getLikedSongs();
            const isLiked = likedSongs.some(song => song.country === properties.name);
            
            if (isLiked) {
                likeBtn.classList.add('liked');
                likeBtn.innerHTML = '<span class="heart">♥</span> Remove from Playlist';
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.innerHTML = '<span class="heart">♡</span> Add to Playlist';
            }
            
            // Remove old event listener by cloning
            const newLikeBtn = likeBtn.cloneNode(true);
            likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
            
            // Add new event listener
            newLikeBtn.addEventListener('click', function() {
                toggleLikeSong(properties.name, countryInfo.song);
            });
        }
    } else {
        // Hide like button if no song
        const likeContainer = document.getElementById('song-like-container');
        if (likeContainer) {
            likeContainer.style.display = 'none';
        }
    }
    

}


function findCountryInfo(countryName) {
    if (!countriesInfoData) return null;
    
    return countriesInfoData.find(country => 
        country['country'] === countryName
    );
}


function showCountryDetails() {
    if (selectedCountry) {
        selectedCountry.closePopup();
    }
    
    const detailsSection = document.getElementById('country-details');
    detailsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}





    function mapScroll() {
        const mapSection = document.getElementById('map');
        if (!mapSection) return;
        mapSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
function showPlaylistView() {
    window.location.href = "playlist.html";
}

function showMapView() {
    window.location.href = "index.html";
}

function showQuizView() {
    window.location.href = "quiz.html";
}

// Liked songs management functions
function getLikedSongs() {
    const stored = localStorage.getItem('likedSongs');
    return stored ? JSON.parse(stored) : [];
}

function saveLikedSongs(songs) {
    localStorage.setItem('likedSongs', JSON.stringify(songs));
}

function toggleLikeSong(countryName, songUrl) {
    const likedSongs = getLikedSongs();
    const existingIndex = likedSongs.findIndex(song => song.country === countryName);
    
    if (existingIndex >= 0) {
        // Remove from liked songs
        likedSongs.splice(existingIndex, 1);
        alert(`Removed ${countryName}'s song from playlist!`);
    } else {
        // Add to liked songs
        likedSongs.push({
            country: countryName,
            songUrl: songUrl
        });
        alert(`Added ${countryName}'s song to playlist!`);
    }
    
    saveLikedSongs(likedSongs);
    
    // Update button state
    const likeBtn = document.getElementById('like-song-btn');
    if (likeBtn) {
        const isLiked = existingIndex < 0;
        if (isLiked) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<span class="heart">♥</span> Remove from Playlist';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<span class="heart">♡</span> Add to Playlist';
        }
    }
}

fetch('data/countries_info.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(countriesArray => {
        console.log('Data loaded successfully:', countriesArray);
        
        
        countriesInfoData = countriesArray;

        
        const geoJSONData = {
            type: "FeatureCollection",
            features: countriesArray.map(country => ({
                type: "Feature",
                properties: {
                    name: country['country'],
                    ...country
                },
                geometry: country.geometry
            }))
        };

        
        const defaultStyle = {
            fillColor: '#A0F1BD', 
            fillOpacity: 0.2,
            color: '#2E4F21',      
            weight: 0.3,
            opacity: 0.6
        };
        
        const hoverStyle = {
            fillColor: '#A0F1BD', 
            fillOpacity: 0.4,
            color: '#2E4F21',      
            weight: 0.5,
            opacity: 1
        };
        
        const selectedStyle = {
            fillColor: '#387d31ff',
            fillOpacity: 0.3,  
            color: '#3e652aff',
            opacity: 0.5,
            weight: 2.5
        };

        
        L.geoJSON(geoJSONData, {
            style: defaultStyle,
            onEachFeature: function(feature, layer) {
                
                
                layer.on('mouseover', function(e) {
                    if (e.target !== selectedCountry) {
                        e.target.setStyle(hoverStyle);
                    }
                });
                
                
                layer.on('mouseout', function(e) {
                    if (e.target !== selectedCountry) {
                        e.target.setStyle(defaultStyle);
                    }
                });
                
                
                layer.on('click', function(e) {
                    
                    if (selectedCountry && selectedCountry !== e.target) {
                        selectedCountry.setStyle(defaultStyle);
                        selectedCountry.closePopup();
                    }
                    
                    
                    e.target.setStyle(selectedStyle);
                    selectedCountry = e.target;
                    currentCountryData = feature.properties;

                   
                    const countryInfo = findCountryInfo(feature.properties.name);
                    const countryName1 = feature.properties.name;
                    const code = countryCodes[countryName1];
                    
                    const popupContent = `
                        <div class="country-popup">
                            ${code ? `<img class="flag" src="https://flagcdn.com/${code.toLowerCase()}.svg" alt="${countryName1} flag">` : ""}
                            <h3>${countryName1}</h3>
                            <div class="popup-content">
                                <p><strong>Capital:</strong> ${countryInfo?.capital || 'Unknown'}</p>
                                <button class="info-btn" onclick="showCountryDetails()">More Information</button>
                            </div>
                        </div>
                    `;   

                    
                    layer.bindPopup(popupContent, {
                        maxWidth: 320,
                        className: 'custom-popup',
                        closeOnClick: false,
                        autoPan: true,
                        offset: L.point(0, -6)
                    }).openPopup();
                    
                    
                    if (countryInfo) {
                        updateCountryDetails(feature.properties, countryInfo);
                    }

                    
                    map.fitBounds(e.target.getBounds(), {
                        easeLinearity: 0.7,
                        padding: [90, 90]
                    });
                });
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading country data:', error);
        alert('Failed to load country data.');
    });