var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.Postgame = function(){};

PlatformerGame.Postgame.prototype = {
  init: function(myscore) { 
    this.calculateBarbarianFrame(parseInt(myscore));
    this.summary = "You made it out of the Ring of Fire cave!";
    
    if (this.amulet) {
        this.summary = "You made it out of the Ring of Fire cave\nwith the amulet! You win!";
        if (this.sword || this.helmet || this.armour) {
          this.summary += "\n\nYou also found the following items: ";
        }
    }
    else if (this.sword || this.helmet || this.armour) {
      this.summary += "\n\nYou found the following items: ";
    }
    if (this.sword) {
     this.summary += "\nA twinkling sword";
    } 
    if (this.helmet) {
     this.summary += "\nA mighty helmet";
    } 
    if (this.armour) {
     this.summary += "\nAn old chain-mail";
    } 
    if (this.shield) {
     this.summary += "\nA wooden shield";
    } 
     this.summary += "\n\n\nPress enter to play again";
    this.myText = this.game.add.text(32, 32, this.summary, { font: "20px Arial", fill: "#ff0044"});
    this.colour = "#000";
  },
  create: function() {

    //Change the background colour

    this.game.stage.backgroundColor = this.colour;

    this.startTime = this.game.time.now; 

    this.game.input.keyboard.addCallbacks(this, this.skip, null, null);
    this.pressed = false;

  },

  skip : function() {
    if (!this.pressed) {
        this.pressed = true;
        this.state.start('Game');
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
        

        this.sword = sword;
        this.armour = armour;
        this.shield = shield;
        this.helmet = helmet;
        if (amulet == 10) {
           this.amulet = true;
        }
    },
};
