var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var rm = require("./chatRoom");
var req = require("request");

var userMap = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
}); //localhost8000 사용시 주석처리

io.on('connection', function(socket){
    console.log('a user connected'); //창을 열때 connected

    socket.on('disconnect', function(){
        console.log('user disconnected');//창을 닫으면 disconnected
    });

    socket.on("c-msg", function(msg) {
        console.log(msg);
        // io.emit("s-msg", socket.nickname + " : " + msg);
        io.to(socket.roomName).emit("s-msg", socket.nickname + " : " + msg);
        
        if(msg === 'SALL') { //현재 방에있는 사람들목록 불러오기(select ALL)
            console.log(rm.getNickNames(socket.roomName));
            socket.emit("s-msg",rm.getNickNames(socket.roomName).join(","));
            // socket.emit("s-msg")
        }
        if(msg === 'END') { 
            req.get("http://localhost:8080/api/10", function(error, response, body) {

                console.log("RESPONSE BODY+++++++++++++");
                console.log(body);
            })
        }
    
    });

    socket.on("c-setnick", function(userNickname){
        socket.nickname = userNickname;
        userMap[userNickname] = socket;
        io.emit("s-msg", userNickname + "님이 입장하셨습니다.");
        
        if(userNickname !== 'ZZZ') {
        //로비에 Join
        socket.join("lobby");
        //사용자의 방정보도 로비로 세팅
        socket.roomName = "lobby";
        rm.joinRoom('lobby', socket);
        }
    });

    socket.on("c-secret", function(secretMsg) {
        console.log(secretMsg);

        userMap[secretMsg.to].emit("s-msg", "귓속말-" + socket.nickname + ": " + secretMsg.msg);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});