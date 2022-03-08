// const testData = [
//   {"lagoslakeid": "123", "lake_nhdid": "456", "lake_reachcode": "000", "lake_namegnis": "pond", "lake_namelagos": "pond", "longitude": "-80", "latitude": "42.5"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "pona", "lake_namelagos": "NA", "longitude": "-81", "latitude": "42.5"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "pondd", "lake_namelagos": "NA", "longitude": "-80", "latitude": "43.5"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "pon", "lake_namelagos": "NA", "longitude": "-82", "latitude": "40.5"}
// ];

// const testJson = toGeoJson(testData);


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

let allLakesLayer;
let cardsHtml = '';
const map = addMap();
let lakeSearchLayer = new L.GeoJSON().addTo(map) // add peristent reference to search layer to use in MapCards


searchableMap = function(parseResults) {

  // Data to GeoJSON
  const lakes = toGeoJson(parseResults.data).features;

  // Add allLakes Layer
  allLakesLayer = L.geoJSON(lakes, {
    pointToLayer: (point, latlng) => L.circleMarker(latlng, {radius: 2}),
    onEachFeature: interactAllLakes
  });
  
  // Add toggle button to side-bar form, turns allLakesLayer on/off
  const toggleButton = new LayerToggle(map, allLakesLayer);


  // Add lake data to search closure
  const searchLakes = makeSearch(lakes);

  // accept identifier and search immediately
  idSearch.addEventListener("input", () => searchLakes(idSearch.value, idSearch.id));

  // accept name and search after delay
  let timeout = null;
  nameSearch.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(searchLakes, 1000, nameSearch.value, nameSearch.id);
  }); 

  // // accept list of IDs and search after delay
  // listSearch.addEventListener("input", () => {
  //   clearTimeout(timeout);
  //   timeout = setTimeout(searchLakes, 1000, prepList(listSearch.value), listSearch.id);
  // }); 
}

Papa.parse("/data/lakes.csv", {
  // TODO: consider worker option
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: searchableMap
})
