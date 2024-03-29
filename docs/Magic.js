
export default class Magic extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, img, damage, manaCost) {
        super(scene, x, y, img);
        this.damage = damage;
        this.manaCost = manaCost;
       
        
    }
    preload() {
        this.load.json('constants', './Constants.json');

    }

    Harm(enemy) {
        enemy.ReceiveDamage(this.damage);


        if (enemy.HP <= 0) {
            this.scene.UpdateNumEnemies(-1);
            enemy.DropItem(this.scene, enemy.x, enemy.y, 'coin', 'mana');
            enemy.destroy();
        }
    }


}