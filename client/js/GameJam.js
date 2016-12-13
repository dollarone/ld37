var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.GameJam = function(){};

PlatformerGame.GameJam.prototype = {
  init: function(colour, timeout) { 
    this.colour = colour;
    this.timeout = timeout;
  },
  create: function() {

    //Change the background colour

    var yam = this.game.add.sprite(this.game.width/2, this.game.height/2, 'ludumdare');
    yam.anchor.setTo(0.5);
    yam.scale.setTo(0.5); //yam.width/this.game.width)
    this.game.stage.backgroundColor = this.colour;

    this.startTime = this.game.time.now; 

    this.game.input.keyboard.addCallbacks(this, this.skip, null, null);
    this.pressed = false;

  },

  skip : function() {
    if (!this.pressed) {
        this.pressed = true;
        this.state.start('MainMenu', true, false, this.colour, this.timeout);
    }
  },

  update: function() {
    if (this.startTime < this.game.time.now - 1500 && !this.pressed) {

        this.pressed = true;
        
        this.state.start('MainMenu', true, false, this.colour, this.timeout);
    }
  },

};
