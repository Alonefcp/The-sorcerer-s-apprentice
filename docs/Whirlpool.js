import Magic from './Magic.js';
import Fireball from './Fireball.js'
export default class Whirlpool extends Magic {
    constructor(scene, x, y, enemies, constants) {
        super(scene, x, y, 'whirlpool', constants.whirlpoolDamage, constants.whirlpoolCost);
        this.constants = constants;
        this.play('whirlpool', true);
        this.enemies = enemies;
        this.maxDistance = 25000;
        this.atkCont = 0;
        this.scene.physics.add.overlap(this, this.enemies, this.OnOverlap, null, this);
        this.time = 100;
        this.cont = 0;
        this.coolDown = this.constants.whirlpoolCoolDown;
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.enemies.getChildren().forEach(function (e) {
            if (Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y) < this.maxDistance) {

                this.dirX = this.x - e.x;
                this.dirY = this.y - e.y;
                this.mod = Math.sqrt(Math.pow(this.dirX, 2) + Math.pow(this.dirY, 2));
                this.dirX /= this.mod;
                this.dirY /= this.mod;
                e.ApplyForce(this.dirX, this.dirY);
            }
        }, this);
        this.atkCont++;
        this.cont++;
        if (this.cont >= this.time)
            this.destroy();


    }
    OnOverlap(whirlpool, enemies) {
        if (this.atkCont >= 20) {
            whirlpool.Harm(enemies);
            this.atkCont = 0;
        }
    }
    Cast(x, y, currentmana, dirX, dirY) {
        this.nMana = currentmana - this.manaCost;
        if (this.nMana >= 0) {
            this.scene.tornadofx.play();
            this.nWhirlpool = new Whirlpool(this.scene, x, y, this.enemies, this.constants);
            this.scene.add.existing(this.nWhirlpool);
            this.scene.physics.add.existing(this.nWhirlpool);
            return this.nMana;

        }
        else return currentmana;
    }
    GetCoolDown() {
        return this.coolDown;
    }
}