
var allData = [];

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();


function loadData() {
  // Divvy Bikes XML station feed

var url = 'https://gbfs.divvybikes.com/gbfs/en/station_information.json'

  // TO-DO: LOAD DATA

$.getJSON( url, (data) => {
  allData=data.data.stations
  $('#station-count').text(allData.length)
  createVis()
})


}


function createVis() {

  // TO-DO: INSTANTIATE VISUALIZATION
  var stationMap = new StationMap("station-map",allData,[41.8781, -87.6298]);
}