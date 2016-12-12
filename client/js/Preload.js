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
    //this.game.load.audio('music', 'assets/audio/music.ogg');

  },
  create: function() {
    var colour = "eee";
    var timeout = 2;
    this.state.start('Game', true, false, colour, timeout);
  }
};
