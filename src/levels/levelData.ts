import { LevelDefinition, GridCoord, PowerUpType } from '../types';

/**
 * 0 = Path, 1 = Wall
 */

export const LEVELS: LevelDefinition[] = [
  // ==========================================
  // LEVEL 1: Training Labyrinth (11 x 11)
  // ==========================================
  {
    id: 1,
    name: "Training Labyrinth",
    subtitle: "Learn the ropes, collect gold & reach the portal",
    width: 11,
    height: 11,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    playerStart: { x: 1, y: 1 },
    exitPos: { x: 9, y: 9 },
    timeLimit: 50,
    coins: [
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
      { x: 7, y: 3 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 },
      { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }, { x: 3, y: 7 },
      { x: 5, y: 7 }, { x: 7, y: 7 }, { x: 1, y: 9 }, { x: 3, y: 9 },
      { x: 5, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }
    ],
    stars: [
      { x: 9, y: 1 }, // Top right pocket
      { x: 5, y: 5 }, // Center crossroad
      { x: 1, y: 7 }  // Bottom left branch
    ],
    enemies: [
      {
        x: 5,
        y: 1,
        type: 'patrol',
        speed: 2.0,
        patrolPath: [{ x: 5, y: 1 }, { x: 9, y: 1 }]
      }
    ],
    traps: [],
    powerUps: [
      { x: 5, y: 3, type: 'SPEED' }
    ]
  },

  // ==========================================
  // LEVEL 2: Spike Hollow (15 x 13)
  // ==========================================
  {
    id: 2,
    name: "Spike Hollow",
    subtitle: "Watch your step! Avoid dynamic floor spikes",
    width: 15,
    height: 13,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    playerStart: { x: 1, y: 1 },
    exitPos: { x: 13, y: 11 },
    timeLimit: 60,
    coins: [
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
      { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }, { x: 10, y: 1 }, { x: 11, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 9, y: 3 },
      { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 9, y: 5 }, { x: 11, y: 5 },
      { x: 1, y: 7 }, { x: 3, y: 7 }, { x: 5, y: 7 }, { x: 9, y: 7 }, { x: 11, y: 7 },
      { x: 3, y: 9 }, { x: 5, y: 9 }, { x: 7, y: 9 }, { x: 9, y: 9 },
      { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }
    ],
    stars: [
      { x: 13, y: 1 },  // Top right
      { x: 5, y: 5 },   // Middle alcove
      { x: 7, y: 11 }   // Bottom branch
    ],
    enemies: [
      {
        x: 7,
        y: 1,
        type: 'patrol',
        speed: 2.2,
        patrolPath: [{ x: 7, y: 1 }, { x: 13, y: 1 }]
      },
      {
        x: 1,
        y: 7,
        type: 'patrol',
        speed: 2.4,
        patrolPath: [{ x: 1, y: 7 }, { x: 5, y: 7 }]
      }
    ],
    traps: [
      { x: 7, y: 3, type: 'spikes', interval: 2.8 },
      { x: 11, y: 7, type: 'spikes', interval: 3.2 },
      { x: 3, y: 9, type: 'spikes', interval: 2.5 }
    ],
    powerUps: [
      { x: 1, y: 9, type: 'SHIELD' },
      { x: 13, y: 5, type: 'SPEED' }
    ]
  },

  // ==========================================
  // LEVEL 3: Neon Catacombs (17 x 15)
  // ==========================================
  {
    id: 3,
    name: "Neon Catacombs",
    subtitle: "Hunter drones on alert! Use Freeze & Magnet strategically",
    width: 17,
    height: 15,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    playerStart: { x: 1, y: 1 },
    exitPos: { x: 15, y: 13 },
    timeLimit: 75,
    coins: [
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 9, y: 1 }, { x: 11, y: 1 }, { x: 13, y: 1 }, { x: 14, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 7, y: 3 }, { x: 9, y: 3 }, { x: 13, y: 3 },
      { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 }, { x: 9, y: 5 }, { x: 11, y: 5 }, { x: 13, y: 5 }, { x: 15, y: 5 },
      { x: 1, y: 7 }, { x: 3, y: 7 }, { x: 5, y: 7 }, { x: 7, y: 7 }, { x: 9, y: 7 }, { x: 11, y: 7 }, { x: 13, y: 7 }, { x: 15, y: 7 },
      { x: 1, y: 9 }, { x: 3, y: 9 }, { x: 7, y: 9 }, { x: 9, y: 9 }, { x: 13, y: 9 }, { x: 15, y: 9 },
      { x: 1, y: 11 }, { x: 3, y: 11 }, { x: 7, y: 11 }, { x: 9, y: 11 }, { x: 13, y: 11 },
      { x: 1, y: 13 }, { x: 3, y: 13 }, { x: 5, y: 13 }, { x: 7, y: 13 }, { x: 11, y: 13 }, { x: 13, y: 13 }
    ],
    stars: [
      { x: 15, y: 1 },  // Top right nook
      { x: 8, y: 7 },   // Central grand corridor
      { x: 1, y: 13 }   // Bottom left corner
    ],
    enemies: [
      {
        x: 8,
        y: 1,
        type: 'patrol',
        speed: 2.2,
        patrolPath: [{ x: 5, y: 1 }, { x: 11, y: 1 }]
      },
      {
        x: 1,
        y: 7,
        type: 'patrol',
        speed: 2.6,
        patrolPath: [{ x: 1, y: 7 }, { x: 15, y: 7 }]
      },
      {
        x: 11,
        y: 13,
        type: 'drone',
        speed: 2.0,
        patrolPath: [{ x: 9, y: 13 }, { x: 15, y: 13 }]
      }
    ],
    traps: [
      { x: 7, y: 7, type: 'spikes', interval: 2.5 },
      { x: 9, y: 7, type: 'spikes', interval: 2.5 },
      { x: 3, y: 3, type: 'spikes', interval: 3.0 },
      { x: 13, y: 11, type: 'spikes', interval: 2.8 }
    ],
    powerUps: [
      { x: 7, y: 3, type: 'FREEZE' },
      { x: 5, y: 13, type: 'MAGNET' }
    ]
  },

  // ==========================================
  // LEVEL 4: Obsidian Vault (21 x 17)
  // ==========================================
  {
    id: 4,
    name: "Obsidian Vault",
    subtitle: "High security sectors, fast drones & lethal traps",
    width: 21,
    height: 17,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    playerStart: { x: 1, y: 1 },
    exitPos: { x: 19, y: 15 },
    timeLimit: 90,
    coins: [
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 11, y: 1 }, { x: 13, y: 1 }, { x: 15, y: 1 }, { x: 17, y: 1 }, { x: 18, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 11, y: 3 }, { x: 15, y: 3 }, { x: 17, y: 3 },
      { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 }, { x: 9, y: 5 }, { x: 11, y: 5 }, { x: 15, y: 5 }, { x: 17, y: 5 },
      { x: 1, y: 7 }, { x: 3, y: 7 }, { x: 7, y: 7 }, { x: 13, y: 7 }, { x: 17, y: 7 }, { x: 19, y: 7 },
      { x: 1, y: 9 }, { x: 3, y: 9 }, { x: 5, y: 9 }, { x: 11, y: 9 }, { x: 15, y: 9 }, { x: 17, y: 9 }, { x: 19, y: 9 },
      { x: 1, y: 11 }, { x: 3, y: 11 }, { x: 5, y: 11 }, { x: 7, y: 11 }, { x: 13, y: 11 }, { x: 17, y: 11 },
      { x: 1, y: 13 }, { x: 3, y: 13 }, { x: 5, y: 13 }, { x: 7, y: 13 }, { x: 15, y: 13 }, { x: 17, y: 13 },
      { x: 1, y: 15 }, { x: 2, y: 15 }, { x: 3, y: 15 }, { x: 5, y: 15 }, { x: 7, y: 15 }, { x: 9, y: 15 }, { x: 11, y: 15 }, { x: 13, y: 15 }, { x: 15, y: 15 }, { x: 17, y: 15 }
    ],
    stars: [
      { x: 19, y: 1 },  // Top right vault
      { x: 9, y: 7 },   // Central secure room
      { x: 1, y: 15 }   // Deep lower sector
    ],
    enemies: [
      {
        x: 1,
        y: 7,
        type: 'patrol',
        speed: 2.5,
        patrolPath: [{ x: 1, y: 7 }, { x: 5, y: 7 }]
      },
      {
        x: 13,
        y: 7,
        type: 'patrol',
        speed: 2.6,
        patrolPath: [{ x: 13, y: 7 }, { x: 19, y: 7 }]
      },
      {
        x: 7,
        y: 11,
        type: 'hunter',
        speed: 2.4,
        patrolPath: [{ x: 5, y: 11 }, { x: 9, y: 11 }]
      }
    ],
    traps: [
      { x: 7, y: 3, type: 'spikes', interval: 2.2 },
      { x: 13, y: 3, type: 'spikes', interval: 2.7 },
      { x: 9, y: 9, type: 'spikes', interval: 2.0 },
      { x: 15, y: 11, type: 'spikes', interval: 2.5 },
      { x: 11, y: 15, type: 'spikes', interval: 3.0 }
    ],
    powerUps: [
      { x: 9, y: 5, type: 'SHIELD' },
      { x: 11, y: 9, type: 'FREEZE' },
      { x: 5, y: 15, type: 'SPEED' }
    ]
  },

  // ==========================================
  // LEVEL 5: The Master Gauntlet (25 x 19)
  // ==========================================
  {
    id: 5,
    name: "The Master Gauntlet",
    subtitle: "The ultimate trial! Unforgiving paths, roving hunters & traps",
    width: 25,
    height: 19,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    playerStart: { x: 1, y: 1 },
    exitPos: { x: 23, y: 17 },
    timeLimit: 110,
    coins: [
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 9, y: 1 }, { x: 11, y: 1 }, { x: 12, y: 1 }, { x: 13, y: 1 }, { x: 15, y: 1 }, { x: 17, y: 1 }, { x: 19, y: 1 }, { x: 21, y: 1 }, { x: 22, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 9, y: 3 }, { x: 11, y: 3 }, { x: 15, y: 3 }, { x: 17, y: 3 }, { x: 19, y: 3 }, { x: 21, y: 3 },
      { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 }, { x: 9, y: 5 }, { x: 11, y: 5 }, { x: 13, y: 5 }, { x: 15, y: 5 }, { x: 17, y: 5 }, { x: 19, y: 5 }, { x: 21, y: 5 }, { x: 23, y: 5 },
      { x: 1, y: 7 }, { x: 3, y: 7 }, { x: 7, y: 7 }, { x: 11, y: 7 }, { x: 13, y: 7 }, { x: 17, y: 7 }, { x: 21, y: 7 }, { x: 23, y: 7 },
      { x: 3, y: 9 }, { x: 5, y: 9 }, { x: 7, y: 9 }, { x: 11, y: 9 }, { x: 13, y: 9 }, { x: 17, y: 9 }, { x: 19, y: 9 }, { x: 21, y: 9 },
      { x: 1, y: 11 }, { x: 3, y: 11 }, { x: 7, y: 11 }, { x: 11, y: 11 }, { x: 13, y: 11 }, { x: 17, y: 11 }, { x: 21, y: 11 }, { x: 23, y: 11 },
      { x: 1, y: 13 }, { x: 3, y: 13 }, { x: 5, y: 13 }, { x: 7, y: 13 }, { x: 9, y: 13 }, { x: 11, y: 13 }, { x: 13, y: 13 }, { x: 15, y: 13 }, { x: 17, y: 13 }, { x: 19, y: 13 }, { x: 21, y: 13 }, { x: 23, y: 13 },
      { x: 1, y: 15 }, { x: 3, y: 15 }, { x: 7, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }, { x: 17, y: 15 }, { x: 21, y: 15 },
      { x: 1, y: 17 }, { x: 2, y: 17 }, { x: 3, y: 17 }, { x: 5, y: 17 }, { x: 7, y: 17 }, { x: 9, y: 17 }, { x: 13, y: 17 }, { x: 15, y: 17 }, { x: 17, y: 17 }, { x: 19, y: 17 }, { x: 21, y: 17 }
    ],
    stars: [
      { x: 23, y: 1 },  // Top right corner
      { x: 12, y: 9 },  // Dead center
      { x: 1, y: 17 }   // Bottom left start of grand return
    ],
    enemies: [
      {
        x: 7,
        y: 1,
        type: 'patrol',
        speed: 2.5,
        patrolPath: [{ x: 5, y: 1 }, { x: 9, y: 1 }]
      },
      {
        x: 17,
        y: 1,
        type: 'patrol',
        speed: 2.5,
        patrolPath: [{ x: 15, y: 1 }, { x: 19, y: 1 }]
      },
      {
        x: 7,
        y: 7,
        type: 'hunter',
        speed: 2.8,
        patrolPath: [{ x: 7, y: 7 }, { x: 17, y: 7 }]
      },
      {
        x: 17,
        y: 11,
        type: 'drone',
        speed: 2.7,
        patrolPath: [{ x: 7, y: 11 }, { x: 17, y: 11 }]
      }
    ],
    traps: [
      { x: 9, y: 3, type: 'spikes', interval: 2.4 },
      { x: 15, y: 3, type: 'spikes', interval: 2.6 },
      { x: 11, y: 7, type: 'spikes', interval: 2.0 },
      { x: 13, y: 7, type: 'spikes', interval: 2.0 },
      { x: 7, y: 13, type: 'spikes', interval: 2.5 },
      { x: 17, y: 13, type: 'spikes', interval: 2.5 }
    ],
    powerUps: [
      { x: 11, y: 1, type: 'SPEED' },
      { x: 12, y: 7, type: 'SHIELD' },
      { x: 5, y: 13, type: 'FREEZE' },
      { x: 19, y: 13, type: 'MAGNET' }
    ]
  }
];

