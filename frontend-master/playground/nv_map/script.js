
var width = 960,
		height = 1000;

var mapURL = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/NV-32-nevada-counties.json";
var locationsURL = 'http://18.222.174.225:8080/api/populate_map';

var projection = d3.geoAlbersUsa()
	.translate([width/2, height/2])
	.scale([1000]);

var path = d3.geoPath().projection(projection);

var svg = d3.select('#map').append('svg')
	.attr('width', width)
	.attr('height', height);

svg.append('rect')
	.attr("class", "background") 
	.attr('width', width)
.attr('height', height);

var g = svg.append("g")

d3.json(mapURL)
	.then(function(nv) {

		var clark = nv.objects.cb_2015_nevada_county_20m.geometries[4];
		const filtered = {
			...nv.objects.cb_2015_nevada_county_20m,
			geometries: clark,
		} 
		console.log(nv);
		console.log(filtered);
		
		g.selectAll("path")
		// .data(topojson.feature(nv, nv.objects.cb_2015_nevada_county_20m.geometries).features)
			.data(topojson.feature(filtered).features)
			.enter().append("path")
			.attr("d", path)
			.attr("class", "feature")

		svg.append("path")
			.attr("d", path(topojson.mesh(nv, nv.objects.cb_2015_nevada_county_20m, function(a, b) { return a !== b; })))
			.attr("class", "borders")

	d3.json(locationsURL)
			.then(function(locations) {

				const aa = [locations[0].longitude, locations[0].latitude]
				const bb = [locations[1].longitude, locations[1].latitude]
				const locationsArray = locations.map(location => {
					return [
						location.longitude,
						location.latitude,
						location.restaurant_name,
						location.business_id,
					];
				})

				// console.log(projection(aa), projection(bb));
				g.selectAll('circle')
					.data(locationsArray).enter()
					.append('circle')
					.attr('cx', function(d) { return projection(d)[0]; })
					.attr('cy', function(d) { return projection(d)[1]; })
					.attr('r', '1px')
					.attr('fill', 'red')

			})
	})

