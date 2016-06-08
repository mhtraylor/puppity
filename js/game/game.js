var Puppity = Puppity || {};

Puppity.Game = function(){};
Puppity.Game.prototype = {
    preload: function(){},
    create: function(){
        this.createWalls();
        this.createBlocks();
        this.game.time.events.loop(Puppity.CONFIG.BLOCKS.DROP_INTERVAL, this.dropBlocks, this);

        this.player = new Puppity.Player(this.game, this.game.world.centerX, this.game.world.centerY, 'player');
        this.george = new Puppity.George(this.game, 96, -64, 'george');

        this.player.addCollision(this.floors);
        this.player.addCollision(this.walls);
        this.player.addCollision(this.blocks);
        this.player.addCollision(this.george.emitter);
    },
    update: function(){
        // TODO: add collisions to george object
        // this.game.physics.arcade.collide(this.george.emitter, this.floors);
        // this.game.physics.arcade.collide(this.george.emitter, this.walls);
        this.player.collide();
        this.player.move();
    },
    createWalls: function() {
        this.walls = this.game.add.group();
        this.walls.enableBody = true;

        for (var i=0; i<15; i++) {
            this.game.add.sprite(8, i*32, 'wall_left', 0, this.walls).anchor.setTo(0.5, 0);
            this.game.add.sprite(248, i*32, 'wall_right', 0, this.walls).anchor.setTo(0.5, 0);
        }
        this.walls.setAll('body.immovable', true);

        this.floors = this.game.add.group();
        this.floors.enableBody = true;

        for (var i=0; i<8; i++) {
            this.game.add.sprite(i*32, 480, 'floor', 0, this.floors);
        }
        this.floors.setAll('body.immovable', true);
    },
    createBlocks: function() {
        this.blocks = this.game.add.group();
        this.blocks.y = -48;
        this.blocks.enableBody = true;

        this.blocks.createMultiple(16, 'block');
        this.blocks.setAll('body.allowGravity', false);
        this.blocks.setAll('body.immovable', true);
    },
    dropBlocks: function() {
        var blk = this.blocks.getFirstDead();
        if (!blk) {
            return; // OPTIONAL: extra pooling
        }

        blk.reset(this.game.rnd.integerInRange(Puppity.CONFIG.BLOCKS.SPAWN_RANGE_X0,
            Puppity.CONFIG.BLOCKS.SPAWN_RANGE_X1), 32);

        blk.checkWorldBounds = true;
        blk.outOfBoundsKill = true;

        blk.body.checkCollision.down = false;
        blk.body.checkCollision.left = false;
        blk.body.checkCollision.right = false;

        blk.body.allowGravity = false;
        blk.body.immovable = true;

        blk.body.velocity.y = Puppity.CONFIG.BLOCKS.DROP_VEL;
    }
};