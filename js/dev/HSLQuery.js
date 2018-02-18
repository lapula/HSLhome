
export function queryStopData(stops) {
	let queryLoop = stops.map((name) => {
		return `q${name}: stops(name: "${name}") {
	    name
	    code
	      stoptimesWithoutPatterns {
	      scheduledArrival
	      realtimeArrival
	      arrivalDelay
	      scheduledDeparture
	      realtime
	      realtimeState
	      serviceDay
	      headsign
	      trip {
	          pattern {
	            route {
	              shortName
	              type
	            }
	          }
	        }
	      }
	  }`;
	});
	const query =
	`
		{
			${queryLoop.join(' ')}
		}
	`;
	return executeHslQuery(query).then((response) => {
		return formatStopJsonData(response, stops);
	});
}

export function queryStopToNameData(stops) {
	let queryLoop = stops.map((name) => {
		return `q${name}: stops(name: "${name}") {
	    name
	    code
	  }`;
	});
	const query =
	`
		{
			${queryLoop.join(' ')}
		}
	`;

	return executeHslQuery(query).then((response) => {
		return formatStopToNameJsonData(response, stops);
	});
}

export function queryStopsByCoordinates(lat, lon, rad) {
	const query =
	`
		{
			stopsByRadius(lat: ${lat}, lon: ${lon}, radius: ${rad}) {
				edges {
					node {
						stop {
							code
						}
					}
				}
			}
		}
	`;

	return executeHslQuery(query).then((response) => {
		return formatStopByCoordinatesJsonData(response);
	});
}

export function queryByCoordinates(lat, lon, rad) {
	const query =
	`
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
	`;

	return executeHslQuery(query).then((response) => {
		return formatStopByOnlyLocationJsonData(response);
	});
}

function executeHslQuery(query) {
	const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	return fetch(url, {
		  method: 'POST',
		  headers: {'Content-Type': 'application/graphql'},
		  body: query
	})
	.then((response) => {return response.json();})
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
	const stops = Object.keys(responseJSON.data).map(key => responseJSON.data[key]);;

	stops.forEach((location) => {
		const stopDeparturesList = location[0].stoptimesWithoutPatterns;
		let trips = stopDeparturesList.map((route) => {
			return {
				stopName: location[0].name,
				stopCode: location[0].code,
				realTimeArrival: route.realtimeArrival,
				shortName: route.trip.pattern.route.shortName,
				headsign: route.headsign,
				realtime: route.realtime,
				type: route.trip.pattern.route.type
			};
		});
		formattedData.push(...trips);
	});

	return formattedData;
}

function formatStopToNameJsonData(responseJSON, userStops) {
	let formattedData = [];
	const stops = Object.keys(responseJSON.data).map(key => responseJSON.data[key]);
	stops.forEach((location) => {
			let trip = {
				stopName: location[0].name,
				stopCode: location[0].code,
			};
		formattedData.push(trip);
	});

	return formattedData;
}

function formatStopByCoordinatesJsonData(responseJSON) {
	const stopsList = responseJSON.data.stopsByRadius.edges;

	let formattedData = stopsList.map((location) => {
		return location.node.stop.code;
	});

	return formattedData;
}
