let socket = io();

function scrollToBottom() {
  // Selectors
  let messages = $("#messages");
  let newMessage = messages.children('li:last-child');

  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  // console.log('Connected to server');
  let params = $.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log("No error");
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  // console.log("Users list: ", users);
  let ol = $('<ol></ol>');
  users.forEach(function(user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function(newMessage) {
  // console.log('newMessage', newMessage);

  let formattedTime = moment(newMessage.createdAt).format('h:mm a');
  let template = $("#message-template").html();
  let html = Mustache.render(template, {
    text: newMessage.text,
    from: newMessage.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(newLocMessage) {
  // console.log('newLocationMessage', newLocMessage);

  let formattedTime = moment(newLocMessage.createdAt).format('h:mm a');

  let template = $("#location-message-template").html();
  let html = Mustache.render(template, {
    url: newLocMessage.url,
    from: newLocMessage.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
});

$("#message-form").on('submit', function(e) {
  e.preventDefault();

  let msgTextBox = $("[name=message]");

  socket.emit('createMessage', {
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
