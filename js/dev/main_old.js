import * as HSLQuery from './HSLQuery.js';
import * as tizen from 'tizen-tau-wearable';


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

    Promise.all([HSLQuery.queryStopData(stops),
                 HSLQuery.queryStopsByCoordinates(position.coords.latitude,
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
	HSLQuery.queryStopData(stops).then(function(response){
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
	HSLQuery.queryByCoordinates(60.166298, 24.967361, 500).then(function(response){
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
