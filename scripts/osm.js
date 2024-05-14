let records = [];




let mapOptions = {
	center:[45, 16],
	zoom:8
}

let map = new L.map('map', mapOptions);
let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'); 
map.addLayer(layer);

let customIcon = {
	iconUrl:"",
	iconSize: [40, 40]
}
//let myIcon = L.icon(customIcon);
//let myIcon = L.divIcon();
let iconOptions = {
	color: 'red',
	fillcollor:'red',
	fillOpacity:1,
	radius:4
}
let hoverIconOptions = {
    color: 'purple', 
    fillColor: 'red',
    fillOpacity: 1,
    radius: 5 
};




//let marker = L.circleMarker([45, 15], iconOptions).bindTooltip("Hello");
//let marker2 = L.circleMarker([45.40315909820226, 16.41380354623487], iconOptions).bindTooltip("Hello");
//marker.addTo(map);
//marker2.addTo(map);
//marker.bindPopup("content").openPopup();

//let popup = L.popup().setLatLng([45, 15] ).setContent("<p>new popup</br> more complicated</p>").openOn(map);
function increaseMarkerSize(e) {
    let marker = e.target;
    marker.setStyle(hoverIconOptions); // Increase radius on hover
}

// Function to reset marker size after hover
function resetMarkerSize(e) {
    let marker = e.target;
    marker.setStyle(iconOptions); // Reset radius after hover
}



// Add event listeners to each marker
//marker.on('mouseover', increaseMarkerSize);
//marker.on('mouseout', resetMarkerSize);
//marker2.on('mouseover', increaseMarkerSize);
//marker2.on('mouseout', resetMarkerSize);

// Fetch data from the server
fetch('/records')
  .then(response => response.json())
  .then(data => {
    // Process each row of data
    data.forEach(row => {
      // Convert geographic coordinates and push processed record into records array
      let coords = convert(row.GKE, row.GKN);
      records.push({
        "ID": row.ID,
        "Datum": row.Datum,
        //"Županija": row.Županija,
        //"Općina": row.Općina,
        "Naselje": row.Naselje,
        "GKN": row.GKN,
        "GKE": row.GKE,
        "lat": coords[0],
        "lon": coords[1] // Corrected assignment operator
      });
    });
    
    // Add markers to the map for each record
    records.forEach(record => {
      const lat = record.lat;
      const lon = record.lon;
      const marker = L.circleMarker([lat, lon], iconOptions).bindTooltip(`ID: ${record.ID}` + '<br>' + `Naselje: ${record.Naselje}`);
      marker.addTo(map);
      marker.on('mouseover', increaseMarkerSize);
      marker.on('mouseout', resetMarkerSize);
      marker.on("click", handleClick);
    });
    filterRecord();
    console.log(records)
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function handleClick(e) {
    const tooltipContent = e.target.getTooltip().getContent();
    const id = tooltipContent.split(':')[1].split('<')[0].trim();

    const existingDetailsPanel = document.querySelector('.details-panel');
        if (existingDetailsPanel) {
            existingDetailsPanel.remove();
        }
    fetch(`/map_details/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetch log:", data.ID)
      

    // Create a new div element
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details-panel');
    
    // Add ID text to the div
    detailsDiv.innerHTML = `ID: ${id}<br>GKZona: ${data.GKZona}<br>GKN: ${data.GKN}<br>GKE: ${data.GKE}
                            <br>UNSektor: ${data.UNSektor}<br>OznakaUN: ${data.OznakaUN}<br>
                            Oznaka: ${data.Oznaka}<br>Županija: ${data.Županija}<br>Općina: ${data.Općina}
                            <br>Naselje: ${data.Naselje}<br>VojskaID: ${data.VojskaID}
                            <br>Datum: ${data.Datum}<br>POM: ${data.POM}<br>PPM: ${data.PPM}
                            <br>Ostala: ${data.Ostala}<br>Provjere: ${data.provjere}<br>Tip polja: ${data.TipPolja}`;
   // const divText = document.createTextNode(`ID: ${id}\nHey`);
    //detailsDiv.appendChild(divText);


    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', function() {
        detailsDiv.remove();
    });

    const openFieldButton = document.createElement('button');
        openFieldButton.innerHTML = 'Detalji područja';
        openFieldButton.classList.add('open-field-button');
        openFieldButton.addEventListener('click', function() {
            window.open(`/field/${id}`, '_blank');
        });
    
    // Append the close button to the details div
    detailsDiv.appendChild(closeButton);
    detailsDiv.appendChild(openFieldButton);
    
    // Add the details div to the left side of the map
    document.body.appendChild(detailsDiv);
    }).catch(error => {console.error('Error fetching data:', error)});
}
function filterRecord(){
  const searchText = document.getElementById("filterRecord").value.toLowerCase();
  const filterKey = document.getElementById("filterKey").value;
  map.eachLayer(function(layer){
    if (layer instanceof L.CircleMarker){
      map.removeLayer(layer);
    }
  });

  const filteredRecords = records.filter(record => record[filterKey].toString().toLowerCase().includes(searchText));
  filteredRecords.forEach(record => {
    const lat = record.lat;
    const lon = record.lon;
    const marker = L.circleMarker([lat, lon], iconOptions).bindTooltip(`ID: ${record.ID}` + '<br>' + `Naselje: ${record.Naselje}`);
    marker.addTo(map);
    marker.on('mouseover', increaseMarkerSize);
    marker.on('mouseout', resetMarkerSize);
    marker.on("click", handleClick);
  });
}
document.getElementById("filterRecord").addEventListener("keyup", filterRecord);
document.getElementById("filterKey").addEventListener("change", filterRecord);



function logClick(e){
  console.log("Clicked coordinates:", e.latlng.lat, e.latlng.lng);
}

map.on('click', logClick);