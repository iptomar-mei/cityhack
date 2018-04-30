var coap = require('coap')
  , server = coap.createServer({ type: 'udp6' })

server.on('request', function(req, res) {
  res.end('Hello ' + req.url.split('/')[1] + '\n')
})

// the default CoAP port is 5683
server.listen(5683, 'coap://[aaaa::1]', function() {
    req = coap.request('coap://[aaaa::1:]') //faz um pedido

  req.on('response', function(res) { 
    console.log(res)

    res.pipe(process.stdout)
    res.on('end', function() {
      process.exit(0)
    })
  })

  req.end()
})