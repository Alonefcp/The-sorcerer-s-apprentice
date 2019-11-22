export default class HUD extends Phaser.Scene {
    constructor() {

        super({ key: 'HUD' });
        
    }

    preload(){
        this.load.image('greenbar','Assets/LifeBar.png');
    }
    create()
    {
        
        this.lifebar=this.add.sprite(135,25,'greenbar');
  
    }
}