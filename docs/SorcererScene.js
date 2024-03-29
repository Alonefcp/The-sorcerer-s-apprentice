import Portal from './Portal.js';
import Player from './Player.js';
import DestructibleObject from './DestructibleObject.js';
import Melee from './Melee.js';
import Wizard from './Wizard.js';
import Tank from './Tank.js';
import Ghost from './Ghost.js';
import Book from './book.js';
import SpiderWeb from './SpiderWeb.js';
import Spikes from './Spikes.js';
import Acid from './Poison.js';
import Hole from './Hole.js';
import ManaItem from './ManaItem.js';
import CoinsItem from './CoinsItem.js';

export default class SorcererScene extends Phaser.Scene {
  constructor(data) {
    super(data);
    this.coolDown = 1000000;
  }
  init(data) {
    this.coins = data.money;
    this.playerExtraMana = data.extraMana;
    this.playerExtraHP = data.extraHP;
    this.reduceLife = data.reduceLife;
    this.stage = data.stage;

  }
  createScene(groundlayer, wallsLayer, wallsLayer2 = undefined, decoLayer = undefined, spikesLayer = undefined, acidLayer = undefined,
    webLayer = undefined, holeLayer = undefined, bookLayer = undefined, portalLayer, destructibleObjectsLayer = undefined, meleeLayer = undefined,
    wizardLayer = undefined, tankLayer = undefined, ghostLayer = undefined, ghostPoints = undefined, playerSpawnLayer = undefined, numEnemies, enemiesgroup
    , unlockedmagic, constants, magic) {
    this.constants = constants;
    this.unlockedMagic = unlockedmagic;
    this.magic = magic;
    this.numEnemies = numEnemies;
    this.playerSpawnLayer = playerSpawnLayer;
    this.suelo = groundlayer;
    this.paredes = wallsLayer;
    this.paredes2 = wallsLayer2;
    this.deco = decoLayer;
    this.spikesLayer = spikesLayer;
    this.acidLayer = acidLayer;
    this.webLayer = webLayer;
    this.holeLayer = holeLayer;
    this.bookLayer = bookLayer;
    this.portalLayer = portalLayer;
    this.destructibleObjectsLayer = destructibleObjectsLayer;
    this.meleeLayer = meleeLayer;
    this.wizardLayer = wizardLayer;
    this.tankLayer = tankLayer;
    this.ghostLayer = ghostLayer;
    this.ghostPoints = ghostPoints;
    this.enemies = enemiesgroup;

    //musica de fondo
    this.music = this.sound.add('musiclv' + this.stage.toString());
    this.music.loop = true;
    this.music.volume = 0.04;
    this.music.play();

    //efectos de sonido
    this.fireballfx = this.sound.add('fireballfx');
    this.fireballfx.volume = 0.1;
    this.laserfx = this.sound.add('laserfx');
    this.laserfx.volume = 0.03;
    this.stopTimefx = this.sound.add('stopTime');
    this.stopTimefx.volume = 0.1;
    this.tornadofx = this.sound.add('tornado');
    this.tornadofx.volume = 0.03;
    this.windfx = this.sound.add('viento');
    this.windfx.volume = 0.1;
    this.meleefx = this.sound.add('meleefx');
    this.enemyFireball = this.sound.add('enemyFireball');
    this.enemyFireball.volume = 0.5;

    //colisiones
    this.paredes.setCollisionByProperty({ colisiona: true });
    if (this.paredes2 !== undefined)
      this.paredes2.setCollisionByProperty({ colisiona: true });
    if (this.deco !== undefined)
      this.deco.setCollisionByProperty({ colisiona: true });
    //Jugador
    this.player = new Player(this, playerSpawnLayer.objects[0].x, playerSpawnLayer.objects[0].y, this.coins, this.playerExtraHP, this.playerExtraMana, this.unlockedMagic, this.constants, this.magic);
    //Trampas
    this.spikesLayer.objects.forEach(element => {
      this.spike = new Spikes(this, element.x, element.y, 'spikes' + this.stage.toString(), this.player).setScale(.5);
    });

    this.acidLayer.objects.forEach(object => {
      this.acid = new Acid(this, object.x, object.y, 'acid', this.player).setScale(0.5);
    });

    this.webLayer.objects.forEach(object => {
      this.web = new SpiderWeb(this, object.x, object.y, 'spiderWeb', this.player).setScale(0.5);

    });

    this.holeLayer.objects.forEach(object => {
      this.hole = new Hole(this, object.x, object.y, 'hole' + this.stage.toString(), this.player).setScale(0.5);

    });
    //Ajustes del player
    this.player.body.setSize(16, 60);//Ajustamos el collider
    this.player.setScale(0.5);
    this.player.setDepth(1);

    //Objeto destructibles
    this.destuctibleObjects = this.physics.add.group();

    this.destructibleObjectsLayer.objects.forEach(object => {
      this.destObject = new DestructibleObject(this, object.x, object.y, 'chest').setScale(1);
      this.destuctibleObjects.add(this.destObject);
    });
    this.destuctibleObjects.children.iterate(function (object) {
      object.body.setImmovable(true);
    });

    this.HUDscene = this.scene.get('HUD');

    //Camara
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player);
    this.camera.setZoom(2);

