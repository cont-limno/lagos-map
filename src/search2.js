const idSearch = document.getElementById("id-search");
const nameSearch = document.getElementById("name-search");
const listSearch = document.getElementById("list-search");
const matchList = document.getElementById("match-list");

function parseData(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      callback(results.data);
    }
  });
}

function idFuse(data) {
  const options = {
    keys: [
      "lagoslakeid", 
      "lake_nhdid",
      "lake_reachcode"
    ],
    // threshold: 0.5,
  };
  const index = Fuse.createIndex(options.keys, data);
  return new Fuse(data, options, index);
}

function nameFuse(data) {
  const options = {
    keys: [
      "lake_namegnis", 
      "lake_namelagos"
    ],
    // threshold: 0.5,
  };
  console.log("filtering data");
  const filteredData = data.filter(item => item.lake_namelagos != null);
  const index = Fuse.createIndex(options.keys, filteredData);
  return new Fuse(filteredData, options, index);
}

function listFuse(data) {
  const options = {
    keys: [
      "lagoslakeid",
    ],
    // threshold: 0.5,
  }

  const index = Fuse.createIndex(options.keys, data);
  return new Fuse(data, options, index);
}

function zoomToFeature(item) {
  let fLat = item.lat;
  let fLng = item.lng;
  map.flyTo([fLat, fLng], 14);
  console.log(lakeLayer);
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


function searchLakes(searchText, searchType) {
  let matches;
  parseData("data/lakes.csv", function(data) {
    switch (searchType) {
      case "id":
        const idSearch = idFuse(data);
        matches = idSearch.search(searchText).slice(0,20);
        break;
      case "name":
        const nameSearch = nameFuse(data);
        matches = nameSearch.search(searchText).slice(0,20);
        break;
      case "list":
        const listSearch = listFuse(data);
        matches = listSearch.search(searchText).slice(0,20);
    }
    if (searchText.length == 0) {
      matches = [];
      matchList.innerHTML = '';
    }

    outputHtml(matches);

  });
}

let timeout = null;
const typingDelay = 400; 
idSearch.addEventListener("focus", () => outputHtml([]));
nameSearch.addEventListener("focus", () => outputHtml([]));
listSearch.addEventListener("focus", () => outputHtml([]));
idSearch.addEventListener("input", () => searchLakes(idSearch.value, "id"));
nameSearch.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(searchLakes, typingDelay, nameSearch.value, "name");
});

listSearch.addEventListener("input", () => searchLakes(nameSearch.value, "list"));

