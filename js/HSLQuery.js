
function queryStopData(stops) {
	
	var url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	var query = "{";
	
	for (var i = 0; i < stops.length; i++) {
		query += "q" + stops[i] + ": stops(name: \"" + stops[i] + "\") {" + 
	    "name " +
	    "code " +
	      "stoptimesWithoutPatterns {" +
	      "scheduledArrival " +
	      "realtimeArrival " +
	      "arrivalDelay " +
	      "scheduledDeparture " +
	      "realtime " +
	      "realtimeState " +
	      "serviceDay " +
	      "headsign " +
	      "trip {" +
	          "pattern {" +
	            "route {" +
	              "shortName " +
	              "type" +
	            "}" +
	          "}" +
	        "}" +
	      "} " +
	  "} ";
	}
	query += "}";
	
	return fetch(url, {
		  method: 'POST',
		  headers: {'Content-Type': 'application/graphql'},
		  body: query
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(response) {
		return formatStopJsonData(response);
	});
}

function queryStopsByCoordinates(lat, lon, rad) {
	var url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	var query = "{ " +
			  "stopsByRadius(lat:" + lat + " lon:" + lon + " radius:" + rad + ") {" +
				    "edges {" +
				      "node {" +
				        "stop {" +
				          "code" +
				        "}" +
				      "}" +
				    "}" +
				  "}" +
				"}";
	
	return fetch(url, {
		  method: 'POST',
		  headers: {'Content-Type': 'application/graphql'},
		  body: query
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(response) {
		return formatStopByCoordinatesJsonData(response);
	});
}

function formatStopJsonData(responseJSON) {
	var formattedData = [];
	var stopsList = responseJSON.data;
	var userStops = tizen.preference.getValue('stops').split(",");
	
	for(var i = 0; i < userStops.length; i++) {
		var stop = stopsList["q" + userStops[i]][0];
		var stopDeparturesList = stop.stoptimesWithoutPatterns;
		
		for(var j = 0; j < stopDeparturesList.length; j++) {
			formattedData.push({
				stopName: stop.name,
				stopCode: stop.code,
				realTimeArrival: stopDeparturesList[j].realtimeArrival,
				shortName: stopDeparturesList[j].trip.pattern.route.shortName,
				headsign: stopDeparturesList[j].headsign,
				realtime: stopDeparturesList[j].realtime,
				type: stopDeparturesList[j].trip.pattern.route.type
			});
		}
	}
	
	formattedData.sort(function(a, b) { 
	    return a.realTimeArrival - b.realTimeArrival;
	});
	return formattedData;
}

function formatStopByCoordinatesJsonData(responseJSON) {
	var formattedData = [];
	var stopsList = responseJSON.data.stopsByRadius.edges;
	
	for(var i = 0; i < stopsList.length; i++) {
		formattedData[i] = stopsList[i].node.stop.code;
	}
	
	return formattedData;
}