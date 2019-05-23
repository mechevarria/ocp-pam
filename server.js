'use strict';

let compression = require('compression');
let express = require('express');
let logger = require('morgan');
let http = require('http');
let path = require('path');
let proxy = require('http-proxy-middleware');
let bodyParser = require('body-parser');

let app = express();

app.set('port', process.env.PORT || 8080);
app.set('kie', process.env.KIE || 'http://rhpam7-install-kieserver:8080');

app.use(compression());
app.use(logger('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// needed to fix POST and PUT not being proxied
var restream = function(proxyReq, req) {
  if (req.body) {
    let bodyData = JSON.stringify(req.body);
    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    // stream the content
    proxyReq.write(bodyData);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// proxy to kie server
app.use(
  '/services/*',
  proxy({
    target: app.get('kie'),
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: restream
  })
);

app.use('*', function(req, res) {
  // respond with index to process links
  if (req.accepts('html')) {
    res.sendFile(__dirname + '/dist/index.html');
    return;
  }

  // otherwise resource was not found
  res.status(404);
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
