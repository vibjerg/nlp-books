var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var http = require('http').Server(app);

var mongoose = require("mongoose");

var io = require('socket.io')(http);

mongoose.connect('mongodb://localhost/bibbot');

import rules from './rules';

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

function startBot () {

  io.on('connection', async function(socket) {
    console.log("User '" + socket.id + "' has connected.\n");
    socket.emit('chat message', {text:'Velkommen til bibbot demoen\n'});
    socket.emit('chat message', {text:'<< Hej, hvad kan jeg hjælpe med?\n'});

    socket.on('chat message', async function(msg){
      // Emit the message back first
      socket.emit('chat message', { text: ">> " + msg });
      const response = await rules(msg);
      console.log(response, 'response');
      socket.emit('chat message', { text: "" + response});
      /*bot.reply(socket.id, msg.trim(), function(err, resObj){
        var color = resObj.color || "#fff";

      });*/
    });
  });

  http.listen(1234, function(){
    console.log('listening on *:3000');
  });
};


startBot();