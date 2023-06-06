// declare variables
let mapOptions = {'center': [34.125381, -118.471901],'zoom':10}

let none = L.featureGroup();
let gluten_free = L.featureGroup();
let dairy_lactose_free = L.featureGroup();
let vegetarian = L.featureGroup();
let vegan = L.featureGroup();
let kosher = L.featureGroup();
let nut_allergies = L.featureGroup();
let fish_shellfish_allergies = L.featureGroup();
let egg_allergies = L.featureGroup();
let other = L.featureGroup();

let layers = {
    "None": none,
    "Gluten free": gluten_free,
    "Dairy or lactose free": dairy_lactose_free,
    "Vegetarian": vegetarian,
    "Vegan": vegan,
    "Kosher": kosher,
    "Nut allergies": nut_allergies,
    "Fish or shellfish allergies": fish_shellfish_allergies,
    "Egg allergies": egg_allergies,
    "Other": other   
}

let circleOptions = {
    radius: 6,
    fillColor: "#40E0D0",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSc_884KqgNiQ2l5x-M0ohGdnsrJ95kcCENQpBVSTBN_Y-bM6KD4wrmrqe2VVBKOxv5JOH3XKgAQjfW/pub?output=csv"

// define the leaflet map
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

// add layer control box
L.control.layers(null,layers).addTo(map)

let Esri_WorldGrayCanvas = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


Esri_WorldGrayCanvas.addTo(map);

function addMarker(data){
    if(data["Please list any dietary restrictions you may have:"] == "None"){
        circleOptions.fillColor = "#FFBF00"
        none.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>None</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Gluten Free"){
        circleOptions.fillColor = "#F08080"
        gluten_free.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Gluten Free</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Dairy and Lactose free"){
        circleOptions.fillColor = "#E9967A"
        dairy_lactose_free.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Dairy and lactose Free</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Vegetarian"){
        circleOptions.fillColor = "#FA8072"
        vegetarian.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Vegetarian</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Vegan"){
        circleOptions.fillColor = "#DFFF00"
        vegan.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Vegan</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Kosher"){
        circleOptions.fillColor = "#FFBF00"
        kosher.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Kosher</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Nut Allergies"){
        circleOptions.fillColor = "#DE3163"
        nut_allergies.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Nut allergies</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Fish and Shellfish Allergies"){
        circleOptions.fillColor = "#6495ED"
        fish_shellfish_allergies.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Fish and Shellfish Allergies</h2>`))
    }
    if(data["Please list any dietary restrictions you may have:"] == "Egg Allergies"){
        circleOptions.fillColor = "#40E0D0"
        egg_allergies.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Egg Allergies</h2>`))
    }
    else{
        circleOptions.fillColor = "#9FE2BF"
        other.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Other</h2>`))
    }
    return data;
}

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        addMarker(data);
        createButtons(data.lat, data.lng, data["Timestamp"], data);
    })
    none.addTo(map) // add our layers after markers have been made
    gluten_free.addTo(map) // add our layers after markers have been made  
    dairy_lactose_free.addTo(map)
    vegetarian.addTo(map)
    vegan.addTo(map)
    kosher.addTo(map)
    nut_allergies.addTo(map)
    fish_shellfish_allergies.addTo(map)
    egg_allergies.addTo(map)
    other.addTo(map)
    // let allLayers = L.featureGroup([none, gluten_free, dairy_lactose_free, vegetarian, vegan, kosher, nut_allergies, fish_shellfish_allergies, egg_allergies, other]);
    // map.fitBounds(allLayers.getBounds());
}

loadData(dataUrl)

function createButtons(lat,lng,title,data){
    const newButton = document.createElement("button"); 
    newButton.id = "button"+title; 
    newButton.setAttribute("lat",lat); 
    newButton.setAttribute("lng",lng); 
    newButton.addEventListener('click', function() { map.flyTo([lat,lng],mapOptions.zoom); })
    const spaceForButtons = document.getElementById("userStories");
    spaceForButtons.appendChild(newButton); 

    // Button Text 
    let resources = "<h2>Most Frequently Used Resource: </h2>" + data["Have you used a food security resource while at UCLA? \nIf so, please list your most recently used food security resource. Otherwise, type 'N/A.' (ex: CPO Food Closet, Emergency Meal Program, etc)"];
    let locationImpact = data["How has where you live impacted your access to food?"];
    let UCLAImpact = data["How has food insecurity impacted your quality of life at UCLA?"];
    let text = resources + `<br><br>` + locationImpact + " " + UCLAImpact;
    if(data["Please list any dietary restrictions you may have:"] != "None"){
        dietaryImpact = data["How has your dietary restrictions affected your decision to access food security resources?"];
        text = text + " " + dietaryImpact;
    }
    newButton.innerHTML = text;

    // Button Styling
    newButton.style.margin = "2px";
    newButton.style.padding = "20px";
    newButton.style.textAlign = "left";
    newButton.style.backgroundColor = "white";
    newButton.addEventListener('mouseover', () => {
        newButton.style.backgroundColor = "rgb(235, 235, 235)";})
    newButton.addEventListener('mouseout', () => {
            newButton.style.backgroundColor = 'white';})
    // newButton.style.display = "inline-block";
    // newButton.style.width = "25%";
    // newButton.style.fontSize = "12px";
    // newButton.style.fontFamily = "";
    // newButton.style.textAlign = "center";
    // newButton.style.paddingTop = "8px";
    // newButton.style.paddingBottom = "8px";
    // newButton.style.justifyContent = "center";
    // newButton.style.cursor = "pointer";
}