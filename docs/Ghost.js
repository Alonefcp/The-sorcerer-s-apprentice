import Enemy from './Enemy.js';
export default class Ghost extends Enemy{

    constructor(scene, x, y,img,damage){
        super(scene,x,y,img,damage);
       
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time,delta);
        if(!this.timeStopped)
        this.FollowPlayer(25000,200);
        else this.Stop();
    }
}