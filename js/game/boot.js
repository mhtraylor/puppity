var Puppity = Puppity || {};

Puppity.Boot = function(){};
Puppity.Boot.prototype = {
    preload: function(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.renderer.renderSession.roundPixels = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    create: function(){
        this.game.state.start('Load');
    },
    update: function(){}
};

