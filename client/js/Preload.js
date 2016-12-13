var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.game.load.spritesheet('logo-tiles', 'assets/images/logo-tiles.png', 17, 16);
    this.game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
    this.game.load.spritesheet('barbarian', 'assets/images/barbarian1.png', 32, 32);
    this.game.load.spritesheet('heart', 'assets/images/heart.png', 32, 9);
    this.game.load.spritesheet('items', 'assets/images/items.png', 32, 32);
    this.load.tilemap('level', 'assets/tilemaps/level.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('glint', 'assets/images/glint.png');
    this.load.image('ludumdare', 'assets/images/ludumdare.png');
    this.load.image('title', 'assets/images/title.png');
    this.game.load.audio('dollarone', 'assets/audio/dollarone_dollarone.ogg');
    this.game.load.audio('swords', 'assets/audio/swords.ogg');
    this.game.load.audio('ugh1', 'assets/audio/ugh1.ogg');
    this.game.load.audio('ugh2', 'assets/audio/ugh2.ogg');
    this.game.load.audio('ugh3', 'assets/audio/ugh3.ogg');
    this.game.load.audio('aaaargh', 'assets/audio/aaaargh.ogg');
    //this.game.load.audio('music', 'assets/audio/main_theme.ogg');
    //this.game.load.audio('title-theme', 'assets/audio/title-theme.ogg');    
    this.game.load.audio('music', 'assets/audio/both.ogg');    

  },
  create: function() {
    var colour = "000";
    var timeout = 2;
    this.state.start('Logo', true, false, colour, timeout);
  }
};
