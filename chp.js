'use strict'
var WiFiControl = require('wifi-control');
const network = "XT1068 7098";


//  Initialize wifi-control package with verbose output 
WiFiControl.init({
    debug: false,
    connectionTimeout: 500
});


process.on('message', (m) => {


    var _ap = {
        ssid: network,
        password: m
    };


    var results = WiFiControl.connectToAP(_ap, function(errBrute, response) {
        let status = WiFiControl.getIfaceState();

        if (status && status.success) {
            if (status.ssid == network) {
                process.send(m);
            } else {
                console.log("fail", network, status.ssid, m);
                throw new Error('nope wrong ssid');
            }
        } else {
            console.log("fail", network, m, errBrute);
            throw new Error('nope no connection');
        }
    });
});