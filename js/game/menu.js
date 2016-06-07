var Puppity = Puppity || {};

Puppity.Menu = function(){};
Puppity.Menu.prototype = {
    preload: function(){},
    create: function(){
        this.game.state.start('Game');
    },
    update: function(){}
};