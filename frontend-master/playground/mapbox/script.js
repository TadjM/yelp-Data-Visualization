
mapboxgl.accessToken = 'pk.eyJ1IjoidmhvbmcwMDAiLCJhIjoiY2pvbjkxb3F1MG03azNsczhkY2tmcWlsdiJ9.-rdpqu4_9MXX_w6z35RE5A'
var locationsURL = 'http://18.222.174.225:8080/api/populate_map';

var map = new mapboxgl.Map({
	container: 'map',
	style: "mapbox://styles/mapbox/streets-v9",
	center: [-115.156770, 36.139770],
	zoom: 10,
	// interactive: false
})

// map.dragPan.disable()
map.scrollZoom.disable()
// map.dragRotate.disable()

// setup svg layer for d3
var container = map.getCanvasContainer()
var svg = d3.select(container).append('svg')

var active = false;
   
map.addControl(new mapboxgl.Navigation());

function project(d) {
	return map.project(getLL(d));
}
function getLL(d) {
	return new mapboxgl.LngLat(+d.longitude, +d.latitude)
}

d3.json(locationsURL)
	.then(function(locations) {
		// 		return locations.splice(0, 6);
		// 	}).then((locations) => {

		console.log(locations[0], getLL(locations[0]), project(locations[0]))

		var dots = svg.selectAll('circle.dot').data(locations);
		dots.enter()
			.append('circle')
			.classed('dot', true)
			.attr('r', 2)
			.attr('fill', 'red')
			
		function render() {
			// svg.remove();
			// var svg = d3.select(container).append('svg')
			var dots = svg.selectAll('circle.dot')

			dots.attr('cx', function(d) { return project(d).x; })
			.attr('cy', function(d) { return project(d).y; })

			// Lasso functions
			var lasso_start = function() {
					lasso.items()
						.attr("r",3.5) // reset size
						.classed("not_possible",true)
						.classed("selected",false);
			};

			var lasso_draw = function() {

				// Style the possible dots
				lasso.possibleItems()
					.classed("not_possible",false)
					.classed("possible",true);

				// Style the not possible dot
				lasso.notPossibleItems()
					.classed("not_possible",true)
					.classed("possible",false);

			};

			var lasso_end = function() {
				console.log(lasso.selectedItems()._groups[0][0].__data__);
				var data = lasso.selectedItems()._groups[0].map(circle => {
					return circle.__data__.business_id;
				})
				console.log(data);
				// Reset the color of all dots
				lasso.items()
					.classed("not_possible",false)
					.classed("possible",false);

				// Style the selected dots
				lasso.selectedItems()
					.classed("selected",true)
					.attr("r",3);

				// Reset the style of the not selected dots
				lasso.notSelectedItems()
					.attr("r",2);
			};

			var lasso = d3.lasso()
					.closePathSelect(true)
					.closePathDistance(100)
					.items(dots)
					.targetArea(svg)

			if(active) {
				lasso.on("start", lasso_start)
					.on("draw",lasso_draw)
					.on("end",lasso_end);
				svg.call(lasso);
			} else {
				d3.select('.lasso').remove();
				d3.select('svg').on('mousedown.drag', null)
			}
		}

		d3.select("#draw").on("click", function() {
			active = !active;
			if(active) {
				map.dragPan.disable();
				render();
			} else {
				map.dragPan.enable();
				render();
			}
			d3.select(this).classed("active", active)
		})
    
		map.on("viewreset", function() { render(); })
		map.on("move", function() { render(); })
		render();

	})

