'use strict';

var express = require('express');
var http = require('http');
var _ = require('lodash');
var path = require('path');
var CronJob = require('cron').CronJob;

var socket = require('./routes/socket.js');

const VIDEOS_FILE = path.join(__dirname, 'video_submits.json');

var app = express();
var server = http.createServer(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Socket.io Communication */
var io = require('socket.io').listen(server);
// io.sockets.on('connection', socket);


app.get('/vroom=*', function (req, res) {
    res.sendfile('./public/vroom.html');
    var name = req.url.split('=')[1];
    console.log(name);
    var nsp = io.of(name);
    nsp.on('connection', socket);
});


/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
