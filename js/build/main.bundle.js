/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HSLQuery_js__ = __webpack_require__(1);


function getStopData() {
		document.getElementById("refresh_time").style.backgroundColor = "#FED100";
		if (tizen.preference.getValue('gps')) {
			getLocationStopData();
		} else {
			console.log(2)
			getStopDataWithoutLocation(false);
		}
}

function getLocationStopData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getStopDataFromLocation, errorCallback,
                                                 {maximumAge:60000, timeout:15000});
    } else {
        console.log('Geolocation is not supported.');
    }
}

function getStopDataFromLocation(position) {
		var stops = tizen.preference.getValue('stops').split(",");
		console.log("l: " + tizen.preference.getValue('stops').length)

    Promise.all([__WEBPACK_IMPORTED_MODULE_0__HSLQuery_js__["b" /* queryStopData */](stops),
                 __WEBPACK_IMPORTED_MODULE_0__HSLQuery_js__["c" /* queryStopsByCoordinates */](position.coords.latitude,
				                		 position.coords.longitude,
				                		 tizen.preference.getValue('stopSearchRadius'))
                ]).then(function(values) {

    	var arrivalTimes = values[0];
    	var stopFilters = values[1];
    	var filteredStops = [];

	    for(var i = 0; i < arrivalTimes.length; i++) {
	    	if (stopFilters.includes(arrivalTimes[i].stopCode)) {
	    		filteredStops.push(arrivalTimes[i]);
	    	}
	    }
	    setListItems(filteredStops);
	});

}

function getStopDataWithoutLocation(forHome) {
	var stops = forHome ? tizen.preference.getValue('home').split(",") : tizen.preference.getValue('stops').split(",");
	__WEBPACK_IMPORTED_MODULE_0__HSLQuery_js__["b" /* queryStopData */](stops).then(function(response){
		setListItems(response);
	});
}


function errorCallback(error) {
	document.getElementById("refresh_time").style.backgroundColor = "#DC0451";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
        	console.log('Location information is unavailable.');
            break;
        case error.TIMEOUT:
        	console.log('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
        	console.log('An unknown error occurred.');
            break;
    }
}

function formatArrivalTime(seconds) {
	var d = new Date(), e = new Date(d);
	var msSinceMidnight = e - d.setHours(0,0,0,0);

	var timeToArrival = Math.round(seconds - msSinceMidnight / 1000);
    var min = Math.floor(timeToArrival / 60);
    var sec = timeToArrival % 60;
    return min + "m " + sec + "s";

}

function setListItems(formattedData) {
	var list = document.querySelectorAll("li.li-has-3line");
	var maxLength = (formattedData.length < list.length) ? formattedData.length : list.length;

	for(var i = 0; i < list.length; i++) {
		var content = list[i];
		var header = null;
		var departure = formattedData[i];

		if (maxLength <= i) {
			content.classList.add("hidden");
			continue;
		} else {
			content.classList.remove("hidden");
		}

		if (content.querySelector(".ui-marquee-content") !== null) {
			header = content.querySelector(".ui-marquee-content");
		} else {
			header = content.querySelector(".ui-marquee");
		}
		var subtexts = content.querySelectorAll(".li-text-sub");

		if (departure.realtime) {
			content.querySelector(".ui-marquee").classList.add("realtime");
		} else {
			content.querySelector(".ui-marquee").classList.remove("realtime");
		}
		document.getElementById("refresh_time").style.backgroundColor = "#64BE1E";


		header.innerHTML = formatArrivalTime(departure.realTimeArrival);
		header.innerHTML += getRouteTypeHtml(departure.type, departure.shortName);
		subtexts[0].innerHTML = departure.headsign;
		subtexts[1].innerHTML = departure.stopName;
	}
}

