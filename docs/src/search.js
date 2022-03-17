const idSearch = document.getElementById("id-search");
const nameSearch = document.getElementById("name-search");
const listSearch = document.getElementById("list-search");
const matchList = document.getElementById("match-list");

function makeFuses(data) {
  return {
    [idSearch.id]: new Fuse(data, { // computed key
      keys: ["properties.lagoslakeid", "properties.lake_nhdid"],
      distance: 0,
      includeScore: true
    }),
    [nameSearch.id]: new Fuse(data, {
      keys: ["properties.lake_namelagos"], 
      includeScore: true
    })
  }
}

function prepList(listString) {
  if (listString.startsWith("c(") && listString.endsWith(")")) {
    var parsedString = listString
      .replace(/[\r\n\t]+/g, '') // remove all whitespace except spaces
      .replace(/['"]+/g, '') // remove quotes
      .substring(2, listString.length - 1)
      .split(',')
      .join(' =');
  } else {
    parsedString = listString
    .replace(/['"]+/g, '') // remove quotes
    .split(/\s+/g) // split on any whitespace
    .join(' ')
  }
  return parsedString;
}

/**
 * Initialize fuse search objects
 * @param {Array[object]} data 
 * @returns Search function (closure)
 */
function makeSearch(data) {
  const fuseSearches = makeFuses(data);

  /**
   * Define search event results and behavior.
   * @param {string} searchText Text to search
   * @param {string} searchType Type of search. ["id-search", "name-search", "list-search"]
   * @returns {function} Callback function to pass to event listener with data
   */
  const searchData = function(searchText, searchType) {
    // Get search results as JSON
    let matches, features;
    matchList.innerHTML = `<div class="spinner-border text-secondary"></div>`
    matches = fuseSearches[searchType]
      .search(searchText)
      .filter(item => item.score < 0.1)
    features = matches.map(item => data[item.refIndex]);

    // Make search results map layer
    lakeSearchLayer.clearLayers();
    lakeSearchLayer = L.geoJSON(features, {
      pointToLayer: (point, latlng) => L.circleMarker(latlng, {radius: 8, stroke: false, color: "cyan", fillOpacity: 0.9}),
      onEachFeature: interactSearchedLakes})
      .addTo(map)
      .bringToFront();
    lakeSearchLayer.getFeatureLayer = function(featureId) {
      return this.getLayers().filter(l => l.featureId === featureId)[0];
    };

    // Insert cards HTML
    matchList.innerHTML = cardsHtml;
    cardsHtml = '';



  }
  return searchData
}
