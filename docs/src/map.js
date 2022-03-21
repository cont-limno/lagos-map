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

  // TheNationalMap base layer
  tnmLink = "https://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WMSServer?";
  const usgsAttr = "<a href='https://www.usgs.gov/'>U.S. Geological Survey</a> | <a href='https://www.usgs.gov/laws/policies_notices.html'>Policies</a>";
  const tnmOpt = {
    layers: "0",
    format: "image/png",
    attribution: usgsAttr
  };
  
  // USGS Hydro Cached
  const hydroCachedLink = "https://basemap.nationalmap.gov/arcgis/services/USGSHydroCached/MapServer/WMSServer";
  const hydroCachedOpt = {
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
    
  // NLCD
  const nlcdLink = "https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms?";
  const nlcdAttr = "<a href='https://www.mrlc.gov/'>Multi-Resolution Land Characteristics (MRLC) Consortium</a>";
  const nlcdOpt = {
    layers: "mrlc_display:NLCD_2016_Land_Cover_L48",
    format: "image/png",
    transparent: true,
    attribution: nlcdAttr
  };

  // OSM
  const osmLink = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const osmAttr = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
  osmOpt = {
    attribution: osmAttr
  };
  
  // WBD
  const wbdLink = 'https://hydro.nationalmap.gov/arcgis/services/wbd/MapServer/WMSServer?';
  const wbdOpt = {
    layers: "2,3,4,5,6,7",
    format: "image/png",
    transparent: false,
    attribution: usgsAttr
  };

  // WQP
  //    layers: "wqp_sites:dynamicSites_2429643288, 
  //wqp_sites:dynamicSites_3888488612, qw_portal_map:fpp, qw_portal_map:nwis_sites, wqp_sites",

  const wqpLink = 'https://www.waterqualitydata.us/ogcservices/wms?';
  const wqpAttr = "<a href = 'https://www.waterqualitydata.us/orgs/'>Water Quality Portal (ARS, EPA, USGS)</a>"
  const wqpOpt = {
    layers: "qw_portal_map:nwis_sites",
    format: "image/png",
    transparent: true,
    attribution: wqpAttr
  };
    


  const tnmMap = L.tileLayer.wms(tnmLink, tnmOpt);
  const hydroCached = L.tileLayer.wms(hydroCachedLink, hydroCachedOpt);
  const nhdHigh = L.tileLayer.wms(nhdHighLink, nhdHighOpt);
  const nlcd = L.tileLayer.wms(nlcdLink, nlcdOpt);
  nlcd.setOpacity(0.5);
  // const osmMap = L.tileLayer(osmLink, osmOpt);
  const wbd = L.tileLayer.wms(wbdLink, wbdOpt);
  wbd.setOpacity(0.5);
  const wqp = L.tileLayer.wms(wqpLink, wqpOpt);


  // Call map and add base layers
  const map = L.map("mapdiv", config).setView([lat, lng], zoom);

  tnmMap.addTo(map);
  hydroCached.addTo(map);

  var baseLayers = {
    "The National Map": tnmMap
  };

  var overlays = {
    "NHD Medium": hydroCached,
    "NHD HR": nhdHigh,
    "NLCD": nlcd,
    // "Open Street Map": osm,
    "WBD Hydrologic Units" : wbd,
    "NWIS Sites" : wqp
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
 * Define layer pop-up content
 * @param {Object} feature GeoJSON feature object
 * @returns {string} Pop-up content
 */
function formatPopup(feature) {
  let { lagoslakeid,
    lake_nhdid,
    lake_namelagos,
    lake_centroidstate,
    lake_missingws,
    lake_elevation_m,
    lake_waterarea_ha,
    lake_connectivity_class} = feature.properties;
  if (!lake_namelagos) {
    lake_namelagos = '(Unnamed)'
  }
  return `
    <table>
    <tr>
      <th colspn="2"><h6 class="text-ocean">${lake_namelagos}</h6></th>
    <tr>
      <td><strong>lagoslakeid</strong></td>
      <td class="text-ocean">${lagoslakeid}</td>
    </tr>
    <tr>
      <td><strong>NHD Permanent_Identifier</strong></td>
      <td>${lake_nhdid}</td>
    </tr>
    <tr>
      <td><strong>State</strong></td>
      <td>${lake_centroidstate}</td>
    </tr>
    <tr>
      <td><strong>Missing watersheds?</strong></td>
      <td>${lake_missingws}</td>
    </tr>
    <tr>
      <td><strong>Elevation (m)</strong></td>
      <td>${lake_elevation_m}</td>
    </tr>
    <tr>
      <td><strong>Water area (ha)</strong></td>
      <td>${lake_waterarea_ha}</td>
    </tr>
    <tr>
      <td><strong>Maximum Connectivity</strong></td>
      <td>${lake_connectivity_class}</td>
    </tr>
    </table>
    `
}

/**
 * Define layer tooltip content
 * @param {Object} feature GeoJSON feature object
 * @returns {string} Tooltip content
 */
function formatTooltip(feature) {
  const {lake_namelagos, lagoslakeid} = feature.properties;
  return lake_namelagos ? lake_namelagos + " " + lagoslakeid : lagoslakeid;
}

/**
 * Define onEachFeature option for "all lakes" layer (lakesAllLayer)
 * @param {Object} feature GeoJSON feature
 * @param {L.Layer} layer Leaflet Layer instance
 */
function interactAllLakes(feature, layer) {
  // Define popups, tools
  layer.bindPopup(formatPopup(feature));
  layer.bindTooltip(formatTooltip(feature));

  // Set up listeners
  layer.on({
    mouseover: function(e) {
      e.target.setStyle({color:"cyan"})
      e.target.openTooltip()},
    mouseout: function(e) {
      allLakesLayer.resetStyle(e.target)
      e.target.closeTooltip()},
    click: function(e) {map.setView(e.target.getLatLng(), map.getZoom() + 2)}

  })
}

/**
 * Define onEachFeature for lake search results (lakeSearchLayer)
 * @param {Object} feature GeoJSON feature
 * @param {L.Layer} layer Leaflet Layer instance
 */
 function interactSearchedLakes(feature, layer) {
  const id = feature.properties.lagoslakeid;
  const name = feature.properties.lake_namelagos;
  const state = feature.properties.lake_centroidstate;

  layer.featureId = id;
  layer.bindPopup(formatPopup(feature));
  layer.bindTooltip(formatTooltip(feature));


   // make card with search hints that shows pointer like a link when you hover
   cardsHtml += `
   <div id="${id}" class="card card-body p-2 border-ocean" style="cursor:pointer;">
     <span class="text-ocean">${id}</span> 
     ${name} 
     (${state})
   </div>
  `
  //  MARKER event listeners
  layer.on({
    mouseover: function (e) {
      // highlight marker
      e.target.setStyle({color: "lightcyan", stroke: true, fillColor: "cyan"});
      e.target.bringToFront();
      e.target.openTooltip();
      // get side-bar card
      let elem = document.getElementById(e.target.featureId);
      elem.classList.add("bg-info");
    },
    mouseout: function (e) {
      allLakesLayer.resetStyle(e.target);
      e.target.closeTooltip();
      let elem = document.getElementById(e.target.featureId);
      elem.classList.remove("bg-info");
    },
    click: function (e) {
      // move card to top of list to ensure visibility
      map.panTo(e.target.getLatLng());
      let elem = document.getElementById(e.target.featureId);
      let matchList = elem.parentElement;
      matchList.insertBefore(elem, matchList.firstChild);
    }

  })
}