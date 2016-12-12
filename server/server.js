var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({port: 8989});

console.log('Server started on 8989');


var players = [];
players.push({x:3, y:2, nick:"Conan", bot:true, life:3, items:0});
players.push({x:18, y:2, nick:"Kull", bot:true, life:3, items:0});
players.push({x:10, y:2, nick:"Thorgrim", bot:true, life:3, items:0});
players.push({x:11, y:5, nick:"Bombaata", bot:true, life:3, items:0});
players.push({x:8, y:6, nick:"Togra", bot:true, life:3, items:0});

players.push({x:3, y:16, nick:"Alaric", bot:true, life:2, items:0});
players.push({x:18, y:17, nick:"Clovic", bot:true, life:3, items:0});
players.push({x:14, y:13, nick:"Gundahar", bot:true, life:3, items:0});
players.push({x:10, y:10, nick:"Harald", bot:true, life:3, items:0});
players.push({x:6, y:13, nick:"Grim", bot:true, life:1, items:0});
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

var items = [];

items.push({type:"amulet",x:-10,y:-10, owner:"", dead:false});
items.push({type:"helm1",x:-10,y:-10, owner:"", dead:false});
items.push({type:"helm2",x:-10,y:-10, owner:"", dead:false});
items.push({type:"helm3",x:-10,y:-10, owner:"", dead:false});
items.push({type:"shield1",x:-10,y:-10, owner:"", dead:false});
items.push({type:"shield2",x:-10,y:-10, owner:"", dead:false});
items.push({type:"shield3",x:-10,y:-10, owner:"", dead:false});
items.push({type:"shield4",x:-10,y:-10, owner:"", dead:false});
items.push({type:"armour1",x:-10,y:-10, owner:"", dead:false});
items.push({type:"armour2",x:-10,y:-10, owner:"", dead:false});
items.push({type:"sword",x:-10,y:-10, owner:"", dead:false});
items.push({type:"pineapple",x:-10,y:-10, owner:"", dead:false});
items.push({type:"potion1",x:-10,y:-10, owner:"", dead:false});
items.push({type:"potion2",x:-10,y:-10, owner:"", dead:false});
items.push({type:"potion3",x:-10,y:-10, owner:"", dead:false});


for (item in parsedJSON.layers[2].objects) {
    console.log(parsedJSON.layers[2].objects[item]);
    var type = parsedJSON.layers[2].objects[item].properties.type;
    var x = parseInt(parsedJSON.layers[2].objects[item].x/32);
    var y = parseInt(parsedJSON.layers[2].objects[item].y/32);
    for (item in items) {
        if (items[item].type == type) {
            items[item].x = x;
            items[item].y = y;
        }
    }
}

for (item in items) {
    console.log(items[item].type + ": " + items[item].x + "/" + items[item].y);
}


