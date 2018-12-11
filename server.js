var fs = require('fs');
var https = require('https');

const cert = '<YOUR-CERT-HERE>'
const key  = '<YOUR-KEY-HERE>'

res.then((result, err) => {
  var options = {
    cert,
    key,
    requestCert: true, // asks client to server their client-side cert
    rejectUnauthorized: true, // rejects any unauthorized client-side certs
  };

  https.createServer(options, function (req, res) {
    if (req.socket.authorized) { // shouldn't even get here if not authorized
      console.log(`Authorized: ${new Date()} ${req.connection.remoteAddress} ${CN} ${req.method} ${req.url}`)
    }

    if (!req.socket.authorized) {
      console.log(`Unauthorized: ${new Date()} ${req.connection.remoteAddress} ${CN} ${req.method} ${req.url}`)
    }

    if (CN === '*.dashbot.io') {
      // logic here for authorized clients
      req.on("data", (data) => {
        console.log(`\t    data: ${data.toString()}`)
      })
      res.writeHead(200);
      res.end("success\n");
    }

    res.writeHead(403);
    res.end();

    req.on("data", (data) => {
      console.log(data.toString())
    })

    res.writeHead(200);
    res.end("hello world\n");
  }).listen(4433);
  return 'success'
})

console.log('listening on 0.0.0.0:4433');

