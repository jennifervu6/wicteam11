
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

fetch('data.json')
    .then(response => response.json())
    .then(countriesData => {

        const defaultStyle = {
            fillColor: '', 
            fillOpacity: 0,
            color: '#cdcdcdff',      
            weight: 0.3,
            opacity: 1
        };
        
        const hoverStyle = {
            fillColor: '', 
            fillOpacity: 0.5,
            color: '#cdcdcdff',      
            weight: 0.3,
            opacity: 1
        };
        
        const selectedStyle = {
            fillColor: 'red',
            fillOpacity: 0.2,  
            color: '#c20000ff',
            opacity: 1,
            weight: 0.3
        };

        L.geoJSON(countriesData, {
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
                     if (selectedCountry) {
                selectedCountry.setStyle(defaultStyle);
                selectedCountry.closePopup();
            }
                    

                    e.target.setStyle(selectedStyle);
                    selectedCountry = e.target;
                    currentCountryData = feature.properties;

                    const popupContent = document.getElementById('popup-template').innerHTML
                        .replace('Country Name', feature.properties.name)
                        .replace('Region information', `Region: ${feature.properties.region || 'Not specified'}`)
                        .replace('Population data', `Population: ${feature.properties.population ? feature.properties.population.toLocaleString() : 'Unknown'}`);

                    this.bindPopup(popupContent, {
                        maxWidth: 300,
                        className: 'custom-popup',
                        closeOnClick: false
                    }).openPopup();
                                    
                    map.fitBounds(e.target.getBounds(), {
                        easeLinearity: 0.7,
                        padding: [90, 90]
                    });
                });
            }
        }).addTo(map);
    });
    
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
