var cluster = require("cluster");
if (cluster.isMaster) {
  console.log("Cluster initiate")
  cluster.fork();
  cluster.on("exit", () => cluster.fork());
} else {

  var express = require('express');
  var app = express();
  var coap = require('coap');
  coap.registerFormat('application/json', 50);

  var zolertias = [
    { id: 1, ip: "fd00::212:4b00:14d5:2bf9", location: "salao_dhl" },   // dht22 / lum
    { id: 2, ip: "fd00::212:4b00:60d:610d", location: "rua_dhl" },    // dht22 / lum
    { id: 3, ip: "fd00::212:4b00:14d5:2f32", location: "lazer_dhl" },   // dht22 / lum
    { id: 4, ip: "fd00::212:4b00:60d:6077", location: "salao_s" },    // loudness
    { id: 5, ip: "fd00::212:4b00:14d5:2dc6", location: "lazer_s" }    // loudness
  ]

  app.get('/:id', function (req, res) {

    let zolertia = zolertias[req.params.id - 1];

    let getDHT22 = new Promise((resolve, reject) => {
      coap.request({
        hostname: zolertia.ip,
        port: 5683,
        method: "GET",
        pathname: "/sensors/dht22",
        /*options: {
          psk:           new Buffer('4f7572536563726574'),
          PSKIdent:      new Buffer("OurIdentity")
        }*/
      })
        .on('response', (coap_res) => {
          let response = coap_res._packet.payload.toString('utf8');
          if (response.length > 0) {
            let json_res = JSON.parse(JSON.stringify(eval("(" + coap_res._packet.payload.toString('utf8') + ")")));
            resolve({
              temp: json_res.temp / 10 + ((json_res.temp % 10) * 0.01),
              hum: json_res.hum / 10
            });
          }
          else resolve();
        })
        .on('error', (coap_res) => resolve())
        .end();
    })
    let getLoud = new Promise((resolve, reject) => {
      coap.request({
        hostname: zolertia.ip,
        port: 5683,
        method: "GET",
        pathname: "/sensors/loudness",
        /* options: {
           psk:           new Buffer('OurSecret'),
           PSKIdent:      new Buffer("OurIdentity")
         }*/
      })
        .on('response', (coap_res) => {
          let response = coap_res._packet.payload.toString('utf8');
          if (response.length > 0) resolve(JSON.parse(JSON.stringify(eval("(" + coap_res._packet.payload.toString('utf8') + ")"))));
          else resolve();
        })
        .on('error', (coap_res) => resolve())
        .end();
    })
    let getLight = new Promise((resolve, reject) => {
      coap.request({
        hostname: zolertia.ip,
        port: 5683,
        method: "GET",
        pathname: "/sensors/light-sensor",
        /*options: {
          psk:           new Buffer('OurSecret'),
          PSKIdent:      new Buffer("OurIdentity")
        }*/
      })
        .on('response', (coap_res) => {
          let response = coap_res._packet.payload.toString('utf8');
          if (response.length > 0) resolve(JSON.parse(JSON.stringify(eval("(" + coap_res._packet.payload.toString('utf8') + ")"))));
          else resolve();
        })
        .on('error', (coap_res) => reject())
        .end();
    })

    Promise.all([getDHT22, getLight, getLoud]).then(
      values => {
        let to_send = Object.assign({}, { locat: zolertia.location }, ...values);
        console.log(zolertia, to_send);
        res.send(to_send);
      },
      error => res.send("ERROR")
    );

  });

  app.listen(3000, () => { console.log("server running"); });

}

