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

// Call map
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


// //---CSV METHOD: FASTER FOR NOW (2/25)--------------------------------------------------------------------------------
// Parse lakes CSV
function toGeoJson(json) {
  const PointFeatureArray = json.map(
    row =>  {
      return {
        "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [row.longitude * 1, row.latitude * 1]
      },
      "properties": row
      }
    }
  );
  return {
    "type": "FeatureCollection",
    "features": PointFeatureArray
  }
}

parseData("data/extract_1000.csv", function(result) {
  // Add lakes to map
  lakePts = toGeoJson(result);
  lakeLayer = L.geoJSON(lakePts, {
      pointToLayer: (point, latlng) => {
        return L.circleMarker(latlng, {radius: 2});
      }
    })
    .bindPopup(layer => {
      popupContent = '<b>Name:</b>' + layer.feature.properties.lake_namegnis + '<br><b>ID:</b>' + layer.feature.properties.lagoslakeid;
      return popupContent;
    });
  
  // Toggle all lakes on or off
  function highlightToggle(e) {
    e.target.previousElementSibling.className="text-light";
    e.target.previousElementSibling.innerHTML+=' <div class="spinner-border spinner-border-sm"></div>';
  }
  
  function resetHighlight(e) {
    e.target.previousElementSibling.classList.remove("text-light");
    e.target.previousElementSibling.innerHTML = 'Show all lakes';
  }

  function toggleLakes(e) {
    if (e.target.checked) {
      lakeLayer.addTo(map);
    } else {
      lakeLayer.remove(map);
    }
  }

  var lakesCheckbox = document.querySelector("#lakes-checkbox");
  lakesCheckbox.addEventListener("mousedown", highlightToggle);
  lakesCheckbox.addEventListener("mouseup", resetHighlight);
  lakesCheckbox.addEventListener("click", toggleLakes);

});  