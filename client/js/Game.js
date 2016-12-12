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

        this.queuedAction = "";
        
        var msg = JSON.parse(message.data);
        console.log(msg);
        if (undefined != msg.status && msg.status == "registration") {
            this.nick = msg.nick;
        }
        else {
            for (var i = 0; i < 10; i++) {
                /*if (msg.players[i].nick == this.nick) {
                    this.player.x = parseInt(msg.players[i].x) * 32;
                    this.player.y = parseInt(msg.players[i].y) * 32;
                    this.player.life = parseInt(msg.players[i].life);
                    this.player.frame = this.calculateBarbarianFrame(parseInt(msg.players[i].items));
                    this.barbarians[i].x = -100;
                }
                else {*/
                    this.barbarians[i].life = parseInt(msg.players[i].life);
                    this.barbarianHearts[i].frame = 3 - parseInt(msg.players[i].life);
                    if (parseInt(msg.players[i].life) == 0) {
                        this.barbarians[i].x = -100;
                        this.barbarianNames[i].x = -100;
                    }
                    else {
                        this.barbarians[i].x = parseInt(msg.players[i].x) * 32;
                        this.barbarians[i].y = parseInt(msg.players[i].y) * 32;
                        this.barbarianNames[i].x = parseInt(msg.players[i].x) * 32 + 16;
                        this.barbarianNames[i].y = parseInt(msg.players[i].y) * 32 - 1;
                    }
                    this.barbarians[i].frame = this.calculateBarbarianFrame(parseInt(msg.players[i].items));
                //}

                this.barbarianNames[i].text = msg.players[i].nick;
                this.barbarianNames[i].updateText();

                if (!this.cameraIsSet && msg.players[i].nick == this.nick) {
                    this.game.camera.follow(this.barbarians[i]);
                    this.cameraIsSet = true;

                }
            }
            for (var i = 0; i < 15; i++) {
                this.items[i].x = parseInt(msg.items[i].x) * 32;
                this.items[i].y = parseInt(msg.items[i].y) * 32;
                if (msg.items[i].type == "sword") {
                    this.glintSprite.x = this.items[i].x + 3;
                    this.glintSprite.y = this.items[i].y + 2;
                    if (msg.items[i].owner != "") {
                        for (var j = 0; j < 10; j++) {
                            if (this.barbarianNames[j].text == msg.items[i].owner) {
                                this.glintSprite.x = this.barbarians[j].x + 3;
                                this.glintSprite.y = this.barbarians[j].y + 3;
                                this.glintSprite.bringToTop();
                            }
                        }
                    }
                }
            }
        }
        this.myText.text = 'connected ' + this.nick + '\n' + message.data;
    },

    displayError: function(err) {
        console.log('Websocketerror: ' + err);
    },

    sendAction : function(action) {
        if (action != this.queuedAction) {
            if (this.connected) { //} && this.can_send_action) {
                this.ws.send(JSON.stringify({action: action}));
                this.queuedAction = action;
            }
        }
    },

    calculateBarbarianFrame: function(itemscore) {
        var score = itemscore;
        var sword = false;
        var armour = false;
        var shield = false;
        var helmet = false;
        var amulet = 0;

        if (parseInt(score / 1024) == 1) {
            sword = true;
            score -= 1024;
        }
        if (parseInt(score / 512) == 1) {
            armour = true;
            score -= 512;
        }
        if (parseInt(score / 256) == 1) {
            armour = true;
            score -= 256;
        }
        if (parseInt(score / 128) == 1) {
            shield = true;
            score -= 128;
        }
        if (parseInt(score / 64) == 1) {
            shield = true;
            score -= 64;
        }
        if (parseInt(score / 32) == 1) {
            shield = true;
            score -= 32;
        }
        if (parseInt(score / 16) == 1) {
            shield = true;
            score -= 16;
        }
        if (parseInt(score / 8) == 1) {
            helmet = true;
            score -= 8;
        }
        if (parseInt(score / 4) == 1) {
            helmet = true;
            score -= 4;
        }
        if (parseInt(score / 2) == 1) {
            helmet = true;
            score -= 2;
        }
        if (score == 1) {
            amulet = 10;
        }

        if (armour) {
            if (shield) {
                if (helmet) {
                    return 5 + amulet;
                }
                else {
                    return 3 + amulet;
                }
            }
            else {
                if (helmet) {
                    return 4 + amulet;
                }
                else {
                    return 1 + amulet;
                }
            }
        }
        else {
            if (shield) {
                if (helmet) {
                    return 7 + amulet;
                }
                else {
                    return 2 + amulet;
                }
            }
            else {
                if (helmet) {
                    return 6 + amulet;
                }
                else {
                    return 0 + amulet;
                }
            }

        }

        /*
        1 = amulet
        2 = helmet
        4 = helmet
        8 = helmet
        16 = shield
        32 = shield
        64 = shield
        128 = shield
        256 = armour
        512 = armour
        1024 = sword*/
    },

    create: function() {
        this.queuedAction = "";
        this.nick = '';
        this.cameraIsSet = false;
        this.map = this.game.add.tilemap('level');

        this.map.addTilesetImage('tiles', 'tiles');

        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //this.foregroundLayer = this.map.createLayer('foregroundLayer');

        this.map.setCollisionBetween(1, 10000, true, 'blockedLayer');
        this.blockedLayer.resizeWorld();


        this.barbarians = [];
        this.barbarianNames = [];
        this.barbarianHearts = [];
        var style = { font: "bold 12px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };
        //#da4200"

        this.items = [];
        for (var i = 0; i < 10; i++) {
            this.barbarians[i] = this.game.add.sprite(-200, -200, 'barbarian');
            this.barbarianNames[i] = this.game.add.text(32, 32, "", style);
            this.barbarianNames[i].anchor.setTo(0.5, 0.5);
        }
        for (var i = 0; i < 10; i++) {
            this.barbarianHearts[i] = this.game.add.sprite(0, 32, 'heart');
            this.barbarians[i].addChild(this.barbarianHearts[i]);

        }
        for (var i = 0; i < 15; i++) {
            this.items[i] = this.game.add.sprite(-200, -200, 'items');
            this.items[i].frame = 4;
            this.items[i].dead = false;
            this.items[i].owner = "";
        }        
        this.items[0].frame = 0;
        this.items[0].type = "amulet";
        this.items[1].frame = 2;
        this.items[1].type = "helm1";
        this.items[2].frame = 2;
        this.items[2].type = "helm2";
        this.items[3].frame = 2;
        this.items[3].type = "helm3";
        this.items[4].frame = 1;
        this.items[4].type = "shield1";
        this.items[5].frame = 1;
        this.items[5].type = "shield2";
        this.items[6].frame = 1;
        this.items[6].type = "shield3";
        this.items[7].frame = 1;
        this.items[7].type = "shield4";
        this.items[8].frame = 3;
        this.items[8].type = "armour1";
        this.items[9].frame = 3;
        this.items[9].type = "armour2";
        this.items[10].frame = 7;
        this.items[10].type = "sword";
        this.items[11].frame = 5;
        this.items[11].type = "pineapple";
        this.items[12].type = "potion1";
        this.items[13].type = "potion2";
        this.items[14].type = "potion3";
 
        this.music = this.game.add.audio('music');
        this.music.loop = true;
        //this.music.play();

        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;

        this.openConnection();
        this.myText = this.game.add.text(32, 32, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
        this.myText.fixedToCamera = true;

        this.can_send_action = true;
        this.glint = false;
        this.glintSprite = this.game.add.sprite(-100, 0, 'glint');  
        this.game.add.tween(this.glintSprite).to( { alpha: 0 }, 600, "Linear", true, 0, -1, true);

    },

    update: function() {
        this.timer++;

        if (this.glint) {
            if (this.timer % 200 == 0) {
                this.glintSprite.visible = true;
            }
            if (this.timer % 200 == 20) {
                this.glintSprite.visible = false;
            }
        }

        if (this.cursors.left.isDown) {
            this.sendAction("left");
        }
        else if (this.cursors.right.isDown) {
            this.sendAction("right");
        }

        if (this.cursors.up.isDown) {
            this.sendAction("up");
        }
        else if (this.cursors.down.isDown) {
            this.sendAction("down");
        }


    },
};
