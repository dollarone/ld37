var PlatformerGame = PlatformerGame || {};

PlatformerGame.game = new Phaser.Game(400, 320, Phaser.AUTO, '');
//, '', { preload: preload, create: cr4ate, update: update });

PlatformerGame.game.state.add('Boot', PlatformerGame.Boot);
PlatformerGame.game.state.add('Preload', PlatformerGame.Preload);
PlatformerGame.game.state.add('Logo', PlatformerGame.Logo);
PlatformerGame.game.state.add('GameJam', PlatformerGame.GameJam);
PlatformerGame.game.state.add('Game', PlatformerGame.Game);

PlatformerGame.game.state.start('Boot');