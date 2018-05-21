var coap = require('coap');

coap.registerFormat('application/json', 50);

var express = require('express');
var app = express();

app.get('/dht22', function (req, res) {
  var coap_req = coap.request({
    hostname: 'fd00::212:4b00:14d5:2bf9',
    port: 5683,
    method: "GET",
    pathname: "/sensors/dht22",
    /* options: {
  	psk:           new Buffer('OurSecret'),
  	PSKIdent:      new Buffer("OurIdentity")
    }*/
  });

  coap_req.on('response', (coap_res) => {
    console.log(coap_res._packet.payload.toString('utf8'));
    res.send(coap_res._packet.payload.toString('utf8'));
  });

  coap_req.on('error', (coap_res) => {
    console.log(coap_res);
    res.send("error");
  });

  coap_req.end()
})

app.get('/loudness', function (req, res) {
  var coap_req = coap.request({
    hostname: 'fd00::212:4b00:14d5:2bf9',
    port: 5683,
    method: "GET",
    pathname: "/sensors/loudness",
    /* options: {
  	psk:           new Buffer('OurSecret'),
  	PSKIdent:      new Buffer("OurIdentity")
    }*/
  });

  coap_req.on('response', (coap_res) => {
    console.log(coap_res._packet.payload.toString('utf8'));
    res.send(coap_res._packet.payload.toString('utf8'));
  });

  coap_req.on('error', (coap_res) => {
    console.log(coap_res);
    res.send("error");
  });

  coap_req.end()
})

app.get('/light', function (req, res) {
  var coap_req = coap.request({
    hostname: 'fd00::212:4b00:14d5:2bf9',
    port: 5683,
    method: "GET",
    pathname: "/sensors/light-sensor",
    /* options: {
  	psk:           new Buffer('OurSecret'),
  	PSKIdent:      new Buffer("OurIdentity")
    }*/
  });

  coap_req.on('response', (coap_res) => {
    console.log(coap_res._packet.payload.toString('utf8'));
    res.send(coap_res._packet.payload.toString('utf8'));
  });

  coap_req.on('error', (coap_res) => {
    console.log(coap_res);
    res.send("error");
  });

  coap_req.end()
})
