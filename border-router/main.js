var express = require('express');
var app = express();
var coap = require('coap');
coap.registerFormat('application/json', 50);

var zolertias = [
  { id: 1, ip: "fd00::212:4b00:14d5:2bf9", location: "salão" }
]

app.get('/:id',  function (req, res) {

  let zolertia = zolertias[req.params.id - 1];

  console.log(zolertia);

  let getDHT22 = new Promise( (resolve, reject) => {
      coap.request({
        hostname: zolertia.ip,
        port: 5683,
        method: "GET",
        pathname: "/sensors/dht22",
        // options: {
        //   psk:           new Buffer('OurSecret'),
        //   PSKIdent:      new Buffer("OurIdentity")
        // }
      })
      .on('response', (coap_res) => { 
        let response=coap_res._packet.payload.toString('utf8');
        if(response.length>0) resolve(JSON.parse(JSON.stringify(eval("("+coap_res._packet.payload.toString('utf8')+")"))));
        else resolve({ temp: null,  hum: null });
      })
      .on('error', (coap_res) => reject({ temp: null,  hum: null }))
      .end();
  })
  let getLoud = new Promise( (resolve, reject) => {
      coap.request({
        hostname: zolertia.ip,
        port: 5683,
        method: "GET",
        pathname: "/sensors/loudness",
        // options: {
        //   psk:           new Buffer('OurSecret'),
        //   PSKIdent:      new Buffer("OurIdentity")
        // }
      })
      .on('response', (coap_res) => { 
        let response=coap_res._packet.payload.toString('utf8');
        if(response.length>0) resolve(JSON.parse(JSON.stringify(eval("("+coap_res._packet.payload.toString('utf8')+")"))));
        else resolve({ loudness: null });
      })
      .on('error', (coap_res) => reject({ loudness: null }))
      .end();
  })
  let getLight = new Promise( (resolve, reject) => {
      coap.request({
        hostname: zolertia.ip,
        port: 5683,
        method: "GET",
        pathname: "/sensors/light-sensor",
        // options: {
        //   psk:           new Buffer('OurSecret'),
        //   PSKIdent:      new Buffer("OurIdentity")
        // }
      })
      .on('response', (coap_res) => { 
        let response=coap_res._packet.payload.toString('utf8');
        if(response.length>0) resolve(JSON.parse(JSON.stringify(eval("("+coap_res._packet.payload.toString('utf8')+")"))));
        else resolve({ light: null });
      })
      .on('error', (coap_res) => reject({ light: null }))
      .end();
  })

  Promise.all([getDHT22, getLight, getLoud]).then(
    values=>{
      console.log(values);
      res.send(Object.assign({}, {locat: zolertia.location}, ...values));
    },
    error=> res.send("ERROR")
  );

});

app.listen(3000, () => { console.log("server running"); });