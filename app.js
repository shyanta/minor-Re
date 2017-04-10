// NPM requirements
var express = require('express');
var app = express();
var path = require('path');
var ejs = require('ejs');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// declare app Routers
var homeRouter = require('./routes/home');

// Set view engine to .ejs and tell app where these files are placed
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Tell express which static files to serve
app.use(express.static('public'));

// Declare routes for the app to listen to
app.get('/', homeRouter);

app.get('/*', function(req, res){
	res.render('404');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log('message: ' + msg);
	});
});

http.listen(3000, function(req, res){
	console.log('App is running at localhost:3000')
});
