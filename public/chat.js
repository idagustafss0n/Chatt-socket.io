let namn = prompt("Välj ett namn")
document.getElementById("handle").value = namn; 

// Make connection
let socket = io.connect('http://localhost:4000');

  

// Query DOM
let message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

    
// Emit events
socket.emit('handle', namn);

btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})



// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('handle', function(anslutnaAnvandare){
    output.innerHTML += '<p>Anslutna användare ' + anslutnaAnvandare + '</p>';
})

socket.on("uppdateraAnvandare", (data) => {
    console.log("En användare kopplade sig från servern.");
    console.log("Anslutna just nu: " + data);
    output.innerHTML += '<p>Anslutna just nu: ' + data + '</p>';

});