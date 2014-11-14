function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function startCompass() {
        if (Ti.Geolocation.locationServicesEnabled && Titanium.Geolocation.hasCompass) {
            var lat1 = latitudeString;
            var lon1 = longitudeString;
            var lat2 = lat;
            var lon2 = lon;
            Titanium.Geolocation.showCalibration = false;
            Ti.Geolocation.getCurrentHeading(function(e) {
                function toRad(value) {
                    return value * Math.PI / 180;
                }
                function toDeg(value) {
                    return 180 * value / Math.PI;
                }
                function getBearing(lat1, lon1, lat2, lon2) {
                    var dLon = toRad(lon2 - lon1);
                    lat1 = toRad(lat1);
                    lat2 = toRad(lat2);
                    var y = Math.sin(dLon) * Math.cos(lat2);
                    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                    var brng = toDeg(Math.atan2(y, x));
                    return brng;
                }
                if (e.error) {
                    alert("error: " + e.error);
                    return;
                }
                e.heading.x;
                e.heading.y;
                e.heading.z;
                var magneticHeading = e.heading.magneticHeading;
                e.heading.accuracy;
                e.heading.trueHeading;
                e.heading.timestamp;
                var bearing = getBearing(lat1, lon1, lat2, lon2);
                var t = Ti.UI.create2DMatrix();
                var a = Ti.UI.createAnimation();
                Ti.API.info(t);
                t = t.rotate(bearing - magneticHeading);
                a.transform = t;
                $.image.animate(a);
                Ti.API.info(t);
            });
            Titanium.Geolocation.addEventListener("heading", function(e) {
                function toRad(value) {
                    return value * Math.PI / 180;
                }
                function toDeg(value) {
                    return 180 * value / Math.PI;
                }
                function getBearing(lat1, lon1, lat2, lon2) {
                    var dLon = toRad(lon2 - lon1);
                    lat1 = toRad(lat1);
                    lat2 = toRad(lat2);
                    var y = Math.sin(dLon) * Math.cos(lat2);
                    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                    var brng = toDeg(Math.atan2(y, x));
                    return brng;
                }
                if (e.error) {
                    Titanium.API.info("error: " + e.error);
                    return;
                }
                e.heading.x;
                e.heading.y;
                e.heading.z;
                var magneticHeading = e.heading.magneticHeading;
                e.heading.accuracy;
                e.heading.trueHeading;
                e.heading.timestamp;
                var bearing = getBearing(lat1, lon1, lat2, lon2);
                var t = Ti.UI.create2DMatrix();
                var a = Ti.UI.createAnimation();
                Ti.API.info(t);
                t = t.rotate(bearing - magneticHeading);
                a.transform = t;
                $.image.animate(a);
                Ti.API.info(t);
            });
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#c0392b",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.name = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontFamily: "Arial Narrow",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        top: "45dp",
        id: "name"
    });
    $.__views.index.add($.__views.name);
    $.__views.distance = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
            fontFamily: "Arial Narrow",
            fontSize: "30dp",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        bottom: "45dp",
        id: "distance"
    });
    $.__views.index.add($.__views.distance);
    $.__views.image = Ti.UI.createImageView({
        height: "300dp",
        width: "300dp",
        id: "image",
        image: "/compass.png"
    });
    $.__views.index.add($.__views.image);
    $.__views.wifilogo = Ti.UI.createImageView({
        height: "300dp",
        width: "300dp",
        id: "wifilogo",
        image: "/wifi_logo.png"
    });
    $.__views.index.add($.__views.wifilogo);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Titanium.Geolocation.purpose = "Recieve User Location";
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Titanium.Geolocation.distanceFilter = 1;
    var name;
    var latitudeString;
    var longitudeString;
    var lat;
    var lon;
    Ti.Database.install("/hotspots.sqlite", "hotspotsDB");
    var db = Ti.Database.open("hotspotsDB");
    if (Ti.Geolocation.locationServicesEnabled) {
        Titanium.Geolocation.purpose = "We zijn opzoek naar een hotspot";
        Titanium.Geolocation.addEventListener("location", function(e) {
            Ti.API.info("success");
            if (e.error) alert("Error: " + e.error); else {
                latitudeString = e.coords.latitude;
                longitudeString = e.coords.longitude;
            }
            Ti.API.info("My location: " + latitudeString, longitudeString);
            if (longitudeString) {
                var resultSet = db.execute("SELECT * FROM hotspots ORDER BY (lat - " + latitudeString + ") * (lat - " + latitudeString + ") + ((lon - " + longitudeString + ") * 2) * ((lon -" + longitudeString + ") * 2) LIMIT 1");
                lat = resultSet.fieldByName("lat");
                lon = resultSet.fieldByName("lon");
                name = resultSet.fieldByName("name");
                var R = 6371;
                var dLat = (lat - latitudeString) * Math.PI / 180;
                var dLon = (lon - longitudeString) * Math.PI / 180;
                var a = .5 - Math.cos(dLat) / 2 + Math.cos(lat * Math.PI / 180) * Math.cos(latitudeString * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
                var d = 2 * R * Math.asin(Math.sqrt(a));
                $.name.text = name;
                var distanceMeters = Math.round(1e3 * d);
                var bgColor = 100 / distanceMeters;
                .4 > bgColor ? $.index.animate({
                    backgroundColor: "#c0392b",
                    duration: 1e3
                }) : bgColor >= .4 && .6 > bgColor ? $.index.animate({
                    backgroundColor: "#c74c3c",
                    duration: 1e3
                }) : bgColor >= .6 && 1 > bgColor ? $.index.animate({
                    backgroundColor: "#e67e22",
                    duration: 1e3
                }) : bgColor >= 1 && 2 > bgColor ? $.index.animate({
                    backgroundColor: "#f39c12",
                    duration: 1e3
                }) : bgColor >= 2 && 3 > bgColor ? $.index.animate({
                    backgroundColor: "#2ecc71",
                    duration: 1e3
                }) : bgColor > 3 && $.index.animate({
                    backgroundColor: "#87d37c",
                    duration: 1e3
                });
                $.distance.text = 15 > distanceMeters ? "You're now near the hotspot!" : distanceMeters + "m";
                Ti.API.info(distanceMeters);
            }
        });
    } else alert("Schakel locatievoorzieningen in");
    $.index.open();
    setInterval(startCompass, 2e3);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;