var buffer = "";
for(var y=0; y < height; y++) {
  for(var x=0; x < width; x++) {
    if (map[y][x] < 10) {
        buffer += " ";
    }
    if (map[y][x] == 0) {
        buffer += " , ";
    }
    else {
        buffer += map[y][x] + ", ";
    }
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
            if (players[i]["life"] == 0) {
                players[i] = {x:10, y:18, nick:nick, bot:false, life:3, items:0};
                created = true;
            }
            i++;
        }
        if (!created) {
           i = 0;
        }
        while (!created && i < 10) {

            if (players[i]["bot"] == true) {
                players[i] = {x:10, y:18, nick:nick, bot:false, life:3, items:0};
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


var manly_adjectives = ['Mighty', 'Powerful', 'Hairy', 'Macho', 'Slobbering', 'Grizzly', 'Menacing', 'Wild', 'Mute', 'Rabid',
                        'Barbaric', 'Dirty', 'Dusty', 'Strong', 'Brave', 'Scarred', 'Monobrowy', 'Stenching', 'Brutish', 
                        'Uncultured', 'Simple', 'Brutal', 'Untamed', 'Vicious', 'Vulgar', 'Coarse', 'Primitive'];

var barbarian = ['Barbarian', 'Man', 'Warrior', 'Fighter', 'Swordsman', 'Sumerian', 'Pitfighter', 'Gladiator', 'Wildman',
                 'Brute', 'Savage', 'Hoplite', 'Primitive', 'Beastman', 'HalfOgre'];

var barbarian_names = [ 'Sigtrygg', 'Thorstein', 'Hjalkar', 'Sigve', 'Skegg', 'Thorberg', 'Hauk', 'Jon',
                        'Erlend', 'Anlaf', 'Asmund', 'Ingmar', 'Einer', 'Ingimar', 'Gunnvid', 'Vegeir', 'Thorgil',
                        'Hrein', 'Glam', 'Ragnar', 'Eifind', 'Ulf', 'Olav', 'Karstein', 'Bror', 'Gauk', 'Rogne',
                        'Stein', 'Tor', 'Tyrkir', 'Thorlak', 'Snorre', 'Oddvar', 'Eydis', 'Geitir', 'Steinar', 'Runolf',
                        'Galter', 'Skidi', 'Hroar', 'Bolverk', 'Sveni', 'Hrasvelg', 'Arin', 'Bjorn', 'Hafr', 'Ofieg',
                        'Tyrfing', 'Alvi', 'Alver', 'Ridan', 'Thang', 'Cromm', 'Guth', 'Kahvor', 'Crat', 'Nath', 'Thang',
                        'Theod', 'Olaf', 'Gorg', 'Ratdrud', 'Thokgrand', 'Forgrad', 'Barax', 'Kahtarg', 'Grat', 'Grimm',
                        'Fledrid', 'Vorthak', 'Wulf', 'Rancuth', 'Theon', 'Vor', 'Ra', 'Winhall', 'Thok', 'Odin', 'Glor', 'Wutan',
                        'Nanlof', 'Wirak', 'Balder', 'Chop', 'Ferth', 'Bard', 'Valan', 'Theonhor', 'Rorran', 'Ulv', 'Rein',
                        'Eivind', 'Ax', 'Einar', 'Huwaru', 'Dragrand', 'Ratrar', 'Targwyn', 'Slaugmak', 'Mandne', 'Krummof', 
                        'Feum', 'Possom', 'Kahuca', 'Brytswith', 'Wiggrund', 'Varakrom', 'Anka', 'Withegrad', 'Mornvor', 'Clovic',
                        'Hallaf', 'Warkrum', 'Gunnar', 'Skullrar', 'Slaugdr', 'Karis', 'Cromty', 'Niran', 'Huthok', 'Slaugax', 
                        'Grok', 'Utarg', 'Wigtarg', 'Brink', 'Theanvor', 'Warugar', 'Keleto', 'Beorn', 'Stelne', 'Anhelm', 'Togra',
                        'Krolmwig', 'Sirmak', 'Thokstan', 'Ethelan', 'Ivar', 'Hallfrey', 'Sede', 'Hugrim', 'Cromand', 'Alaric',
                        'Tharghor', 'Gradgund', 'Stanconn', 'Thunkromm', 'Brytmand', 'Oystein', 'Wulfthak', 'Brakca', 
                        'Grunceol', 'Hukrom', 'Hudryt', 'Wenra', 'Bianca', 'Todrud', 'Narghal', 'Carsten', 'Thanbeo', 'Caror',
                        'Gundval', 'Riceo', 'Crommethel', 'Kah', 'Ancromm', 'Bombaata', 'Huhil', 'Horanvor', 'Drytra', 'Rakceol',
                        'Carorhall', 'Grimhes', 'Uhall', 'Escwulf', 'Etheldel', 'Thargald', 'Takhesgund', 'Eadwyn', 'Grim',
                        'Reya', 'Stantheod', 'Krolm', 'Thorgrim', 'Nargthryth', 'Riri', 'Grandslaug', 'Waldhor', 'Garmak',
                        'Tharg', 'Vawulf', 'Kull', 'Thek', 'Morn', 'Freawaru', 'Ricae', 'Brytnarg', 'Krolm', 'Kele', 'Thang',
                        'Gundahar', 'Orat', 'Ethelnan', 'Reyafi', 'Utarg', 'Conan', 'Brakdyr', 'Anvorred', 'Croea', 'Helm', 'Harald'];

var currentName = 0;

var fs = require('fs');

var arg = process.argv[2];
console.log("arg is " + arg);

var allNicks = {};

function generateNick(userhash) {
    var tmp = barbarian_names[currentName];
    currentName++; 
    if (currentName >= barbarian_names.length) {
        currentName = 0;
    }
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

function calculateAndSetItems(i) {
    console.log("calculating");
    var score = 0;
    for (item in items) {
        if (item <= 10 && items[item].owner == players[i].nick) {
            console.log("adding item# " + item + " for " + (Math.pow(2, (parseInt(item))).toString()));
            score += Math.pow(2, parseInt(item));
        }
    }
    players[i].items = score;
}

function attack(player) {

    var x = player.x;
    var y = player.y;
    if (player.action == "left") {
        x -= 1;
    }
    else if (player.action == "right") {
        x += 1;
    }
    else if (player.action == "up") {
        y -= 1;
    }
    else if (player.action == "down") {
        y += 1;
    }

    for(var i = 0; i < players.length; i++) {
        if (player.nick != players[i].nick && players[i].life > 0 && players[i].x == x && players[i].y == y) {
            // yey
            var bonus = 0;
            var abort = false;
            if (player.action == "left" && map[players[i].y][players[i].x-1] < 20) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x-1 == players[j].x && players[i].y == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].x -= 1;
                }
            }
            else if (player.action == "right" && map[players[i].y][players[i].x+1] < 20) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x+1 == players[j].x && players[i].y == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].x += 1;
                }
            }
            else if (player.action == "up" && map[players[i].y-1][players[i].x] < 20) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x == players[j].x && players[i].y-1 == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].y -= 1;
                }
            }
            else if (player.action == "down" && map[players[i].y+1][players[i].x] < 20) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x == players[j].x && players[i].y+1 == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].y += 1;
                }
            }
            else {
                bonus = 2;
            }

            var defence = 0;
            var armour = false;
            var shield = false;
            var helmet = false;

            for (item in items) {
                if (items[item].owner == players[i].nick) {
                    if (items[item].type == "armour1" || items[item].type == "armour2") {
                        armour = true;
                    }
                    else if (items[item].type == "helm1" || items[item].type == "helm2" || items[item].type == "helm3") {
                        helmet = true;
                    }
                    else if (items[item].type == "shield1" || items[item].type == "shield2" 
                        || items[item].type == "shield3" || items[item].type == "shield4") {
                        shield = true;
                    }
                }
                if (items[item].owner == player.nick && items[item].type == "sword") {
                    bonus += 2;
                }
            }

            if (armour) {
                defence += 2;
            }
            if (shield) {
                defence += 1;
            }
            if (helmet) {
                defence += 1;
            }

            if (getRandomInt(1,11) + bonus - defence > 5) {
                players[i].life -= 1;
            }

            // kill confirmed
            if (players[i].life == 0) {
                dropItems(players[i], player.action);
                players[i].x = -100;
            }

            return true;
        }
    }
}

