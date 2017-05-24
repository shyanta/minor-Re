# Minor - Real Time Web

## Introduction
In this project I'm going to build a real time web application. I'm going to make a
website that visually represents a real-time data source. Nowadays people expect websites
to be real-time. Think about al the social media platforms. When someone posts something, you want
to see it immediately. Just like whatsapp, when someone sends you a message, you want to see it
directly, you don't want to wait around for multiple seconds.

This is why real-time is very popular right now. It's fast and more importantly, it's what people
expect, and as a frontend developer this is what should trigger you.

## Live Link
The live twitter stream can be found on the following link: <br/>
[Live Twitter Stream with Socket.io](https://minor-realtimeweb-chat.herokuapp.com/)

## What did I make
In this app each person can track a hashtag from twitter. They can choose every hashtag they want.
The stream is realtime so the tweets keep popping in.

## setup
### Create an app
Create an app on your twitter account.

## How does the code work
### Connect with twitter API
```js
var Twit = require('twit');

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
```


## Features
-	Different stream per socket user
-	RealTime Twitter stream
-	Search input Hashtag

## Wishes
-	Create a tunnel event
-	After disconnect, ask for new Hash

## Sources
-	[Get started chat - Socket.io](https://socket.io/get-started/chat/)
