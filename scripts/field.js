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
  const createPolygonBtn = document.getElementById("createPolygonBtn");
  if (createPolygonMode){
    polygonCoords = [];
    createPolygonBtn.classList.add("active");
    console.log("Creating polygon...")
  }

  else{
    markerLayer.clearLayers();
    createPolygonBtn.classList.remove("active");
    if (polygonCoords.length >= 3){
      polygonCoords.push(polygonCoords[0]);
      
      const formContent = `
        <p>Enter the details for this field:</p>
        <label for="actionInput">Action:</label>
        <input type="text" id="actionInput" name="action"><br>
        <label for="descriptionInput">Description:</label>
        <input type="text" id="descriptionInput" name="description"><br>
        <label for="colorInput">Color:</label>
        <input type="color" id="colorInput" name="color" value="#ff0000"><br>
        <button id="submitDetailsBtn">Submit</button>
      `;
      
      const popupOptions = { maxWidth: 300 };
      const polygonPopup = L.popup(popupOptions)
        .setLatLng(map.getBounds().getCenter())
        .setContent(formContent)
        .openOn(map);
      document.getElementById("submitDetailsBtn").addEventListener("click", function(){
        const action = document.getElementById("actionInput").value;
        const description = document.getElementById("descriptionInput").value;
        const color = document.getElementById("colorInput").value;

                if(!action || !description || !color){
                  alert("All fields are required!");
                  return;
                }

                map.closePopup(polygonPopup);
                console.log("Submitted details:", { action, description, color });
                // Add the polygon layer with the selected action
                const polygon = L.polygon(polygonCoords, {
                    color: "black",//colors[selectedAction],
                    fillColor: color,
                    fillOpacity: 0.5,
                    ID: null,
                    Opis: description,
                    Operacija: action
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
                  body: JSON.stringify({RecordID: rid, Vrhovi:vrhovi, Operacija:action, Opis: description, Color:color}),
                }).then(response => {
                  if(!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                }).then(data => {
                  polygon.options.ID = data.insertedID;
                  polygon.on('click', function(){
                      if(!createPolygonMode){
                        polygonDetails(data.insertedID, action, description, color);
                    }
                  });
                  console.log('Upload polja uspješan', data);
                }).catch(error => {
                  console.error('Error pri uploadu polja', error);
                });


                console.log(polygon);
            });
        
    } else {
      alert("Potrebna su barem 3 vrha za kreiranje polja! Crtanje polja prekinuto.  ")
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
    console.log(field);
    field.Vrhovi.split("-").forEach((coord) => {

      const pair = coord.split("|");
      //console.log(pair);
      coords.push([pair[0], pair[1]]);
    });

    const polygon = L.polygon(coords,{
      color:"black",
      fillColor: field.Color,
      fillOpacity: 0.5,
      ID: field.ID,
      Opis: field.Opis,
      Operacija: field.Operacija}).addTo(map);
    console.log(polygon);

    polygon.on('click', function(){
      if(!createPolygonMode){
        polygonDetails(field.ID, field.Operacija, field.Opis, field.Color);
      }
    });
    
  });
}

markerLayer.addTo(map);


