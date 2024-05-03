let regionTotal = {};
for(let i = 1; i <= 21; i++){
  regionTotal[i] = 0;
}
const regionKeys = {"MM": 1,"VP":2,"KK":3,"OB":4,"IS":5,"DN":6,"SM":7,"BP":8,"KR":9,"ZD":10,"VS":11,"SD":12,"VŽ":13,"KZ":14,"ZG":15,"PG":16,"ŠK":17,"LS":18,"BB":19,"GZ":20,"PS":21};
//console.log(regionKeys);
let citiesVisible = true;
let recordsVisible = true;
let records = [];
//regionTotal[3] = 5;
//regionTotal[9] = 15;
//regionTotal[15] = 40;
fetch('/records')
  .then(response => response.json())
  .then(data => {
    data.forEach(row => {
      if (row.Županija !== null && row.Županija !== undefined){
        const regionKey = regionKeys[row.Županija]
        if (regionKey !== undefined){
          regionTotal[regionKey] += 1;
        }
      }
      let coords = convert(row.GKE, row.GKN);
      records.push({
        "ID": row.ID,
        "Datum": row.Datum,
        "Županija": row.Županija,
        "Općina": row.Općina,
        "Naselje": row.Naselje,
        "GKN": row.GKN,
        "GKE": row.GKE,
        "lat": coords[0],
        "lon": coords[1] 
      });

      //for (let i = 0; i < records.length; i++) {
      //console.log(records[i]);
      //}
    });
    console.log(regionTotal)
  }).catch(error => {
    console.error('Error fetching data:', error);
  });




function toggleCities(){
  citiesVisible = !citiesVisible;
  console.log(citiesVisible)
  svg.selectAll(".city")
    .attr("visibility", citiesVisible ? "visible" : "hidden");
}

document.getElementById("toggleCitiesButton").addEventListener("click", toggleCities);

function toggleRecords(){
  recordsVisible = !recordsVisible;
  console.log(recordsVisible)
  svg.selectAll(".yellow-square")
    .attr("visibility", recordsVisible ? "visible" : "hidden");
}

document.getElementById("toggleRecordsButton").addEventListener("click", toggleRecords);




const width = window.innerWidth;//600;
const height = window.innerHeight;//600;

const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoMercator()
  .scale(5450)
  .center([16.5, 45.8])
  .translate([width / 2, height / 2 - 150]);

const path = d3.geoPath().projection(projection);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)