/**
 * Procedural Endless Maze Generator for infinite replayability!
 * Uses randomized recursive backtracker / DFS to guarantee a 100% solvable maze.
 */
export function generateProceduralLevel(levelNum: number): LevelDefinition {
  // Odd dimensions
  const width = Math.min(27, 13 + Math.floor(levelNum * 2));
  const height = Math.min(21, 11 + Math.floor(levelNum * 1.5));
  
  // Fill grid with walls (1)
  const grid: number[][] = Array(height).fill(0).map(() => Array(width).fill(1));

  // Carve paths using recursive backtracker
  const stack: GridCoord[] = [];
  const startX = 1;
  const startY = 1;
  grid[startY][startX] = 0;
  stack.push({ x: startX, y: startY });

  const directions = [
    { dx: 0, dy: -2 },
    { dx: 0, dy: 2 },
    { dx: -2, dy: 0 },
    { dx: 2, dy: 0 }
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors: Array<{ nx: number; ny: number; wallX: number; wallY: number }> = [];

    // Shuffle directions
    const shuffled = [...directions].sort(() => Math.random() - 0.5);

    for (const d of shuffled) {
      const nx = current.x + d.dx;
      const ny = current.y + d.dy;

      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && grid[ny][nx] === 1) {
        neighbors.push({
          nx,
          ny,
          wallX: current.x + d.dx / 2,
          wallY: current.y + d.dy / 2
        });
      }
    }

    if (neighbors.length > 0) {
      const chosen = neighbors[0];
      grid[chosen.wallY][chosen.wallX] = 0;
      grid[chosen.ny][chosen.nx] = 0;
      stack.push({ x: chosen.nx, y: chosen.ny });
    } else {
      stack.pop();
    }
  }

  // Open up a few extra loops for arcade flow (so it's not a strict tree maze)
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      if (grid[y][x] === 1 && Math.random() < 0.15) {
        grid[y][x] = 0;
      }
    }
  }

  // Find all path cells
  const openCells: GridCoord[] = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (grid[y][x] === 0 && !(x === startX && y === startY)) {
        openCells.push({ x, y });
      }
    }
  }

  // Pick exit furthest from start
  let exitPos = { x: width - 2, y: height - 2 };
  if (grid[exitPos.y][exitPos.x] === 1) {
    // find closest open cell
    let maxDist = -1;
    for (const cell of openCells) {
      const dist = Math.hypot(cell.x - startX, cell.y - startY);
      if (dist > maxDist) {
        maxDist = dist;
        exitPos = cell;
      }
    }
  }

  // Filter out exit from available open cells
  const available = openCells.filter(c => !(c.x === exitPos.x && c.y === exitPos.y));
  available.sort(() => Math.random() - 0.5);

  // Coins: place on ~40% of open cells
  const coinCount = Math.min(available.length - 10, Math.floor(available.length * 0.45));
  const coins = available.slice(0, coinCount);

  // Stars: 3 stars
  const remaining = available.slice(coinCount);
  const stars = remaining.slice(0, 3);

  // Traps
  const trapCount = Math.min(6, 2 + Math.floor(levelNum * 0.7));
  const trapsList = remaining.slice(3, 3 + trapCount).map(c => ({
    x: c.x,
    y: c.y,
    type: 'spikes' as const,
    interval: 2.0 + Math.random() * 1.5
  }));

  // PowerUps
  const powerUpTypes: PowerUpType[] = ['SPEED', 'SHIELD', 'FREEZE', 'MAGNET'];
  const powerUpsList = remaining.slice(3 + trapCount, 3 + trapCount + 3).map((c, i) => ({
    x: c.x,
    y: c.y,
    type: powerUpTypes[i % powerUpTypes.length]
  }));

  // Enemies
  const enemyCount = Math.min(5, 1 + Math.floor(levelNum * 0.6));
  const enemyCells = remaining.slice(3 + trapCount + 3, 3 + trapCount + 3 + enemyCount);
  const enemiesList = enemyCells.map((c, i) => {
    // Generate simple 2-point patrol corridor
    const patrol: GridCoord[] = [{ x: c.x, y: c.y }];
    for (const d of directions) {
      const px = c.x + d.dx / 2;
      const py = c.y + d.dy / 2;
      if (px > 0 && px < width - 1 && py > 0 && py < height - 1 && grid[py][px] === 0) {
        patrol.push({ x: px, y: py });
        break;
      }
    }
    return {
      x: c.x,
      y: c.y,
      type: (i === 0 ? 'hunter' : i % 2 === 0 ? 'drone' : 'patrol') as 'patrol' | 'drone' | 'hunter',
      speed: 2.2 + Math.min(levelNum * 0.15, 1.2),
      patrolPath: patrol.length > 1 ? patrol : undefined
    };
  });

  return {
    id: levelNum,
    name: `Sector ${levelNum}: Neural Grid`,
    subtitle: `Procedural labyrinth challenge with dynamic threats`,
    width,
    height,
    grid,
    playerStart: { x: startX, y: startY },
    exitPos,
    timeLimit: Math.max(45, 50 + levelNum * 8),
    coins,
    stars,
    enemies: enemiesList,
    traps: trapsList,
    powerUps: powerUpsList
  };
}
