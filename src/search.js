const idSearch = document.getElementById("id-search");
const nameSearch = document.getElementById("name-search");
const listSearch = document.getElementById("list-search");
const matchList = document.getElementById("match-list");

function makeFuses(data) {
  const namedData = data.filter(item => item.lake_namelagos != "NA");
  return {
    [idSearch.id]: new Fuse(data, {
      keys: ["properties.lagoslakeid", "properties.lake_nhdid", "properties.lake_reachcode"],
      distance: 0,
      includeScore: true,
    }),
    [nameSearch.id]: new Fuse(namedData, {
      keys: ["properties.lake_namegnis", "properties.lake_namelagos"], 
      includeScore: true})
  }
}

/**
 * Initialize fuse search objects
 * @param {Array[object]} data 
 * @returns Search function (closure)
 */
function makeSearch(data) {
  const fuseSearches = makeFuses(data);

  const searchData = function(searchText, searchType) {
    let matches, features, mapCards;
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

    // Insert cards HTML
    matchList.innerHTML = cardsHtml;
    cardsHtml = '';

    // Bind CARD event listeners to list items
    cardElems = document.getElementsByClassName("card");
    for (let i = 0; i < cardElems.length; i++) {
      cardElems[i].addEventListener("mouseover", function (e) {
        const layer = lakeSearchLayer.getLayers();
        layer[i].setStyle({color: "lightcyan", stroke: true, fillColor: "cyan"});
        cardElems[i].classList.add("bg-info");
      }, true);
      cardElems[i].addEventListener("mouseout", function (e) {
        const hoveredCardId = e.target.id;
        lakeSearchLayer.resetStyle(lakeSearchLayer.getLayer(hoveredCardId));
        cardElems[i].classList.remove("bg-info");
      }, true);
      cardElems[i].addEventListener("click", function (e) {
        const layer = lakeSearchLayer.getLayers();
        map.setView(layer[i].getLatLng(), map.getZoom() + 2);
        layer[i].openPopup();
      });
    }

  //   mapCards = new MapCards(mapFeatures, lakeSearchLayer);
  //   if (searchText.length == 0) {
  //     mapFeatures = [];
  //     matchList.innerHTML = '';
  //   }
  //   return(mapFeatures);
  // }
  }
  return searchData
}