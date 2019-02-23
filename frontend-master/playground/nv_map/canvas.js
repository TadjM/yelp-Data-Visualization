
var width = 960,
		height = 1000;

var mapURL = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/NV-32-nevada-counties.json";
var locationsURL = 'http://18.222.174.225:8080/api/populate_map';

var projection = d3.geoAlbersUsa()
// .center([-116.893588, 39.612884])
	.translate([2.5*width, height/1.5])
 .scale([6900]);

var canvas = d3.select('#map').append('canvas')
	.attr('height', height)
.attr('width', width);

var ctx = canvas.node().getContext('2d')

var path = d3.geoPath().projection(projection).context(ctx);
var circle = d3.geoCircle();

d3.json(mapURL).then(function(nv) {
		ctx.beginPath()
		path(topojson.feature(nv, nv.objects.cb_2015_nevada_county_20m))
		ctx.fillStyle = '#dcd8d2'
		ctx.fill()
		ctx.lineWidth = '2'
		ctx.stroke()

	//ctx.beginPath()
	//	ctx.arc(projection([-115.14, 36.1691])[0], projection([-115.14, 36.1691])[1], 10, 0, Math.PI*2, false)
	//	ctx.fillStyle = '#3388a7'
	//	ctx.fill()
	//	ctx.lineWidth = '50'
	//	ctx.strokeStyle = 'rgba(51, 136, 167, 0.2)'
	//	ctx.stroke()

	d3.json(locationsURL).then(function(locations) {
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
		console.log('locationArray', locationsArray);

		var pointcount = 0;
		locationsArray.forEach(function(point) {
			var latlong = point.slice(0,2);
			ctx.beginPath()
			ctx.arc(projection(latlong)[0], projection(latlong)[1], 1, 0, Math.PI*2, false)
			ctx.fillStyle = '#3388a7'
			ctx.fill()
			ctx.closePath()
			//ctx.lineWidth = '50'
			//ctx.strokeStyle = 'rgba(51, 136, 167, 0.2)'
			//ctx.stroke()
			pointcount += 1;
			console.log(pointcount);
		})

	});

})

