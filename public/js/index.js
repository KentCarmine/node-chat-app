let socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(newMessage) {
  console.log('newMessage', newMessage);
  let li = $('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`)
  $("#messages").append(li);
});

socket.on('newLocationMessage', function(newLocMessage) {
  console.log('newLocationMessage', newLocMessage);

  let li = $('<li></li>');
  let a = $('<a target="_blank">My current location</a>');
  li.text(`${newLocMessage.from}: `);
  a.attr('href', newLocMessage.url);
  li.append(a);
  $("#messages").append(li);
});

$("#message-form").on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: "User",
    text: $("[name=message]").val()
  }, function() {

  });
});

let locationButton = $("#send-location");
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('Unable to fetch location.');
  });
});
