import React, { useEffect, useRef, useCallback } from 'react';
import { 
  LevelDefinition, 
  Direction, 
  CoinItem, 
  StarItem, 
  TrapItem, 
  EnemyItem, 
  PowerUpItem,
  FloatingText,
  Particle,
  GridCoord
} from '../types';
import { sound } from '../utils/audio';

interface MazeCanvasProps {
  level: LevelDefinition;
  isPaused: boolean;
  onCoinCollected: (coin: CoinItem, comboMultiplier: number) => void;
  onStarCollected: (star: StarItem) => void;
  onPowerUpCollected: (powerUp: PowerUpItem) => void;
  onTrapHit: () => void;
  onEnemyHit: () => void;
  onReachExit: () => void;
  lives: number;
  combo: number;
  currentDirection: Direction;
  setCurrentDirection: (dir: Direction) => void;
  activePowerUps: {
    speed: number;    // remaining seconds
    shield: boolean;
    freeze: number;   // remaining seconds
    magnet: number;   // remaining seconds
  };
  invulnerableTime: number; // remaining seconds
  onPlayerMoved?: (x: number, y: number) => void;
}

export const MazeCanvas: React.FC<MazeCanvasProps> = ({
  level,
  isPaused,
  onCoinCollected,
  onStarCollected,
  onPowerUpCollected,
  onTrapHit,
  onEnemyHit,
  onReachExit,
  lives,
  combo,
  currentDirection,
  setCurrentDirection,
  activePowerUps,
  invulnerableTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mutable Game Entities in Ref to avoid re-renders on every 60fps frame
  const stateRef = useRef<{
    player: {
      x: number;
      y: number;
      gridX: number;
      gridY: number;
      targetGridX: number;
      targetGridY: number;
      isMoving: boolean;
      facing: Direction;
      animOffset: number;
    };
    coins: CoinItem[];
    stars: StarItem[];
    traps: TrapItem[];
    enemies: EnemyItem[];
    powerUps: PowerUpItem[];
    floatingTexts: FloatingText[];
    particles: Particle[];
    screenShake: number; // current shake magnitude
    lastTime: number;
  }>({
    player: {
      x: level.playerStart.x,
      y: level.playerStart.y,
      gridX: level.playerStart.x,
      gridY: level.playerStart.y,
      targetGridX: level.playerStart.x,
      targetGridY: level.playerStart.y,
      isMoving: false,
      facing: 'RIGHT',
      animOffset: 0
    },
    coins: [],
    stars: [],
    traps: [],
    enemies: [],
    powerUps: [],
    floatingTexts: [],
    particles: [],
    screenShake: 0,
    lastTime: performance.now()
  });

  // Re-initialize state when level changes
  useEffect(() => {
    stateRef.current.player = {
      x: level.playerStart.x,
      y: level.playerStart.y,
      gridX: level.playerStart.x,
      gridY: level.playerStart.y,
      targetGridX: level.playerStart.x,
      targetGridY: level.playerStart.y,
      isMoving: false,
      facing: 'RIGHT',
      animOffset: 0
    };
    stateRef.current.coins = level.coins.map((c, i) => ({
      id: `coin-${i}`,
      x: c.x,
      y: c.y,
      collected: false
    }));
    stateRef.current.stars = level.stars.map((s, i) => ({
      id: `star-${i}`,
      x: s.x,
      y: s.y,
      collected: false,
      index: i + 1
    }));
    stateRef.current.traps = level.traps.map((t, i) => ({
      id: `trap-${i}`,
      x: t.x,
      y: t.y,
      type: t.type,
      state: 'idle',
      timer: (i * 0.7) % (t.interval || 2.5),
      interval: t.interval || 2.8,
      warningTime: 0.8,
      activeTime: 1.0
    }));
    stateRef.current.enemies = level.enemies.map((e, i) => ({
      id: `enemy-${i}`,
      x: e.x,
      y: e.y,
      gridX: e.x,
      gridY: e.y,
      targetGridX: e.x,
      targetGridY: e.y,
      type: e.type,
      direction: 'RIGHT',
      patrolPath: e.patrolPath,
      currentPathIndex: 0,
      speed: e.speed || 2.2
    }));
    stateRef.current.powerUps = level.powerUps.map((p, i) => ({
      id: `powerup-${i}`,
      x: p.x,
      y: p.y,
      type: p.type,
      collected: false
    }));
    stateRef.current.floatingTexts = [];
    stateRef.current.particles = [];
    stateRef.current.screenShake = 0;
  }, [level]);

  // Add floating score / message
  const addFloatingText = useCallback((text: string, x: number, y: number, color: string) => {
    stateRef.current.floatingTexts.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      color,
      opacity: 1,
      scale: 1,
      life: 0
    });
  }, []);

  // Spawn visual particle burst
  const spawnParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03
      });
    }
  }, []);

  // Screen shake trigger on hit
  const triggerScreenShake = useCallback(() => {
    stateRef.current.screenShake = 8;
  }, []);

  // Helper: check if a grid position is walkable
  const isWalkable = useCallback((gx: number, gy: number): boolean => {
    if (gx < 0 || gx >= level.width || gy < 0 || gy >= level.height) return false;
    return level.grid[gy][gx] === 0;
  }, [level]);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animId: number;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - stateRef.current.lastTime) / 1000, 0.1);
      stateRef.current.lastTime = currentTime;

      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (!canvas || !container) {
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      // Resize canvas to match display size with pixel ratio
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Calculate cell dimensions to fit maze nicely within canvas
      const padding = 16;
      const availableW = displayWidth - padding * 2;
      const availableH = displayHeight - padding * 2;
      const cellSize = Math.min(
        Math.floor(availableW / level.width),
        Math.floor(availableH / level.height)
      );

      const offsetX = Math.floor((displayWidth - cellSize * level.width) / 2);
      const offsetY = Math.floor((displayHeight - cellSize * level.height) / 2);

      // Handle Screen Shake
      if (stateRef.current.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * stateRef.current.screenShake;
        const shakeY = (Math.random() - 0.5) * stateRef.current.screenShake;
        ctx.translate(shakeX, shakeY);
        stateRef.current.screenShake = Math.max(0, stateRef.current.screenShake - dt * 25);
      }

      const enemiesFrozen = activePowerUps.freeze > 0;

      // If not paused, update game logic
      if (!isPaused) {
        const p = stateRef.current.player;
        p.animOffset += dt * 4;

        // Player Speed (cells per second)
        const baseSpeed = activePowerUps.speed > 0 ? 6.5 : 4.5;

        // Player Movement Logic
        if (!p.isMoving) {
          // If stationary, can we move in currentDirection?
          if (currentDirection !== 'NONE') {
            let nextGx = p.gridX;
            let nextGy = p.gridY;
            if (currentDirection === 'UP') nextGy -= 1;
            else if (currentDirection === 'DOWN') nextGy += 1;
            else if (currentDirection === 'LEFT') nextGx -= 1;
            else if (currentDirection === 'RIGHT') nextGx += 1;

            if (isWalkable(nextGx, nextGy)) {
              p.targetGridX = nextGx;
              p.targetGridY = nextGy;
              p.isMoving = true;
              p.facing = currentDirection;
            }
          }
        }

        if (p.isMoving) {
          const dx = p.targetGridX - p.x;
          const dy = p.targetGridY - p.y;
          const dist = Math.hypot(dx, dy);
          const step = baseSpeed * dt;

          if (dist <= step) {
            // Reached destination cell
            p.x = p.targetGridX;
            p.y = p.targetGridY;
            p.gridX = p.targetGridX;
            p.gridY = p.targetGridY;
            p.isMoving = false;

            // Continue moving in currentDirection if possible
            if (currentDirection !== 'NONE') {
              let nextGx = p.gridX;
              let nextGy = p.gridY;
              if (currentDirection === 'UP') nextGy -= 1;
              else if (currentDirection === 'DOWN') nextGy += 1;
              else if (currentDirection === 'LEFT') nextGx -= 1;
              else if (currentDirection === 'RIGHT') nextGx += 1;

              if (isWalkable(nextGx, nextGy)) {
                p.targetGridX = nextGx;
                p.targetGridY = nextGy;
                p.isMoving = true;
                p.facing = currentDirection;
              }
            }
          } else {
            p.x += (dx / dist) * step;
            p.y += (dy / dist) * step;
          }

          // Emit subtle trailing particles
          if (Math.random() < 0.4) {
            stateRef.current.particles.push({
              x: (p.x + 0.5) * cellSize + offsetX,
              y: (p.y + 0.5) * cellSize + offsetY,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8,
              size: 2,
              color: activePowerUps.speed > 0 ? '#fbbf24' : '#38bdf8',
              alpha: 0.6,
              decay: 0.05
            });
          }
        }

        // Magnet Power-up Logic: Pull nearby coins towards player
        if (activePowerUps.magnet > 0) {
          stateRef.current.coins.forEach(coin => {
            if (!coin.collected) {
              const cdist = Math.hypot(p.x - coin.x, p.y - coin.y);
              if (cdist < 3.2 && cdist > 0.1) {
                const pullSpeed = 4 * dt;
                coin.x += ((p.x - coin.x) / cdist) * pullSpeed;
                coin.y += ((p.y - coin.y) / cdist) * pullSpeed;
              }
            }
          });
        }

        // Coin Collection Check
        stateRef.current.coins.forEach(coin => {
          if (!coin.collected) {
            const dist = Math.hypot(p.x - coin.x, p.y - coin.y);
            if (dist < 0.6) {
              coin.collected = true;
              const comboBonus = Math.min(combo + 1, 5);
              onCoinCollected(coin, comboBonus);
              sound.playCoin();
              sound.playCombo(comboBonus);

              const screenX = (coin.x + 0.5) * cellSize + offsetX;
              const screenY = (coin.y + 0.5) * cellSize + offsetY;
              spawnParticles(screenX, screenY, '#fbbf24', 8);

              const bonusText = comboBonus > 1 ? `+${100 * comboBonus} (x${comboBonus})` : '+100';
              addFloatingText(bonusText, screenX, screenY, comboBonus > 2 ? '#f59e0b' : '#fbbf24');
            }
          }
        });

        // Star Collection Check
        stateRef.current.stars.forEach(star => {
          if (!star.collected) {
            const dist = Math.hypot(p.x - star.x, p.y - star.y);
            if (dist < 0.65) {
              star.collected = true;
              onStarCollected(star);
              sound.playStar();

              const screenX = (star.x + 0.5) * cellSize + offsetX;
              const screenY = (star.y + 0.5) * cellSize + offsetY;
              spawnParticles(screenX, screenY, '#a855f7', 16);
              addFloatingText('+500 STAR!', screenX, screenY, '#c084fc');
            }
          }
        });

        // PowerUp Collection Check
        stateRef.current.powerUps.forEach(pu => {
          if (!pu.collected) {
            const dist = Math.hypot(p.x - pu.x, p.y - pu.y);
            if (dist < 0.65) {
              pu.collected = true;
              onPowerUpCollected(pu);
              sound.playPowerUp();

              const screenX = (pu.x + 0.5) * cellSize + offsetX;
              const screenY = (pu.y + 0.5) * cellSize + offsetY;
              spawnParticles(screenX, screenY, '#38bdf8', 14);
              addFloatingText(`+${pu.type}!`, screenX, screenY, '#38bdf8');
            }
          }
        });

        // Exit Portal Reach Check
        const exitDist = Math.hypot(p.x - level.exitPos.x, p.y - level.exitPos.y);
        if (exitDist < 0.5) {
          onReachExit();
        }

        // Trap Updating & Collision
        stateRef.current.traps.forEach(trap => {
          trap.timer = (trap.timer + dt) % trap.interval;

          if (trap.timer < trap.interval - (trap.warningTime + trap.activeTime)) {
            trap.state = 'idle';
          } else if (trap.timer < trap.interval - trap.activeTime) {
            trap.state = 'warning';
          } else {
            trap.state = 'active';
          }

          // Damage check if active and player intersects
          if (trap.state === 'active' && invulnerableTime <= 0) {
            const dist = Math.hypot(p.x - trap.x, p.y - trap.y);
            if (dist < 0.65) {
              triggerScreenShake();
              onTrapHit();
              const screenX = (trap.x + 0.5) * cellSize + offsetX;
              const screenY = (trap.y + 0.5) * cellSize + offsetY;
              spawnParticles(screenX, screenY, '#ef4444', 16);
              addFloatingText(activePowerUps.shield ? 'SHIELD BLOCKED!' : '-1 LIFE!', screenX, screenY, '#ef4444');
            }
          }
        });

        // Enemy Updating & Collision (Skip movement if Freeze powerup active)
        stateRef.current.enemies.forEach(enemy => {
          if (!enemiesFrozen) {
            // Patrol movement along patrolPath
            if (enemy.patrolPath && enemy.patrolPath.length > 1) {
              const currentWaypoint = enemy.patrolPath[enemy.currentPathIndex || 0];
              const edx = currentWaypoint.x - enemy.x;
              const edy = currentWaypoint.y - enemy.y;
              const edist = Math.hypot(edx, edy);
              const estep = enemy.speed * dt;

              if (edist <= estep) {
                enemy.x = currentWaypoint.x;
                enemy.y = currentWaypoint.y;
                enemy.currentPathIndex = ((enemy.currentPathIndex || 0) + 1) % enemy.patrolPath.length;
              } else {
                enemy.x += (edx / edist) * estep;
                enemy.y += (edy / edist) * estep;
              }
            } else if (enemy.type === 'hunter') {
              // Soft chase towards player if unobstructed line of sight or nearby
              const hdx = p.x - enemy.x;
              const hdy = p.y - enemy.y;
              const hdist = Math.hypot(hdx, hdy);
              if (hdist < 4.5 && hdist > 0.2) {
                const step = enemy.speed * 0.7 * dt;
                const tryX = enemy.x + (hdx / hdist) * step;
                const tryY = enemy.y + (hdy / hdist) * step;
                if (isWalkable(Math.round(tryX), Math.round(tryY))) {
                  enemy.x = tryX;
                  enemy.y = tryY;
                }
              }
            }
          }

          // Enemy Collision with Player
          if (invulnerableTime <= 0) {
            const pDist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
            if (pDist < 0.7) {
              triggerScreenShake();
              onEnemyHit();
              const screenX = (p.x + 0.5) * cellSize + offsetX;
              const screenY = (p.y + 0.5) * cellSize + offsetY;
              spawnParticles(screenX, screenY, '#f43f5e', 18);
              addFloatingText(activePowerUps.shield ? 'SHIELD ABSORBED!' : '-1 LIFE!', screenX, screenY, '#f43f5e');
            }
          }
        });

        // Update floating texts
        stateRef.current.floatingTexts = stateRef.current.floatingTexts.filter(ft => {
          ft.life += dt * 1.5;
          ft.y -= dt * 35;
          ft.opacity = Math.max(0, 1 - ft.life);
          return ft.life < 1;
        });

        // Update particles
        stateRef.current.particles = stateRef.current.particles.filter(pt => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha -= pt.decay;
          return pt.alpha > 0;
        });
      }

      // ==========================================
      // RENDERING SECTION
      // ==========================================

      // 1. Clear background
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Maze arena background with subtle glow
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(offsetX, offsetY, level.width * cellSize, level.height * cellSize);

      // Subtle arena grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= level.width; x++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + x * cellSize, offsetY);
        ctx.lineTo(offsetX + x * cellSize, offsetY + level.height * cellSize);
        ctx.stroke();
      }
      for (let y = 0; y <= level.height; y++) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + y * cellSize);
        ctx.lineTo(offsetX + level.width * cellSize, offsetY + y * cellSize);
        ctx.stroke();
      }

      // 2. Render Walls
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          if (level.grid[y][x] === 1) {
            const wx = offsetX + x * cellSize;
            const wy = offsetY + y * cellSize;
            
            // Wall body
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.roundRect(wx + 1, wy + 1, cellSize - 2, cellSize - 2, 4);
            ctx.fill();

            // Wall inner bevel
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Wall top neon accent line
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(wx + 3, wy + 2);
            ctx.lineTo(wx + cellSize - 3, wy + 2);
            ctx.stroke();
          }
        }
      }

      // 3. Render Exit Portal
      const exitPx = offsetX + (level.exitPos.x + 0.5) * cellSize;
      const exitPy = offsetY + (level.exitPos.y + 0.5) * cellSize;
      const portalRadius = cellSize * 0.42;
      const timeSec = currentTime / 1000;

      // Swirling portal rings
      ctx.save();
      ctx.translate(exitPx, exitPy);
      ctx.rotate(timeSec * 2);

      // Outer glow
      const portalGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, portalRadius);
      portalGrad.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
      portalGrad.addColorStop(0.6, 'rgba(5, 150, 105, 0.4)');
      portalGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Swirl arcs
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, portalRadius * (0.4 + i * 0.18), i * 1.5, i * 1.5 + Math.PI * 0.8);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Render Traps (Spikes)
      stateRef.current.traps.forEach(trap => {
        const tx = offsetX + trap.x * cellSize;
        const ty = offsetY + trap.y * cellSize;

        // Base plate
        ctx.fillStyle = trap.state === 'active' ? '#450a0a' : trap.state === 'warning' ? '#451a03' : '#1e293b';
        ctx.fillRect(tx + 2, ty + 2, cellSize - 4, cellSize - 4);

        if (trap.state === 'warning') {
          // Warning indicator
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeRect(tx + 3, ty + 3, cellSize - 6, cellSize - 6);

          // Center pulsing hazard dot
          const pulse = (Math.sin(timeSec * 12) + 1) / 2;
          ctx.fillStyle = `rgba(245, 158, 11, ${0.4 + pulse * 0.6})`;
          ctx.beginPath();
          ctx.arc(tx + cellSize / 2, ty + cellSize / 2, cellSize * 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (trap.state === 'active') {
          // Sharp extended spikes
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 1.5;

          const spikePoints = [
            { x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 },
            { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.7 },
            { x: 0.5, y: 0.5 }
          ];

          spikePoints.forEach(sp => {
            const sx = tx + sp.x * cellSize;
            const sy = ty + sp.y * cellSize;
            ctx.beginPath();
            ctx.moveTo(sx - 3, sy + 4);
            ctx.lineTo(sx, sy - 5);
            ctx.lineTo(sx + 3, sy + 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          });
        } else {
          // Idle grate
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(tx + 4, ty + 4, cellSize - 8, cellSize - 8);
        }
      });

      // 5. Render Coins
      stateRef.current.coins.forEach(coin => {
        if (!coin.collected) {
          const cx = offsetX + (coin.x + 0.5) * cellSize;
          const cy = offsetY + (coin.y + 0.5) * cellSize;
          const spin = Math.sin(timeSec * 5 + coin.x * 2 + coin.y * 2);
          const r = cellSize * 0.22;

          ctx.save();
          ctx.translate(cx, cy);

          // Glow
          ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Coin body with 3D spin scaling
          ctx.scale(Math.abs(spin) * 0.7 + 0.3, 1);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Inner gold ring
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });

      // 6. Render Stars
      stateRef.current.stars.forEach(star => {
        if (!star.collected) {
          const sx = offsetX + (star.x + 0.5) * cellSize;
          const sy = offsetY + (star.y + 0.5) * cellSize;
          const starRadius = cellSize * 0.32;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(timeSec * 1.8);

          // Star outer flare
          ctx.fillStyle = 'rgba(192, 132, 252, 0.3)';
          ctx.beginPath();
          ctx.arc(0, 0, starRadius * 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Draw 5-pointed star
          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const innerAngle = outerAngle + Math.PI / 5;
            const ox = Math.cos(outerAngle) * starRadius;
            const oy = Math.sin(outerAngle) * starRadius;
            const ix = Math.cos(innerAngle) * (starRadius * 0.45);
            const iy = Math.sin(innerAngle) * (starRadius * 0.45);

            if (i === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
            ctx.lineTo(ix, iy);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
      });

      // 7. Render PowerUps
      stateRef.current.powerUps.forEach(pu => {
        if (!pu.collected) {
          const px = offsetX + (pu.x + 0.5) * cellSize;
          const py = offsetY + (pu.y + 0.5) * cellSize;
          const pRadius = cellSize * 0.3;
          const bob = Math.sin(timeSec * 4) * 3;

          ctx.save();
          ctx.translate(px, py + bob);

          // Powerup aura
          let pColor = '#38bdf8';
          let pLabel = 'S';
          if (pu.type === 'SHIELD') { pColor = '#10b981'; pLabel = '🛡'; }
          else if (pu.type === 'FREEZE') { pColor = '#06b6d4'; pLabel = '❄'; }
          else if (pu.type === 'MAGNET') { pColor = '#ec4899'; pLabel = '🧲'; }
          else if (pu.type === 'SPEED') { pColor = '#eab308'; pLabel = '⚡'; }

          ctx.fillStyle = `${pColor}33`;
          ctx.beginPath();
          ctx.arc(0, 0, pRadius * 1.3, 0, Math.PI * 2);
          ctx.fill();

          // Hexagonal base
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = pColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = Math.cos(angle) * pRadius;
            const hy = Math.sin(angle) * pRadius;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Icon label
          ctx.font = `${Math.floor(cellSize * 0.35)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = pColor;
          ctx.fillText(pLabel, 0, 1);

          ctx.restore();
        }
      });

      // 8. Render Enemies
      stateRef.current.enemies.forEach(enemy => {
        const ex = offsetX + (enemy.x + 0.5) * cellSize;
        const ey = offsetY + (enemy.y + 0.5) * cellSize;
        const eRadius = cellSize * 0.32;

        ctx.save();
        ctx.translate(ex, ey);

        if (enemiesFrozen) {
          // Freeze ice block
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.strokeStyle = '#67e8f9';
          ctx.lineWidth = 2;
          ctx.strokeRect(-eRadius * 1.2, -eRadius * 1.2, eRadius * 2.4, eRadius * 2.4);
          ctx.fillRect(-eRadius * 1.2, -eRadius * 1.2, eRadius * 2.4, eRadius * 2.4);
        }

        // Enemy glow aura
        const enemyAura = ctx.createRadialGradient(0, 0, 2, 0, 0, eRadius * 1.3);
        enemyAura.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
        enemyAura.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = enemyAura;
        ctx.beginPath();
        ctx.arc(0, 0, eRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Enemy Drone Chassis
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, eRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner Red Eye Sensor
        const eyeColor = enemiesFrozen ? '#67e8f9' : '#f87171';
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(0, 0, eRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Scanner sweep line
        if (!enemiesFrozen) {
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 1.5;
          const sweepAngle = timeSec * 6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(sweepAngle) * eRadius * 0.9, Math.sin(sweepAngle) * eRadius * 0.9);
          ctx.stroke();
        }

        ctx.restore();
      });

      // 9. Render Player
      const p = stateRef.current.player;
      const px = offsetX + (p.x + 0.5) * cellSize;
      const py = offsetY + (p.y + 0.5) * cellSize;
      const pRadius = cellSize * 0.35;

      // Invulnerability flicker
      const isVisible = invulnerableTime <= 0 || Math.floor(timeSec * 15) % 2 === 0;

      if (isVisible) {
        ctx.save();
        ctx.translate(px, py);

        // Ambient Player Light
        const playerLight = ctx.createRadialGradient(0, 0, 2, 0, 0, pRadius * 2.0);
        playerLight.addColorStop(0, activePowerUps.speed > 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(56, 189, 248, 0.35)');
        playerLight.addColorStop(1, 'transparent');
        ctx.fillStyle = playerLight;
        ctx.beginPath();
        ctx.arc(0, 0, pRadius * 2.0, 0, Math.PI * 2);
        ctx.fill();

        // Shield Effect
        if (activePowerUps.shield) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 + timeSec * 2;
            const sx = Math.cos(angle) * (pRadius * 1.35);
            const sy = Math.sin(angle) * (pRadius * 1.35);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.stroke();
        }

        // Magnet Concentric Rings
        if (activePowerUps.magnet > 0) {
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
          ctx.lineWidth = 1.5;
          const ringR = (pRadius * 1.2 + (timeSec * 20) % (pRadius * 1.5));
          ctx.beginPath();
          ctx.arc(0, 0, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Player Core Body
        const runnerColor = activePowerUps.speed > 0 ? '#fbbf24' : '#38bdf8';
        ctx.fillStyle = runnerColor;
        ctx.beginPath();
        ctx.arc(0, 0, pRadius, 0, Math.PI * 2);
        ctx.fill();

        // Cyber Visor / Directional eye
        let eyeDx = 0;
        let eyeDy = 0;
        if (p.facing === 'UP') eyeDy = -pRadius * 0.4;
        else if (p.facing === 'DOWN') eyeDy = pRadius * 0.4;
        else if (p.facing === 'LEFT') eyeDx = -pRadius * 0.4;
        else if (p.facing === 'RIGHT') eyeDx = pRadius * 0.4;

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(eyeDx, eyeDy, pRadius * 0.38, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeDx, eyeDy, pRadius * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 10. Render Particles
      stateRef.current.particles.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 11. Render Floating Texts
      stateRef.current.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = ft.opacity;
        ctx.font = 'bold 14px "Space Mono", monospace';
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    level,
    isPaused,
    onCoinCollected,
    onStarCollected,
    onPowerUpCollected,
    onTrapHit,
    onEnemyHit,
    onReachExit,
    currentDirection,
    activePowerUps,
    invulnerableTime,
    combo,
    isWalkable,
    addFloatingText,
    spawnParticles,
    triggerScreenShake
  ]);

  // Touch Swipe Handlers directly on the canvas container
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        setCurrentDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        setCurrentDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas 
        ref={canvasRef} 
        className="block cursor-crosshair select-none"
      />
    </div>
  );
};
