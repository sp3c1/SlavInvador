'use strict'
var WiFiControl = require('wifi-control');

//  Initialize wifi-control package with verbose output 
WiFiControl.init({
    debug: false,
    connectionTimeout: 7000
});


process.on('message', (m) => {

    var _ap = {
        ssid: m.network,
        password: m.password
    };

    console.log('###', _ap);

    var results = WiFiControl.connectToAP(_ap, function(errBrute, response) {
        let status = WiFiControl.getIfaceState();

        //console.log(status);

        if (status && status.success) {
            if (status.ssid == m.network) {
                process.send(m);
            } else {
                //console.log("@@@fail network compare", m.network, status.ssid);
                //throw new Error('nope wrong ssid');
                process.exit(1);
            }
        } else {
            console.log("@@@fail connection", m.password, errBrute);
            //throw new Error('nope no connection');
            process.exit(1);
        }
    });
});