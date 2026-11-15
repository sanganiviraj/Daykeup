export const getStackTowerHtml = (targetHeight: number = 12): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Stack Tower</title>
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
      background: radial-gradient(circle at 50% 30%, #1e1b4b 0%, #09090b 100%);
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
      padding: 16px 22px;
    }
    .score-badge {
      font-size: 38px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 4px 14px rgba(0,0,0,0.6);
      letter-spacing: 1px;
    }
    .target-badge {
      font-size: 13px;
      font-weight: 800;
      color: #a855f7;
      background: rgba(168, 85, 247, 0.18);
      border: 1px solid rgba(168, 85, 247, 0.4);
      padding: 6px 14px;
      border-radius: 20px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .combo-badge {
      font-size: 15px;
      font-weight: 800;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 5px 12px;
      border-radius: 20px;
    }
    .helper-text {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <div class="hud">
    <div class="top-bar">
      <div class="score-badge" id="scoreDisplay">0</div>
      <div class="target-badge" id="targetDisplay">TARGET: ${targetHeight}</div>
      <div class="combo-badge" id="comboDisplay">COMBO: <span id="comboVal">0</span></div>
    </div>
    <div class="helper-text" id="helperMsg">TAP TO PLACE BLOCK</div>
  </div>

  <script>
    (function() {
      // --- Web Audio Synthesizer (Diatonic scale melody engine) ---
      const AudioEngine = {
        ctx: null,
        // Diatonic scale across 2 octaves
        scale: [
          261.63, // C4
          293.66, // D4
          329.63, // E4
          349.23, // F4
          392.00, // G4
          440.00, // A4
          493.88, // B4
          523.25, // C5
          587.33, // D5
          659.25, // E5
          698.46, // F5
          783.99, // G5
          880.00, // A5
          987.77, // B5
          1046.50 // C6
        ],
        init() {
          if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        },
        playPerfect(noteIndex) {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const freq = this.scale[noteIndex % this.scale.length];

            // Crystal marimba tone
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);

            // Shimmer harmonic
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(freq * 2, now);
            gain2.gain.setValueAtTime(0.18, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now);
            osc2.stop(now + 0.3);
          } catch(e) {}
        },
        playSlice() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
          } catch(e) {}
        },
        playGameOver() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            [300, 260, 220, 160].forEach((freq, idx) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq, now + idx * 0.1);
              gain.gain.setValueAtTime(0.25, now + idx * 0.1);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + idx * 0.1);
              osc.stop(now + idx * 0.1 + 0.25);
            });
          } catch(e) {}
        },
        playVictory() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.09);
              gain.gain.setValueAtTime(0.35, now + idx * 0.09);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + idx * 0.09);
              osc.stop(now + idx * 0.09 + 0.35);
            });
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
      const comboVal = document.getElementById('comboVal');
      const helperMsg = document.getElementById('helperMsg');

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
      const BLOCK_HEIGHT = 28;
      const INITIAL_WIDTH = Math.min(width * 0.58, 220);
      const BASE_Y = height * 0.76;
      const TARGET_GOAL = ${targetHeight};
      const PERFECT_TOLERANCE = 4.5; // pixels - generous & rewarding

      let score = 0;
      let combo = 0;
      let gameState = 'PLAYING'; // 'PLAYING' | 'STAGE_CLEAR' | 'GAME_OVER'
      let cameraY = 0;
      let targetCameraY = 0;

      // Stacked blocks array
      let stack = [];
      let fallingSlices = [];
      let shockwaves = [];
      let particles = [];
      let floatingTexts = [];

      // Currently moving block
      let currentBlock = {
        x: width / 2 - INITIAL_WIDTH / 2,
        y: BASE_Y - BLOCK_HEIGHT,
        width: INITIAL_WIDTH,
        vx: 4.0,
        direction: 1,
        hue: 240
      };

      function getBlockHue(idx) {
        // Shifting pastel rainbow spectrum
        return (idx * 8 + 220) % 360;
      }

      function initGame() {
        score = 0;
        combo = 0;
        gameState = 'PLAYING';
        cameraY = 0;
        targetCameraY = 0;
        stack = [];
        fallingSlices = [];
        shockwaves = [];
        particles = [];
        floatingTexts = [];

        scoreDisplay.innerText = '0';
        comboVal.innerText = '0';
        helperMsg.innerText = 'TAP TO PLACE BLOCK';

        // Base foundation block
        stack.push({
          x: width / 2 - INITIAL_WIDTH / 2,
          y: BASE_Y,
          width: INITIAL_WIDTH,
          hue: getBlockHue(0)
        });

        // First moving block
        currentBlock = {
          x: 0,
          y: BASE_Y - BLOCK_HEIGHT,
          width: INITIAL_WIDTH,
          vx: 4.2,
          direction: 1,
          hue: getBlockHue(1)
        };
      }

      function addShockwave(x, y, w, color) {
        shockwaves.push({
          x: x + w / 2,
          y: y + BLOCK_HEIGHT / 2,
          radius: w * 0.4,
          maxRadius: w * 1.4,
          color,
          alpha: 1
        });
      }

      function addSparks(x, y, count, color) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            color,
            size: 3 + Math.random() * 3,
            alpha: 1,
            decay: 0.03
          });
        }
      }

      function addFloatingText(text, x, y, color) {
        floatingTexts.push({
          text,
          x,
          y,
          vy: -2,
          alpha: 1,
          color
        });
      }

      // --- Tap Handler (Place Block) ---
      function placeBlock() {
        AudioEngine.init();
        if (gameState !== 'PLAYING') return;

        const topBlock = stack[stack.length - 1];
        const diff = currentBlock.x - topBlock.x;
        const absDiff = Math.abs(diff);

        // Check if PERFECT hit
        if (absDiff <= PERFECT_TOLERANCE) {
          // Snap directly onto previous block
          currentBlock.x = topBlock.x;
          combo++;
          comboVal.innerText = combo;

          // Sound note based on combo streak
          AudioEngine.playPerfect(combo);

          // Rewarding combo width expansion every 5 combos
          if (combo >= 5) {
            currentBlock.width = Math.min(INITIAL_WIDTH, currentBlock.width + 6);
            addFloatingText('COMBO EXPAND!', currentBlock.x + currentBlock.width / 2, currentBlock.y - 30, '#38bdf8');
          } else {
            addFloatingText('PERFECT! 🎶', currentBlock.x + currentBlock.width / 2, currentBlock.y - 20, '#facc15');
          }

          addShockwave(currentBlock.x, currentBlock.y, currentBlock.width, '#facc15');
          addSparks(currentBlock.x + currentBlock.width / 2, currentBlock.y, 16, '#facc15');

          sendNative({ type: 'PERFECT', score: score + 1, combo });
        } else if (absDiff < topBlock.width) {
          // Overlap! Slice the overhang
          AudioEngine.playSlice();
          combo = 0;
          comboVal.innerText = '0';

          const newWidth = topBlock.width - absDiff;
          const sliceWidth = absDiff;

          if (diff > 0) {
            // Overhang on the RIGHT
            fallingSlices.push({
              x: topBlock.x + newWidth,
              y: currentBlock.y,
              width: sliceWidth,
              hue: currentBlock.hue,
              vx: 2 + Math.random() * 2,
              vy: 0,
              rot: 0,
              vRot: 0.08,
              alpha: 1
            });
            currentBlock.width = newWidth;
            // currentBlock.x remains topBlock.x + diff... clamped:
            currentBlock.x = topBlock.x + diff;
          } else {
            // Overhang on the LEFT
            fallingSlices.push({
              x: currentBlock.x,
              y: currentBlock.y,
              width: sliceWidth,
              hue: currentBlock.hue,
              vx: -(2 + Math.random() * 2),
              vy: 0,
              rot: 0,
              vRot: -0.08,
              alpha: 1
            });
            currentBlock.x = topBlock.x;
            currentBlock.width = newWidth;
          }

          addSparks(currentBlock.x + (diff > 0 ? newWidth : 0), currentBlock.y + BLOCK_HEIGHT, 8, '#ffffff');
          sendNative({ type: 'STACK', score: score + 1 });
        } else {
          // Complete Miss! Tower toppled!
          gameState = 'GAME_OVER';
          AudioEngine.playGameOver();
          helperMsg.innerText = 'TOWER TOPPLED!';

          // The whole current block falls down
          fallingSlices.push({
            x: currentBlock.x,
            y: currentBlock.y,
            width: currentBlock.width,
            hue: currentBlock.hue,
            vx: currentBlock.direction * 3,
            vy: 1,
            rot: 0,
            vRot: currentBlock.direction * 0.1,
            alpha: 1
          });

          sendNative({ type: 'GAME_OVER', score });
          return;
        }

        // Add to stack
        stack.push({
          x: currentBlock.x,
          y: currentBlock.y,
          width: currentBlock.width,
          hue: currentBlock.hue
        });

        score++;
        scoreDisplay.innerText = score;

        // Check Target Goal Win
        if (score >= TARGET_GOAL && gameState === 'PLAYING') {
          gameState = 'STAGE_CLEAR';
          AudioEngine.playVictory();
          helperMsg.innerText = 'TOWER CONQUERED! 🏆';
          addSparks(width / 2, height * 0.4, 40, '#a855f7');
          sendNative({ type: 'STAGE_CLEAR', score });
          return;
        }

        // Next block
        const nextIdx = stack.length;
        const nextSpeed = 4.2 + Math.min(score * 0.12, 4.5);
        currentBlock = {
          x: (score % 2 === 0 ? 0 : (width - currentBlock.width)),
          y: currentBlock.y - BLOCK_HEIGHT,
          width: currentBlock.width,
          vx: nextSpeed,
          direction: (score % 2 === 0 ? 1 : -1),
          hue: getBlockHue(nextIdx)
        };

        // Adjust camera to keep stack centered
        if (stack.length > 5) {
          targetCameraY = (stack.length - 5) * BLOCK_HEIGHT;
        }
      }

      window.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        placeBlock();
      });

      // --- Main Game Physics Loop ---
      function update() {
        // Camera smooth lerp
        cameraY += (targetCameraY - cameraY) * 0.1;

        // Move sliding block
        if (gameState === 'PLAYING') {
          currentBlock.x += currentBlock.vx * currentBlock.direction;

          // Bounce back and forth off screen borders
          if (currentBlock.direction === 1 && currentBlock.x + currentBlock.width >= width) {
            currentBlock.x = width - currentBlock.width;
            currentBlock.direction = -1;
          } else if (currentBlock.direction === -1 && currentBlock.x <= 0) {
            currentBlock.x = 0;
            currentBlock.direction = 1;
          }
        }

        // Falling sliced pieces
        for (let i = fallingSlices.length - 1; i >= 0; i--) {
          const s = fallingSlices[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.7; // Gravity
          s.rot += s.vRot;
          s.alpha -= 0.015;
          if (s.alpha <= 0 || s.y > height + cameraY + 100) {
            fallingSlices.splice(i, 1);
          }
        }

        // Shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.radius += 5;
          sw.alpha -= 0.04;
          if (sw.alpha <= 0) {
            shockwaves.splice(i, 1);
          }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.alpha -= p.decay;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
          }
        }

        // Floating texts
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
          const ft = floatingTexts[i];
          ft.y += ft.vy;
          ft.alpha -= 0.025;
          if (ft.alpha <= 0) {
            floatingTexts.splice(i, 1);
          }
        }
      }

      // --- Rendering 3D Bevelled Slab ---
      function drawSlab(x, y, w, h, hue, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;

        const BEVEL = 6;

        // Front Face (slightly darker)
        ctx.fillStyle = 'hsl(' + hue + ', 75%, 48%)';
        ctx.fillRect(x, y + BEVEL, w, h - BEVEL);

        // Top Face (bright vibrant pastel highlight)
        ctx.fillStyle = 'hsl(' + hue + ', 82%, 64%)';
        ctx.beginPath();
        ctx.moveTo(x, y + BEVEL);
        ctx.lineTo(x + BEVEL, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w - BEVEL, y + BEVEL);
        ctx.closePath();
        ctx.fill();

        // Right Side Face (3D depth)
        ctx.fillStyle = 'hsl(' + hue + ', 70%, 38%)';
        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w, y + h - BEVEL);
        ctx.lineTo(x + w - BEVEL, y + h);
        ctx.lineTo(x + w - BEVEL, y + BEVEL);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      function drawFallingSlice(s) {
        ctx.save();
        ctx.translate(s.x + s.width / 2, s.y + BLOCK_HEIGHT / 2);
        ctx.rotate(s.rot);
        drawSlab(-s.width / 2, -BLOCK_HEIGHT / 2, s.width, BLOCK_HEIGHT, s.hue, s.alpha);
        ctx.restore();
      }

      function render() {
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(0, cameraY);

        // 1. Draw Stacked Blocks
        for (let b of stack) {
          drawSlab(b.x, b.y, b.width, BLOCK_HEIGHT, b.hue);
        }

        // 2. Draw Current Moving Block
        if (gameState === 'PLAYING') {
          drawSlab(currentBlock.x, currentBlock.y, currentBlock.width, BLOCK_HEIGHT, currentBlock.hue);
        }

        // 3. Draw Falling Slices
        for (let s of fallingSlices) {
          drawFallingSlice(s);
        }

        // 4. Draw Shockwaves
        for (let sw of shockwaves) {
          ctx.save();
          ctx.globalAlpha = sw.alpha;
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // 5. Draw Particles
        for (let p of particles) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 6. Draw Floating Texts
        for (let ft of floatingTexts) {
          ctx.save();
          ctx.globalAlpha = ft.alpha;
          ctx.font = '900 18px -apple-system, sans-serif';
          ctx.fillStyle = ft.color;
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }

        ctx.restore();
      }

      function loop() {
        update();
        render();
        requestAnimationFrame(loop);
      }

      initGame();
      requestAnimationFrame(loop);

      window.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.action === 'RESTART') {
            initGame();
          }
        } catch(err) {}
      });
      document.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.action === 'RESTART') {
            initGame();
          }
        } catch(err) {}
      });
    })();
  </script>
</body>
</html>
`;

