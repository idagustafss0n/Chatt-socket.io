let express = require('express');
let socket = require('socket.io');

// App setup
let app = express();
let server = app.listen(4000, function(){
    console.log("Kör servern på localhost:4000");
});

// Static files
app.use(express.static('public'));

let anslutnaAnvandare = [];

// Socket setup & pass server
let io = socket(server);
io.on('connection', (socket) => {

    // Klient anslöt med id
    console.log('Klient anslöt med id: ', socket.id);
    // Kolla anslutna 
    socket.on("handle", function(data){
        console.log("Användaren " + data + " anslöt sig till servern!");
        socket.anvandare = data;
        anslutnaAnvandare.push(data);
        console.log(anslutnaAnvandare);
        socket.broadcast.emit('handle', anslutnaAnvandare)
        //io.sockets.emit('handle', anslutnaAnvandare)
    });


    // Handle chat event
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on("disconnect", () => {
        console.log("Användaren " + socket.anvandare + " avbröt kontakt med servern.");
        // tar bort elementet med 
        anslutnaAnvandare = anslutnaAnvandare.filter(item => item !== socket.anvandare);
        console.log(anslutnaAnvandare);
        socket.broadcast.emit("uppdateraAnvandare", anslutnaAnvandare);
    });


});
