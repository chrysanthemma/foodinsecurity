// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':5}

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

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

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
    return data
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
        console.log(data)
        addMarker(data)
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
    let allLayers = L.featureGroup([none, gluten_free, dairy_lactose_free, vegetarian, vegan, kosher, nut_allergies, fish_shellfish_allergies, egg_allergies, other]);
    map.fitBounds(allLayers.getBounds());
}

loadData(dataUrl)