let socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  // socket.emit('createMessage', {
  //   from: "ClientExample",
  //   text: "This message was sent from the client"
  // });
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

// socket.emit('createMessage', {
//   from: 'Client',
//   text: 'Hi'
// }, function(data) {
//   console.log("Got it.", data);
// });

$("#message-form").on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: "User",
    text: $("[name=message]").val()
  }, function() {

  });
});
