/**
 * Add map to page with initial view of contiguous U.S. and USGS base layers.
 */
function addMap() {
  // Configure map
  const zoom = 4;
  const lat = 39.8;
  const lng = -98.5;

  let config = {
    minZoom: 3,
    maxZoom: 16,
    preferCanvas: true
  };
    
  // Configure tile layers

  // OSM
  osmLink = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  osmOpt = {
    attribution: osmAttr
  };

  // USGS Hydro Cached
  const hydroCachedLink = "https://basemap.nationalmap.gov/arcgis/services/USGSHydroCached/MapServer/WMSServer";
  const usgsAttr = "<a href='https://www.usgs.gov/'>U.S. Geological Survey</a> | <a href='https://www.usgs.gov/laws/policies_notices.html'>Policies</a>";
  const hydroCachedOpt= {
    layers: "0",
    format: "image/png",
    transparent: true,
    attribution: usgsAttr
  };
    

  // NHD High Res: only appears zoom level 13 or higher
  const nhdHighLink = "https://hydro.nationalmap.gov/arcgis/services/NHDPlus_HR/MapServer/WMSServer?";
  const nhdHighOpt = {
    layers: "1,2,3,4,5,6,7,8,9,10,11",
    format: "image/png",
    transparent: true,
    attribution: usgsAttr
  };
    
  // TheNationalMap base layer
  tnmLink = "https://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WMSServer?";
  const tnmOpt = {
    layers: "0",
    format: "image/png",
    attribution: usgsAttr
  };

  const osmMap = L.tileLayer(osmLink, osmOpt)
  const tnmMap = L.tileLayer.wms(tnmLink, tnmOpt);
  const hydroCached = L.tileLayer.wms(hydroCachedLink, hydroCachedOpt);
  const nhdHigh = L.tileLayer.wms(nhdHighLink, nhdHighOpt);

  // Call map and add base layers
  const map = L.map("mapdiv", config).setView([lat, lng], zoom);

  tnmMap.addTo(map);

  var baseLayers = {
    "The National Map": tnmMap
  };

  var overlays = {
    "NHD Medium": hydroCached,
    "NHD HR": nhdHigh
  };

  L.control.layers(baseLayers, overlays).addTo(map);


  // Define "home" button control
  const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
  </svg>`;
  
  const HomeControl = L.Control.extend({
    // button position
    options: {
      position: "topleft",
    },

    // method
    onAdd: function (map) {
      // create button
      const btn = L.DomUtil.create("button");
      btn.title = "zoom all the way out";
      btn.innerHTML = homeSvg;
      btn.className += "leaflet-bar zoom-all-out";
      btn.setAttribute(
        "style",
        "height: 30px; padding-top: 5px; margin-top: 5; left: 0; display: flex; cursor: pointer; justify-content: center;"
      );

    return btn;
    },
  });

  // Add the button to map
  map.addControl(new HomeControl());

  const button = document.querySelector(".zoom-all-out");
  button.addEventListener("click", () => map.setView([lat, lng], zoom));

  return map;
}

/**
 * Set up interactions for "all lakes" layer (circleMarkers)
 * @param {Object} feature GeoJSON feature
 * @param {L.Layer} layer Leaflet Layer instance
 */
function interactAllLakes(feature, layer) {
  layer.on({
    mouseover: function(e) {e.target.setStyle({color:"cyan"})},
    mouseout: function(e) {allLakesLayer.resetStyle(e.target)},
    click: function(e) {map.setView(e.target.getLatLng(), 14)}

  })
}

/**
 * Set up interactions for lake search results (Markers)
 * @param {Object} feature GeoJSON feature
 * @param {L.Layer} layer Leaflet Layer instance
 */
 function interactSearchedLakes(feature, layer) {
   const id = feature.properties.lagoslakeid;
   const name = feature.properties.lake_namegnis;
   const state = feature.properties.lake_centroidstate;
   // make card with search hints that shows pointer like a link when you hover
   cardsHtml += `
   <div id="${id}" class="card card-body" style="cursor:pointer;">
     <p>
     <span class="text-primary">${id}</span> 
     ${name} 
     (${state})
     </p>
   </div>
  `

  layer.leafletId = id;
  const popup = `<b>Name:</b> ${name} <br><b>ID:</b> ${id}`
  layer.bindPopup(popup);

  //  MARKER event listeners
  layer.on({
    mouseover: function (e) {
      // highlight marker
      e.target.setStyle({color: "lightcyan", stroke: true, fillColor: "cyan"});
      e.target.bringToFront();
      // get side-bar card
      let elem = document.getElementById(e.target.leafletId);
      elem.classList.add("bg-info");
    },
    mouseout: function (e) {
      allLakesLayer.resetStyle(e.target);
      let elem = document.getElementById(e.target.leafletId);
      elem.classList.remove("bg-info");
    },
    click: function (e) {
      map.setView(e.target.getLatLng(), map.getZoom() + 2)
      // TODO: Consider changing color and "pin" to top of list?
    }

  })
}



/**
 * Manages map search form.
 * @constructor
 */
function LayerToggle(map, layer) {
  this.map = map;
  this.layer = layer;
  this.element = document.getElementById("search-form");
  this.checkbox = document.querySelector("#lakes-checkbox");
  this.checkboxLabel = this.checkbox.previousElementSibling;
  this.cardElements = document.querySelectorAll(".card");
  this.toggleName = 'Show all lakes';

  this.addSpinner = function () {
    this.checkboxLabel.innerHTML+=' <div class="spinner-border spinner-border-sm text-secondary"></div>';
  };

  this.removeSpinner = function () {
    this.checkboxLabel.innerHTML = this.toggleName;
  };

  this.toggleLayer = function () {
    if (this.checkbox.checked) {
      this.layer.addTo(this.map);
      lakeSearchLayer.bringToFront();
    } else {
      this.layer.remove(this.map);
    }
  };

  this.addToggleListeners = function () {
    this.checkbox.addEventListener("mousedown", () => this.addSpinner());
    this.checkbox.addEventListener("mouseup", () => this.removeSpinner());
    this.checkbox.addEventListener("click", () => this.toggleLayer()); 
  };

  this.addToggleListeners(); // automatically add listeners when MapForm is called
}

// /**
//  * 
//  * @param {MapFeature[]} mapFeatures Array of MapFeature objects
//  */
// function MapCards(mapFeatures, searchLayer) {
//   this.features = mapFeatures;
//   this.searchLayer = searchLayer;

//   /**
//    * Output descriptive card and card element for each feature
//    * @function
//    */
//   this.outputHtml = function () {
//     if (this.features.length > 0) {
//       const html = this.features.map(f => `
//         <div class="card card-body" style="cursor:pointer;">
//           <p>
//           <span class="text-primary">${f.properties.lagoslakeid}</span> 
//           ${f.properties.lake_namegnis} 
//           (${f.properties.lake_centroidstate})
//           </p>
//         </div>
//         `
//       )
//       .join('');
//       matchList.innerHTML = html;
//       this.cardElements = document.querySelectorAll(".card");
//     }
//   };

//   this.outputMarkers2 = function () {
//     const popup = function(layer) {
//       const name = layer.feature.properties.lake_namegnis;
//       const id = layer.feature.properties.lagoslakeid;
//       return `<b>Name:</b> ${name} <br><b>ID:</b> ${id}`
//       }
//     this.searchLayer.clearLayers();
//     L.geoJSON(this.features).bindPopup(popup).addTo(this.searchLayer);
//   };

//   this.addClickListeners = function() {
//     for (let i = 0; i < this.cardElements.length; i++) {
//       this.cardElements[i].addEventListener("click", () => {
//         this.features[i].zoomTo();
//         this.features[i].marker.openPopup();
//       })
//     }
//   };

//   // add all components when called
//   this.outputMarkers2();
//   this.outputHtml();
//   if (this.features.length > 0) {
//     this.addClickListeners();
//   }

// }

// /**
//  * Manage a feature on this map.
//  * @param {L.map} map Leaflet map object
//  * @param {Object} feature GeoJSON feature object
//  */
// class MapFeature {
//   constructor(inFeature) {
//     this.feature = inFeature;
//     this.properties = inFeature.properties;
//     this.geometry = inFeature.geometry;
//     this.type = inFeature.type;
//     this.latlng = L.latLng(inFeature.geometry.coordinates[1], inFeature.geometry.coordinates[0]);
//     this.popup = `${this.properties.lake_namelagos}`;
//     this.marker = L.marker(this.latlng).bindPopup(this.popup);
//   }
//   zoomTo() {
//     map.flyTo(this.latlng, 14);
//     this.marker.addTo(map);
//   }
//   inMapView() {
//     const mapBounds = map.getBounds();
//     return mapBounds.contains(this.latlng);
//   }
// }