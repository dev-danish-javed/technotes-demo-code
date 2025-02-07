const express = require('express');
const fs = require('fs');
const https = require('https');

const app = express();
const httpPort = 3200;
const httpsPort = 3300;

// Load server's private key and certificate, and CA certificate to verify clients
const options = {
  // private key
  key: fs.readFileSync(
    './../mTLS/certificates/server_data/node_server_private_key.pem'
  ),
  // server certificate
  cert: fs.readFileSync(
    // CA signed certificate
    './../mTLS/certificates/server_data/node_server_certificate.pem'
    // self signed certificate
    // 'D:/mTLS/certificates/server_data/node_server_self_signed_certificate.pem'
  ),
  // CA certificate for client verification
  ca: fs.readFileSync(
    './../mTLS/certificates/certificate_authority/ca_certificate.pem'
  ),
  // Request client certificate
  requestCert: true,
  // Reject unauthorized clients
  rejectUnauthorized: true,
};

app.get('/greet/:name', (req, res) => {
  const { name } = req.params;
  console.log('Request received to greet', name);
  res.send(`Hello, ${name}`);
});

// Create HTTPS server with mTLS enabled

app.listen(httpPort, () => {
  console.log(`Simple app http://localhost:${httpPort}`);
});

https.createServer(options, app).listen(httpsPort, () => {
  console.log(`mTLS Server is running on: https://localhost:${httpsPort}`);
});
