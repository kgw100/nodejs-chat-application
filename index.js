var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
// var session = require('express-session');
// var MySQLStore =require('express-mysql-session')(session);
// var mysql =require('mysql');
var onlineUsers = [];
var answer="";

io.set('heartbeat timeout', 15000);//연결 끊김 개선
io.set('heartbeat interval', 8000);
//
// var conn = mysql.createConnection({
//   host :'localhost',
//   user : 'root',
//   password:'2788',
//   database:'Chat'
// });
// conn.connect();
//
// var options = {
//   host:'localhost',
//   port:3306,
//   user: 'root',
//   password:'2788',
//   database:'Chat'
// };
// var sessionStore = new MySQLStore(options);




app.get('/', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  // app.use(session({
  //   secret: '!@#!@#!@#!@#@!#!@#',
  //   resave: false,
  //   saveUninitializeed: true
  //   // store:sessionStore
  // }));

  res.sendFile(path.join(__dirname, '../chat-Application', 'index.html'));
});

// Register events on socket connection
io.on('connection', function(socket){
  // Listen to chantMessage event sent by client and emit a chatMessage to the client
  socket.on('chatMessage', function(message){
    io.to(message.receiver).emit('chatMessage', message);
  });
  // Listen to notifyTyping event sent by client and emit a notifyTyping to the client
  socket.on('notifyTyping', function(sender, receiver){
    io.to(receiver.id).emit('notifyTyping', sender, receiver);
  });
  // Listen to newUser event sent by client and emit a newUser to the client with new list of online users
  var getIndexIfObjWithOwnAttr = function(array, attr, value, returnCode) {
      for(var i = 0; i < array.length; i++) {
          if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
              returnCode = -1;
              return returnCode;
          }
      }
      return returnCode;
  }
  socket.on('newUser', function(user,returnFunction){
    var newUser = {id: socket.id, name: user};
    var returnCode = 1;
    // for(var i in onlineUsers){
    //   if(onlineUsers[i]== newUser){
    //    returnCode = -1;
    //    break;
    //   }
    // }
    returnCode = getIndexIfObjWithOwnAttr(onlineUsers, "name", newUser.name, returnCode);
    returnFunction(returnCode);
    if(returnCode == 1){
    onlineUsers.push(newUser);
      io.to(socket.id).emit('newUser', newUser);
      io.emit('onlineUsers', onlineUsers);
    }
  });
  // Listen to disconnect event sent by client and emit userIsDisconnected and onlineUsers (with new list of online users) to the client

  socket.on('disconnect', function(){
    onlineUsers.forEach(function(user, index){
      if(user.id === socket.id) {
        onlineUsers.splice(index, 1);
        io.emit('userIsDisconnected', socket.id);
        io.emit('onlineUsers', onlineUsers);
    }
    });
  });
});

// Listen application request on port 3389
http.listen(3000, "127.0.0.1", function(){
  console.log('포트 개방 : *3000');
});
const gracfulCleanJob = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        // cleaning job done
        resolve();
    }, 2000);
});

process.on('SIGINT', function() {
    console.log("신호를 수신하지못했습니다. 서버를 종료중입니다.");
    gracfulCleanJob().then(() => {
        process.exit();
    })
});