// the player who died and the action of either the attacker or himself
function dropItems(player, action) {
    var x = player.x;
    var y = player.y;
    var resetItems = false;

    if (map[y][x] < 20 && map[y][x] > 10 || map[y][x] == 0) {

    }
    else {
        if (action == "left" && ((map[y][x+1] < 20 && map[y][x+1] > 10) || map[y][x+1] == 0)) {
            x += 1;
        }
        else if (action == "right" && ((map[y][x-1] < 20 && map[y][x-1] > 10) || map[y][x-1] == 0)) {
            x -= 1;
        }
        else if (action == "up" && ((map[y+1][x] < 20 && map[y+1][x] > 10) || map[y+1][x] == 0)) {
            y += 1;
        }
        else if (action == "down" && ((map[y-1][x] < 20 && map[y-1][x] > 10) || map[y-1][x] == 0)) {
            y -= 1;
        }
        else {
            if (((map[y][x+1] < 20 && map[y][x+1] > 10) || map[y][x+1] == 0)) {
                x += 1;
            }
            else if (((map[y][x-1] < 20 && map[y][x-1] > 10) || map[y][x-1] == 0)) {
                x -= 1;
            }
            else if (((map[y+1][x] < 20 && map[y+1][x] > 10) || map[y+1][x] == 0)) {
                y += 1;
            }
            else if (((map[y-1][x] < 20 && map[y-1][x] > 10) || map[y-1][x] == 0)) {
                y -= 1;
            }
            else {
                resetItems = true;
            }

        }
    }

    for (item in items) {
        if (items[item].owner == player.nick) {
            items[item].owner = "";
            items[item].x = x;
            items[item].y = y;
            if (resetItems) {
                items[item].dead = true;
            }
        }
    }

}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function process_and_send_events() {
    turn++;
    console.log("Turn " + turn);

    for(var i = 0; i < players.length; i++) {
        
        if (players[i].action == "left") {

            if (attack(players[i])) {

            }
            else if (players[i].x > 0 && map[players[i].y][players[i].x-1] < 20) {
                players[i].x -= 1;
            }
        }
        else if (players[i].action == "right") {
            if (attack(players[i])) {

            }
            else if (players[i].x < width-1 && map[players[i].y][players[i].x+1] < 20) {
                players[i].x += 1;
            }
        }
        else if (players[i].action == "up") {
            if (attack(players[i])) {

            }
            else if (players[i].y > 0 && map[players[i].y-1][players[i].x] < 20) {
                players[i].y -= 1;
            }
        }
        else if (players[i].action == "down") {
            if (attack(players[i])) {

            }
            else if (players[i].y < height-1 && map[players[i].y+1][players[i].x] < 20) {
                players[i].y += 1;
            }
        }
        if (map[players[i].y][players[i].x] < 11 && map[players[i].y][players[i].x] != 0) {
            players[i].life = 0;
            dropItems(players[i], players[i].action);
            players[i].x = -100;
        }

        var calc = false;
        for (item in items) {
            if (items[item].owner == "" && items[item].dead == false && items[item].x == players[i].x && items[item].y == players[i].y) {
                items[item].x = -100;
                if (items[item].type == "potion1" || items[item].type == "potion2" 
                     || items[item].type == "potion3") {
                    items[item].dead = true;
                    players[i].life = 3;
                } 
                else if (items[item].type == "pineapple") {
                    items[item].dead = true;
                }
                else {
                    items[item].owner = players[i].nick;
                    calc = true;                    
                }
            }
        }
        if (calc) {
            calculateAndSetItems(i);
        }
        players[i].action = "";

    }

    var payload = {};
    payload["players"] = players;
    payload["items"] = items;
    for(var i in wss.clients) {
        wss.clients[i].send(JSON.stringify(payload));
    }
}
setInterval(process_and_send_events, 0.5*1000);
    
