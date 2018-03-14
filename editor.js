// The Google Map. 
var map;

var geoJsonOutput;
var downloadLink;

var stili;
var selectedFeature;

var PropertyValue="unknown";

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.620803, lng: 19.9207394},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'satellite'
  });
	
  map.data.setControls(['Point', 'LineString', 'Polygon']);
  map.data.setStyle({
    editable: true,
    draggable: true,
    clickable: true
  });
  
  map.data.setStyle(function(feature) {
        var color = "white";
        if (feature.getProperty("Rating") == null && feature.getProperty("Color") == null ) {
            feature.setProperty("Rating", PropertyValue);
            feature.setProperty("Color", PropertyValue);
        }
        if (feature.getProperty("Color") != PropertyValue) {
            var color = feature.getProperty("Color");
        }
        return ({
            strokeColor: color,
            strokeWeight: 4
	});
   });
	
  map.data.addListener("click",function(selected){
  	 selectedFeature = selected.feature;
  	 map.data.revertStyle();
  	 map.data.overrideStyle(selectedFeature,{strokeWeight: 6});
  });

  map.data.addListener("rightclick",function(rate){
	  var metritis = 0;
	  var colour;
	  if (metritis==5){metritis=0;}
	  metritis++;
	  
	  if (metritis==1){ colour='red';}else 
	  if (metritis==2){ colour='orange';}else
	  if (metritis==3){ colour='yellow';}else
	  if (metritis==4){ colour='green';}else
	  if (metritis==5){ colour='blue';}
	  
	  rate.features.setProperty("Rating", metritis);
  });
	
  map.data.loadGeoJson("data/geojson.json");

  bindDataLayerListeners(map.data);

  // Retrieve HTML elements.
  stili = document.getElementById('stili');
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');

  resize();
  google.maps.event.addDomListener(window, 'resize', resize);
}

google.maps.event.addDomListener(window, 'load', init);

// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonOutput.value = JSON.stringify(geoJson, null ,2);
    refreshDownloadLinkFromGeoJson();
  });
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
  downloadLink.href = "data:;base64," + btoa(geoJsonOutput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}

function DelAll(){
	map.data.forEach(function(features){
		map.data.remove(features);
	});
}

function DelSel(){
	map.data.remove(selectedFeature);
}

function showButton() {
  var stili_mou = document.getElementById('geojson-output').style.display;
  if(stili_mou === "none"){
          document.getElementById('geojson-output').style.display = "block";
  }else{
          document.getElementById('geojson-output').style.display = "none";
  }
}

function resize() {
  var geoJsonOutputRect = geoJsonOutput.getBoundingClientRect();
  var stiliRect = stili.getBoundingClientRect();
  geoJsonOutput.style.height = stiliRect.bottom - geoJsonOutputRect.top - 8 + "px";
}

