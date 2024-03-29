import Entity from './Entity.js';
import Fireball from './Fireball.js';
import WaterRay from './WaterRay.js';
import Wind from './Wind.js';

export default class Player extends Entity {

  constructor(scene, x, y, coins, hasIncreasedMaxHP, hasIncreasedMaxMana, unlockedMagic, constants, magic) {
    super(scene, x, y, 'player');
    this.constants = constants;
    scene.physics.add.existing(this);
    this.maxMagic = 3;
    this.coins = coins;
    this.stage = 0;
    this.numStages = 3;
    this.extraMaxHP = 50;
    if (hasIncreasedMaxHP) {
      this.MaxHP += this.extraMaxHP;
      this.HP = this.MaxHP;
    }
    this.extraMaxMana = 50;
    this.maxMana = 100;
    if (hasIncreasedMaxMana)
      this.maxMana += this.extraMaxMana;
    this.mana = this.maxMana;


    this.coolDown = 0;
    this.unlockedMagic = unlockedMagic;
    this.magic = magic;
    this.magicCont = -1;
    this.canCastMagic = true;
    this.isAttacking = false;
    this.atkTime = 0;
    this.Spawnx = x;
    this.Spawny = y;
    this.SpeedNerf = this.constants.SpeedNerf;
    this.speedX = 160;
    this.speedY = 160;
    this.cont = 0;
    this.SlowTime = 0;
    this.atkcont = 0;
    this.thrust = false;
    this.thrustX = 0;
    this.thrustY = 0;
    this.thrustCont = 0;
    this.poisonedTime = 0;
    this.poisonIntervals = 0;
    this.maxSlowTime = this.constants.MaxSlowTime;
    this.maxPoisonedTime = this.constants.maxPoisonedTime;
    this.maxPoisonIntervals = this.constants.maxPoisonIntervals;
    this.spikesDamage = this.constants.spikesDamage;
    this.slowdown = false;
    this.acid = false;
    this.currentMagic = this.unlockedMagic;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);



    //Aplica un empuje al jugador
    if (this.thrust) {
      this.thrustCont++;
      this.ApplyForce(this.thrustX, this.thrustY);
      if (this.thrustCont >= 15) {
        this.thrust = false;
        this.thrustCont = 0;
      }
    }

    //Ralentizamos al jugador un tiempo
    if (this.slowdown === true) {

      this.SlowTime += 1;
      if (this.SlowTime >= this.maxSlowTime) {
        this.slowdown = false;
        this.SlowTime = 0;
      }
    }

