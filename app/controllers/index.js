Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 1;
Titanium.Geolocation.frequency = 1;

var name;
var latitudeString;
var longitudeString; 
var lat;
var lon;

Ti.Database.install('/hotspots.sqlite', 'hotspotsDB');
var db = Ti.Database.open('hotspotsDB');

if (Ti.Geolocation.locationServicesEnabled) {
    Titanium.Geolocation.purpose = 'We zijn opzoek naar een hotspot';
    Titanium.Geolocation.addEventListener('location', function(e) {
    	Ti.API.info("success");
        if (e.error) {
            alert('Error: ' + e.error);
        } else {
        	latitudeString = e.coords.latitude;
            longitudeString = e.coords.longitude;
        }
        
        Ti.API.info("My location: " + latitudeString, longitudeString);
  		
  		if(longitudeString) {
			var resultSet = db.execute('SELECT * FROM hotspots ORDER BY (lat - '+latitudeString+') * (lat - '+latitudeString+') + ((lon - '+longitudeString+') * 2) * ((lon -'+longitudeString+') * 2) LIMIT 1');
	
			lat = resultSet.fieldByName('lat');
			lon = resultSet.fieldByName('lon');
			name = resultSet.fieldByName('name');
	
			var R = 6371; // Radius of the earth in km
	  		var dLat = (lat - latitudeString) * Math.PI / 180;  
	  		var dLon = (lon - longitudeString) * Math.PI / 180;
	  		var a =  0.5 - Math.cos(dLat)/2 + Math.cos(lat * Math.PI / 180) * Math.cos(latitudeString * Math.PI / 180) * (1 - Math.cos(dLon))/2;
	 		var  d = R * 2 * Math.asin(Math.sqrt(a));
	 		var distanceMeters =  Math.round(d*1000);
			var bgColor = (100/distanceMeters);
			
	 		$.name.text = name;
	 		
			if(bgColor < 0.4){
				$.index.animate( { 
					backgroundColor:'#c0392b', duration:3000
				});
			}else if (bgColor >= 0.4 && bgColor < 0.6) {
				$.index.animate({ 
					backgroundColor:'#c74c3c', duration:3000
				});
			}else if (bgColor >= 0.6 && bgColor < 1) {
				$.index.animate( { 
					backgroundColor:'#e67e22', duration:3000
				});
			}else if (bgColor >= 1 && bgColor < 2) {
				$.index.animate( { 
					backgroundColor:'#f39c12', duration:3000
				});
			}else if (bgColor >= 2 && bgColor < 3) {
				$.index.animate( { 
					backgroundColor:'#2ecc71', duration:3000
				});
			}else if (bgColor > 3) {
				$.index.animate( { 
					backgroundColor:'#87d37c', duration:3000
				});
			}
	
			if(distanceMeters < 15) {
		 		$.distance.text = "You're now near the hotspot!";
		 	}else {
		 	 	$.distance.text = distanceMeters + "m";	
		 	} 	
		 	Ti.API.info(distanceMeters);
		}  
	});
}else {
    alert('Schakel locatievoorzieningen in');
}

function startCompass() {

	if (Ti.Geolocation.locationServicesEnabled) {
		if (Titanium.Geolocation.hasCompass) {
    	var lat1 = latitudeString;
    	var lon1 = longitudeString;
    	var lat2 = lat;
    	var lon2 = lon;
        Titanium.Geolocation.showCalibration = false;
 
        Ti.Geolocation.getCurrentHeading(function(e) {
 
            if (e.error) {
                alert('error: ' + e.error);
                return;
            }
 
            var x = e.heading.x;
            var y = e.heading.y;
            var z = e.heading.z;
            var magneticHeading = e.heading.magneticHeading;
            var accuracy = e.heading.accuracy;
            var trueHeading = e.heading.trueHeading;
            var timestamp = e.heading.timestamp;
 
            var bearing = getBearing(lat1, lon1, lat2, lon2);
 
            var t = Ti.UI.create2DMatrix();
            var a = Ti.UI.createAnimation();
            Ti.API.info(t);
            t = t.rotate(bearing - magneticHeading);
 
            a.transform = t;
            $.image.animate(a);
            Ti.API.info(t);
 
            function toRad(value) {
                return value * Math.PI / 180;
            }
 
            function toDeg(value) {
                return value * 180 / Math.PI;
            }
 
            function getBearing(lat1, lon1, lat2, lon2) {
 
                var dLon = toRad((lon2 - lon1));
                lat1 = toRad(lat1);
                lat2 = toRad(lat2);
 
                var y = Math.sin(dLon) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                var brng = toDeg(Math.atan2(y, x));
                return brng;
            }
 
        });
 
        Titanium.Geolocation.addEventListener('heading', function(e) {
            if (e.error) {
                Titanium.API.info("error: " + e.error);
                return;
            }
 
            var x = e.heading.x;
            var y = e.heading.y;
            var z = e.heading.z;
            var magneticHeading = e.heading.magneticHeading;
            var accuracy = e.heading.accuracy;
            var trueHeading = e.heading.trueHeading;
            var timestamp = e.heading.timestamp;
 
            var bearing = getBearing(lat1, lon1, lat2, lon2);
            var t = Ti.UI.create2DMatrix();
            var a = Ti.UI.createAnimation();
            Ti.API.info(t);
            t = t.rotate(bearing - magneticHeading);
            
            a.transform = t;
            $.image.animate(a);
			

            Ti.API.info(t);
 
            function toRad(value) {
                return value * Math.PI / 180;
            }
 
            function toDeg(value) {
                return value * 180 / Math.PI;
            }
 
            function getBearing(lat1, lon1, lat2, lon2) {
 
                var dLon = toRad((lon2 - lon1));
                lat1 = toRad(lat1);
                lat2 = toRad(lat2);
 
                var y = Math.sin(dLon) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                var brng = toDeg(Math.atan2(y, x));
                return brng;
            }
 
        });
    } 
	}
}
$.index.open();
setInterval(startCompass, 2000);



