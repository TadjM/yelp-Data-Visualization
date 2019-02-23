
import React, {Component} from 'react';
import * as d3 from 'd3';

// dimensions

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

// var colors = ["#fb4934","#fe8019", "#d3869b", "#83a598", "#b8bb26"];
var colors = ["#fcd6d3", "#f8ada8", "#f15c4f", "#d32323", "#791900"];
var zScale = d3.scaleOrdinal()
	.range(colors);

var legendKeys = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];

var vAxisCall = d3.axisLeft()
	.ticks(10)

var hAxisCall = d3.axisBottom()

class TemporalChart extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.createChart();
  }

	componentDidUpdate(nextProps) {
		if (!nextProps.data) return null;
		this.updateChart();
	}

createChart() {
	var currentData = this.props.data;
	var keys = Object.keys(this.props.data[0]).slice(1, 6);

	xScale.domain(d3.range(this.props.data.length))
	zScale.domain(d3.range(keys.length));

	// tallest bar
	var yMax = d3.max(this.props.data.map(d => d.total));
	yScale.domain([0, yMax]);

	var svg = d3.select('#d3chart')
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
		.attr('width', 60).attr('height', 10)
		.style('fill', function(d, i) { return colors[i]; })

	legend.append('text')
		.attr('x', 70)
		.attr('y', 20)
		.text(function(d, i) { return d; })
	.style('text-anchor', 'start')

	///// STACK CHART /////
	var tooltip = d3.select('#d3chart').append('div')
		.attr('class', 'tooltip')
		.style('padding', '5px 10px')
		.style('position', 'absolute')
		.style('border', 'solid')
		.style('border-width', '2px')
		.style('background', '#fbf1c7')
	.style('opacity', 0)

	var stackData = d3.stack().keys(keys);

	var x_var = "month";
	keys.forEach(function(key, key_index) {

		var bar = svg.selectAll(".bar-" + key)
			.data(stackData(currentData)[key_index], function(d) { return d.data[x_var] + "-" + key; })

		var newBars = bar.enter().append('rect')
		.attr("class", function(d) { return "bar bar-" + key; })
		.attr('fill', zScale(key))
		.attr('width', xScale.bandwidth())
		.attr('height', 0)
		.attr('x', function(d, i) { return xScale(i) + margins.left; })
		.attr('y', height + margins.top)
		.on('mouseover', function(d,i) { // tooltip on mouse over
			tooltip.transition()
			.style('opacity', 1)
			tooltip.html('average: ' + parseFloat(currentData[i].average).toFixed(2))
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

		newBars.transition().duration(750)
		.attr('height', function(d) { return yScale(d[1]) - yScale(d[0]); })
		.attr('y', function(d) { return height + margins.top - yScale(d[1]); })

	})

	///// AXIS /////
 	var yGuideScale = d3.scaleLinear()
 		.domain([0, yMax])
 		.range([height, 0])

	vAxisCall.scale(yGuideScale)

 	svg.append('g')
	.attr('class', 'y-axis')
 	.attr('transform', `translate(${margins.left},${margins.top})`)
	.call(vAxisCall)

	var yAxisLabel = svg.append('text')
	.attr('x', -((height + margins.top)/2))
	.attr('y', 25)
	.style('text-anchor', 'middle')
	.text("Number of reviews")
	.attr('transform', 'rotate(270)')

	var xGuideScale = xScale.domain(this.props.data.map(d => d.month)) // set domain to the months

	hAxisCall.scale(xGuideScale)
	.tickValues(this.props.data.map(d => d.month))

	svg.append('g')
	.attr("class", "x-axis")
	.attr('transform', `translate(${margins.left}, ${height + margins.top})`)
	.call(hAxisCall)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("transform", "rotate(-65)")

	var xAxisLabel = svg.append('text')
		.attr('x', (width + margins.left + margins.right - 25)/2)
	.attr('y', height + margins.top + 70)
	.text('Months')

}

updateChart() {
	var currentData = this.props.data;

	var svg = d3.select('#d3chart').select('svg')

	var keys = Object.keys(currentData[0]).slice(1, 6);
	xScale.domain(d3.range(currentData.length))
	zScale.domain(d3.range(keys.length));

	console.log(xScale.domain())

	var yMax = d3.max(currentData.map(d => d.total));
	yScale.domain([0, yMax]);
 	var yGuideScale = d3.scaleLinear()
 		.domain([0, yMax])
 		.range([height, 0])
	vAxisCall.scale(yGuideScale)

	var y = svg.select('.y-axis')
	var newY = y.enter().append('g')
	.attr('class', 'y-axis')
	.attr('transform', `translate(${margins.left},${margins.top})`)
	y.merge(newY).transition().duration(750)
	.call(vAxisCall)

	///// STACK CHART /////
	var tooltip = d3.select('#d3chart').append('div')
		.attr('class', 'tooltip')
		.style('padding', '5px 10px')
		.style('position', 'absolute')
		.style('border', 'solid')
		.style('border-width', '2px')
		.style('background', '#fbf1c7')
	.style('opacity', 0)

	var stackData = d3.stack().keys(keys)

	var x_var = "month";

	keys.forEach(function(key, key_index) {
		var bar = svg.selectAll(".bar-" + key)
			.data(stackData(currentData)[key_index], function(d) { return d.data[x_var] + "-" + key; })

		bar.exit()
			.transition()
			.attr('height', 0)
			.attr('y', height + margins.top)
		.remove()

		var newBars = bar.enter().append('rect')
		.attr("class", function(d) { return "bar bar-" + key; })
		.attr('fill', zScale(key))
		.attr('width', xScale.bandwidth())
		.attr('height', 0)
		.attr('x', function(d, i) { return xScale(i) + margins.left; })
		.attr('y', height + margins.top)
		.on('mouseover', function(d,i) { // tooltip on mouse over
			tooltip.transition()
			.style('opacity', 1)
			tooltip.html('average: ' + parseFloat(currentData[i].average).toFixed(2))
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

		newBars.transition().duration(750)
		.attr('height', function(d) { return yScale(d[1]) - yScale(d[0]); })
		.attr('y', function(d) { return height + margins.top - yScale(d[1]); })

		bar.merge(bar)
		.attr('fill', zScale(key))
		.transition().duration(750)
		.attr('height', function(d) { return yScale(d[1]) - yScale(d[0]); })
		.attr('width', xScale.bandwidth())
		.attr('y', function(d) { return height + margins.top - yScale(d[1]); })
		.attr('x', function(d, i) { return xScale(i) + margins.left; })

	})

	var xGuideScale = xScale.domain(currentData.map(d => d.month))
	hAxisCall.scale(xGuideScale)
	.tickValues(currentData.map(d => d.month))

	var x = svg.select('.x-axis')
	var newX = x.enter().append('g')
	.attr('class', 'x-axis')
	.attr('transform', `translate(${margins.left}, ${height + margins.top})`)
	x.merge(newX).transition().duration(750)
	.call(hAxisCall)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("transform", "rotate(-65)")

}

  render() {
    return (
      <div id="d3chart" />
    )
  }
}

export default TemporalChart;