    //libro
    this.book = new Book(this, this.bookLayer.objects[0].x, this.bookLayer.objects[0].y, 'book', this.player);

    this.enemyConstants = this.cache.json.get('constants');

    this.meleeLayer.objects.forEach(object => {
      this.melee = new Melee(this, object.x, object.y, 'meleeEnemy', this.enemyConstants, this.reduceLife, this.player).setScale(0.8);
      if (this.reduceLife) this.melee.HP -= 20;
      this.enemies.add(this.melee);
    }, this);

    this.wizardLayer.objects.forEach(object => {
      this.wizard = new Wizard(this, object.x, object.y, 'wizard', this.enemyConstants, this.reduceLife, this.player).setScale(1.1);
      if (this.reduceLife) this.wizard.HP -= 20;
      this.enemies.add(this.wizard);
    }, this);

    this.tankLayer.objects.forEach(object => {
      this.tank = new Tank(this, object.x, object.y, 'tank', this.enemyConstants, this.reduceLife, this.player).setScale(1.2);
      if (this.reduceLife) this.tank.HP -= 20;
      this.enemies.add(this.tank);
    }, this);

    this.ghostLayer.objects.forEach(object => {
      this.ghost = new Ghost(this, object.x, object.y, 'ghost', this.enemyConstants, this.reduceLife, this.player).setScale(1.1);
      if (this.reduceLife) this.ghost.HP -= 20;
      this.enemies.add(this.ghost);
    }, this);


    // Colisiones
    this.physics.add.collider(this.enemies, this.enemies);

    //colision entre el jugador y entre los objetos destruibles
    this.physics.add.collider(this.enemies, this.destuctibleObjects);
    this.physics.add.collider(this.player, this.destuctibleObjects);

    //Colision entre las paredes y los enemigos y el jugador
    this.physics.add.collider(this.player, this.paredes);
    this.physics.add.collider(this.enemies, this.paredes);
    this.physics.add.collider(this.player, this.paredes2);
    this.physics.add.collider(this.enemies, this.paredes2);
    this.physics.add.collider(this.enemies, this.deco);
    this.physics.add.collider(this.player, this.deco);

    // //colision entre el enemigo y el jugador(el enemigo hace daño al jugador)
    this.physics.add.overlap(this.player, this.enemies, this.EnemyHitsPlayer, null, this);

    //input del teclado
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.e = this.input.keyboard.addKey('E');
    this.e.on('down', () => {
      this.player.RotateMagic();
    });
    this.t = this.input.keyboard.addKey('T');
    this.t.on('up', () => {
      this.scene.launch('Combinator');
      this.scene.setVisible(false, 'HUD');
      this.scene.pause('level' + (this.stage).toString());

    });

    