function writePolygon() {
    // Create form elements

    let existingPanel = document.querySelector('.polygon-form-container');
    if (existingPanel) existingPanel.remove();

    const formContainer = document.createElement('div');
    formContainer.classList.add('polygon-form-container');

    const form = document.createElement('form');
    form.classList.add('polygon-form');

    const verticesContainer = document.createElement('div');
    verticesContainer.classList.add('vertices-container');

    const actionLabel = document.createElement('label');
    actionLabel.setAttribute('for', 'actionInput');
    actionLabel.textContent = 'Action:';
    const actionInput = document.createElement('input');
    actionInput.type = 'text';
    actionInput.id = 'actionInput';
    actionInput.name = 'action';

    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'descriptionInput');
    descriptionLabel.textContent = 'Description:';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'descriptionInput';
    descriptionInput.name = 'description';

    const colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'colorInput');
    colorLabel.textContent = 'Color:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'colorInput';
    colorInput.name = 'color';
    colorInput.value = '#ff0000';

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Submit';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';

    const addVertexButton = document.createElement('button');
    addVertexButton.type = 'button';
    addVertexButton.textContent = '+';
    addVertexButton.classList.add('add-vertex');

    const removeVertexButton = document.createElement('button');
    removeVertexButton.type = 'button';
    removeVertexButton.textContent = '-';
    removeVertexButton.classList.add('remove-vertex');

  // Add initial vertex inputs (minimum 3)
  for (let i = 0; i < 3; i++) {
    addVertexInput(verticesContainer);
  }

  // Append elements to the form
  form.appendChild(addVertexButton);
  form.appendChild(removeVertexButton);
  form.appendChild(verticesContainer);
  
  form.appendChild(actionLabel);
  form.appendChild(actionInput);
  form.appendChild(descriptionLabel);
  form.appendChild(descriptionInput);
  form.appendChild(colorLabel);
  form.appendChild(colorInput);
  form.appendChild(submitButton);
  form.appendChild(cancelButton);
  formContainer.appendChild(form);
  document.body.appendChild(formContainer);

  // Event listeners for form buttons
  addVertexButton.addEventListener('click', function () {
    addVertexInput(verticesContainer);
  });

  removeVertexButton.addEventListener('click', function () {
    removeVertexInput(verticesContainer);
  });

  submitButton.addEventListener('click', function () {
    const vertices = [];
    verticesContainer.querySelectorAll('.vertex-input').forEach(input => {
      const coords = input.value.split(',');
      if (coords.length === 2) {
        vertices.push([parseFloat(coords[0]), parseFloat(coords[1])]);
      }
    });

    const action = actionInput.value;
    const description = descriptionInput.value;
    const color = colorInput.value;

    if (vertices.length < 3 || !action || !description || !color) {
      alert("All fields are required and at least 3 vertices are needed!");
      return;
    }

    vertices.push(vertices[0]); // Close the polygon

    // Draw the polygon on the map
    const polygon = L.polygon(vertices, {
      color: "black",
      fillColor: color,
      fillOpacity: 0.5,
      ID: null,
      Opis: description,
      Operacija: action
    }).addTo(map);

    let vrhovi = vertices.slice(0, -1).map(coord => `${coord[0]}|${coord[1]}`).join('-');
    vrhovi += `-${vertices[0][0]}|${vertices[0][1]}`;

    // Send POST request
    fetch('/field', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ RecordID: rid, Vrhovi: vrhovi, Operacija: action, Opis: description, Color: color }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      polygon.options.ID = data.insertedID;
      polygon.on('click', function () {
        if (!createPolygonMode) {
          polygonDetails(data.insertedID, action, description, color);
        }
      });
      console.log('Field upload successful', data);
    }).catch(error => {
      console.error('Error uploading field', error);
    });

    formContainer.remove();
  });

  cancelButton.addEventListener('click', function () {
    formContainer.remove();
  });
}

function addVertexInput(container) {
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('vertex-input');
  input.placeholder = 'lat,lng';
  container.appendChild(input);
}

function removeVertexInput(container) {
  const inputs = container.querySelectorAll('.vertex-input');
  if (inputs.length > 3) {
    inputs[inputs.length - 1].remove();
  }
}





document.getElementById("createPolygonBtn").addEventListener("click", toggleCreate);
document.getElementById("writePolygonBtn").addEventListener("click", writePolygon);

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

