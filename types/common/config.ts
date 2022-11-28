const config = {
  multiPlayerPros: {
    screenWidth: 1600,
    screenHeight: 900,
  },
  graphicAssets: {   
    bulletNormal: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletNormal"
    },
    bulletAtomic: {
      URL: "assets/images/bullet_atomic.png",
      name: "bulletAtomic"
    },
    bulletUnlimited: {
      URL: "assets/images/bullet_unlimited.png",
      name: "bulletUnlimited"
    },
    bulletDouble: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletDouble"
    },
    bulletTriple: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletTriple"
    },
    bulletVolley: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletVolley"
    },
    bulletLazer: {
      URL: "assets/images/bullet_lazer.png",
      name: "bulletLazer"
    },
    bulletExplose: {
      URL: "assets/images/bullet_explosive.png",
      name: "bulletExplose"
    },
    bulletRegion: {
      URL: "assets/images/bullet_region.png",
      name: "bulletRegion"
    },
    asteroidFirstL: {
      URL: "assets/images/asteroid_first_large.png",
      name: "asteroidFirstL",
    },
    asteroidFirstS: {
      URL: "assets/images/asteroid_first_small.png",
      name: "asteroidFirstS"
    },
    asteroidSecondL: {
      URL: "assets/images/asteroid_second_large.png",
      name: "asteroidSecondL",
    },
    asteroidSecondS: {
      URL: "assets/images/asteroid_second_small.png",
      name: "asteroidSecondS"
    },
    airdropRapid: {
      URL: "assets/images/airdrop_rapid.png",
      name: 'airdropRapid'
    },
    airdropDouble: {
      URL: "assets/images/airdrop_double.png",
      name: 'airdropDouble'
    },
    airdropTriple: {
      URL: "assets/images/airdrop_triple.png",
      name: 'airdropTriple'
    },
    airdropBurst: {
      URL: "assets/images/airdrop_burst.png",
      name: 'airdropBurst'
    },
    airdropExplosive: {
      URL: "assets/images/airdrop_explosive.png",
      name: 'airdropExplosive'
    },
    airdropLazer: {
      URL: "assets/images/airdrop_lazer.png",
      name: 'airdropLazer'
    },
    airdropRocket: {
      URL: "assets/images/airdrop_rocket.png",
      name: 'airdropRocket'
    },
    airdropLife: {
      URL: "assets/images/airdrop_life.png",
      name: 'airdropLife'
    },
    airdropShield: {
      URL: "assets/images/airdrop_shield.png",
      name: 'airdropShield'
    },
    enemyFirst: {
      URL: "assets/images/enemy_1.png",
      name: "enemyFirst"
    },
    enemySecond: {
      URL: "assets/images/enemy_2.png",
      name: "enemySecond"
    },
    enemyBullet: {
      URL: "assets/images/bullet_enemy.png",
      name: "enemyBullet"
    },
    rocketFirst: {
      URL: "assets/images/rocket_1.png",
      name: "rocketFirst"
    },
    rocketSecond: {
      URL: "assets/images/rocket_2.png",
      name: "rocketSecond"
    },
    rocketThird: {
      URL: "assets/images/rocket_3.png",
      name: "rocketThird"
    },
    rocketFourth: {
      URL: "assets/images/rocket_4.png",
      name: "rocketFourth"
    },
    rocketBullet: {
      URL: "assets/images/bullet_boss.png",
      name: "rocketBullet"
    },   
    lazerEffectParticle: {
      URL: 'assets/images/lazer_effect.png',
      data: 'assets/images/particle_lazer.json',
      name: "lazerEffectParticle"
    }
  },
  bulletPros: {
    NORMAL_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    UNLIMITED_BULLET: {
      maxBullets: 99, // 99 = ∞
      fireCooldown: 0.4,
      passiveRegenCooldown: 0.1,
      speed: 300,
      lifespan: 2000,
    },
    DOUBLE_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    TRIPLE_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    VOLLEY_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    LAZER_BULLET: {
      maxBullets: 10,
      fireCooldown: 0.5,
      passiveRegenCooldown: 1,
      speed: 450,
      lifespan: 2000,
    },
    EXPLOSIVE_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.8,
      passiveRegenCooldown: 1,
      speed: 250,
      lifespan: 2000,
    },
    ATOMIC_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
  },
  asteroidPros: {
    startingAsteroids: 3,
    maxAsteroids: 12,
    incrementAsteroids: 2,
    minSpeed: 60,
    maxSpeed: 100
  },
  enemyPros: {
    minSpeed: 60,
    maxSpeed: 80,
    startingEnemies: 0,
    incrementEnemies: 1,
    startingBoss: 0,
    incrementBoss: 1,
    bossLives: 10,
    angVelRange: 40,
  },
  enemyBulletPros: {
    maxBullets: 999,
    fireCooldown: 3,
    passiveRegenCooldown: 0,
    normalSpeed: 120,
    velocity: { x: 180, y: 180 },
    lives: 2,
    bossSpeed: 180,
    bossFireCooldown: 0.8,
  },
  airdropPros: {
    percentAsteroid: 5,
    percentEnemy: 70,
    percentBoss: 100,
    duration: 15,
    lifetime: 10,
    alertTime: 7
  },
}

export default config