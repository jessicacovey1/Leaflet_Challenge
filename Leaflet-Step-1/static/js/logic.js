// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

// * Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. 
//Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

// * **HINT** the depth of the earth can be found as the third coordinate for each earthquake.

// * Include popups that provide additional information about the earthquake when a marker is clicked.

// * Create a legend that will provide context for your map data.

// * Your visualization should look something like the map above.


  //for ( i=0; i< data.length; i++) 

        // Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  //"http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  //"2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

  
// Perform a GET request to the query URL must match with the correct d3 version in html //d3.json(queryUrl).then(function(data) {
d3.json(queryUrl, function(data) {
  console.log(data.features);
 
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  function onEachFeature(feature, layer) {
    layer.bindPopup(`${feature.properties.place}<hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}`);
  }

  function getColor(depth) {
  //  var getColor = data[1].mag;
    //for ( i=0; i< data.length; i++) 
        if (depth >= 90.0) {
          return "darkgreen";
        } 
        else if (depth >= 15) {
          return "forestgreen"; 
        } 
        else if (depth >= 9.0) {
          return "lawngreen"; 
        } 
        else if (depth >= 5.0) {
          return "lightgreen";        
        }
        else if (depth >= 2.0) {
            return "springgreen"; 
        }
        else {
            return "palegreen"; 
        }

  }  
        
   var earthquakes = L.geoJSON(data.features, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: function(feature) {
      return {
        "color": "black",
        "fillOpacity": 1,
        "fillColor": getColor(feature.geometry.coordinates[2]),  //getColor(feature.properties.mag),
        "weight": 2,
        "radius": feature.properties.mag * 5,
        "opacity": 0.65    
      }
    }  
  })
    

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    "Earthquakes": earthquakes
  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, earthquakes] //default map opens
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
   // var limits = geojson.options.limits;
    // var colors = geojson.options.colors;
    var limits = [90, 15, 9, 5, 2, -10];
    var colors = ["darkgreen", "forestgreen", "lawngreen", "lightgreen", "springgreen", "palegreen"];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Depth</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

 });
