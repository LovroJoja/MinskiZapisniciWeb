fields = [];
const rid = window.location.href.split("/")[4];
//console.log(rid);
let colors = {"Cleared":"green", "Investigating":"yellow", "Demining":"red"};

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

let polygonCoords = [];
let createPolygonMode = false;
let markerLayer = L.layerGroup();

function toggleCreate(){
  createPolygonMode = !createPolygonMode;

  if (createPolygonMode){
    polygonCoords = [];
    console.log("Creating polygon...")
  }

  else{
    markerLayer.clearLayers();
    
    if (polygonCoords.length >= 3){
      polygonCoords.push(polygonCoords[0]);
      const popupContent = `
        <p>What is the action in this field?</p>
        <button class="action-btn" data-action="Cleared" style="background-color: green;">Cleared</button>
        <button class="action-btn" data-action="Investigating" style="background-color: yellow;">Investigating</button>
        <button class="action-btn" data-action="Demining" style="background-color: red;">Demining</button>
      `;

      const popupOptions = { maxWidth: 300};
      
      const polygonPopup = L.popup(popupOptions)
        .setLatLng(map.getBounds().getCenter())
        .setContent(popupContent)
        .openOn(map);


      document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', function () {
                const selectedAction = this.getAttribute('data-action');
                console.log("Selected action:", selectedAction);

                // Remove the polygon popup
                map.closePopup(polygonPopup);

                // Add the polygon layer with the selected action
                const polygon = L.polygon(polygonCoords, {
                    color: "black",//colors[selectedAction],
                    fillColor: colors[selectedAction],
                    fillOpacity: 0.5,
                    ID: null
                    //action: selectedAction // Add custom property for action
                }).addTo(map);
                //console.log(polygon);
                let vrhovi = ""
                polygonCoords.slice(0, -1).forEach((coord) => {
                  vrhovi += String(coord[0]) + "|" + String(coord[1]) + "-";
                });
                vrhovi += String(polygonCoords[0][0]) + "|" + String(polygonCoords[0][1]);
                

                //send POST HERE
                fetch('/field', {
                  method:'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({RecordID: rid, Vrhovi:vrhovi, Akcija:selectedAction}),
                }).then(response => {
                  if(!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                }).then(data => {
                  polygon.options.ID = data.insertedID;
                  polygon.on('click', function(){
                      if(confirm("Želite li izbrisati odabrano polje?")){
                        deleteField(data.insertedID);
                        map.removeLayer(polygon);
                    }
                  });
                  console.log('Upload polja uspješan', data);
                }).catch(error => {
                  console.error('Error pri uploadu polja', error);
                });


                console.log(polygon);
            });
        });
    } else {
      alert("Potrebna su barem 3 vrha za kreiranje polja!")
    }
  }
}
map.on("click", function(e){
  if (createPolygonMode){
    polygonCoords.push([e.latlng.lat, e.latlng.lng]);
    const marker = L.circleMarker(e.latlng, iconOptions).addTo(markerLayer);
    
    }
});

function drawFields(){
  
  
  fields.forEach((field) =>{
    coords = [];
    field.Vrhovi.split("-").forEach((coord) => {

      const pair = coord.split("|");
      //console.log(pair);
      coords.push([pair[0], pair[1]]);
    });

    const polygon = L.polygon(coords,{
      color:"black",
      fillColor: colors[field.Akcija],
      fillOpacity: 0.5,
      ID: field.ID}).addTo(map);
    console.log(polygon);

    polygon.on('click', function(){
      if(confirm("Želite li izbrisati odabrano polje?")){
        deleteField(field.ID);
        map.removeLayer(polygon);
      }
    });
    
  });
}

markerLayer.addTo(map);
document.getElementById("createPolygonBtn").addEventListener("click", toggleCreate);

function deleteField(ID){
  fetch('/field', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json',},
    body: JSON.stringify({ID: ID}),    
  }).then(response => {
    if (!response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    console.log('Polje uspješno izbrisano', data);
  }).catch(error => {
    console.error('Greška pri brisanju polja', error);
  });
}