var socket = io();
var form = document.querySelector('form');
var message = document.getElementById('field-message');
var messages = document.getElementById('messages');
var listItem = document.querySelector('li');
form.addEventListener('submit', function(){
	event.preventDefault();
	socket.emit('chat message', message.value);
	message.value = "";
	return false;
});
socket.on('chat message', function(msg, id){
	var status;
	if (socket.id === id) {
		status = "send";
	} else {
		status = "received";
	}
	var d = new Date();
	var day;
	if (d.getDay() == 0){
		day = "Sunday";
	} else if (d.getDay() == 1){
		day = "Monday";
	} else if (d.getDay() == 2){
		day = "Tuesday";
	} else if (d.getDay() == 3){
		day = "Wednesday";
	} else if (d.getDay() == 4){
		day = "Thursday";
	} else if (d.getDay() == 5){
		day = "Friday";
	} else {
		day = "Saturday";
	}
	var hour = d.getHours();
	var minute = d.getMinutes();
	var minuteString = minute.toString();

	if(minuteString.length == 1){
		minute = '0' + d.getMinutes();
	} else {
		minute = '' + d.getMinutes();
	}

	messages.innerHTML += '<li data-status="' + status + '"><p>' + msg + '</p><footer><p> Posted on '+ day + ', ' + hour + ':' + minute + '</footer></li>';
});
