var PlatformerGame = PlatformerGame || {};

PlatformerGame.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
PlatformerGame.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/loadingbar.png');
  },
  create: function() {
    //loading screen will have a black background
    this.game.stage.backgroundColor = '#000';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;


    this.game.stage.smoothed = false;
    this.game.smoothed = false;
    this.game.antialias = false;
    
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    
    this.state.start('Preload');
  }
};