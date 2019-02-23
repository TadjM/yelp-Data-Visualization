import React, { Component } from 'react';
import CartogramChart from './cartogramChart';
import HeatMap from './heatmap';
import heatData from './heat_data.js';
import NevadaMap from './nevadamap';
import { fetchMapData, fetchCartogramData, fetchHeatmapData } from './fetches';
import isEmpty from 'lodash/isEmpty';
import './App.css';

class ComboVis extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mapData: [],
			cartogramData: [],
			heatmapData: [],
			businessId: [],
			attributeName: [],
			selectedBusinessData: [],
			didFetchHeatMapData: false,
		}
		this.getMapData = this.getMapData.bind(this);
		this.getCartogramData = this.getCartogramData.bind(this);
		this.getHeatmapData = this.getHeatmapData.bind(this);
		this.setBusinessData = this.setBusinessData.bind(this);
		this.setBusinessId = this.setBusinessId.bind(this)
		this.setAttributeName = this.setAttributeName.bind(this);
	}

	componentDidMount() {
		this.getMapData();
	}

	getMapData() {
		fetchMapData().then(data => {
			this.setState({ mapData: data })
		})
	}

	getCartogramData(selected) {
		fetchCartogramData(selected).then(data => {
			this.setState({ cartogramData: data, didFetchHeatMapData: false })
		})
	}

	getHeatmapData(attributes) {
		fetchHeatmapData(attributes).then(data => {
			this.setState({ heatmapData: data })
		})
	}

	setBusinessData(data) {
		this.setState({
			selectedBusinessData: data
		})
	}

	setBusinessId(ids) {
		this.setState({
			businessId: ids
		})
	}

	setAttributeName(name) {
		this.setState({
			attributeName: name
		})
	}

	render() {
		const { mapData, cartogramData, heatmapData, businessId, selectedBusinessData } = this.state;
		const hasMapData = mapData && !isEmpty(mapData);
		const hasCartogramData = cartogramData && !isEmpty(cartogramData);
		const hasHeatmapData = heatmapData && !isEmpty(heatmapData);
		console.log(this.state)
		return (
			<div className=" container vis-container">
				<div id="map-container">
					{hasMapData ? (
						<NevadaMap data={mapData} callback={this.getCartogramData} setBusinessData={this.setBusinessData} setBusinessId={this.setBusinessId} />
					) : (<p>Loading...</p>)}
				</div>

				<div id="cartogram-container">
					{hasCartogramData ? (
						<CartogramChart data={cartogramData} callback={this.getHeatmapData} businessIds={businessId} setAttributeName={this.setAttributeName} />
					) : (null)}
				</div>
				<div id="heatmap-container">
					{hasHeatmapData ? <HeatMap data={heatmapData} mapData={selectedBusinessData} /> : null}
				</div>

				<p>
					The map of Nevada shown above is marked with all restaurants represented by the Yelp dataset.
					The user can select a section of the map by clicking the on the 'Draw' button and circling off a section of the map.
					Once selected, a bubble chart detailing attributes of the selected restaurants is generated. Clicking on the 'Draw' button again allows the user to manipulate the map instead of drawing.
					The cartogram represents the frequency with which each attribute appears for the restaurants in the area selected. By clicking on an attribute on the cartogram, a heat map will be generated.
					Clicking on the same attribute will deselect it.
				</p>
			</div>
		)
	}
}

export default ComboVis;
