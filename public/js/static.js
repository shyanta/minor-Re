var socket = io();
var form = document.getElementById('message_form');
var message = document.getElementById('field-message');
var messages = document.getElementById('messages');
var listItem = document.querySelector('li');
var userNameInput = document.getElementById('hashtag');

var userSection = document.getElementById('user');
var userForm = document.getElementById('user_form');
	userSection.removeAttribute("class", "visible");
var hashtag = undefined;

if (hashtag === undefined){
	userSection.setAttribute("class", "visible");
	userForm.addEventListener('submit', function(){
		event.preventDefault();
		hashtag = userNameInput.value;
		userNameInput.value="";
		socket.emit('hashtag_search', hashtag);
		userSection.removeAttribute("class","visible");
	})
}

socket.on('tweet_body', function(body, user, hashtag){
	var d = new Date();
	var day = d.getDay();
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var hour = d.getHours();
	var minute = d.getMinutes();
	var minuteString = minute.toString();
		if(minuteString.length == 1){
			minute = '0' + d.getMinutes();
		} else {
			minute = '' + d.getMinutes();
		}
	messages.innerHTML += '<li data-status="received"><header>@'+ user + ' </header><p>' + body + '</p><footer><p> Posted on '+ days[day] + ', ' + hour + ':' + minute + '</footer></li>';
	messages.scrollTop = messages.scrollHeight;
})
