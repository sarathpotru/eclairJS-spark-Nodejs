/**
 * app.js - Main Node.js Express Application Controller
 */

// Module dependencies.
var express = require('express'),
    pug = require('pug'),
    path = require('path'),
    home = require('./routes/home');
var WebSocketServer = require('ws').Server;

var app = express();

// Setup the application's environment.
app.set('port',  process.env._EJS_APP_PORT || 3000);
app.set('host',  process.env.EJS_APP_HOST || 'localhost');
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Route all GET requests to our public static index.html page
app.get('/', home.index);

// Start listening for requests
var server = app.listen(app.get('port'), app.get('host'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var wss = new WebSocketServer({
    server: server
  });
  
  wss.on('connection', function(ws) {
    ws.on('message', function(message) {
      console.log("*******",message);
      var msg = JSON.parse(message);
      if (msg && msg.startCount) {
          startCount();
      }
    });
  });

var count = require('./count.js');
function startCount() {
var file = 'file:/data/dream.txt';
count.start(file, function(results){
	//TODO:  SOMETHING BETTER WITH RESULTS HERE
	console.log('results: ',results);
});

// stop spark  when we stop the node program
process.on('SIGTERM', function () {
  count.stop(function() {
    console.log('SIGTERM - stream has been stopped');
    process.exit(0);
  });
});

process.on('SIGINT', function () {
  count.stop(function() {
    console.log('SIGINT - stream has been stopped');
    process.exit(0);
  });
});
};