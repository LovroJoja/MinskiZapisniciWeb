console.log('hi');

const width = 975;
const height = 610;

// Load the JSON data asynchronously
d3.json('./states-albers-10m.json').then(function(us) {
    const path = d3.geoPath();
    const svg = d3.create('svg')
        .attr('height', height)
        .attr('width', width);

    // Append the background path
    const statesBackground = svg.append('path')
        .attr('fill', '#ddd')
        .attr('d', path(topojson.feature(us, us.objects.nation)));

	const statesBorders = svg.append('path')
		.attr('fill', 'none')
		.attr('stroke', '#fff')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-linecap', 'round')
		.attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a!== b)));    
    // Append the SVG to the document body
    document.body.appendChild(svg.node());
}).catch(function(error) {
    console.error('Error loading JSON:', error);
});

	

