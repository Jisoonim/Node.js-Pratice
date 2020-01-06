
//채팅방 
var roomManager = (function () {
    var roomObj = {};

    // roomObj['lobby'] = [];

    function joinRoom(roomName, socket) {
        
        if(!roomObj[roomName]) { //만약 방(방이름)이 존재하지 않는다면
            roomObj[roomName] = [];
        }
        roomObj[roomName].push(socket);
    }

    function getNickNames(roomName) {

        var names = [];
        var arr = roomObj[roomName];
        for(var i = 0; i < arr.length; i++) {
            names.push(arr[i].nickname);
        }
        return names;
    }

    // var count = 0;

    // function increase() {
    //     count++;
    //     return count;
    // }

    return {joinRoom, getNickNames} //increase : increase

})();

// console.log(roomManager.increase());
// console.log(roomManager.increase());
// console.log(roomManager.increase());

module.exports = roomManager;

