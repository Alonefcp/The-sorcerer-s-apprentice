import Entity from './Entity.js'; 
export default class Player extends Entity{
    
    constructor(scene, x, y) {
      super(scene,x,y,'player');

     
      scene.physics.add.existing(this);

      this.dirX=0;
      this.dirY=1;
      this.Spawnx=x;
      this.Spawny=y;
      this.speedX=160;
      this.speedY=160;    
      }
      
      preload() 
      { 
      }
    
      create() 
      {
      }
    
      preupdate(time, delta) 
      {    
      }

        MoveUp() 
        {
          this.body.setVelocityY(-this.speedY);
          this.dirY=-1;
        }

        MoveDown()
        {
          this.body.setVelocityY(this.speedY);
          this.dirY=1;
        }

        MoveRight()
        {
          this.body.setVelocityX(this.speedX);
          this.dirX=1;
        }

        MoveLeft()
        {
          this.body.setVelocityX(-this.speedX);
          this.dirX=-1;
        }

        Stop(){
          this.body.setVelocityX(0);
          this.body.setVelocityY(0);
          this.dirX=0;
          this.dirY=0;
        }
        Attack(){
          this.trigger = this.scene.add.zone(this.x+10*this.dirX, this.y+10*this.dirY);
          this.trigger.setSize(200, 200);
          this.scene.physics.world.enable(this.trigger);
          this.trigger.body.setAllowGravity(false);
          this.trigger.body.moves = false;
        }
        Spawn(){
          this.body.reset(this.Spawnx,this.Spawny);
        }
        die(){
          this.HP=0;
        }
      }
    
    
