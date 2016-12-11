var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({port: 8989});

console.log('Server started on 8989');


var players = [];
players.push({x:3, y:2, nick:"Conan", bot:true, dead:false, items:0});
players.push({x:18, y:2, nick:"Kull", bot:true, dead:false, items:0});
players.push({x:10, y:2, nick:"Thorgrim", bot:true, dead:false, items:0});
players.push({x:11, y:5, nick:"Bombaata", bot:true, dead:false, items:0});
players.push({x:8, y:6, nick:"Togra", bot:true, dead:false, items:0});

players.push({x:2, y:16, nick:"Alaric", bot:true, dead:false, items:0});
players.push({x:18, y:17, nick:"Clovic", bot:true, dead:false, items:0});
players.push({x:14, y:13, nick:"Gundahar", bot:true, dead:false, items:0});
players.push({x:10, y:10, nick:"Harald", bot:true, dead:false, items:0});
players.push({x:6, y:13, nick:"Grim", bot:true, dead:false, items:0});
currentPlayer = 0;

var start_x = 10;
var start_y = 19;

var next_player_id = 0;
var parsedJSON = require('../client/assets/tilemaps/level.json');

//console.log(parsedJSON.layers[0].data);

var height = 20;
var width  = 20;


var z = 0;

var map = [width];

for(var y=0; y < height; y++) {
    map[y] = [height]
        for(var x=0; x < width; x++) {
        map[y][x] = parsedJSON.layers[1].data[z];
        //console.log(parsedJSON[z]);
        z++;

    }
}

var buffer = "";
for(var y=0; y < height; y++) {
  for(var x=0; x < width; x++) {
    if (map[y][x] < 10) {
        buffer += " ";
    }
    buffer += map[y][x] + ", ";
  }
  buffer += "\n"
}

console.log(buffer);
/*
{ "height":20,
 "layers":[
        {
         "data"
*/
var users = {};


wss.on('connection', function(ws) {

    
    console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key']);
    var user = ws.upgradeReq.headers['sec-websocket-key'];
    if (user in users) {
        console.log("user already registered?");
    }
    else {
        
        var nick = generateNick(user);

        var i=0;
        var created = false;
        while (!created && i < 10) {
            if (players[i]["dead"] == true) {
                players[i] = {x:10, y:19, nick:nick, bot:false, dead:false, items:0};
                created = true;
            }
            i++;
        }
        if (!created) {
           i = 0;
        }
        while (!created && i < 10) {

            if (players[i]["bot"] == true) {
                players[i] = {x:10, y:19, nick:nick, bot:false, dead:false, items:0};
                created = true;
            }
            i++;
        }
        
        if (created) {

            users[user] = i - 1;
            var payload = new Object();
            payload["status"] = "registration";
            payload["nick"] = nick;
            console.log("sending " + payload.toString());
            ws.send(JSON.stringify(payload));
        }
    }

    ws.on('message', function(message) {       
        var incomingMsg = JSON.parse(message);
        if (user in users) {
            console.log("yes2");
            players[users[user]].action = incomingMsg.action;
        }

        console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key']);

        console.log(incomingMsg.action);
        
    });
});



var adjectives = ['Happy', 'Hungry', 'Pink', 'Jumpy', 'Green', 'Blue', 'Yellow', 'Red', 'Orange', 
'Purple', 'White', 'Black', 'Grey', 'Offwhite', 'Indigo', 'Teal', 'Glowering', 'Transparent', 'Radiant', 
'Beautiful', 'Wonderful', 'Flowery', 'Aggressive', 'Sleepy', 'Fierce', 'Eager', 'Strong', 'Laborious', 'Funny', 
'Giggly', 'Huggy', 'Cozy', 'Lovely', 'Cheeky', 'Cute', 'Cheery', 'Slippery', 'Amazing', 'Brilliant', 'Nice', 
'Fantastic', 'Striped', 'Bright', 'Clever', 'Tall', 'Dark', 'Winged', 'Sexy', 'Powerful', 'Foxy', 'Big', 'Small', 'Medium'];

