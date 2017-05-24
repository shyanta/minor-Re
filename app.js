// NPM requirements
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var Twit = require('twit');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;

// NPM setup modules
require('dotenv').config();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ee = new EventEmitter();

//Use bodyParser to parse to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set view engine to .ejs and tell app where these files are placed
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Tell express which static files to serve
app.use(express.static('public'));

// Declare routes for the app to listen to
app.get('/', function(req, res){
	res.render('index');
});

app.get('/*', function(req, res){
	res.render('404');
});

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

// Get all Tweets around the world, this is a "bounding box" this coordinates are the whole globe.
// More info add: https://dev.twitter.com/streaming/overview/request-parameters#locations
var globe = ['-180','-90','180','90'];

// Start Twitter streaming API
var stream = twitter.stream('statuses/filter', { locations: globe });
stream.on('tweet', function (tweet) {
	// If tweet has Hashtags
	var tweetHashtags = tweet.entities.hashtags;
	// Check if there are hashtags in Tweet, if yes run the code.
	if (tweetHashtags.length >= 1) {
		for (var h = 0; h < tweetHashtags.length; h++) {
		// Get hashtag text and convert to lowercase and remove ' + "
		var getHashTag = tweetHashtags[h].text.toLowerCase().replace(/"/g, '').replace(/'/g, '');
		ee.emit('tweet_hash_test', getHashTag, tweet.text, tweet.user.screen_name);
		}
	}
});
stream.on('disconnect', function (disconnect) {
	io.emit('error');
});

io.on('connection', function(socket){
	console.log('a user connected');
	if (socket.hashtag === ""){
		console.log('no hash');
		io.emit('get_new_hashtag')
	}
	socket.on('hashtag_search', function(hashtag){
		console.log('yes hash');
		socket.hashtag = hashtag.toLowerCase().replace(/"/g, '').replace(/'/g, '');
		ee.on('tweet_hash_test', function(hashtag, tweet, username){
			if (hashtag === socket.hashtag){
				io.to(socket.id).emit('tweet_body', tweet, username, hashtag);
			}
		});
	});
	socket.on('disconnect', function(disconnect){
		console.log('user disconnected');
		
	});
});

http.listen(process.env.PORT || 3000, function(req, res){
	console.log('App is running at localhost:3000')
});
