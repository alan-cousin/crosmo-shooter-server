import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ICrosmoState } from '../../types/ICrosmoState'

type Payload = {
  client: Client
  x: number
  y: number
  rotation: number
  speed_x: number
  speed_y: number
  angularVel:number
  isForwarding: boolean
  hasShield: boolean
  isFire: boolean
  score: number
  isExplode: boolean
  lives: number
  curServerTime:number
}

export default class UpdatePlayer extends Command<ICrosmoState, Payload> {
  execute(data: Payload) {
    const { client, x, y, rotation,speed_x,speed_y,angularVel, isForwarding, hasShield, isFire, score, isExplode,lives,curServerTime } = data

    const player = this.room.state.players.get(client.sessionId)

    if (!player) return
    player.x = x
    player.y = y
    player.rotation = rotation
    player.isForwarding = isForwarding
    player.speed_x=speed_x
    player.speed_y=speed_y
    player.angularVel=angularVel
    player.hasShield = hasShield
    player.isFire = isFire
    player.score = score
    player.isExplode = isExplode
    player.lives = lives
    player.curServerTime=curServerTime
  }
}
