var ports = {
    "A": {lat: 37.6213129, lng: -122.3789554},
    "B": {lat: 33.6407282, lng: -84.4277001},
    "C": {lat: 32.8481029, lng: -96.8512063},
    "D": {lat: 33.9415889, lng: -118.40853},
    "E": {lat: 47.4502499, lng: -122.3088165},
    "F": {lat: 38.7161686, lng: -90.3534764},
    "G": {lat: 25.795865, lng: -80.2870457},
    "H": {lat: 41.4124339, lng: -81.8479925},
    "I": {lat: 39.8630625, lng: -104.6737477},
    "J": {lat: 42.3656132, lng: -71.0095602},
    "K": {lat: 40.78426, lng: -111.98048},
    "L": {lat: 44.8847554, lng: -93.2222846},
    "M": {lat: 45.588654, lng: -122.593117},
    "N": {lat: 29.6529506, lng: -95.2766507},
    "O": {lat: 39.1774042, lng: -76.6683922},
    "P": {lat: 46.775111, lng: -100.7573875}
};

function randomCost(c1, c2) {
    var y = c2.lng - c1.lng;
    var x = c2.lat - c1.lat;
    var dist = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    var r = Math.random() - .5; // -50% to 50%
    var v = dist * r; // calc discount/markup
    return parseInt(dist + v) + 1; // add discount/markup and make int number
};

module.exports = {
    queueList: function(length, spid, oldroutes) {
        var portNames = Object.keys(ports);
        var list = {};
        var oldrouteskeys = [];

        if (oldroutes) {
            oldrouteskeys = Object.keys(oldroutes);
        }

        for (var o in oldroutes) {
            list[o] = oldroutes[o];
        }

        for (var i = 0; i < length; i++) {
            var a = parseInt(Math.random() * portNames.length);
            var b = parseInt(Math.random() * portNames.length);

            // duplicate resolution
            if (a == b) {
                b = (b + 1) % portNames.length;
            }

            var c1 = portNames[a];
            var c2 = portNames[b];
            var pair;

            // order pair alphabetically for easier comparison
            if (c1 < c2) {
                pair = c1 + c2;
            } else {
                pair = c2 + c1;
            }

            // add to result list
            if (undefined == list[pair]) {
                list[pair] = {
                    "spid": spid,
                    "c1": c1,
                    "c2": c2,
                    "coord1": ports[c1],
                    "coord2": ports[c2],
                    "cost": randomCost(ports[c1], ports[c2])
                };
            } else {
                i--; // repeat loop if we already have this pair
            }
        }

        if (oldrouteskeys.length > 0) {
            for (var o in oldrouteskeys) {
                delete list[oldrouteskeys[o]];
            }
        }

        return list;
    }
};
