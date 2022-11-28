import { Room, Client, ServerError, Delayed } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import { Player, Bullet, CrosmoState } from './schema/CrosmoState'
import { Message } from '../types/Messages'
import { IRoomData } from '../types/Rooms'
import UpdatePlayer from './commands/UpdatePlayer'
import { setScore } from './state'
import {
	randRange,
	checkRoulette,
	QUARTRAD,
	ASTEROID_NAME,
	ASTEROID_SIZE,
	ASTEROID_TYPE,
	AIRDROP_NAME,
	AIRDROP_TYPE,
	BULLET_TYPE,
	BULLET_NAME,
	ENEMY_NAME,
	ENEMY_TYPE,
	BONUS_AIRDROP_DURATION,
	BONUS_LIFE,
	DIFFICULTY
} from "../types/common/helper"
// import UpdateBullet from './commands/UpdateBullet'

export class CrosmoRoom extends Room<CrosmoState> {
  maxClients = 2;
  public delayedInterval!: Delayed;
  private dispatcher = new Dispatcher(this)
  // private name: string
  // private description: string
  // private password: string | null = null
  private isSplit = false;
  private gameStart = false;


  async onCreate(options: IRoomData) {
    // const { name, description, password, autoDispose } = options
    // this.name = name
    // this.description = description
    // this.autoDispose = autoDispose

    // let hasPassword = false
    // if (password) {
    //   const salt = await bcrypt.genSalt(10)
    //   this.password = await bcrypt.hash(password, salt)
    //   hasPassword = true
    // }
    // this.setMetadata({ name, description, hasPassword })
    this.setState(new CrosmoState())
    // this.setPatchRate(30)//standard 50

    // when receiving updatePlayer message, call the UpdatePlayer
    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: {
        x: number,
        y: number,
        rotation: number,
        speed_x:number,
        speed_y:number,
        angularVel:number,
        isForwarding: boolean,
        hasShield: boolean,
        isFire: boolean,
        score: number,
        isExplode: boolean,
        lives: number
        clientTime: number
      }) => {
        setScore(message.score)
        let dt = this.state.client2ServerDelay(message.clientTime, client.sessionId)
        let compensated_pos = this.state.compensation(message.x, message.y, message.rotation, message.speed_x, message.speed_y, message.angularVel, dt)
        let curServertime = this.state.ServerTime();
        this.dispatcher.dispatch(new UpdatePlayer(), {
          client,
          x: compensated_pos.x,
          y: compensated_pos.y,
          rotation: compensated_pos.dir,
          speed_x:message.speed_x,
          speed_y:message.speed_y,
          angularVel:message.angularVel,
          isForwarding: message.isForwarding,
          hasShield: message.hasShield,
          isFire: message.isFire,
          score: message.score,
          isExplode: message.isExplode,
          lives: message.lives,
          curServerTime:curServertime
        })
      }
    )
    this.onMessage(
      Message.UPDATE_BULLET,
      (client, message: {
        x: number,
        y: number,        
        rotation: number,
        speed_x:number,
        speed_y: number,
        bulletType:string
      }) => {
        console.log("bullet created", message.bulletType);
        if (this.state.getPlayer(client.sessionId) == undefined) return;
        this.state.spawnRandomBullet(client.sessionId, message);
      })
    // this.onMessage(
    //   Message.GAMEPLAY_READY,
    //   (client, message: {
    //     ready: boolean;
    //   }) => {
    //     this.gameStart = message.ready;
    //     if(this.gameStart)
    this.startGameServer()
    // })

    this.onMessage(
      Message.ATOMIC_EXPLODE,
      (client, message: {
        explode: boolean;
      }) => {
        if (message.explode)
          this.isAtomicExplode(client.sessionId);
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.READY_TO_CONNECT, (client,  message: { clientTime:number} ) => {
      const player = this.state.players.get(client.sessionId);      
      this.state.setDtClient2Server(message.clientTime,client.sessionId);
      if (player) player.readyToConnect = true;
    })
  }
  startGameServer() {
    this.delayedInterval = this.clock.setInterval(() => {
      if (this.state._enemyCount < 8) {
        this.state.spawnOneAsteroid();
        // this.state.spawnRandomAirdrop(300, 400, 80);
      }
    }, 2000);
    this.clock.setInterval(this.ServerGameLoop.bind(this), 50);
  }
  isAtomicExplode(sessionId:string) {
    console.log("Atomic explode", sessionId);
    this.state.asteroids.forEach((asteroid, id) => {
      this.broadcast(
        Message.COLLIDE_BULLET_ASTEROID, {
          punisher_id: sessionId,
          bullet_id: 0,
          asteroid_id: id,
          asteroid_x: asteroid.x,
          asteroid_y:asteroid.y,
      });
      asteroid.live--;
      if (asteroid.live < 1) {
        this.state.removeAsteroid(Number(id));
        if (asteroid.size === 1)
          this.state.splitAsteroid(asteroid);
        this.state._enemyCount--;
      }
    });
    this.state.players.forEach((player,id) => {
      if (id === sessionId) return;
      console.log("atomic explode player id", id);
      this.broadcast(
        Message.COLLIDE_PLAYER_BULLET, {
        punished_id: id,
        punisher_id: sessionId
      });
      this.state.removePlayer(id);
    });
  }
  removeAirdropAfterPeriods(index: number) {
    // this.clock.delayed;
    this.clock.setTimeout(() => {
      this.state.removeAirdrop(Number(index));
    }, 10000);
  }
  ServerGameLoop() {
    // if(this.state._enemyCount===0)
    //   this.state.spawnAsteroids();
    this.state.asteroids?.forEach((asteroid, index) => {
      this.state.moveAsteroid(Number(index));
      this.state.players?.forEach((player, id) => { 
        //because your own bullet shouldn't kill hit
        let dx = player.x - asteroid.x;
        let dy = player.y - asteroid.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          this.broadcast(
            Message.COLLIDE_PLAYER_ASTEROID, {
            punished_id: id,
          });
          // this.state.removeBullet(Number(index));
          this.state.removePlayer(id);
          return;
        }
      })
    })
    this.state.airdrops?.forEach((airdrop, index) => {
      this.state.moveAirdrop(Number(index));

      this.state.players?.forEach((player, id) => {
        //because your own bullet shouldn't kill hit

        let dx = player.x - airdrop.x;
        let dy = player.y - airdrop.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          this.broadcast(
            Message.COLLIDE_PLAYER_AIRDROP, {
              player_id: id,
              kind:airdrop.kind,
          });
          // this.state.removeBullet(Number(index));
          this.state.removePlayer(id);
          this.state.removeAirdrop(Number(index));
          return;
        }
      })
    })

    this.state.bullets?.forEach((bullet,index) => {
      this.state.moveBullet(Number(index));
      let bulletRange = 40;
      if (bullet.bulletType === BULLET_TYPE.EXPLOSIVE_BULLET)
        bulletRange = 60;
      //remove the bullet if it goes too far
      if(bullet.distanceTravelled>1600){
          this.state.removeBullet(Number(index));
      } else {
          //check if this bullet is close enough to hit a player
        this.state.players?.forEach((player, id) => {
          if (bullet.owner != id) {
              //because your own bullet shouldn't kill hit
              let dx = player.x - bullet.x;
              let dy = player.y - bullet.y;
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < bulletRange) {
                this.broadcast(
                  Message.COLLIDE_PLAYER_BULLET, {
                  punished_id: id,
                  punisher_id: bullet.owner
                });
                this.state.removePlayer(id);
                if (bullet.bulletType !== AIRDROP_TYPE.LAZER_BULLET)
                  this.state.removeBullet(Number(index));
                return;
              }
            }          
        })
        this.isSplit=false
        //check if this bullet is close enough to hit a Asteroid
        this.state.asteroids?.forEach((asteroid, id) => {
          //because your own bullet shouldn't kill hit
          if (this.isSplit) return;
              let dx = asteroid.x - bullet.x;
              let dy = asteroid.y - bullet.y;
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < bulletRange) {
                this.broadcast(
                  Message.COLLIDE_BULLET_ASTEROID, {
                    punisher_id: bullet.owner,
                    bullet_id: index,
                    asteroid_id: id,
                    asteroid_x: asteroid.x,
                    asteroid_y:asteroid.y,
                });
                if (bullet.bulletType !== AIRDROP_TYPE.LAZER_BULLET)
                    this.state.removeBullet(Number(index));
                //asteroid type 1
                if (asteroid.type === 1){
                  if (asteroid.size === 1){
                    this.state.splitAsteroid(asteroid);
                    this.state.removeAsteroid(Number(id));
                    this.isSplit = true;
                    this.state._enemyCount--;
                    return;
                  }
                  else {
                      this.state.removeAsteroid(Number(id));
                      this.state.spawnRandomAirdrop(asteroid.x, asteroid.y, 80);
                      this.removeAirdropAfterPeriods(Number(this.state.airdrop_index - 1));
                      
                      this.state._enemyCount--;                     
                    return;
                  }
                }
                //asteroid type 2
                else {
                  if (asteroid.live === 2) {
                    asteroid.live -= 1;
                    return;
                  }
                  else {
                    if (asteroid.size === 1) {
                      this.state.removeAsteroid(Number(id));
                      this.state.splitAsteroid(asteroid);
                       this.state._enemyCount--;                      
                       this.isSplit = true;
                      return;
                    }
                    else {
                      this.state.removeAsteroid(Number(id));
                      this.state.spawnRandomAirdrop(asteroid.x, asteroid.y, 80);
                      this.removeAirdropAfterPeriods(Number(this.state.airdrop_index - 1));
                      this.state._enemyCount--;
                      return;
                    }
                  }
                }
              }
        })
      }

    })

  }


  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player())
    //added by mars
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      serverTime:this.state.ServerTime(),
      // name: this.name,
      // description: this.description,
    })
  }
  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId)
    }
  }
  onDispose() {
    this.dispatcher.stop();    
    this.state.asteroids.clear();
    this.state.bullets.clear();
    this.state.airdrops.clear();
    this.delayedInterval.clear();
    console.log("room_id",this.roomId,"is disposing...")
    this.clock.clear();
  }
}
