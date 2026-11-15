export const getKnifeHitHtml = (initialTotalKnives: number = 7): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Knife Hit</title>
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
      background: radial-gradient(circle at 50% 35%, #1a2238 0%, #0a0d16 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #gameCanvas {
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
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }
    .score-badge {
      font-size: 34px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 4px 14px rgba(0,0,0,0.7);
      letter-spacing: 1px;
    }
    .stage-badge {
      font-size: 13px;
      font-weight: 800;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.18);
      border: 1px solid rgba(245, 158, 11, 0.45);
      padding: 6px 14px;
      border-radius: 20px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .apple-badge {
      font-size: 15px;
      font-weight: 800;
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      padding: 5px 12px;
      border-radius: 20px;
    }
    .knife-stack {
      position: absolute;
      bottom: 24px;
      left: 20px;
      display: flex;
      flex-direction: column-reverse;
      gap: 6px;
    }
    .knife-icon {
      width: 12px;
      height: 24px;
      background: #f59e0b;
      clip-path: polygon(50% 0%, 100% 35%, 80% 35%, 80% 100%, 20% 100%, 20% 35%, 0% 35%);
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.7);
      transition: all 0.2s ease;
    }
    .knife-icon.used {
      background: #334155;
      box-shadow: none;
      opacity: 0.3;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <div class="hud">
    <div class="top-bar">
      <div class="score-badge" id="scoreDisplay">0</div>
      <div class="stage-badge" id="stageDisplay">STAGE 1</div>
      <div class="apple-badge" id="appleDisplay">🍎 <span id="appleCount">0</span></div>
    </div>
    <div class="knife-stack" id="knifeStack"></div>
  </div>

  <script>
    (function() {
      // --- Web Audio Synthesizer (Zero asset loading, 100% Offline) ---
      const AudioEngine = {
        ctx: null,
        init() {
          if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
              this.ctx = new AudioContext();
            }
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        },
        playThrow() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
          } catch(e) {}
        },
        playHit() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            // Thud low punch
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);
            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);

            // Wood snap click
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(650, now);
            osc2.frequency.exponentialRampToValueAtTime(150, now + 0.05);
            gain2.gain.setValueAtTime(0.3, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now);
            osc2.stop(now + 0.05);
          } catch(e) {}
        },
        playClash() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            [1760, 2640, 3520].forEach((freq, idx) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.35);
              gain.gain.setValueAtTime(0.3 / (idx + 1), now);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now);
              osc.stop(now + 0.35);
            });
          } catch(e) {}
        },
        playApple() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(750, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.14);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
          } catch(e) {}
        },
        playExplode() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.45);
            gain.gain.setValueAtTime(0.55, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
          } catch(e) {}
        }
      };

      function sendNative(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const scoreDisplay = document.getElementById('scoreDisplay');
      const stageDisplay = document.getElementById('stageDisplay');
      const appleCountDisplay = document.getElementById('appleCount');
      const knifeStack = document.getElementById('knifeStack');

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

      // --- Geometry & Constants ---
      const LOG_RADIUS = Math.min(width * 0.25, 105);
      const LOG_CENTER_X = width * 0.5;
      const LOG_CENTER_Y = height * 0.32;
      const KNIFE_BLADE_LEN = 56;
      const KNIFE_HANDLE_LEN = 36;
      const KNIFE_TOTAL_LEN = KNIFE_BLADE_LEN + KNIFE_HANDLE_LEN;
      const KNIFE_WIDTH = 18;
      const READY_Y = height * 0.82;
      // 13.5 degrees threshold in radians (~0.235 rad) - exactly visual knife boundary
      const CLASH_THRESHOLD = (13.5 * Math.PI) / 180;
      const APPLE_THRESHOLD = (16.0 * Math.PI) / 180;

      let score = 0;
      let applesCollected = 0;
      let currentStage = 1;
      let totalKnivesForStage = ${initialTotalKnives};
      let knivesRemaining = totalKnivesForStage;
      let gameState = 'PLAYING'; // 'PLAYING', 'STAGE_CLEAR', 'GAME_OVER'

      let logAngle = 0;
      let logSpeed = 0.035;
      let logSpinTimer = 0;
      let logRecoily = 0;
      let logChunks = [];

      let stuckKnives = []; // Array of { angle, length }
      let apples = [];      // Array of { angle, sliced, halves: [] }
      let particles = [];
      let floatingTexts = [];
      let cameraShake = { x: 0, y: 0, duration: 0, intensity: 0 };

      let activeKnife = {
        y: READY_Y,
        vy: 0,
        state: 'READY', // 'READY', 'FLYING', 'DEFLECTING'
        deflectX: 0,
        deflectVx: 0,
        deflectAngle: 0,
        deflectVRot: 0
      };

      function updateKnifeStackUI() {
        knifeStack.innerHTML = '';
        for (let i = 0; i < totalKnivesForStage; i++) {
          const icon = document.createElement('div');
          icon.className = 'knife-icon' + (i >= knivesRemaining ? ' used' : '');
          knifeStack.appendChild(icon);
        }
      }

      function initStage(stageNum) {
        currentStage = stageNum;
        totalKnivesForStage = Math.min(6 + Math.min(stageNum, 6), 12);
        knivesRemaining = totalKnivesForStage;
        gameState = 'PLAYING';
        logAngle = 0;
        logSpinTimer = 0;
        logChunks = [];
        stuckKnives = [];
        apples = [];
        activeKnife.y = READY_Y;
        activeKnife.vy = 0;
        activeKnife.state = 'READY';
        activeKnife.deflectX = 0;
        activeKnife.deflectAngle = 0;

        stageDisplay.innerText = stageNum % 5 === 0 ? '👑 BOSS STAGE' : ('STAGE ' + stageNum);
        if (stageNum % 5 === 0) {
          stageDisplay.style.color = '#ef4444';
          stageDisplay.style.background = 'rgba(239, 68, 68, 0.2)';
          stageDisplay.style.borderColor = 'rgba(239, 68, 68, 0.6)';
        } else {
          stageDisplay.style.color = '#f59e0b';
          stageDisplay.style.background = 'rgba(245, 158, 11, 0.18)';
          stageDisplay.style.borderColor = 'rgba(245, 158, 11, 0.45)';
        }

        // Spawn initial obstacle knives
        // Stage 1: 0 obstacles (clean warm up)
        // Stage 2: 1 obstacle
        // Stage 3: 2 obstacles
        // Stage 4+: 3 obstacles
        const obstacleCount = stageNum === 1 ? 0 : Math.min(stageNum - 1, 3);
        if (obstacleCount > 0) {
          const step = (Math.PI * 2) / obstacleCount;
          for (let i = 0; i < obstacleCount; i++) {
            // Keep obstacles away from bottom start (angle 0)
            const angle = (i * step) + 1.2;
            stuckKnives.push({
              angle: (angle % (Math.PI * 2)),
              length: KNIFE_TOTAL_LEN
            });
          }
        }

        // Spawn apples (starting stage 2)
        if (stageNum >= 2) {
          const appleCount = stageNum % 3 === 0 ? 2 : 1;
          for (let a = 0; a < appleCount; a++) {
            // Random angle away from initial knives
            const appleAngle = Math.random() * Math.PI * 2;
            apples.push({
              angle: appleAngle,
              sliced: false,
              halves: []
            });
          }
        }

        updateKnifeStackUI();
      }

      function addParticles(x, y, count, color, speedMul = 1, isSpark = false) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (2 + Math.random() * 6) * speedMul;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (isSpark ? 2 : 0),
            color,
            size: isSpark ? (2 + Math.random() * 3) : (3 + Math.random() * 5),
            alpha: 1,
            gravity: isSpark ? 0.25 : 0.4,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.3,
            life: 1,
            decay: 0.02 + Math.random() * 0.03
          });
        }
      }

      function addFloatingText(text, x, y, color = '#f59e0b') {
        floatingTexts.push({
          text,
          x,
          y,
          vy: -2,
          alpha: 1,
          color,
          scale: 1.3
        });
      }

      function triggerShake(intensity, duration) {
        cameraShake.intensity = intensity;
        cameraShake.duration = duration;
      }

      function shatterLog() {
        gameState = 'STAGE_CLEAR';
        AudioEngine.playExplode();
        triggerShake(14, 25);

        const shards = 8;
        logChunks = [];
        for (let i = 0; i < shards; i++) {
          const a1 = (i / shards) * Math.PI * 2;
          const a2 = ((i + 1) / shards) * Math.PI * 2;
          const midA = (a1 + a2) / 2;
          const speed = 5 + Math.random() * 7;
          logChunks.push({
            a1,
            a2,
            x: LOG_CENTER_X,
            y: LOG_CENTER_Y,
            vx: Math.cos(midA) * speed,
            vy: Math.sin(midA) * speed + 1,
            rotation: 0,
            vRot: (Math.random() - 0.5) * 0.2,
            alpha: 1
          });
        }

        addParticles(LOG_CENTER_X, LOG_CENTER_Y, 40, '#c68a4c', 2);
        addParticles(LOG_CENTER_X, LOG_CENTER_Y, 30, '#8b572a', 1.8);
        addParticles(LOG_CENTER_X, LOG_CENTER_Y, 20, '#f59e0b', 2.5, true);

        sendNative({ type: 'STAGE_CLEAR', stage: currentStage, score });

        setTimeout(() => {
          initStage(currentStage + 1);
        }, 1100);
      }

      function throwKnife() {
        AudioEngine.init();
        if (gameState !== 'PLAYING' || activeKnife.state !== 'READY') return;

        activeKnife.state = 'FLYING';
        activeKnife.vy = -36; // Snappy instant velocity
        AudioEngine.playThrow();
      }

      window.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        throwKnife();
      });

      function update() {
        // Camera shake
        if (cameraShake.duration > 0) {
          cameraShake.duration--;
          cameraShake.x = (Math.random() - 0.5) * cameraShake.intensity;
          cameraShake.y = (Math.random() - 0.5) * cameraShake.intensity;
        } else {
          cameraShake.x = 0;
          cameraShake.y = 0;
        }

        logRecoily *= 0.82;

        // Rotation speed patterns
        if (gameState !== 'STAGE_CLEAR') {
          logSpinTimer += 0.02;
          if (currentStage === 1) {
            logSpeed = 0.036;
          } else if (currentStage === 2) {
            logSpeed = 0.042 + Math.sin(logSpinTimer * 2) * 0.02;
          } else if (currentStage === 3) {
            logSpeed = Math.cos(logSpinTimer * 1.5) * 0.052;
          } else if (currentStage % 5 === 0) {
            logSpeed = (Math.sin(logSpinTimer * 2.8) > 0.3 ? 0.07 : -0.055);
          } else {
            logSpeed = 0.048 + Math.sin(logSpinTimer * 2.2) * 0.032;
          }
          logAngle = (logAngle + logSpeed) % (Math.PI * 2);
        }

        // Active Knife Flight Physics
        if (activeKnife.state === 'FLYING') {
          activeKnife.y += activeKnife.vy;

          const targetY = LOG_CENTER_Y + LOG_RADIUS;
          if (activeKnife.y <= targetY) {
            // Impact at bottom of log (world angle 0)
            // Local angle on log: (-logAngle)
            let hitAngle = ((-logAngle) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);

            // Check collision with all stuck knives:
            // A stuck knife's current world angle is (logAngle + k.angle)
            let collidedWithKnife = false;
            for (let k of stuckKnives) {
              let worldKAngle = ((logAngle + k.angle) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
              let diff = Math.abs(worldKAngle);
              if (diff > Math.PI) diff = (Math.PI * 2) - diff;
              if (diff < CLASH_THRESHOLD) {
                collidedWithKnife = true;
                break;
              }
            }

            if (collidedWithKnife) {
              // --- CLASH ---
              activeKnife.state = 'DEFLECTING';
              activeKnife.deflectVx = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 4);
              activeKnife.vy = 8 + Math.random() * 6;
              activeKnife.deflectVRot = (activeKnife.deflectVx > 0 ? 0.25 : -0.25);

              triggerShake(10, 16);
              AudioEngine.playClash();
              addParticles(LOG_CENTER_X, targetY, 25, '#fbbf24', 2, true);
              addParticles(LOG_CENTER_X, targetY, 15, '#ffffff', 1.5, true);

              gameState = 'GAME_OVER';
              sendNative({ type: 'CLASH', score, stage: currentStage });
            } else {
              // --- CLEAN HIT ---
              activeKnife.state = 'READY';
              activeKnife.y = READY_Y;

              logRecoily = -8;
              triggerShake(5, 8);
              AudioEngine.playHit();
              addParticles(LOG_CENTER_X, targetY, 14, '#c68a4c', 1.2);
              addParticles(LOG_CENTER_X, targetY, 8, '#f59e0b', 1, true);

              // Embed knife at hitAngle
              stuckKnives.push({
                angle: hitAngle,
                length: KNIFE_TOTAL_LEN
              });

              score += 1;
              scoreDisplay.innerText = score;
              knivesRemaining--;
              updateKnifeStackUI();

              // Check apple collisions
              for (let app of apples) {
                if (!app.sliced) {
                  let worldAppAngle = ((logAngle + app.angle) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
                  let diff = Math.abs(worldAppAngle);
                  if (diff > Math.PI) diff = (Math.PI * 2) - diff;
                  if (diff < APPLE_THRESHOLD) {
                    app.sliced = true;
                    applesCollected += 2;
                    appleCountDisplay.innerText = applesCollected;
                    AudioEngine.playApple();
                    addFloatingText('+2 APPLES', LOG_CENTER_X, targetY - 24, '#ef4444');
                    addParticles(LOG_CENTER_X, targetY, 20, '#ef4444', 1.8);
                    addParticles(LOG_CENTER_X, targetY, 10, '#22c55e', 1.5);
                    app.halves = [
                      { vx: -4, vy: -3, rot: -0.1 },
                      { vx: 4, vy: -3, rot: 0.1 }
                    ];
                  }
                }
              }

              sendNative({ type: 'HIT', score, knivesRemaining });

              if (knivesRemaining <= 0) {
                shatterLog();
              }
            }
          }
        } else if (activeKnife.state === 'DEFLECTING') {
          activeKnife.deflectX += activeKnife.deflectVx;
          activeKnife.y += activeKnife.vy;
          activeKnife.vy += 0.8;
          activeKnife.deflectAngle += activeKnife.deflectVRot;
        }

        // Update shattered chunks
        for (let chunk of logChunks) {
          chunk.x += chunk.vx;
          chunk.y += chunk.vy;
          chunk.vy += 0.4;
          chunk.rotation += chunk.vRot;
          chunk.alpha = Math.max(0, chunk.alpha - 0.015);
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rotation += p.vRot;
          p.alpha -= p.decay;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
          }
        }

        // Update floating text
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
          const ft = floatingTexts[i];
          ft.y += ft.vy;
          ft.alpha -= 0.02;
          if (ft.alpha <= 0) {
            floatingTexts.splice(i, 1);
          }
        }
      }

      function drawLog() {
        const cx = LOG_CENTER_X + cameraShake.x;
        const cy = LOG_CENTER_Y + cameraShake.y + logRecoily;

        if (gameState === 'STAGE_CLEAR') {
          for (let chunk of logChunks) {
            ctx.save();
            ctx.globalAlpha = chunk.alpha;
            ctx.translate(chunk.x, chunk.y);
            ctx.rotate(chunk.rotation);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, LOG_RADIUS, chunk.a1, chunk.a2);
            ctx.closePath();
            ctx.fillStyle = '#a16207';
            ctx.fill();
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
          }
          return;
        }

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(logAngle);

        // 1. Bark Outer Rim
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, LOG_RADIUS + 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3e210b';
        ctx.fill();
        ctx.shadowBlur = 0;

        // 2. Wood Body Gradient
        const woodGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, LOG_RADIUS);
        woodGrad.addColorStop(0, '#eab308');
        woodGrad.addColorStop(0.3, '#ca8a04');
        woodGrad.addColorStop(0.7, '#a16207');
        woodGrad.addColorStop(1, '#713f12');
        ctx.beginPath();
        ctx.arc(0, 0, LOG_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = woodGrad;
        ctx.fill();

        // 3. Tree Annual Rings
        [0.35, 0.58, 0.82].forEach((rMul) => {
          ctx.beginPath();
          ctx.arc(0, 0, LOG_RADIUS * rMul, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(69, 26, 3, 0.28)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        });

        // 4. Center Wood Core
        ctx.beginPath();
        ctx.arc(0, 0, LOG_RADIUS * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#451a03';
        ctx.fill();

        // 5. Apples on log
        for (let app of apples) {
          if (!app.sliced) {
            ctx.save();
            ctx.rotate(app.angle);
            ctx.translate(0, LOG_RADIUS + 10);
            drawApple(0, 0);
            ctx.restore();
          }
        }

        // 6. Embedded Knives
        for (let k of stuckKnives) {
          ctx.save();
          ctx.rotate(k.angle);
          ctx.translate(0, LOG_RADIUS);
          drawEmbeddedKnife();
          ctx.restore();
        }

        ctx.restore();
      }

      function drawApple(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(-7, 0, 10, 0, Math.PI * 2);
        ctx.arc(7, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, -11, 4, 7, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(2, -14);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      function drawEmbeddedKnife() {
        ctx.save();
        const bladeGrad = ctx.createLinearGradient(-KNIFE_WIDTH/2, 0, KNIFE_WIDTH/2, 0);
        bladeGrad.addColorStop(0, '#94a3b8');
        bladeGrad.addColorStop(0.5, '#ffffff');
        bladeGrad.addColorStop(1, '#64748b');

        // Embedded blade tip points into log
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(-KNIFE_WIDTH * 0.45, 10);
        ctx.lineTo(KNIFE_WIDTH * 0.45, 10);
        ctx.closePath();
        ctx.fillStyle = bladeGrad;
        ctx.fill();

        // Crossguard
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-KNIFE_WIDTH * 0.65, 10, KNIFE_WIDTH * 1.3, 5);

        // Grip
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-KNIFE_WIDTH * 0.3, 15, KNIFE_WIDTH * 0.6, 28);

        // Pommel
        ctx.beginPath();
        ctx.arc(0, 47, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        ctx.restore();
      }

      function drawThrowingKnife() {
        if (activeKnife.state === 'READY') {
          drawSingleKnife(LOG_CENTER_X, READY_Y, 0);
        } else if (activeKnife.state === 'FLYING') {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = KNIFE_WIDTH * 0.8;
          ctx.beginPath();
          ctx.moveTo(LOG_CENTER_X, activeKnife.y + 35);
          ctx.lineTo(LOG_CENTER_X, activeKnife.y + 85);
          ctx.stroke();
          ctx.restore();
          drawSingleKnife(LOG_CENTER_X, activeKnife.y, 0);
        } else if (activeKnife.state === 'DEFLECTING') {
          drawSingleKnife(
            LOG_CENTER_X + activeKnife.deflectX,
            activeKnife.y,
            activeKnife.deflectAngle
          );
        }
      }

      function drawSingleKnife(x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const bladeGrad = ctx.createLinearGradient(-KNIFE_WIDTH/2, 0, KNIFE_WIDTH/2, 0);
        bladeGrad.addColorStop(0, '#94a3b8');
        bladeGrad.addColorStop(0.5, '#ffffff');
        bladeGrad.addColorStop(1, '#64748b');

        // Blade pointing UP
        ctx.beginPath();
        ctx.moveTo(0, -KNIFE_BLADE_LEN);
        ctx.lineTo(-KNIFE_WIDTH * 0.45, 0);
        ctx.lineTo(KNIFE_WIDTH * 0.45, 0);
        ctx.closePath();
        ctx.fillStyle = bladeGrad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bevel centerline
        ctx.beginPath();
        ctx.moveTo(0, -KNIFE_BLADE_LEN + 2);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Crossguard
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-KNIFE_WIDTH * 0.65, 0, KNIFE_WIDTH * 1.3, 5);

        // Handle
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-KNIFE_WIDTH * 0.3, 5, KNIFE_WIDTH * 0.6, KNIFE_HANDLE_LEN - 10);

        // Grip ribs
        ctx.fillStyle = '#475569';
        for (let r = 10; r < 28; r += 5) {
          ctx.fillRect(-KNIFE_WIDTH * 0.28, r, KNIFE_WIDTH * 0.56, 2);
        }

        // Pommel
        ctx.beginPath();
        ctx.arc(0, KNIFE_HANDLE_LEN - 3, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        ctx.restore();
      }

      function drawParticles() {
        for (let p of particles) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      function drawFloatingTexts() {
        for (let ft of floatingTexts) {
          ctx.save();
          ctx.globalAlpha = ft.alpha;
          ctx.font = '900 20px -apple-system, sans-serif';
          ctx.fillStyle = ft.color;
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }
      }

      function render() {
        ctx.clearRect(0, 0, width, height);

        const halo = ctx.createRadialGradient(
          LOG_CENTER_X, LOG_CENTER_Y, LOG_RADIUS * 0.5,
          LOG_CENTER_X, LOG_CENTER_Y, LOG_RADIUS * 1.8
        );
        halo.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(LOG_CENTER_X, LOG_CENTER_Y, LOG_RADIUS * 1.8, 0, Math.PI * 2);
        ctx.fill();

        drawLog();
        drawThrowingKnife();
        drawParticles();
        drawFloatingTexts();
      }

      function loop() {
        update();
        render();
        requestAnimationFrame(loop);
      }

      initStage(1);
      requestAnimationFrame(loop);

      window.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.action === 'RESTART') {
            score = 0;
            scoreDisplay.innerText = 0;
            initStage(1);
          }
        } catch(err) {}
      });
      document.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.action === 'RESTART') {
            score = 0;
            scoreDisplay.innerText = 0;
            initStage(1);
          }
        } catch(err) {}
      });
    })();
  </script>
</body>
</html>
`;