    //El veneno resta vida al jugador un tiempo
    if (this.acid === true) {
      this.poisonDamage = this.MaxHP / 20;
      this.poisonedTime += 1;
      this.poisonIntervals += 1;
      if (this.poisonedTime >= this.maxPoisonedTime) {
        this.acid = false;
        this.poisonedTime = 0;
      }
      else if (this.poisonIntervals >= this.maxPoisonIntervals && this.HP - this.poisonDamage > 0) {
        this.ReceiveDamage(this.poisonDamage);
        this.scene.HUDscene.ReduceHealthBar(this.HP, this.MaxHP);
        this.poisonIntervals = 0;
      }
    }
  }

  Move(dirX, dirY) {
    if (this.slowdown) {
      this.body.setVelocityY(dirY * this.speedY * (1 - this.SpeedNerf));
      this.body.setVelocityX(dirX * this.speedX * (1 - this.SpeedNerf));
    }
    else {
      this.body.setVelocityY(dirY * this.speedY);
      this.body.setVelocityX(dirX * this.speedX);
    }
  }

  Attack() {
    this.CalcDir();
    this.trigger = this.scene.add.zone(this.x + this.width / 4 * this.AtkDirX, this.y + this.height / 4 * this.AtkDirY);
    this.trigger.setSize(32, 32);
    this.scene.physics.world.enable(this.trigger);
    this.trigger.body.setAllowGravity(false);
    this.trigger.body.moves = false;
  }

  PlayAnimation(anim) {

    this.CalcDir();
    if (this.isAttacking && (this.AtkDirY > 0 && (this.AtkDirX > 0.90 && this.AtkDirX > -0.90))) this.play('attackRight', true);
    else if (this.isAttacking && this.AtkDirY < 0) this.play('attackUp', true);
    else if (this.isAttacking && (this.AtkDirX < 0 && (this.AtkDirY < 0.90 && this.AtkDirY > -0.90))) this.play('attackLeft', true);
    else if (this.isAttacking && this.AtkDirY > 0) this.play('attackDown', true);
    else this.play(anim, true);

  }

  Spawn() {
    this.slowdown = false;
    this.acid = false;
    this.body.reset(this.Spawnx, this.Spawny);
    this.ResetHP();
    this.resetMana();
    //Reseteamos las barras a 100
    this.scene.HUDscene.lifebar.displayWidth = this.scene.HUDscene.initialWidth;
    this.scene.HUDscene.manabar.displayWidth = this.scene.HUDscene.initialWidthMana;
  }

  //Activa la ralentizacion
  SlowDown() {
    this.slowdown = true;
  }
  //Activa el veneno
  Acid() {
    this.acid = true;
  }
  //Activa los pinchos
  Spikes() {
    this.ReceiveDamage(this.spikesDamage);
    console.log(this.HP)
    this.scene.HUDscene.ReduceHealthBar(this.HP, this.MaxHP);
  }



  CalcDir() {
    this.nDX = this.scene.pointer.worldX - this.x
    this.nDY = this.scene.pointer.worldY - this.y;
    this.module = Math.sqrt(Math.pow(this.nDX, 2) + Math.pow(this.nDY, 2));
    this.AtkDirX = this.nDX / this.module;
    this.AtkDirY = this.nDY / this.module;
    return { x: this.AtkDirX, y: this.AtkDirY };
  }

  setThrust(ntX, ntY) {
    this.thrust = true;
    this.thrustX = ntX;
    this.thrustY = ntY;
  }

  RotateMagic() {

    this.magicCont = (this.magicCont + 1) % (this.magic + 1);

    if (this.magicCont == 0) this.currentMagic = new Fireball(this.scene, 0, 0, this.constants.fireballSpeed, this.constants.fireballSpeed, true, 8, this.constants);
    else if (this.magicCont == 1) this.currentMagic = new WaterRay(this.scene, 0, 0, 0, this.constants);
    else if (this.magicCont == 2) this.currentMagic = new Wind(this.scene, 0, 0, false, this.constants);
    this.UpdateMagicIcon();
  }
  setMagic(magic) {
    this.currentMagic = magic;
  }

  RecoverMana(mana) {
    if (mana > 0)
      if (this.mana + mana < this.maxMana)
        this.mana += mana;
      else this.mana = this.maxMana;
    //Actualizamos la barra de mana
    this.scene.HUDscene.ReduceManaBar(this.mana, this.maxMana);
  }


  GetCoins(coins) {
    if (coins > 0)
      this.coins += coins;
    this.scene.HUDscene.UpdateCoins(this.coins);

  }
  resetMana() {
    this.mana = this.maxMana;
  }
  NextStage() {
    this.stage++;
  }
  GetStage() {
    return this.stage;
  }
  GetCurrentMagic() {
    return this.currentMagic;
  }
  UpdateMagicIcon() {
    this.scene.HUDscene.ChangeMagicIcon(this.currentMagic);
  }
  getMoney() {
    return this.coins;
  }
  getUnlockedMagic() {
    return this.unlockedMagic;
  }
  setCurrentMana(nmana) {
    this.mana = nmana;
    this.scene.scene.get('HUD').ReduceManaBar(this.mana, this.maxMana);
  }
  getCurrentMana() {
    return this.mana;
  }
}


