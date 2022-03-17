// const testData = [
//   {"lagoslakeid": "123", "lake_nhdid": "456", "lake_reachcode": "000", "lake_namegnis": "pond", "lake_namelagos": "pond", "longitude": "-80", "latitude": "42.5"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "pona", "lake_namelagos": "NA", "longitude": "-81", "latitude": "42.5"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "pondd", "lake_namelagos": "NA", "longitude": "-80", "latitude": "43.5"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "pon", "lake_namelagos": "NA", "longitude": "-82", "latitude": "40.5"}
// ];

// const testJson = toGeoJson(testData);
let allLakesLayer;
let cardsHtml = '';
const map = addMap();
let lakeSearchLayer = new L.GeoJSON().addTo(map) // add peristent reference to search layer to use in MapCards

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



// EVENT LISTENERS: .card, delegated via #match-list
matchList.addEventListener("mouseover", function (e) {
  const card = e.target.closest('.card')
  if (card) {
    const layer = lakeSearchLayer.getFeatureLayer(card.id);
    layer.setStyle({color: "lightcyan", stroke: true, fillColor: "cyan"});
    card.classList.add("bg-info");
  }
}); // Hover on result .card: Highlight card and associated feature marker

matchList.addEventListener("mouseout", function (e) {
  const card = e.target.closest('.card');
  if (card) {
    const layer = lakeSearchLayer.getFeatureLayer(card.id);
    lakeSearchLayer.resetStyle(layer);
    card.classList.remove("bg-info");
  }
}); // Hover off result .card: Reset highlight on card on associated feature marker

matchList.addEventListener("click", function (e) {
  const card = e.target.closest('.card');
  if (card) {
    const layer = lakeSearchLayer.getFeatureLayer(card.id);
    map.setView(layer.getLatLng(), map.getZoom() + 2);
    layer.openPopup();
  }
}); // Click on result .card: Slight zoom to feature marker



// EVENT LISTENERS: #lakes-checkbox All lakes" toggle button
const toggle = document.querySelector("#lakes-checkbox");

toggle.addEventListener("click", function (e) {
  const toggle = e.target;
  if (toggle.checked) {
    allLakesLayer.addTo(map);
    allLakesLayer.bringToBack();
  } else {
    allLakesLayer.remove(map);
  }
}); // Click on "all lakes" toggle: Add/remove all lakes layer on map

toggle.addEventListener("mousedown", function (e) {
  const toggleLabel = e.target.previousElementSibling;
  const spinnerDiv = document.createElement("div");
  spinnerDiv.className = "spinner-border spinner-border-sm text-secondary";
  toggleLabel.appendChild(spinnerDiv);
}); // Mousedown on all lakes toggle: Start spinner while waiting for redraw of map

toggle.addEventListener("mouseup", function (e) {
  const toggleLabel = e.target.previousElementSibling;
  toggleLabel.removeChild(toggleLabel.querySelector("div"));
});  // Mouseup on all lakes toggle: Remove spinner when redraw finishes



const searchableMap = (fetchResults) => {
  // Data to GeoJSON
  const lakes = toGeoJson(fetchResults.data).features;

  // Assign allLakesLayer
  allLakesLayer = L.geoJSON(lakes, {
    pointToLayer: (point, latlng) => L.circleMarker(latlng, { radius: 2 }),
    onEachFeature: interactAllLakes
  });

  // Create searchLakes closure
  const searchLakes = makeSearch(lakes);

  // EVENT LISTENERS: Search form
  let timeout = null;
  searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("input", (e) => {
    let timeout = null;
    switch (e.target.id) {
      case "id-search": searchLakes(e.target.value, e.target.id);
      break;

      case "name-search":
        clearTimeout(timeout);
        timeout = setTimeout(searchLakes, 1000, e.target.value, e.target.id);
      break;

      case "list-search":
        clearTimeout(timeout);
        timeout = setTimeout(searchLakes, 500, e.target.value, e.target.id);
      break;

      default: // Do nothing
    }
  });

};

Papa.parse("/lagos-map/data/lakes.csv", {
  // TODO: consider worker option
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: searchableMap
})