import React, { Component } from 'react';
import * as d3 from 'd3';
// import ReactMapGL, { SVGOverlay } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { lasso } from 'd3-lasso';
import isEmpty from 'lodash/isEmpty';

class NevadaMap extends Component {
	constructor(props) {
		window["d3"] = d3;
		super(props);
		this.state = {
			selected: [],
		};
		this.createMap = this.createMap.bind(this);
	}

	componentDidMount() {
		this.createMap();
	}

	createMap() {

		const locations = this.props.data;
		const callback = this.props.callback;
		const setBusinessData = this.props.setBusinessData;
		const setBusinessId = this.props.setBusinessId
		mapboxgl.accessToken = 'pk.eyJ1IjoidmhvbmcwMDAiLCJhIjoiY2pvbjkxb3F1MG03azNsczhkY2tmcWlsdiJ9.-rdpqu4_9MXX_w6z35RE5A'

		const map = new mapboxgl.Map({
			container: 'map',
			style: "mapbox://styles/mapbox/streets-v9",
			center: [-115.156770, 36.139770],
			zoom: 10,
			// interactive: false
		})
		map.scrollZoom.disable();

		var container = map.getCanvasContainer();
		var svg = d3.select(container).append('svg')

		var active = false;

		map.addControl(new mapboxgl.NavigationControl());

		function project(d) {
			return map.project(getLL(d));
		}

		function getLL(d) {
			return new mapboxgl.LngLat(+d.longitude, +d.latitude)
		}

		var dots = svg.selectAll('circle.dot').data(locations);
		dots.enter()
			.append('circle')
			.classed('dot', true)
			.attr('r', 2)
			.attr('fill', 'red')

		// Lasso functions
		var lasso_start = function () {
			thislasso.items()
				.attr("r", 3.5) // reset size
				.classed("not_possible", true)
				.classed("selected", false);
		};

		var lasso_draw = function () {

			// Style the possible dots
			thislasso.possibleItems()
				.classed("not_possible", false)
				.classed("possible", true);

			// Style the not possible dot
			thislasso.notPossibleItems()
				.classed("not_possible", true)
				.classed("possible", false);

		};

		var lasso_end = function () {
			// console.log(thislasso.selectedItems()._groups[0][0].__data__);

			var business_array = thislasso.selectedItems()._groups[0].map(circle => {
				return circle.__data__.business_id;
			})
			var data = { business_ids: business_array };
			if (!isEmpty(business_array)) {
				console.log("business_ids", data)
				// setBusinessIds(data)
				setBusinessId(data)
				callback(data);
			}

			const business_data = thislasso.selectedItems()._groups[0].map(circle => {
				const returnVal = {
					business_id: circle.__data__.business_id,
					restaurant_name: circle.__data__.restaurant_name
				}
				return returnVal
			})
			//console.log("ReturnVal ", business_data)
			setBusinessData(business_data)

			// Reset the color of all dots
			thislasso.items()
				.classed("not_possible", false)
				.classed("possible", false);

			// Style the selected dots
			thislasso.selectedItems()
				.classed("selected", true)
				.attr("r", 3);

			// Reset the style of the not selected dots
			thislasso.notSelectedItems()
				.attr("r", 2);

		};

		var thislasso = lasso().items(dots).targetArea(svg)
		thislasso.on("start", lasso_start)
			.on("draw", lasso_draw)
			.on("end", lasso_end);

		function render() {
			var dots = svg.selectAll('circle.dot')

			dots.attr('cx', function (d) { return project(d).x; })
				.attr('cy', function (d) { return project(d).y; })

			if (active) {
				thislasso.items(dots).targetArea(svg)
				// thislasso.on("start", lasso_start)
				// 	.on("draw", lasso_draw)
				// 	.on("end", lasso_end);
				svg.call(thislasso);
			} else {
				d3.select('.lasso').remove();
				d3.select('svg').on('mousedown.drag', null)
			}
		}

		d3.select("#draw").on("click", function () {
			active = !active;
			if (active) {
				map.dragPan.disable();
				render();
			} else {
				map.dragPan.enable();
				render();
			}
			d3.select(this).classed("active", active)
		})

		map.on("viewreset", function () {
			render();
			d3.select('.lasso').remove();
		})
		map.on("move", function () {
			render();
			d3.select('.lasso').remove();
		})
		render();
	}

	render() {
		return (
			<div>
				<h3>Nevada Map</h3>
				<button id='draw'>Draw</button>
				<div id="map" />
			</div>
		);
	}
}

export default NevadaMap;
