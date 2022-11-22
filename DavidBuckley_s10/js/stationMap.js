
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.mapPosition = _mapPosition;
	L.Icon.Default.imagePath = 'icons/';
	this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
	var vis = this;
	vis.map = L.map('chicago-map').setView(vis.mapPosition, 12);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
   	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(vis.map);
	//L.marker([41.8789, 	-87.6359],{icon:L.icon({iconUrl:'icons/marker-blue.png', shadowUrl:'icons/marker-shadow.png', iconAnchor: [15, 35]})}).addTo(vis.map);
	var path = 'data/cta-lines.json'
	function styleElements(feature){
		switch (feature.properties.route_id) {
			case 'Red':          return"red" ;
			case 'P':       return "purple" ;
			case 'Y': return "yellow" ;
			case 'Blue':      return "blue" ;
			case 'Pink':      return"pink";
			case 'G':      return "green";
			case 'Brn':      return "brown";
			case 'Org':      return "orange";
		  }
	}
	$.getJSON(path, function(data) {
		// Work with data
		console.log(data)
		L.geoJson(data,{
			style: styleElements,
			weight: 10,
			fillOpacity: 1
		}).addTo(vis.map);
		data.features.forEach(element=>{
			if(element.geometry.type == 'Point'){
				L.marker([element.geometry.coordinates[0], 	element.geometry.coordinates[1]],{icon:L.icon({iconUrl:'icons/marker-blue.png', shadowUrl:'icons/marker-shadow.png', iconAnchor: [15, 35]})}).addTo(vis.map);
			}
			if(element.geometry.type == 'LineString'){
				L.polyline(
					element.geometry.coordinates,
					{color:styleElements(element)}
					
				  ).addTo(vis.map);
			}
		})
	 });
	vis.wrangleData();
	
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	vis.displayData = vis.data;
	console.log(vis.displayData);

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
	var vis = this;
	vis.data.forEach(element => {
		var url = 'https://gbfs.divvybikes.com/gbfs/en/station_status.json'
		// L.marker([, 	],{icon:L.icon({iconUrl:'icons/marker-blue.png', shadowUrl:'icons/marker-shadow.png', iconAnchor: [15, 35]})}).addTo(vis.map);
		var station;
		$.getJSON( url, (data) => {
			station = data.data.stations.find(station => station.station_id==element.station_id)
			L.circle([element.lat, element.lon], 50, {
				color: 'red',
				fillColor: 'red',
				fillOpacity: 1
			 }).addTo(vis.map).bindPopup(
				 `<strong>${element.name}</strong><br> Available bikes: ${station.num_bikes_available}<br> Available docks: ${station.num_docks_available}`
			);
		})
	});


}
