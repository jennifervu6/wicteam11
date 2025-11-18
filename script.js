
var map = L.map('map', {
    center: [30, -81],
    zoom: 2.5,
    maxZoom: 4,
    minZoom: 2.5,
    zoomSnap: 0.4 
});

var bounds = map.getBounds();
map.setMaxBounds(bounds);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let selectedCountry = null;
let currentCountryData = null;
let countriesInfoData = null;


function updateCountryDetails(properties, countryInfo) {
    const detailsContainer = document.getElementById('details-container');
    const detailsTemplate = document.getElementById('details-template');
    const noSelection = detailsContainer.querySelector('.no-selection');
    const detailsHeader = document.querySelector('#country-details h2');
    
    if (!detailsContainer || !detailsTemplate) {
        console.error('Details container or template not found');
        return;
    }
    

    if (noSelection) {
        noSelection.style.display = 'none';
    }
    detailsTemplate.style.display = 'block';
    
    if (detailsHeader) {
        detailsHeader.textContent = properties.name; // Change header to country name
    }
 
    const animalDisplay = Array.isArray(countryInfo.animal) 
        ? countryInfo.animal.join(', ') 
        : countryInfo.animal || 'Unknown';
    
    const languageDisplay = countryInfo['official language'] || 'Unknown';
    
    document.getElementById('detail-capital').textContent = countryInfo.capital || 'Unknown';
    document.getElementById('detail-animal').textContent = animalDisplay;
    document.getElementById('detail-dish').textContent = countryInfo.dish || 'Unknown';
    document.getElementById('detail-tree').textContent = countryInfo.tree || 'Unknown';
    document.getElementById('detail-language').textContent = languageDisplay;
    document.getElementById('detail-day').textContent = countryInfo['national day'] || 'Unknown';
    document.getElementById('detail-day-info').textContent = countryInfo['national day info'] || '';
    document.getElementById('detail-anthem').textContent = countryInfo.anthem || 'Unknown';
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
    mapSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}



function showPlaylistView() {
    alert('Playlist feature coming soon!');
}

function showMapView() {
    window.location.href = "index.html";
}

function showQuizView() {
    window.location.href = "quiz.html";
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

                    
                    const popupContent = `
                        <div class="country-popup">
                            <h3>${feature.properties.name}</h3>
                            <div class="popup-content">
                                <p><strong>Capital:</strong> ${countryInfo?.capital || 'Unknown'}</p>
                                <button class="info-btn" onclick="showCountryDetails()">More Information</button>
                            </div>
                        </div>
                    `;

                    
                    layer.bindPopup(popupContent, {
                        maxWidth: 300,
                        className: 'custom-popup',
                        closeOnClick: false
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