
export function queryStopData(stops) {

	let url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	let query = "{";

	for (let i = 0; i < stops.length; i++) {
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
		return formatStopJsonData(response, stops);
	});
}

export function queryStopsByCoordinates(lat, lon, rad) {
	let url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	let query = "{ " +
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

export function queryByCoordinates(lat, lon, rad) {
	let url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	let query = `
	{
  stopsByRadius(lat: ${lat}, lon: ${lon}, radius: ${rad}) {
    edges {
      node {
        distance
        stop {
          name
          code
          stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            headsign
            trip {
              directionId
              pattern {
                route {
                  id
                  shortName
                  type
                }
              }
            }
          }
        }
      }
    }
  }
}
	`

	return fetch(url, {
		  method: 'POST',
		  headers: {'Content-Type': 'application/graphql'},
		  body: query
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(response) {
		return formatStopByOnlyLocationJsonData(response);
	});
}

function formatStopByOnlyLocationJsonData(responseJSON) {
	const stops = responseJSON.data.stopsByRadius.edges;
	let formattedData = [];
	stops.forEach((location) => {
		let trips = location.node.stop.stoptimesWithoutPatterns.map((route) => {
			return {
				stopName: location.node.stop.name,
				stopCode: location.node.stop.code,
				distance: location.node.distance,
				realTimeArrival: route.realtimeArrival,
				shortName: route.trip.pattern.route.shortName,
				headsign: route.headsign,
				realtime: route.realtime,
				type: route.trip.pattern.route.type,
				id: route.trip.pattern.route.id + "/" + route.trip.directionId,
			};
		})
		formattedData.push(...trips)
	});

	formattedData = formattedData.filter((obj, pos, arr) => {
		const objIndex = arr.map(mapObj => mapObj.id).indexOf(obj.id);
		return (objIndex === pos) || (objIndex === pos - 1);
	});

	return formattedData;
}

function formatStopJsonData(responseJSON, userStops) {
	let formattedData = [];
	let stopsList = responseJSON.data;
	console.log("1")
	console.log(stopsList)
	for(let i = 0; i < userStops.length; i++) {
		let stop = stopsList["q" + userStops[i]][0];
		let stopDeparturesList = stop.stoptimesWithoutPatterns;

		for(let j = 0; j < stopDeparturesList.length; j++) {
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

	/*formattedData.sort(function(a, b) {
	    return a.realTimeArrival - b.realTimeArrival;
	});*/
	return formattedData;
}

function formatStopByCoordinatesJsonData(responseJSON) {
	let formattedData = [];
	let stopsList = responseJSON.data.stopsByRadius.edges;

	for(let i = 0; i < stopsList.length; i++) {
		formattedData[i] = stopsList[i].node.stop.code;
	}

	return formattedData;
}
