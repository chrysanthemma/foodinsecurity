// Define the Leaflet map
let uclaCoord = [34.0660, -118.4438];
let mapOptions = {'center': uclaCoord,'zoom':15}

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

// Map Aesthetics 
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
CartoDB_Positron.addTo(map);

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
let allLayers;
let impact = L.featureGroup();
let noImpact = L.featureGroup();

let layers = {
    "<svg height='10' width='10'><circle cx='5' cy='5' r='4' fill='#457b9d' /></svg> Indicated Location Significantly Impacts Food Security": impact,
    "<svg height='10' width='10'><circle cx='5' cy='5' r='4' fill='#735d78' /></svg> Indicated Location Doesn't Significantly Impact Food Security": noImpact
}
L.control.layers(null,layers,{collapsed:false}).addTo(map);

function processData(results){
    results.data.forEach(data => {
        addMarker(data);
    })
    impact.addTo(map);
    noImpact.addTo(map);
    allLayers = L.featureGroup([impact,noImpact]);
    drawRectangles(results);
}

let circleOptions = {
    radius: 9,
    weight: 0,
    fillOpacity: 0.8
}

function addMarker(data){
    let story = "<h2>Experience: </h2><br>\""
        + data["How has food insecurity impacted your quality of life at UCLA? "] + "\"<br><br>"
        + "<h2>Impact of Location on Insecurity: </h2><br>\""
        + data["Why did you choose the answer above?"] + "\"";

    let layer;
    let startColor;
    if (data["Do you think where you live significantly impacts your access to food?"] == "Yes"){
        layer = impact;
        startColor = "#457b9d";
    } 
    else {
        layer = noImpact;
        startColor = "#735d78";
    }

    layer.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(story).setStyle({fillColor: startColor})
    .on('mouseover', function (e) {
        this.openPopup();
        this.setStyle({fillColor: "white"});
    })
    .on('mouseout', function (e) {
        this.closePopup();
        this.setStyle({fillColor: startColor});
    }))
    
    return data;
}

// Create Buttons
function flytoUCLA(){
    map.flyTo(mapOptions.center, mapOptions.zoom);
}

function flytoLA(){
    map.fitBounds(allLayers.getBounds());
}

// Create Stats
function drawRectangles(results) {
    let imCount = 0;
    let nImCount = 0;
    results.data.forEach(data => {
        if (data["Do you think where you live significantly impacts your access to food?"] == "Yes"){
            imCount++;
        }
        else {
            nImCount++;
        }
    })
    let totalCount = imCount + nImCount;
    let imCountPercent = imCount / totalCount;
    let nImCountPercent = nImCount / totalCount;

    const canvas = document.querySelector('#canvas');
    if (!canvas.getContext) { return; }
    const ctx = canvas.getContext('2d');

    /*Draw Impact Percent*/
    let totalWidth = 425;
    let imWidth = totalWidth*imCountPercent;
    ctx.fillStyle = '#457b9d';
    ctx.fillOpacity = 0.8;
    ctx.fillRect(0, 0, imWidth, 50);
    /*Draw Not Impact Percent*/
    ctx.fillStyle = '#735d78';
    ctx.fillOpacity = 0.8;
    ctx.fillRect(imWidth, 0, totalWidth*nImCountPercent, 50);
    /*Text*/
    let percentNice = imCountPercent * 100;
    let statsText = `${percentNice.toFixed(0)}% (${imCount}/${totalCount}) of people surveyed think their location significantly impacts their food security`;
    var node = document.getElementById('stats');
    var newNode = document.createElement('p');
    newNode.appendChild(document.createTextNode(statsText));
    node.appendChild(newNode);
}