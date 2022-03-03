const idSearch = document.getElementById("id-search");
const nameSearch = document.getElementById("name-search");
const listSearch = document.getElementById("list-search");
const matchList = document.getElementById("match-list");


// const myData = [
//   {"lagoslakeid": "123", "lake_nhdid": "456", "lake_reachcode": "000", "lake_namegnis": "pond", "lake_namelagos": "pond"},
//   {"lagoslakeid": "321", "lake_nhdid": "666", "lake_reachcode": "001", "lake_namegnis": "NA", "lake_namelagos": "NA"}
// ];


function makeFuses(data) {
  const namedData = data.filter(item => item.lake_namelagos != "NA");
  return {
    [idSearch.id]: new Fuse(data, {keys: ["lagoslakeid", "lake_nhdid", "lake_reachcode"]}),
    [nameSearch.id]: new Fuse(namedData, {keys: ["lake_namegnis", "lake_namelagos"]})
  }
}

/**
 * Initialize fuse search objects
 * @param {Array[object]} data 
 * @returns Search function (closure)
 */
function makeSearch(data) {
  const fuseSearches = makeFuses(data);
  return function(searchText, searchType) {
    let matches;
    matches = fuseSearches[searchType].search(searchText).slice(0,20);
    console.log(matches);
    if (searchText.length == 0) {
      matches = [];
      matchList.innerHTML = '';
    }
    outputHtml(matches);
  }
}

function outputHtml(matches) {

  if (matches.length > 0) {
    const html = matches.map(match => `
      <div class="card card-body">
        <p>
        <span class="text-primary">${match.item.lagoslakeid}</span> 
        ${match.item.lake_namegnis} 
        (${match.item.lake_centroidstate})
        </p>
      </div>
      `
    )
    .join('');
    matchList.innerHTML = html;

    const cardElements = document.querySelectorAll(".card");
    for (let i = 0; i < cardElements.length; i++) {
      cardElements[i].addEventListener("click", () => zoomToFeature(matches[i].item))

    } 
  } else {
    matchList.innerHTML = "";
  }
}