
mapboxgl.accessToken = 'pk.eyJ1IjoidmhvbmcwMDAiLCJhIjoiY2pvbjkxb3F1MG03azNsczhkY2tmcWlsdiJ9.-rdpqu4_9MXX_w6z35RE5A'
var locationsURL = 'http://18.222.174.225:8080/api/populate_map';

var map = new mapboxgl.Map({
	container: 'map',
	style: "mapbox://styles/mapbox/streets-v9",
	center: [-115.156770, 36.139770],
	zoom: 10,
	interactive: false,
})

map.scrollZoom.disable()
map.dragRotate.disable()
map.addControl(new mapboxgl.Navigation());