d3.json("../public/croatia.json").then(function(croatiaData) {
  // Draw the boundaries of Croatia
  //svg.selectAll(".country")
  //  .data(croatiaData.features)
  //  .enter()
  //  .append("path")
  //  .attr("class", "country")
  //  .attr("d", path)
  //  .attr("fill", "lightblue")
  //  .attr("stroke", "black");

  
  d3.json("../public/hr.json").then(function(regionsData) {
    
    svg.selectAll(".region")
      .data(regionsData.features)
      .enter()
      .append("path")
      .attr("class", "region")
      .attr("d", path)
      .attr("fill", d =>{
        const n = regionTotal[d.id];
        
        if (n === 0){
          return "springgreen";
        } else if (n < 10) {
          return "yellow";
        } else if (n < 25) {
          return "orange";
        } else if (n < 50) {
          return "red";
        } else if (n >= 50) {
          return "darkred";
        }
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      //.attr("id", d => "region-" + d.features.id)
      .on("mouseover", function(event, d){

        //console.log(d3.select(this).datum().properties.name);
        const podaci = d3.select(this).datum();
        //console.log(podaci);
        d3.select(this)
          //.attr("transform", "scale(1.05)")
          .attr("fill", "dodgerblue")
          .attr("stroke-width", 4);
          //.attr("stroke", "darkgreen")
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html("Županija: " + podaci.properties.name + "<br>"
          + "ID: " + podaci.id + "<br>"
          + "Broj zapisa: " + regionTotal[podaci.id])
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(){
        d3.select(this)
          //.attr("transform", null)
          .attr("stroke-width", 2)
          .attr("fill", d =>{
            const n = regionTotal[d.id];
            
            if (n === 0){
              return "springgreen";
            } else if (n < 10) {
              return "yellow";
            } else if (n < 25) {
              return "orange";
            } else if (n < 50) {
              return "orangered";
            } else if (n >= 50) {
              return "darkred";
            }
        })
          //.attr("stroke", "green");
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    
    d3.json("../public/hr_cities.json").then(function(citiesData) {
      // Draw the cities
      console.log("Number of cities:", citiesData.length);
      svg.selectAll(".city")
        .data(citiesData)
        .enter()
        .append("circle")
        .attr("class", "city")
        .attr("cx", d => projection([parseFloat(d.lng), parseFloat(d.lat)])[0])
        .attr("cy", d => projection([parseFloat(d.lng), parseFloat(d.lat)])[1])
        .attr("r", 3)
        .attr("fill", "red")
        .attr("stroke", "black")
        .on("mouseover", function(event, d){

          const podaci = d3.select(this).datum();
          //console.log(podaci);
          tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          tooltip.html("Grad: " + podaci.city)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
          d3.select(this)
            .attr("r", 5)
            .attr("fill", "maroon");
        })
        .on("mouseout", function(){
          d3.select(this)
            .attr("r", 3)
            .attr("fill", "red");
          tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        });

        

        function filterCity(){
          const searchText = document.getElementById("filterCity").value.toLowerCase();

          svg.selectAll(".city")
          .each(function(d){
            //console.log(d.city)
            const isVisible = d.city.toLowerCase().includes(searchText);
            d3.select(this).attr("visibility", isVisible ? "visible" : "hidden");
          });
        }
        //document.getElementById("filterCity").addEventListener("keyup", filterCity);

        


    });

    svg.selectAll(".yellow-square")
        .data(records)
        .enter()
        .append("rect")
        .attr("class", "yellow-square")
        .attr("x", d => projection([d.lon, d.lat])[0]) // Longitude corresponds to x
        .attr("y", d => projection([d.lon, d.lat])[1]) // Latitude corresponds to y
        .attr("width", 2) // Adjust width as needed
        .attr("height", 2) // Adjust height as needed
        .attr("fill", "yellow")
        .attr("stroke", "black")
        .attr("stroke-width", 0.125)
        //.attr("Naselje", d => d.Naselje)
        .on("mouseover", function(event, d) {
          const podaci = d3.select(this).datum();
          //console.log(podaci);
          tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
          tooltip.html("ID: " + podaci.ID + "<br>Naselje: " + podaci.Naselje)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
          d3.select(this)
            .attr("width", 3)
            .attr("height", 3)
            .attr("fill", "goldenrod");
        })
        .on("mouseout", function() {
            d3.select(this)
            .attr("width", 2)
            .attr("height", 2)
            .attr("fill", "yellow");
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .on("click", function () {
          const id = d3.select(this).datum().ID;
          window.location.href = `../details/${id}`;
        });

        function filterRecord(){
          const filterKey = document.getElementById("filterKey").value;
          const searchText = document.getElementById("filterRecord").value.toLowerCase();

          svg.selectAll(".yellow-square")
          .each(function(d){
            //console.log(filterKey, d[filterKey])
            let searchVal;
            if (!isNaN(d[filterKey])){
              searchVal = d[filterKey].toString();
            } else {
              searchVal = d[filterKey];
            }
            const isVisible = searchVal.toLowerCase().includes(searchText);
            d3.select(this).attr("visibility", isVisible ? "visible" : "hidden");
          });
        }
        document.getElementById("filterRecord").addEventListener("keyup", filterRecord);
        document.getElementById("filterKey").addEventListener("change", filterRecord);
        filterRecord()
  });
});


const zoom = d3.zoom()
    .scaleExtent([1, 64])
    .on("zoom", zoomed);
svg.call(zoom);
function zoomed(event) {
    svg.selectAll(".region, .city, .yellow-square")
    .attr("transform", event.transform);

}

//console.log("Map test: " + convert(610645, 5028710))


const zoomInButton = document.getElementById("zoomInButton");
const zoomOutButton = document.getElementById("zoomOutButton");

// Add event listeners to zoom buttons
zoomInButton.addEventListener("click", function() {
    zoom.scaleBy(svg.transition().duration(500), 2);
});

zoomOutButton.addEventListener("click", function() {
    zoom.scaleBy(svg.transition().duration(500), 0.5);
});