function polygonDetails(ID, action, description, color) {
    let existingPanel = document.querySelector('.field-details-panel');
    if (existingPanel) existingPanel.remove();

    const detailsPanel = document.createElement('div');
    detailsPanel.classList.add('field-details-panel');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', function () {
        detailsPanel.remove();
    });

    const actionLabel = document.createElement('p');
    actionLabel.innerHTML = `Action: ${action}`;

    const descriptionLabel = document.createElement('p');
    descriptionLabel.innerHTML = `Description: ${description}`;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', function () {
        if (confirm("Are you sure you want to delete this field?")) {
            deleteField(ID);
            detailsPanel.remove();
            map.eachLayer(function (layer) {
                if (layer instanceof L.Polygon && layer.options.ID === ID) {
                    map.removeLayer(layer);
                }
            });
        }
    });
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.addEventListener('click', function(){
      detailsPanel.remove();
      editPolygon(ID, action, description, color)
    });
    
    detailsPanel.appendChild(closeButton);
    detailsPanel.appendChild(actionLabel);
    detailsPanel.appendChild(descriptionLabel);
    detailsPanel.appendChild(deleteButton);
    detailsPanel.appendChild(editButton);
    document.body.appendChild(detailsPanel);
}




const tooltip = L.DomUtil.create('div', 'custom-tooltip', map.getContainer());
tooltip.style.display = 'none';
tooltip.style.zIndex = 1000;
map.on('mousemove', function(e) {

    const lat = e.latlng.lat.toFixed(5);
    const lng = e.latlng.lng.toFixed(5);
    //console.log(lat, lng);
    tooltip.innerHTML = `Lat: ${lat}<br>Lng: ${lng}`;
    tooltip.style.display = 'block';
    tooltip.style.left = e.originalEvent.pageX + 'px';
    tooltip.style.top = e.originalEvent.pageY - 100 + 'px';
});

map.on('mouseout', function() {
    tooltip.style.display = 'none';
});


function editPolygon(ID, action, description, color) {
    let existingForm = document.querySelector('.edit-form-container');
    if (existingForm) existingForm.remove();

    // Create form elements
    const formContainer = document.createElement('div');
    formContainer.classList.add('edit-form-container');

    const form = document.createElement('form');
    form.classList.add('edit-form');

    const actionLabel = document.createElement('label');
    actionLabel.setAttribute('for', 'editActionInput');
    actionLabel.textContent = 'Action:';
    const actionInput = document.createElement('input');
    actionInput.type = 'text';
    actionInput.id = 'editActionInput';
    actionInput.name = 'action';
    actionInput.value = action;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'editDescriptionInput');
    descriptionLabel.textContent = 'Description:';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'editDescriptionInput';
    descriptionInput.name = 'description';
    descriptionInput.value = description;

    const colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'editColorInput');
    colorLabel.textContent = 'Color:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'editColorInput';
    colorInput.name = 'color';
    colorInput.value = color;

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Submit';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';

    // Append elements to the form
    form.appendChild(actionLabel);
    form.appendChild(actionInput);
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    form.appendChild(colorLabel);
    form.appendChild(colorInput);
    form.appendChild(submitButton);
    form.appendChild(cancelButton);
    formContainer.appendChild(form);
    document.body.appendChild(formContainer);

    // Event listeners for form buttons
    submitButton.addEventListener('click', function () {
        const updatedAction = actionInput.value;
        const updatedDescription = descriptionInput.value;
        const updatedColor = colorInput.value;

        if (!updatedAction || !updatedDescription || !updatedColor) {
            alert("All fields are required!");
            return;
        }

        // Update polygon properties on the map
        map.eachLayer(function (layer) {
            if (layer instanceof L.Polygon && layer.options.ID === ID) {
                layer.setStyle({
                    fillColor: updatedColor
                });
                layer.options.Operacija = updatedAction;
                layer.options.Opis = updatedDescription;

                layer.off('click');
                layer.on('click', function(){
                  if(!createPolygonMode){
                    polygonDetails(ID, updatedAction, updatedDescription, updatedColor);
                  }
                });
            }
        });

        // Send POST request to update the polygon in the database
        fetch('/fieldEdit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ID: ID, Operacija: updatedAction, Opis: updatedDescription, Color: updatedColor }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('Field update successful', data);
            formContainer.remove();
        }).catch(error => {
            console.error('Error updating field', error);
        });
    });

    cancelButton.addEventListener('click', function () {
        formContainer.remove();
    });
}


