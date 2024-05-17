function moveMapToBerlin(map) {
  map.setCenter({lat: 4.6475802, lng: -74.1057188});
  map.setZoom(10);
}

var platform = new H.service.Platform({
  apikey: 'Uw1p92zaaqqMd8w87nderAZeIQ42PT9LAY0YOCVkZq8' // replace with your api key
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('mapContainer'),
  defaultLayers.vector.normal.map, {
  center: { lat: 50, lng: 5 },
  zoom: 4,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
// Now use the map as required...
window.onload = function () {
  moveMapToBerlin(map);
  getDefaultLocation();
}

const autosuggest = (e) => {
  if (event.metaKey) {
      return;
  }

  let searchString = e.value;
  if (searchString != "") {
      const timestamp = new Date().getTime();
      fetch(
          `https://autosuggest.search.hereapi.com/v1/autosuggest?apiKey=${'Uw1p92zaaqqMd8w87nderAZeIQ42PT9LAY0YOCVkZq8'}&at=33.738045,73.084488&limit=5&resultType=city&q=${searchString}&lang=en-US&timestamp=${timestamp}`
      )
      .then((res) => res.json())
      .then((json) => {
          if (json.length != 0) {
              document.getElementById("list").innerHTML = ``;
              json.items.forEach((item) => {
                  if (item.position != undefined && item.position != "") {
                      document.getElementById("list").innerHTML += `<li onClick="addMarkerToMap(${item.position.lat},${item.position.lng},'${item.title}')">${item.title}</li>`;
                  }
              });
          }
      });
  }
};

// Function to get the default location after loading the page
function getDefaultLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          function(position) {
              var lat = position.coords.latitude;
              var lng = position.coords.longitude;
              var title = "Tu ubicación actual";
              addMarkerToMap(lat, lng, title);
          },
          function(error) {
              console.error("Error al obtener la ubicación: ", error);
              // If there is an error, use a default location
              var lat = 4.6475802;
              var lng = -74.1057188;
              var title = "Bogotá D.C.";
              addMarkerToMap(lat, lng, title);
          },
          {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
          }
      );
  } else {
      // If the browser does not support geolocation, use a default location
      var lat = 4.6475802;
      var lng = -74.1057188;
      var title = "Bogotá D.C.";
      addMarkerToMap(lat, lng, title);
  }
}

// Adding marker to map
const addMarkerToMap = (lat, lng, title) => {
  map.removeObjects(map.getObjects());
  document.getElementById("search").value = title;
  var selectedLocationMarker = new H.map.Marker({ lat, lng });
  map.addObject(selectedLocationMarker);
  document.getElementById("list").innerHTML = ``;
  map.setCenter({ lat, lng }, true);
};
