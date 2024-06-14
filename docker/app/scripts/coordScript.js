//Projekcijska zona
proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

function convert(easting, northing) {

    // Convert Gauss-Krüger to WGS84
    const wgs84Coordinates = proj4('EPSG:32633', 'EPSG:4326', [easting, northing]);
    const latitude = wgs84Coordinates[1];
    const longitude = wgs84Coordinates[0];

    return [latitude, longitude];
}

//console.log(convert(610645, 5028710))