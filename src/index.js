function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

console.log(isValidHttpUrl("http://localhost:8000/data/extract_1000.csv"))
console.log(isValidHttpUrl("../data/extract_1000.csv"))

Papa.parse("http://localhost:8000/data/extract_1000.csv", {
  worker: true,
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: results => {
    const searchLakes = makeSearch(results.data);
    mapData(results.data);
    
    // accept identifier and search immediately
    idSearch.addEventListener("input", () => searchLakes(idSearch.value, idSearch.id));

    // accept name and search after delay
    let timeout = null;
    nameSearch.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(searchLakes, 400, nameSearch.value, nameSearch.id);
    }); 

  }
})