
///// DIMENSIONS /////

var margins = {
	left: 60,
	right: 30,
	top: 60,
	bottom: 100,
};

var width = 920 - margins.left - margins.right,
	height = 620 - margins.top - margins.bottom,
	barWidth = 20,
	barOffset = 5;

///// CHART DATA /////
var xScale = d3.scaleBand()
	.range([0, width])
	.padding(.2);

var yScale = d3.scaleLinear()
	.range([0, height])

var colors = ["#fb4934","#fe8019", "#d3869b", "#83a598", "#b8bb26"];
var zScale = d3.scaleOrdinal()
	.range(colors);

var legendKeys = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];

///// RENDER CHART /////
function createVis(data) {

	///// UPDATE DATA (TEMP) /////
	var changeVis = function() {
		d3.select("#visual").select("svg").remove();
		d3.select("#visual").select(".tooltip").remove();

		d3.json("http://localhost:8080/api/temporal/?res=Towne%20Tavern_2000%20Hwy%20160%20W&start_date=2015-04&months=4")
			.then(function(data) {
			createVis(data);
		});
	}

	var keys = Object.keys(data[0]).slice(1, 6);

	xScale.domain(d3.range(data.length))
	zScale.domain(d3.range(keys.length));

	// tallest bar
	var yMax = d3.max(data.map(d => d.total));
	yScale.domain([0, yMax]);
 
	var svg = d3.select('#visual')
		.append('svg')
		.attr('width', width + margins.left + margins.right)
		.attr('height', height + margins.top + margins.bottom)
		.style('background', '#fbf1c7')

	///// LEGEND /////
	var keyLength = 0;
	var legend = svg.selectAll('.legend')
	.data(legendKeys).enter().append('g')
	.attr('class', 'legend')
		.attr('transform', function(d, i) {
			if (i === 0) {
				keyLength = d.length + 150;
				return "translate(80,0)";
			} else {
				var newKeyLength = keyLength;
				keyLength += d.length + 150;
				return "translate(" + (newKeyLength + 80) + ",0)";
			}
		})

	legend.append('rect')
		.attr('x', 0).attr('y', 10)
		.attr('width', 30).attr('height', 10)
		.style('fill', function(d, i) { return colors[i]; })

	legend.append('text')
		.attr('x', 40)
		.attr('y', 20)
		.text(function(d, i) { return d; })
	.style('text-anchor', 'start')

	///// STACK CHART /////
	var g = svg.append('g');

	var stackData = d3.stack().keys(keys)(data);
	var stacks = g.selectAll('.stacks')
		.data(stackData).enter().append('g') // for series
		.attr('fill', (d,i) => zScale(i))

	var tooltip = d3.select('#visual').append('div')
		.attr('class', 'tooltip')
		.style('padding', '5px 10px')
		.style('position', 'absolute')
		.style('border', 'solid')
		.style('border-width', '2px')
		.style('background', '#fbf1c7')
	.style('opacity', 0)

	var bars = stacks.selectAll('rect')
			.data(d => d).enter().append('rect')
			.attr('width', xScale.bandwidth())
			.attr('height', function(d) { return yScale(d[1]) - yScale(d[0]); })
			.attr('x', function(d, i) { return xScale(i) + margins.left; }) 
			.attr('y', function(d) { return height + margins.top - yScale(d[1]); }) 
			.on('mouseover', function(d,i) { // tooltip on mouse over
				tooltip.transition()
				.style('opacity', 1)
				tooltip.html('average: ' + parseFloat(data[i].average).toFixed(2))
					.style('left', (d3.event.pageX - 70) + 'px')
					.style('top', (d3.event.pageY - 40) + 'px')//(405) + 'px')
				d3.select(this)
					.transition()
				.style('opacity', 1)
			})
		.on('mouseout', function(d) { 
			tooltip.transition()
			.style('opacity', 0)
		})
		.on('click', function() {
			changeVis();
		})
		
	///// AXIS /////
 	var yGuideScale = d3.scaleLinear()
 		.domain([0, yMax])
 		.range([height, 0])
 
 	var vAxis = d3.axisLeft(yGuideScale)
 		.ticks(10)
 
 	var vGuide = svg.append('g')
 	vAxis(vGuide)
 	vGuide.attr('transform', `translate(${margins.left},${margins.top})`)

	var yAxisLabel = svg.append('text')
	.attr('x', -((height + margins.top)/2))
	.attr('y', 25)
	.style('text-anchor', 'middle')
	.text("Number of reviews")
	.attr('transform', 'rotate(270)')

	xScale.domain(data.map(d => d.month)) // set domain to the months
	var hGuide = g.append('g')
	.attr("class", "axis")	
	.attr('transform', `translate(${margins.left}, ${height + margins.top})`)
			.call(d3.axisBottom(xScale)
				.tickValues(data.map(d => d.month)))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("transform", "rotate(-65)")

	var xAxisLabel = svg.append('text')
		.attr('x', (width + margins.left + margins.right - 25)/2)
	.attr('y', height + margins.top + 70)
	.text('Months')

}

// INITIAL DATA
		d3.json("http://localhost:8080/api/temporal/?res=Towne%20Tavern_2000%20Hwy%20160%20W&start_date=2015-04&months=4")
	.then(function(data) {

	createVis(data);
});

