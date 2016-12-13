var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.MainMenu = function(){};

PlatformerGame.MainMenu.prototype = {
  init: function(colour, timeout) { 
    this.colour = colour;
    this.timeout = timeout;
  },
  create: function() {

    
    
    var title = this.game.add.sprite(this.game.width/2, this.game.height/2, 'title');
    title.anchor.setTo(0.5);
    
    this.game.stage.backgroundColor = this.colour;

    this.splashMusic = this.game.add.audio('music');
    this.splashMusic.loop = true;
    this.splashMusic.volume = 0.8;    
    this.splashMusic.play();
    this.startTime = this.game.time.now; 

    this.game.input.keyboard.addCallbacks(this, this.skip, null, null);
    this.pressed = false;
    this.goOn = false;
  },

  skip : function() {
    if (!this.pressed) {
        this.pressed = true;
        this.state.start('Game');
    }
  },

  update: function() {
    if (this.startTime < this.game.time.now - 5500 && !this.goOn) {

        this.goOn = true;
        this.press = this.game.add.text(110, 150, "Press enter to start", { font: "24px Arial", fill: "#da4200"});
        this.press.alpha = 0;
		this.game.add.tween(this.press).to( { alpha: 1 }, 1000, "Linear", true, 0, -1, true);

    }
  },
};
