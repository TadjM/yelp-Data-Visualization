import React, { Component } from 'react';
import * as d3 from 'd3';

class CartogramChart extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.createChart = this.createChart.bind(this);
		this.updateChart = this.updateChart.bind(this);
	}

	componentDidMount() {
		this.createChart();
		this.setState({
			attributes: [],
		});
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.data) return null;
		if (prevProps.data !== this.props.data) {
			this.updateChart();
		}
	}

	handleNodeClick(d, i, g) {

		const { callback, setAttributeName, businessIds } = this.props;
		var node = g[i];
		var selected = d3.select(node).select('circle').node();
		let attr = d3.select(node).select('title').text().split(': ');
		let attrJSON = { Name: attr[0], Count: parseInt(attr[1]) }
		let { attributes } = this.state;

		var inList = attributes.some(attr => {
			return JSON.stringify(attr) === JSON.stringify(attrJSON);
		})

		if (inList) {
			attributes = attributes.filter(att => JSON.stringify(att) !== JSON.stringify(attrJSON))
			this.setState({ attributes: attributes })
			d3.select(selected)
				.attr('stroke', '')
				const newAttributes = attributes.map((attribute)=>attribute.Name);
				const data2 = {
					attribute_names: newAttributes,
					business_ids: businessIds.business_ids
				}
			callback(data2);
		} else {
			attributes.push(attrJSON);
			this.setState({ attributes: attributes })
			d3.select(selected)
				.attr('stroke', '#000')
				.attr('stroke-width', '3px')
			const newAttributes = attributes.map((attribute)=>attribute.Name);
			const data2 = {
				attribute_names: newAttributes,
				business_ids: businessIds.business_ids
			}

			console.log(data2);


			callback(data2);
		}

		d3.event.stopPropagation();
	}

	createChart() {

		const { data, callback } = this.props;

		var diameter = 600;
		var color = d3.scaleOrdinal().range(d3.schemeCategory10);

		var bubble = d3.pack(data)
			.size([diameter, diameter])
			.padding(1.5);

		var svg = d3.select("#d3cartogram")
			.append("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.attr("class", "bubble");

		var nodes = d3.hierarchy(data)
			.sum(function (d) { return d.Count; });

		var node = svg.selectAll(".node")
			.data(bubble(nodes).descendants())
			.enter()
			.filter(function (d) {
				return !d.children
			})
			.append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node.append("title")
			.text(function (d) {
				return d.data.Name + ": " + d.data.Count;
			});

		node.append("circle")
			.transition().delay(200)
			.attr("r", function (d) {
				return d.r;
			})
			.style("fill", function (d, i) {
				return color(i);
			});

		node.append("text")
			.attr("dy", ".2em")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.data.Name.substring(0, d.r / 3);
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", function (d) {
				return d.r / 5;
			})
			.attr("fill", "white");

		node.append("text")
			.attr("dy", "1.3em")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.data.Count;
			})
			.attr("font-family", "Gill Sans", "Gill Sans MT")
			.attr("font-size", function (d) {
				return d.r / 5;
			})
			.attr("fill", "white");

		node.on("click", (d, i, g) => { this.handleNodeClick(d, i, g) })
		// node.on("click", handleClick)
		d3.select(this.frameElement)
			.style("height", diameter + "px");
	}

	updateChart() {

		this.setState({ attributes: [] });
		const { data, callback } = this.props;

		var diameter = 600;
		var svg = d3.select("#d3cartogram").select("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.attr("class", "bubble");

		// svg.selectAll('.node').transition().remove().select('circle').attr('r',0);
		svg.selectAll('.node').remove();

		var color = d3.scaleOrdinal().range(d3.schemeCategory10)

		var bubble = d3.pack(data)
			.size([diameter, diameter])
			.padding(1.5);

		var nodes = d3.hierarchy(data)
			.sum(function (d) { return d.Count; });

		var node = svg.selectAll(".node")
			.data(bubble(nodes).descendants())
			.enter()
			.filter(function (d) {
				return !d.children;
			})
			.append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});


		node.append("title")
			.text(function (d) {
				return d.data.Name + ": " + d.data.Count;
			});
		node.append("circle")
			.transition().delay(200).duration(200)
			.attr("r", function (d) {
				return d.r;
			})
			.style("fill", function (d, i) {
				return color(i);
			});

		node.append("text")
			.attr("dy", ".2em")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.data.Name.substring(0, d.r / 3);
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", function (d) {
				return d.r / 5;
			})
			.attr("fill", "white");

		node.append("text")
			.attr("dy", "1.3em")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.data.Count;
			})
			.attr("font-family", "Gill Sans", "Gill Sans MT")
			.attr("font-size", function (d) {
				return d.r / 5;
			})
			.attr("fill", "white");

		node.on("click", (d, i, g) => { this.handleNodeClick(d, i, g) });
		// node.on("click", handleClick)

		d3.select(this.frameElement)
			.style("height", diameter + "px");
	}

	render() {
		return (
			<div>
				<h3> </h3>
				<div id="d3cartogram" />
			</div>
		)
	}
}

export default CartogramChart;