function getRouteTypeHtml(type, name) {

	var typeCode = "";
	var typeCss = "";
	if (type === 0) {
		typeCode = "&#51;";
		typeCss = "hsl-tram";
	} else if (type === 701) {
		typeCode = "&#50;";
		typeCss = "hsl-bus";
	} else if (type === 109) {
		typeCode = "&#52;";
		typeCss = "hsl-train";
	} else if (type === 1) {
		typeCode = "&#53;";
		typeCss = "hsl-metro";
	} else if (type === 4) {
		typeCode = "&#54;;";
		typeCss = "hsl-ferry";
	} else {
		typeCode = "&#48;";
	}

	return " <span class='" + typeCss +"'>" +
				"<span class='hsl-font'>" +
					typeCode +
				"</span>" +
				"<span>" +
				name +
				"</span>" +
			"</span>";
}

function initRefreshTimeHandler(intervalTime) {
	var refreshTime = document.getElementById("refresh_time");
	var timeleft = intervalTime;
    var refreshTimer = setInterval(function(){
	    timeleft--;
	    refreshTime.innerHTML = timeleft;
	    if(timeleft <= 0) {
	        clearInterval(refreshTimer);
	    	getStopData();
	    	initRefreshTimeHandler(intervalTime);
	    }
    },1000);
}

window.onload = function () {

	if (!tizen.preference.exists('stops')) {
		tizen.preference.setValue('stops', "0412,0401,2047,3028,3036,2041,2024,2045,2043,2046");
	}
	if (!tizen.preference.exists('gps')) {
		tizen.preference.setValue('gps', true);
	}
	if (!tizen.preference.exists('listItemCount')) {
		tizen.preference.setValue('listItemCount', 10);
	}
	if (!tizen.preference.exists('stopSearchRadius')) {
		tizen.preference.setValue('stopSearchRadius', 1000);
	}
	if (!tizen.preference.exists('home')) {
		tizen.preference.setValue('home', '0412');
	}

	for (var i = 0; i < tizen.preference.getValue('listItemCount') - 1; i++) {
		var liItem = document.getElementById("snapList").firstElementChild;
		var clone = liItem.cloneNode(true);
		document.getElementById("snapList").insertBefore(clone, liItem);
	}
	getStopDataWithoutLocation(true);
	__WEBPACK_IMPORTED_MODULE_0__HSLQuery_js__["a" /* queryByCoordinates */](60.166298, 24.967361, 500).then(function(response){
		//console.log(response);
	});
	getStopData();
	initRefreshTimeHandler(20);




	var listItems = document.getElementsByClassName("li-has-3line");
	var options = document.getElementById('options');
	var settingsField = document.getElementById('settingsField');
	var saveSettings = document.getElementById('save_settings');

	for (var i = 0; i < listItems.length; i++) {
		listItems[i].addEventListener("click", function(){
			getStopData();
	    });
	}

	options.addEventListener("click", function(){
		settingsField.value = tizen.preference.getValue('stops');
    });

	saveSettings.addEventListener("click", function(){
		tizen.preference.setValue('stops', settingsField.value);
    });




	var page = document.getElementById('main'),
    list = document.getElementById('snapList'),
    listHelper;

	page.addEventListener('pageshow', function() {
	    listHelper = tau.helper.SnapListMarqueeStyle.create(list, {marqueeDelay: 1000});
	});

	page.addEventListener('pagehide', function() {
	    listHelper.destroy();
	});

	document.addEventListener('tizenhwkey', function() {
		if (document.getElementById("main").classList.contains("ui-page-active")) {
			tizen.application.getCurrentApplication().exit();
		} else {
			tau.changePage("#main");
		}
    });
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = queryStopData;
/* harmony export (immutable) */ __webpack_exports__["c"] = queryStopsByCoordinates;
/* harmony export (immutable) */ __webpack_exports__["a"] = queryByCoordinates;

function queryStopData(stops) {
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
	`
	return executeHslQuery(query).then((response) => {
		return formatStopJsonData(response, stops);
	});
}

function queryStopsByCoordinates(lat, lon, rad) {
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

function queryByCoordinates(lat, lon, rad) {
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

function formatStopByCoordinatesJsonData(responseJSON) {
	const stopsList = responseJSON.data.stopsByRadius.edges;

	let formattedData = stopsList.map((location) => {
		return location.node.stop.code;
	});

	return formattedData;
}


/***/ })
/******/ ]);