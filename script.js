
var map = L.map('map', {
    center: [30, -81],
    zoom: 2.5,
    maxZoom: 3,
    minZoom: 2.5,
    zoomSnap: 0.5 
});
var bounds = map.getBounds();

map.setMaxBounds(bounds);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var selectedCountry = null;

fetch('data.json')
    .then(response => response.json())
    .then(countriesData => {

        const defaultStyle = {
            fillColor: '', // Explicitly no fill color
            fillOpacity: 0,
            color: '#cdcdcdff',      
            weight: 0.3,
            opacity: 1
        };
        
        const hoverStyle = {
            fillColor: '', // Explicitly no fill color
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
                        selectedCountry.setStyle({
                            fillColor: '',
                            fillOpacity: 0,
                            color: '#cdcdcdff',      
                            weight: 0.3,
                            opacity: 1
                        });
                    }
                    

                    e.target.setStyle(selectedStyle);
                    selectedCountry = e.target;
                    
                    map.fitBounds(e.target.getBounds());
                });
            }
        }).addTo(map);
    });