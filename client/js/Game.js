var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    openConnection: function() {
        this.ws = new WebSocket("ws://localhost:8989");
        this.connected = false;
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.displayError.bind(this);
        this.ws.onopen = this.connectionOpen.bind(this);
    },

    connectionOpen: function() {
        this.connected = true;
        this.myText.text = 'connected\n';
    },

    onMessage: function(message) {
        
        var msg = JSON.parse(message.data);
        console.log(msg);
        if (undefined != msg.status && msg.status == "registration") {
            this.nick = msg.nick;
        }
        else {
        for (var i = 0; i < 10; i++) {
            if (msg[i].nick == this.nick) {
                this.player.x = parseInt(msg[i].x) * 32;
                this.player.y = parseInt(msg[i].y) * 32;
                this.barbarians[i].x = -200;
                this.barbarians[i].y = -200;
            }
            else {
                this.barbarians[i].x = parseInt(msg[i].x) * 32;
                this.barbarians[i].y = parseInt(msg[i].y) * 32;
            }
        }
        }
        this.myText.text = 'connected ' + this.nick + '\n' + message.data;
    },

    displayError: function(err) {
        console.log('Websocketerror: ' + err);
    },

    sendAction : function(action) {
        if (this.connected) { //} && this.can_send_action) {
            this.ws.send(JSON.stringify({action: action}));
            this.can_send_action = false;
        }
    },

    create: function() {

        this.nick = '';
        this.map = this.game.add.tilemap('level');

        this.map.addTilesetImage('tiles', 'tiles');

        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //this.foregroundLayer = this.map.createLayer('foregroundLayer');

        this.map.setCollisionBetween(1, 10000, true, 'blockedLayer');

        // make the world boundaries fit the ones in the tiled map
        this.blockedLayer.resizeWorld();

        this.barbarians = [];
        for (var i = 0; i < 10; i++) {
            this.barbarians[i] = this.game.add.sprite(-200, -200, 'barbarian');
        }        


        this.player = this.game.add.sprite(this.game.world.width/2, this.game.world.height-32, 'barbarian');
        this.player.frame = 0;


        this.game.camera.follow(this.player);

        this.music = this.game.add.audio('music');
        this.music.loop = true;
        //this.music.play();

        //  The score
//        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        //this.scoreText.fixedToCamera = true;
  //      this.score = 0;

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;

        this.showDebug = true; 


        //this.client = new Client();
        this.openConnection();
        this.myText = this.game.add.text(32, 32, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
        this.myText.fixedToCamera = true;

        this.can_send_action = true;
        
        //game.stage.disableVisibilityChange = true;

    },

    update: function() {
        this.timer++;

        if (this.cursors.left.isDown) {
            //  Move to the left
            this.sendAction("left");
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.sendAction("right");
        }

        if (this.cursors.up.isDown) {
            this.sendAction("up");
        }
        else if (this.cursors.down.isDown) {
            this.sendAction("down");
        }


    },

    death: function() {
        var result = this.findObjectsByType('playerStart', this.map, 'objectLayer');
        this.player.x = result[0].x;
        this.player.y = result[0].y;
        this.player.frame = 1; 

    },

    collectStar : function(player, star) {
        
        // Removes the star from the screen
        star.kill();
        if (star.dangerous) {
            player.kill();
        }

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },


    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, 'objects');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },


    render: function() {

        if (this.showDebug) {
//            this.game.debug.body(this.star);
            this.game.debug.body(this.player);
        }
    },
};
