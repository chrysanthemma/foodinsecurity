// Define the Leaflet map
let uclaCoord = [34.0690, -118.4438];
let mapOptions = {'center': uclaCoord,'zoom':14}

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

// Map Aesthetics 
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
CartoDB_Positron.addTo(map);

let circleOptions = {
    radius: 6,
    fillColor: "#457b9d",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

// Loading Data
function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}
const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSc_884KqgNiQ2l5x-M0ohGdnsrJ95kcCENQpBVSTBN_Y-bM6KD4wrmrqe2VVBKOxv5JOH3XKgAQjfW/pub?output=csv"
loadData(dataUrl)

// Creating Markers
let uclaMarker = L.marker(uclaCoord).addTo(map)
        .bindPopup('University of California, Los Angeles')
        .openPopup();

function processData(results){
    results.data.forEach(data => {
        let story = "<h2>Experience: </h2><br>\""
            + data["How has food insecurity impacted your quality of life at UCLA? "] + "\"<br><br>"
            + "<h2>Impact of Location on Food Acess: </h2><br>\""
            + data["Why did you choose the answer above?"] + "\"";
        L.circleMarker([data.lat,data.lng],circleOptions).addTo(map).bindPopup(story)
        .on('mouseover', function (e) {
            this.openPopup();
            this.setStyle({fillColor: "white"});
        })
        .on('mouseout', function (e) {
            this.closePopup();
            this.setStyle({fillColor: "#457b9d"});
        });
    })
}