export const getAirHockeyHtml = (targetScore: number = 2): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Neon Air Hockey</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #080b12;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #hockeyCanvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    .hud {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .score-board {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
    }
    .player-tag {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 12px;
    }
    .top-player-tag {
      color: #f43f5e;
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
    }
    .bottom-player-tag {
      color: #06b6d4;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.4);
    }
    .score-num {
      font-size: 40px;
      font-weight: 900;
      line-height: 1;
      text-shadow: 0 0 16px currentColor;
    }
    .target-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 11px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 1.5px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 6px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
    }
  </style>
</head>
<body>
  <canvas id="hockeyCanvas"></canvas>
  <div class="hud">
    <!-- Opponent Score -->
    <div class="score-board">
      <span class="player-tag top-player-tag">RIVAL</span>
      <span class="score-num" style="color: #f43f5e" id="topScore">0</span>
    </div>

    <!-- Center Goal Target Badge -->
    <div class="target-badge">FIRST TO ${targetScore} WINS</div>

    <!-- Player Score -->
    <div class="score-board">
      <span class="score-num" style="color: #06b6d4" id="bottomScore">0</span>
      <span class="player-tag bottom-player-tag">YOU</span>
    </div>
  </div>

  <script>
    (function() {
      // --- Web Audio Synthesizer ---
      const AudioEngine = {
        ctx: null,
        init() {
          if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        },
        playHit() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(130, now + 0.08);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
          } catch(e) {}
        },
        playWall() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
          } catch(e) {}
        },
        playGoal() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + i * 0.09);
              gain.gain.setValueAtTime(0.35, now + i * 0.09);
              gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.32);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + i * 0.09);
              osc.stop(now + i * 0.09 + 0.32);
            });
          } catch(e) {}
        }
      };

      function sendNative(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      const canvas = document.getElementById('hockeyCanvas');
      const ctx = canvas.getContext('2d');
      const topScoreEl = document.getElementById('topScore');
      const bottomScoreEl = document.getElementById('bottomScore');

      let width = window.innerWidth;
      let height = window.innerHeight;
      let dpr = window.devicePixelRatio || 2;

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = window.devicePixelRatio || 2;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resize);
      resize();

      // --- Dimensions & Physics Constants ---
      const PADDING = 20;
      const RINK_X = PADDING;
      const RINK_Y = 65;
      const RINK_W = width - PADDING * 2;
      const RINK_H = height - 130;
      const CORNER_C = 44; // 45-degree corner chamfer bank size
      const GOAL_WIDTH = RINK_W * 0.44;
      const GOAL_X1 = RINK_X + (RINK_W - GOAL_WIDTH) / 2;
      const GOAL_X2 = GOAL_X1 + GOAL_WIDTH;

      const MALLET_RADIUS = 28;
      const PUCK_RADIUS = 18;
      const MAX_PUCK_SPEED = 15;
      const MAX_MALLET_MOVE = 18;

      let scoreP1 = 0;
      let scoreP2 = 0;
      let targetWins = ${targetScore};

      // State Machine: 'SERVE' | 'PLAYING' | 'GOAL' | 'MATCH_OVER'
      let matchState = 'SERVE';
      let serveCountdown = 50;
      let stuckTimer = 0; // Anti-hang watchdog timer
      let banner = { text: 'READY', sub: 'Hit the puck forward!', color: '#06b6d4', alpha: 1 };

      let particles = [];
      let puckTrail = [];
      let cameraShake = { x: 0, y: 0, count: 0, intensity: 0 };

      // Game Entities
      const puck = {
        x: RINK_X + RINK_W / 2,
        y: RINK_Y + RINK_H * 0.6,
        vx: 0,
        vy: 0,
        radius: PUCK_RADIUS,
        visible: true
      };

      const p1 = {
        x: RINK_X + RINK_W / 2,
        y: RINK_Y + RINK_H * 0.82,
        vx: 0,
        vy: 0,
        radius: MALLET_RADIUS,
        touchId: null,
        targetX: RINK_X + RINK_W / 2,
        targetY: RINK_Y + RINK_H * 0.82
      };

      const p2 = {
        x: RINK_X + RINK_W / 2,
        y: RINK_Y + RINK_H * 0.18,
        vx: 0,
        vy: 0,
        radius: MALLET_RADIUS,
        targetX: RINK_X + RINK_W / 2,
        targetY: RINK_Y + RINK_H * 0.18
      };

      // --- Touch Handling (Player Only) ---
      window.addEventListener('touchstart', handleTouch, { passive: false });
      window.addEventListener('touchmove', handleTouch, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
      window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      function handleTouch(e) {
        e.preventDefault();
        AudioEngine.init();

        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          const tx = t.clientX;
          const ty = t.clientY;

          // Player controls the mallet anywhere on bottom half with full corner reach
          if (ty > RINK_Y + RINK_H * 0.42) {
            p1.touchId = t.identifier;
            p1.targetX = Math.max(RINK_X + p1.radius - 8, Math.min(RINK_X + RINK_W - p1.radius + 8, tx));
            p1.targetY = Math.max(RINK_Y + RINK_H * 0.48, Math.min(RINK_Y + RINK_H - p1.radius - 2, ty));
          }
        }
      }

      function handleTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (p1.touchId === t.identifier) p1.touchId = null;
        }
      }

      function startNewMatch() {
        scoreP1 = 0;
        scoreP2 = 0;
        topScoreEl.innerText = '0';
        bottomScoreEl.innerText = '0';
        setupServe('p1');
      }

      function setupServe(whoServes) {
        matchState = 'SERVE';
        serveCountdown = 45;
        stuckTimer = 0;
        puck.visible = true;
        puck.vx = 0;
        puck.vy = 0;
        puckTrail = [];

        p1.targetX = RINK_X + RINK_W / 2;
        p1.targetY = RINK_Y + RINK_H * 0.82;
        p1.x = p1.targetX;
        p1.y = p1.targetY;

        p2.targetX = RINK_X + RINK_W / 2;
        p2.targetY = RINK_Y + RINK_H * 0.18;
        p2.x = p2.targetX;
        p2.y = p2.targetY;

        if (whoServes === 'p1') {
          puck.x = RINK_X + RINK_W / 2;
          puck.y = RINK_Y + RINK_H * 0.65;
          banner = { text: 'YOUR SERVE', sub: 'Strike forward to score!', color: '#06b6d4', alpha: 1 };
        } else {
          puck.x = RINK_X + RINK_W / 2;
          puck.y = RINK_Y + RINK_H * 0.35;
          banner = { text: 'OPPONENT SERVE', sub: 'Get ready to defend!', color: '#f43f5e', alpha: 1 };
        }
      }

      // Friendly Opponent Controller (User can win easily within 30s)
      function updateAI() {
        let targetX = RINK_X + RINK_W / 2;
        let targetY = RINK_Y + RINK_H * 0.18;

        if (matchState === 'SERVE' && puck.y < RINK_Y + RINK_H * 0.5) {
          if (serveCountdown <= 10) {
            targetX = puck.x;
            targetY = puck.y - 10;
          }
        } else if (matchState === 'PLAYING') {
          if (puck.y < RINK_Y + RINK_H * 0.44) {
            targetX = puck.x;
            targetY = Math.min(RINK_Y + RINK_H * 0.42, puck.y - 12);
          } else {
            // Defend goal center with slight natural reaction delay
            // Leaving corner angles open so player can easily score!
            targetX = (puck.x * 0.35) + ((RINK_X + RINK_W / 2) * 0.65);
            targetY = RINK_Y + p2.radius + 24;
          }
        }

        targetX = Math.max(RINK_X + p2.radius + 6, Math.min(RINK_X + RINK_W - p2.radius - 6, targetX));
        targetY = Math.max(RINK_Y + p2.radius + 14, Math.min(RINK_Y + RINK_H * 0.5 - p2.radius - 8, targetY));

        p2.targetX = targetX;
        p2.targetY = targetY;
      }

      // --- Mallet Puck Collision ---
      function resolveMalletCollision(m) {
        if (!puck.visible) return;

        const dx = puck.x - m.x;
        const dy = puck.y - m.y;
        const dist = Math.hypot(dx, dy);
        const minDist = puck.radius + m.radius;

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          puck.x = m.x + nx * minDist;
          puck.y = m.y + ny * minDist;

          const rvx = puck.vx - m.vx;
          const rvy = puck.vy - m.vy;
          const velAlongNormal = rvx * nx + rvy * ny;

          if (velAlongNormal < 0) {
            const restitution = 1.0;
            const impulse = -(1 + restitution) * velAlongNormal;
            puck.vx += nx * impulse + m.vx * 0.55;
            puck.vy += ny * impulse + m.vy * 0.55;

            const speed = Math.hypot(puck.vx, puck.vy);
            if (speed > MAX_PUCK_SPEED) {
              puck.vx = (puck.vx / speed) * MAX_PUCK_SPEED;
              puck.vy = (puck.vy / speed) * MAX_PUCK_SPEED;
            }

            AudioEngine.playHit();
            triggerShake(4, 6);
            addSparks(puck.x, puck.y, m === p1 ? '#06b6d4' : '#f43f5e', 14);
            sendNative({ type: 'HIT' });

            if (matchState === 'SERVE') {
              matchState = 'PLAYING';
            }
          }
        }
      }

      function triggerShake(intensity, frames) {
        cameraShake.intensity = intensity;
        cameraShake.count = frames;
      }

      function addSparks(x, y, color, count) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 3 + Math.random() * 3.5,
            alpha: 1,
            decay: 0.04
          });
        }
      }

      function update() {
        if (matchState === 'MATCH_OVER') return;

        if (cameraShake.count > 0) {
          cameraShake.count--;
          cameraShake.x = (Math.random() - 0.5) * cameraShake.intensity;
          cameraShake.y = (Math.random() - 0.5) * cameraShake.intensity;
        } else {
          cameraShake.x = 0;
          cameraShake.y = 0;
        }

        if (matchState === 'SERVE' && serveCountdown > 0) {
          serveCountdown--;
        }

        updateAI();

        // Move Player Mallet
        const dx1 = p1.targetX - p1.x;
        const dy1 = p1.targetY - p1.y;
        const dist1 = Math.hypot(dx1, dy1);
        const move1 = Math.min(dist1, MAX_MALLET_MOVE);
        const prevP1X = p1.x;
        const prevP1Y = p1.y;
        if (dist1 > 0) {
          p1.x += (dx1 / dist1) * move1;
          p1.y += (dy1 / dist1) * move1;
        }
        p1.vx = p1.x - prevP1X;
        p1.vy = p1.y - prevP1Y;

        // Move Opponent Mallet with friendly, beatable speed (max 6.2)
        const dx2 = p2.targetX - p2.x;
        const dy2 = p2.targetY - p2.y;
        const dist2 = Math.hypot(dx2, dy2);
        const maxMoveP2 = 6.2;
        const move2 = Math.min(dist2, maxMoveP2);
        const prevP2X = p2.x;
        const prevP2Y = p2.y;
        if (dist2 > 0) {
          p2.x += (dx2 / dist2) * move2;
          p2.y += (dy2 / dist2) * move2;
        }
        p2.vx = p2.x - prevP2X;
        p2.vy = p2.y - prevP2Y;

        resolveMalletCollision(p1);
        resolveMalletCollision(p2);

        if (matchState === 'PLAYING' || matchState === 'SERVE') {
          for (let step = 0; step < 2; step++) {
            puck.x += puck.vx * 0.5;
            puck.y += puck.vy * 0.5;

            // --- 1. 45-DEGREE CORNER CHAMFER BANKS (PREVENTS HANGING IN CORNERS) ---
            const C = CORNER_C;

            // Top-Left Corner Bank
            const tlDist = (puck.x - RINK_X) + (puck.y - RINK_Y);
            if (tlDist < C + puck.radius) {
              const overlap = (C + puck.radius) - tlDist;
              puck.x += overlap * 0.55;
              puck.y += overlap * 0.55;
              const dot = (puck.vx + puck.vy) * 0.7071;
              if (dot < 0) {
                puck.vx = (puck.vx - 1.414 * dot) * 0.95;
                puck.vy = (puck.vy - 1.414 * dot) * 0.95;
              }
              if (Math.hypot(puck.vx, puck.vy) < 4.0) {
                puck.vx = 4.0;
                puck.vy = 4.0;
              }
              AudioEngine.playWall();
            }

            // Top-Right Corner Bank
            const trDist = (RINK_X + RINK_W - puck.x) + (puck.y - RINK_Y);
            if (trDist < C + puck.radius) {
              const overlap = (C + puck.radius) - trDist;
              puck.x -= overlap * 0.55;
              puck.y += overlap * 0.55;
              const dot = (-puck.vx + puck.vy) * 0.7071;
              if (dot < 0) {
                puck.vx = (puck.vx + 1.414 * dot) * 0.95;
                puck.vy = (puck.vy - 1.414 * dot) * 0.95;
              }
              if (Math.hypot(puck.vx, puck.vy) < 4.0) {
                puck.vx = -4.0;
                puck.vy = 4.0;
              }
              AudioEngine.playWall();
            }

            // Bottom-Left Corner Bank
            const blDist = (puck.x - RINK_X) + (RINK_Y + RINK_H - puck.y);
            if (blDist < C + puck.radius) {
              const overlap = (C + puck.radius) - blDist;
              puck.x += overlap * 0.55;
              puck.y -= overlap * 0.55;
              const dot = (puck.vx - puck.vy) * 0.7071;
              if (dot < 0) {
                puck.vx = (puck.vx - 1.414 * dot) * 0.95;
                puck.vy = (puck.vy + 1.414 * dot) * 0.95;
              }
              if (Math.hypot(puck.vx, puck.vy) < 4.0) {
                puck.vx = 4.0;
                puck.vy = -4.0;
              }
              AudioEngine.playWall();
            }

            // Bottom-Right Corner Bank
            const brDist = (RINK_X + RINK_W - puck.x) + (RINK_Y + RINK_H - puck.y);
            if (brDist < C + puck.radius) {
              const overlap = (C + puck.radius) - brDist;
              puck.x -= overlap * 0.55;
              puck.y -= overlap * 0.55;
              const dot = (-puck.vx - puck.vy) * 0.7071;
              if (dot < 0) {
                puck.vx = (puck.vx + 1.414 * dot) * 0.95;
                puck.vy = (puck.vy + 1.414 * dot) * 0.95;
              }
              if (Math.hypot(puck.vx, puck.vy) < 4.0) {
                puck.vx = -4.0;
                puck.vy = -4.0;
              }
              AudioEngine.playWall();
            }

            // --- 2. SIDE WALLS ---
            if (puck.x - puck.radius <= RINK_X) {
              puck.x = RINK_X + puck.radius;
              puck.vx = Math.abs(puck.vx) * 0.9;
              AudioEngine.playWall();
            } else if (puck.x + puck.radius >= RINK_X + RINK_W) {
              puck.x = RINK_X + RINK_W - puck.radius;
              puck.vx = -Math.abs(puck.vx) * 0.9;
              AudioEngine.playWall();
            }

            // --- 3. TOP BOUNDARY (GOAL OR WALL) ---
            if (puck.y - puck.radius <= RINK_Y) {
              if (puck.x >= GOAL_X1 && puck.x <= GOAL_X2) {
                triggerGoal('p1');
                break;
              } else {
                puck.y = RINK_Y + puck.radius;
                puck.vy = Math.abs(puck.vy) * 0.9;
                AudioEngine.playWall();
              }
            }

            // --- 4. BOTTOM BOUNDARY (GOAL OR WALL) ---
            if (puck.y + puck.radius >= RINK_Y + RINK_H) {
              if (puck.x >= GOAL_X1 && puck.x <= GOAL_X2) {
                triggerGoal('p2');
                break;
              } else {
                puck.y = RINK_Y + RINK_H - puck.radius;
                puck.vy = -Math.abs(puck.vy) * 0.9;
                AudioEngine.playWall();
              }
            }
          }

          puck.vx *= 0.992;
          puck.vy *= 0.992;

          // --- 5. ANTI-HANG AIR CUSHION WATCHDOG ---
          // If the puck ever stops moving or gets trapped for > 0.5s, kick it toward center
          if (matchState === 'PLAYING') {
            const currentSpeed = Math.hypot(puck.vx, puck.vy);
            if (currentSpeed < 1.0) {
              stuckTimer++;
              if (stuckTimer > 25) {
                const angleToCenter = Math.atan2(
                  (RINK_Y + RINK_H * 0.5) - puck.y,
                  (RINK_X + RINK_W * 0.5) - puck.x
                );
                puck.vx = Math.cos(angleToCenter) * 6.5;
                puck.vy = Math.sin(angleToCenter) * 6.5;
                stuckTimer = 0;
                AudioEngine.playWall();
                addSparks(puck.x, puck.y, '#38bdf8', 14);
              }
            } else {
              stuckTimer = 0;
            }
          }

          if (puck.visible && Math.hypot(puck.vx, puck.vy) > 2) {
            puckTrail.push({ x: puck.x, y: puck.y, alpha: 0.6 });
            if (puckTrail.length > 8) puckTrail.shift();
          } else {
            puckTrail.shift();
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          if (p.alpha <= 0) particles.splice(i, 1);
        }

        if (matchState === 'PLAYING' && banner.alpha > 0) {
          banner.alpha -= 0.025;
        }
      }

      function triggerGoal(scorer) {
        if (matchState === 'GOAL' || matchState === 'MATCH_OVER') return;

        matchState = 'GOAL';
        puck.vx = 0;
        puck.vy = 0;
        puck.visible = false;
        puckTrail = [];

        AudioEngine.playGoal();
        triggerShake(12, 18);

        if (scorer === 'p1') {
          scoreP1++;
          bottomScoreEl.innerText = scoreP1;
          addSparks(RINK_X + RINK_W / 2, RINK_Y + 10, '#06b6d4', 40);
          banner = { text: 'GOAL! ⚡', sub: '+1 Point for You', color: '#06b6d4', alpha: 1.5 };
          sendNative({ type: 'GOAL', scorer: 'p1', scoreP1, scoreP2 });

          if (scoreP1 >= targetWins) {
            matchState = 'MATCH_OVER';
            sendNative({ type: 'GAME_OVER', winner: 'p1', scoreP1, scoreP2 });
            return;
          }
        } else {
          scoreP2++;
          topScoreEl.innerText = scoreP2;
          addSparks(RINK_X + RINK_W / 2, RINK_Y + RINK_H - 10, '#f43f5e', 40);
          banner = { text: 'RIVAL SCORED!', sub: '+1 Point', color: '#f43f5e', alpha: 1.5 };
          sendNative({ type: 'GOAL', scorer: 'p2', scoreP1, scoreP2 });

          if (scoreP2 >= targetWins) {
            matchState = 'MATCH_OVER';
            sendNative({ type: 'GAME_OVER', winner: 'p2', scoreP1, scoreP2 });
            return;
          }
        }

        setTimeout(() => {
          setupServe(scorer === 'p1' ? 'p2' : 'p1');
        }, 1000);
      }

      function drawRink() {
        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);

        const C = CORNER_C;

        // Octagon Table Surface with 45-degree chamfered corners
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(RINK_X + C, RINK_Y);
        ctx.lineTo(RINK_X + RINK_W - C, RINK_Y);
        ctx.lineTo(RINK_X + RINK_W, RINK_Y + C);
        ctx.lineTo(RINK_X + RINK_W, RINK_Y + RINK_H - C);
        ctx.lineTo(RINK_X + RINK_W - C, RINK_Y + RINK_H);
        ctx.lineTo(RINK_X + C, RINK_Y + RINK_H);
        ctx.lineTo(RINK_X, RINK_Y + RINK_H - C);
        ctx.lineTo(RINK_X, RINK_Y + C);
        ctx.closePath();
        ctx.fill();

        // Glowing outer border
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
        ctx.stroke();

        // 45-degree corner bank accent lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(RINK_X + C, RINK_Y);
        ctx.lineTo(RINK_X, RINK_Y + C);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(RINK_X + RINK_W - C, RINK_Y);
        ctx.lineTo(RINK_X + RINK_W, RINK_Y + C);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(RINK_X + C, RINK_Y + RINK_H);
        ctx.lineTo(RINK_X, RINK_Y + RINK_H - C);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(RINK_X + RINK_W - C, RINK_Y + RINK_H);
        ctx.lineTo(RINK_X + RINK_W, RINK_Y + RINK_H - C);
        ctx.stroke();

        // Center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(RINK_X, RINK_Y + RINK_H / 2);
        ctx.lineTo(RINK_X + RINK_W, RINK_Y + RINK_H / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center circle
        ctx.beginPath();
        ctx.arc(RINK_X + RINK_W / 2, RINK_Y + RINK_H / 2, 46, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Goals (Top & Bottom)
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 15;
        ctx.fillRect(GOAL_X1, RINK_Y - 4, GOAL_WIDTH, 8);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.fillRect(GOAL_X1, RINK_Y + RINK_H - 4, GOAL_WIDTH, 8);
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      function drawPuck() {
        if (!puck.visible) return;

        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);

        for (let i = 0; i < puckTrail.length; i++) {
          const t = puckTrail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, PUCK_RADIUS * (0.4 + (i / puckTrail.length) * 0.6), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245, 158, 11, ' + (t.alpha * (i / puckTrail.length)) + ')';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(puck.x, puck.y, PUCK_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(puck.x, puck.y, PUCK_RADIUS * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#d97706';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(puck.x, puck.y, PUCK_RADIUS * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#fef3c7';
        ctx.fill();

        ctx.restore();
      }

      function drawMallet(m, colorHex, auraHex) {
        ctx.save();
        ctx.translate(m.x + cameraShake.x, m.y + cameraShake.y);

        ctx.beginPath();
        ctx.arc(0, 0, m.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = auraHex;
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, m.radius * 0.68, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, m.radius * 0.36, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.fill();

        ctx.restore();
      }

      function drawParticles() {
        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);
        for (let p of particles) {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      function drawBanner() {
        if (banner.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, banner.alpha);
          ctx.font = '900 32px -apple-system, sans-serif';
          ctx.fillStyle = banner.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = banner.color;
          ctx.shadowBlur = 16;
          ctx.fillText(banner.text, width / 2, height / 2 - 32);

          if (banner.sub) {
            ctx.font = '600 14px -apple-system, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.shadowBlur = 0;
            ctx.fillText(banner.sub, width / 2, height / 2 + 40);
          }
          ctx.restore();
        }
      }

      function render() {
        ctx.clearRect(0, 0, width, height);
        drawRink();
        drawPuck();
        drawMallet(p1, '#06b6d4', 'rgba(6, 182, 212, 0.22)');
        drawMallet(p2, '#f43f5e', 'rgba(244, 63, 94, 0.22)');
        drawParticles();
        drawBanner();
      }

      function loop() {
        update();
        render();
        requestAnimationFrame(loop);
      }

      startNewMatch();
      requestAnimationFrame(loop);
    })();
  </script>
</body>
</html>
`;
