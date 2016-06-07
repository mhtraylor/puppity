var Puppity = Puppity || {};

Puppity.Load = function(){};
Puppity.Load.prototype = {
    preload: function(){
        this.game.load.spritesheet('player', 'assets/hamburger_32.png', 32, 32);
        this.game.load.image('george', 'assets/george_64x64.png');
        
        this.game.load.image('floor', 'assets/floor_32.png');
        this.game.load.image('block', 'assets/block_32.png');
        this.game.load.image('wall_left', 'assets/wall_left_32.png');
        this.game.load.image('wall_right', 'assets/wall_right_32.png');
    },
    create: function(){
        this.game.state.start('Menu');
    },
    update: function(){}
};