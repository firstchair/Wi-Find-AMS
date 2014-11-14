var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var geo = require("geo");

Alloy.Globals.LATITUDE_BASE = 37.389569;

Alloy.Globals.LONGITUDE_BASE = -122.050212;

Alloy.Globals.Map = Ti.Map = require("ti.map");

Alloy.Globals.winTop = 0;

Ti.UI.backgroundColor = "#fff";

Alloy.createController("index");