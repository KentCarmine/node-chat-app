let socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(newMessage) {
  console.log('newMessage', newMessage);

  let formattedTime = moment(newMessage.createdAt).format('h:mm a');
  let template = $("#message-template").html();
  let html = Mustache.render(template, {
    text: newMessage.text,
    from: newMessage.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
});

socket.on('newLocationMessage', function(newLocMessage) {
  console.log('newLocationMessage', newLocMessage);

  let formattedTime = moment(newLocMessage.createdAt).format('h:mm a');

  let template = $("#location-message-template").html();
  let html = Mustache.render(template, {
    url: newLocMessage.url,
    from: newLocMessage.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
});

$("#message-form").on('submit', function(e) {
  e.preventDefault();

  let msgTextBox = $("[name=message]");

  socket.emit('createMessage', {
    from: "User",
    text: msgTextBox.val()
  }, function() {
    msgTextBox.val("");
  });
});

let locationButton = $("#send-location");
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser.');
    return;
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
