/**
 * Created by Matthew on 6/5/2016.
 */
var Puppity = Puppity || {};

Puppity.CONFIG = {
        PLAYER: {
            USE_ACCEL: true,
            USE_DRAG: true,
            USE_CONST_VEL: false,
            USE_DOUBLE_JUMP: true,

            MAX_VEL_X: 300,
            MAX_VEL_Y: 600,
            ACCEL: 1500,
            DRAG_X: 600,
            DRAG_Y: 0,
            JUMP_VEL: -600,
            GRAVITY: 2600,
            BOUNCE: 0.5
        },
        BLOCKS: {
            DROP_VEL: 75,
            DROP_INTERVAL: 1000,
            SPAWN_RANGE_X0: 32,
            SPAWN_RANGE_X1: 186
        }
};

/**
 * Player base sprite.
 * @param game
 * @param x
 * @param y
 * @param image
 * @constructor Puppity.Player
 */
Puppity.Player = function(game, x, y, image) {
    Phaser.Sprite.call(this, game, x, y, image);
    // sprite setup
    this.anchor.setTo(0.5, 0.5);
    // TODO: animation setup extracted, parametrized
    this.animations.add('right', [0,1,2,3], 10, true);
    this.animations.add('left', [4,5,6,7], 10, true);

    // physics setup
    game.physics.arcade.enable(this);

    this.body.collideWorldBounds = true;

    this.body.bounce.y = Puppity.CONFIG.PLAYER.BOUNCE;
    this.body.bounce.x = Puppity.CONFIG.PLAYER.BOUNCE;

    this.body.gravity.y = Puppity.CONFIG.PLAYER.GRAVITY;
    this.body.maxVelocity.setTo(Puppity.CONFIG.PLAYER.MAX_VEL_X, Puppity.CONFIG.PLAYER.MAX_VEL_Y);

    if (Puppity.CONFIG.PLAYER.USE_DRAG) {
        this.body.drag.setTo(Puppity.CONFIG.PLAYER.DRAG_X, Puppity.CONFIG.PLAYER.DRAG_Y);
    }

    this.cursors = game.input.keyboard.createCursorKeys();
    this.game = game;
    game.add.existing(this);
};

Puppity.Player.prototype = Object.create(Phaser.Sprite.prototype);
Puppity.Player.prototype.constructor = Puppity.Player;

/**
 * Register player collision with group or object
 * @param col   the group or object to check collisions
 */
Puppity.Player.prototype.addCollision = function(col) {
    this.collisionGroups = this.collisionGroups || [];
    this.collisionGroups.push(col);
};

/**
 * Check collisions
 */
Puppity.Player.prototype.collide = function() {
    if (this.collisionGroups) {
        for (var i = 0; i < this.collisionGroups.length; i++) {
            this.game.physics.arcade.collide(this, this.collisionGroups[i]);
        }
    }
};

/**
 * Move the player
 */
Puppity.Player.prototype.move = function() {
    if (this.cursors.left.isDown) {
        if (Puppity.CONFIG.PLAYER.USE_CONST_VEL) {
            this.body.velocity.x = -Puppity.CONFIG.PLAYER.MAX_VEL_X;
        }
        else {
            this.body.acceleration.x = -Puppity.CONFIG.PLAYER.ACCEL;
        }
        this.animations.play('left');
    }
    else if (this.cursors.right.isDown) {
        if (Puppity.CONFIG.PLAYER.USE_CONST_VEL) {
            this.body.velocity.x = Puppity.CONFIG.PLAYER.MAX_VEL_X;
        }
        else {
            this.body.acceleration.x = Puppity.CONFIG.PLAYER.ACCEL;
        }
        this.animations.play('right');
    }
    else {
        this.body.acceleration.x = 0;
    }
    var grounded = this.body.touching.down;

    if (Puppity.CONFIG.PLAYER.USE_DOUBLE_JUMP) {
        if (grounded) {
            this.jumps = 2;
            this.jumping = false;
        }

        var keyup = this.game.input.keyboard.downDuration(Phaser.Keyboard.UP, 5);
        if (this.jumps > 0 && keyup) {
            this.body.velocity.y = Puppity.CONFIG.PLAYER.JUMP_VEL;
            this.jumping = true;
        }

        var keyupreleased = this.game.input.keyboard.upDuration(Phaser.Keyboard.UP);
        if (this.jumping && keyupreleased) {
            this.jumps--;
            this.jumping = false;
        }
    } else {
        if (grounded && this.cursors.up.isDown) {
            this.body.velocity.y = Puppity.CONFIG.PLAYER.JUMP_VEL;
        }
    }
};

Puppity.George = function(game, x, y, image) {
    Phaser.Sprite.call(this, game, x, y, image);
    this.anchor.setTo(0.5, 0.5);

    // TODO: add to configs
    var twn = this.game.add.tween(game.add.existing(this));
    twn.to( { y : 96 }, 2000, Phaser.Easing.In, true, 500, -1, true).repeatDelay(2000)
        .onLoop.add(function() { this.throw(this.x, this.y); }, this);

    // setup items
    this.emitter = game.add.emitter(0, 0, 40);
    this.emitter.makeParticles('bone');
    this.emitter.gravity = 200;
    this.emitter.bounce.setTo(0.3, 0.3);
}

Puppity.George.prototype = Object.create(Phaser.Sprite.prototype);
Puppity.George.prototype.constructor = Puppity.George;

Puppity.George.prototype.throw = function(x, y) {
    // TODO: add eventful item select
    if (y > 16) {
        this.emitter.x = x;
        this.emitter.y = y;

        this.emitter.start(true, 4000, null, 3);
    }
}

// unused
Puppity.Blocks = function(game, x, y, image, num) {
    Phaser.Group.call(this, game);
    this.enableBody = true;

    for (var i = 0; i < num - 1; i++) {
        var sx = this.game.rnd.integerInRange(Puppity.CONFIG.BLOCKS.SPAWN_RANGE_X0,
            Puppity.CONFIG.BLOCKS.SPAWN_RANGE_X1);
        var blk = this.create(sx, y, image);
    }

};

Puppity.Blocks.prototype = Object.create(Phaser.Group.prototype);
Puppity.Blocks.prototype.constructor = Puppity.Blocks;