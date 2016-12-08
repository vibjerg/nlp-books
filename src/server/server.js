import path from 'path';

var express = require('express');
var app = express();
console.log(path.join(__dirname, '../public'));
app.use(express.static(path.join(__dirname, '../../public')));
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
    const context = {};
    console.log("User '" + socket.id + "' has connected.\n");
    socket.emit('chat message', {text:`<span class="response">Hej, Hvad kan jeg hjælpe med?</span>`});

    socket.on('chat message', async function(msg){
      // Emit the message back first
      socket.emit('chat message', { text: `<span class="request">${msg}</span>`});
      const response = await rules(msg, context);
      console.log(response, 'response');
      socket.emit('chat message', { text: `<span class="response">${response}</span>`});
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