    this.pointer = this.input.activePointer;
    this.input.mouse.disableContextMenu();
    //input del raton
    this.input.on('pointerdown', pointer => {
      if (pointer.leftButtonDown()) {
        this.player.Attack();
        this.meleefx.play();
        this.player.isAttacking = true;
      }
      else if (pointer.rightButtonDown() && this.coolDown > this.player.GetCurrentMagic().GetCoolDown()) {
        this.Ndir = this.player.CalcDir();
        this.player.setCurrentMana(this.player.GetCurrentMagic().Cast(this.player.x, this.player.y, this.player.getCurrentMana(), this.Ndir.x, this.Ndir.y));
        this.coolDown = 0;
      }
    });




  }
  update(time, delta) {
    //Colisiones entre el trigger del jugdor y los enemigos(el jugador ataca fisicamente al enemigo) y los 
    //objetos destructibles
    this.coolDown++;
    if (this.physics.overlap(this.enemies, this.player.trigger)) {
      this.enemies.getChildren().forEach(function (enemy) {

        if (this.physics.overlap(enemy, this.player.trigger)) {
          enemy.ReceiveDamage(this.player.atk);
          enemy.SetKnockbackDir(this.player.AtkDirX, this.player.AtkDirY);

          if (enemy.receiveDamage != undefined) enemy.receiveDamage = true;
          enemy.knockback = true;
          if (enemy.HP <= 0) {
            this.UpdateNumEnemies(-1);
            enemy.DropItem();
            enemy.destroy();
          }
          this.player.trigger.destroy();
        }
      }, this);
    }
    else if (this.physics.overlap(this.destuctibleObjects, this.player.trigger)) {
      this.destuctibleObjects.getChildren().forEach(function (object) {
        if (this.physics.overlap(object, this.player.trigger)) {
          object.ReceiveDamage(50);
          if (object.HP <= 0) {
            object.DropItem();
            object.destroy();
          }
          this.player.trigger.destroy();
        }
      }, this);
    }
    else if (this.player.trigger != undefined) this.player.trigger.destroy();

    //Movimiento del jugador y ejecucion de sus animaciones(movimiento y ataque fisico)
    if (this.cursors.up.isDown && this.cursors.right.isDown) {
      this.player.Move(Math.cos(1), Math.sin(-1));
      this.player.PlayAnimation('up');
    }
    else if (this.cursors.up.isDown && this.cursors.left.isDown) {
      this.player.Move(-Math.cos(-1), Math.sin(-1));
      this.player.PlayAnimation('up');
    }
    else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      this.player.Move(Math.cos(1), Math.sin(1));
      this.player.PlayAnimation('down');
    }
    else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      this.player.Move(-Math.cos(-1), Math.sin(1));
      this.player.PlayAnimation('down');
    }
    else if (this.cursors.right.isDown) {
      this.player.Move(1, 0);
      this.player.PlayAnimation('right');
    }
    else if (this.cursors.left.isDown) {
      this.player.Move(-1, 0);
      this.player.PlayAnimation('left');
    }
    else if (this.cursors.up.isDown) {
      this.player.Move(0, -1);
      this.player.PlayAnimation('up');
    }
    else if (this.cursors.down.isDown) {
      this.player.Move(0, 1);
      this.player.PlayAnimation('down');
    }
    else {
      this.player.Stop();
      this.player.PlayAnimation('idle');
    }

    //Esperamos un pequeño tiempo y paramos la animacion del ataque fisico
    if (this.player.isAttacking) this.player.atkTime++;
    if (this.player.atkTime > 10) {
      this.player.isAttacking = false;
      this.player.atkTime = 0;
    }

    //Muerte del jugador
    if (this.player.HP <= 0) this.player.Spawn();
  }

  AddEnemies(enemy) {
    enemy.setScale(0.5);
    this.enemies.add(enemy);

  }

  OnTrapOverlap(player, trap) {
    trap.ApplyEffect(player);
  }

  EnemyHitsPlayer(player, enemy) {
    player.ReceiveDamage(enemy.atk);
    this.HUDscene.ReduceHealthBar(player.HP, player.MaxHP);
    let dirX = player.x - enemy.x;
    let dirY = player.y - enemy.y;
    let module = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
    dirX /= module;
    dirY /= module;
    player.setThrust(dirX, dirY);

  }
  GenerateItem(item, x, y) {
    if (item === 0)
      this.item = new ManaItem(this, x, y, 'mana', 20, this.player);
    else
      this.item = new CoinsItem(this, x, y, 'coin', 5, this.player);
  }
  UpdateNumEnemies(value) {
    this.numEnemies += value;
    if (this.numEnemies <= 0) {
      this.book.UnlockBook();
    }
  }
  AllEnemiesDead() {
    return this.numEnemies <= 0;
  }
  CreateExit() {
    this.portal = new Portal(this, this.portalLayer.objects[0].x, this.portalLayer.objects[0].y, 'portal', this.player, this.stage + 1);


  }

}