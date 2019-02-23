
var temporal_url = 'http://18.222.174.225:8080/api/populate_map';

export const fetchMapData = () => {
	return fetch(temporal_url, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
		}
	}).then((response) => {
		if (response.status !== 200) {
			return Promise.reject({ message: "unable to fetch locations" });
		} else { return response.json(); }
	}).catch(error => {
		return error;
	})
}

var histogram_url = 'http://18.222.174.225:8080/api/attribute_histogram';
export const fetchCartogramData = (locations) => {
	return fetch(histogram_url, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(locations),
	}).then((response) => {
		if (response.status !== 200) {
			return Promise.reject({ message: "unable to fetch cartogram data" });
		} else { return response.json(); }
	}).catch(error => { return error; })
}

var correlation_url = 'http://18.222.174.225:8080/api/correlation';
export const fetchHeatmapData = (attributes) => {
	return fetch(correlation_url, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(attributes),
	}).then((response) => {
		if (response.status !== 200) {
			return Promise.reject({ message: "unable to fetch heatmap data" });
		} else { return response.json(); }
	}).catch(error => { return error; })
}