var animals = ['Hippo', 'Bear', 'Elephant', 'Frog', 'Sloth', 'SlowLoris', 'Owl', 'Millipede', 'Centipede', 
'Monkey', 'Cat', 'Dog', 'Dragon', 'Unicorn', 'Pegasus', 'NyanCat', 'Elk', 'Lemur', 'Vampire', 'Werewolf', 
'Wolf', 'Doge', 'Husky', 'Hen', 'Chicken', 'Ape', 'Orangutan', 'Badger', 'Flamingo', 'Parakeet', 'Woodpecker', 
'Zebra', 'Koala', 'Panda', 'Pelican', 'Albatross', 'Pug', 'Panther', 'Bulldog', 'Parrot', 'Thing', 'Bat', 'Batman', 
'Hedgehog', 'Squirrel', 'Porcupine', 'Polarbear', 'Fox', 'Seal', 'Donkey', 'Rooster', 'Lion', 'Tiger', 'Heffalump', 'Woozle'];

var manly_adjectives = ['Mighty', 'Powerful', 'Hairy', 'Macho', 'Slobbering', 'Grizzly', 'Menacing', 'Wild', 'Mute', 'Rabid',
                        'Barbaric', 'Dirty', 'Dusty', 'Strong', 'Brave', 'Scarred', 'Monobrowy', 'Stenching', 'Brutish', 
                        'Uncultured', 'Simple', 'Brutal', 'Untamed', 'Vicious', 'Vulgar', 'Coarse', 'Primitive'];

var barbarian = ['Barbarian', 'Man', 'Warrior', 'Fighter', 'Swordsman', 'Sumerian', 'Pitfighter', 'Gladiator', 'Wildman',
                 'Brute', 'Savage', 'Hoplite', 'Primitive', 'Beastman', 'Half-Ogre'];


var fs = require('fs');

var arg = process.argv[2];
console.log("arg is " + arg);

var allNicks = {};

function generateNick(userhash) {
    var tmp = "";
    var test = false;
    while (!test) {
        tmp = manly_adjectives[Math.floor(Math.random() * manly_adjectives.length)];
        tmp += manly_adjectives[Math.floor(Math.random() * manly_adjectives.length)];
        tmp += barbarian[Math.floor(Math.random() * barbarian.length)]

        test = true;
        for (var key in allNicks) {
            if (allNicks[key] == tmp) {
                test = false;
                console.log("oh deer! " + tmp + " already in use!");
            }
        }
    }

    allNicks[userhash] = tmp;

    fs.appendFile('ld37-nicks.txt', userhash + ':' + tmp + ":" + getDateTime() + "\n", function (err) {

    });
    return tmp;
}


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}

var run = true;
var turn = 0;


function process_and_send_events() {
    turn++;
    console.log("Turn " + turn);

    for(var i = 0; i < players.length; i++) {
        console.log("player" + i);
        if (players[i].action == "left") {
            console.log("left done");
            if (players[i].x > 0 && map[players[i].y][players[i].x-1] == 0) {
                players[i].x -= 1;
            }
        }
        else if (players[i].action == "right") {
            if (players[i].x < width-1 && map[players[i].y][players[i].x+1] == 0) {
                players[i].x += 1;
            }
        }
        else if (players[i].action == "up") {
            if (players[i].y > 0 && map[players[i].y-1][players[i].x] == 0) {
                players[i].y -= 1;
            }
        }
        else if (players[i].action == "down") {
            if (players[i].y < height-1 && map[players[i].y+1][players[i].x] == 0) {
                players[i].y += 1;
            }
            if (players[i].y == height-1 && !((players[i].y+1) in map) && (players[i].x == 9 || players[i].x == 10)) {
                players[i].y += 1;
            }
        }
        players[i].action = "";

    }



    for(var i in wss.clients) {
        wss.clients[i].send(JSON.stringify(players));
    }
}
setInterval(process_and_send_events, 0.5*1000);
    
