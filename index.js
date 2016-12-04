var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var prefixes = ['BigBeetle', 'TinyTiger', 'RagingLonghorn', 'DaffyDuck', 'DigBick', 'EleanorRigby', 'SarahIsTheBest', 'TonaldDrump', 'AnonymousAardvark', 'TomiLahrenSux']
var nickname_cache = new Set()

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.broadcast.emit('status', 'a user connected');
  generate_unique_nickname(socket);
  io.emit('users online', JSON.stringify(Array.from(nickname_cache)));
  socket.on('disconnect', function(){
    nickname_cache.delete(socket.nickname);
    socket.broadcast.emit('status', 'user disconnected');
  });
  socket.on('chat message', function(msg){
    msg = socket.nickname + ': ' + msg;
    socket.broadcast.emit('chat message', msg);
  });
  socket.on('typing', function(){
    socket.broadcast.emit('typing', socket.nickname);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function generate_unique_nickname(socket) {
    nickname = 'anonymous';
    do {
        random = Math.floor(Math.random() * (prefixes.length - 1));
        prefix = prefixes[random];
        random = Math.floor(Math.random() * 10000);
        nickname = prefix + String(random);
    } while (nickname_cache.has(nickname));
    nickname_cache.add(nickname);

    socket.nickname = nickname;
}