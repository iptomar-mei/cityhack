var coap = require('coap');

coap.registerFormat('application/json', 50);

var express = require('express');
var app = express();

var zolertias = [
  { "id": 1, "ip": "fd00::212:4b00:14d5:2bf9", location: "salão" }
]

app.get('/:id', function (req, res) {
  let values = {}, counter = 0;
  values.locat = zolertias[req.params.id].location;

  var dht22 = coap.request({
    hostname: zolertias[req.params.id].ip,
    port: 5683,
    method: "GET",
    pathname: "/sensors/dht22",
    /* options: {
  	psk:           new Buffer('OurSecret'),
  	PSKIdent:      new Buffer("OurIdentity")
    }*/
  });
  dht22.on('response', (coap_res) => { values.temp = JSON.stringify(coap_res._packet.payload.toString('utf8')).temp; values.hum = JSON.stringify(coap_res._packet.payload.toString('utf8')).hum; counter += 1; });
  dht22.on('error', (coap_res) => { values.temp = null; values.humi = null; counter += 1; });
  dht22.end();

  var loud = coap.request({
    hostname: zolertias[req.params.id].ip,
    port: 5683,
    method: "GET",
    pathname: "/sensors/loudness",
    /* options: {
  	psk:           new Buffer('OurSecret'),
  	PSKIdent:      new Buffer("OurIdentity")
    }*/
  });
  loud.on('response', (coap_res) => { values.loud = JSON.stringify(coap_res._packet.payload.toString('utf8')).loudness; counter += 1; });
  loud.on('error', (coap_res) => { values.loud = null; counter += 1; });
  loud.end();

  var light = coap.request({
    hostname: zolertias[req.params.id].ip,
    port: 5683,
    method: "GET",
    pathname: "/sensors/light-sensor",
    /* options: {
  	psk:           new Buffer('OurSecret'),
  	PSKIdent:      new Buffer("OurIdentity")
    }*/
  });
  light.on('response', (coap_res) => { values.light = JSON.stringify(coap_res._packet.payload.toString('utf8')).light; counter += 1; });
  light.on('error', (coap_res) => { values.light = null; counter += 1; });
  light.end();

  function waiting() {
    if (counter < 3) setTimeout(waiting, 1000);
    else res.send(values);
  }

});

app.listen(3000, () => { console.log("server running"); });
