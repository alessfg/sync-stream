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
io.sockets.on('connection', socket);

function serveIndex(req, res) {
    return res.sendfile('./public/vroom.html');
}

app.get('/vroom=*', serveIndex);
app.head('/vroom=*', serveIndex);

app.post('/api/videos', function(req, res) {
  fs.readFile(VIDEOS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var videos = JSON.parse(data);
    // NOTE: In a real implementation, we would likely rely on a database or
    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    // treat Date.now() as unique-enough for our purposes.
    var newComment = {
      id: req.body.id,
      video_url: req.body.video_url,
      video_id: req.body.video_id,
    };
    videos.push(newComment);
    fs.writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(videos);
    });
  });
});
/* Start server */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
