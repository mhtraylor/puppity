/**
 * Created by Matthew on 6/5/2016.
 */
var Puppity = Puppity || {};

Puppity.game = new Phaser.Game(256, 512, Phaser.AUTO, 'game');

Puppity.game.state.add('Boot', Puppity.Boot);
Puppity.game.state.add('Load', Puppity.Load);
Puppity.game.state.add('Menu', Puppity.Menu);
Puppity.game.state.add('Game', Puppity.Game);

Puppity.game.state.start('Boot');
