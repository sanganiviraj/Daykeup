export const getCurvePongHtml = (targetScore: number = 2): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Curve Pong</title>
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
      background: #060911;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #pongCanvas {
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
    .center-badge {
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
    .speed-gauge {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 11px;
      font-weight: 800;
      color: #f59e0b;
      letter-spacing: 1px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      padding: 4px 8px;
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <canvas id="pongCanvas"></canvas>
  <div class="hud">
    <!-- Opponent Score -->
    <div class="score-board">
      <span class="player-tag top-player-tag">RIVAL</span>
      <span class="score-num" style="color: #f43f5e" id="topScore">0</span>
    </div>

    <!-- Center Target Goal -->
    <div class="center-badge">FIRST TO ${targetScore} WINS</div>
    <div class="speed-gauge" id="speedGauge">1.0x SPEED</div>

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
        playHit(isCurve) {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = isCurve ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(isCurve ? 580 : 480, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
            gain.gain.setValueAtTime(0.35, now);
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
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
          } catch(e) {}
        },
        playScore() {
          if (!this.ctx) return;
          try {
            const now = this.ctx.currentTime;
            [440, 554.37, 659.25, 880].forEach((freq, idx) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.08);
              gain.gain.setValueAtTime(0.3, now + idx * 0.08);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now + idx * 0.08);
              osc.stop(now + idx * 0.08 + 0.3);
            });
          } catch(e) {}
        }
      };

      function sendNative(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      const canvas = document.getElementById('pongCanvas');
      const ctx = canvas.getContext('2d');
      const topScoreEl = document.getElementById('topScore');
      const bottomScoreEl = document.getElementById('bottomScore');
      const speedGauge = document.getElementById('speedGauge');

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
      const PADDING = 20;
      const COURT_X = PADDING;
      const COURT_Y = 65;
      const COURT_W = width - PADDING * 2;
      const COURT_H = height - 130;

      const PADDLE_W = Math.min(COURT_W * 0.28, 88);
      const PADDLE_H = 14;
      const BALL_RADIUS = 9;

      let scoreP1 = 0;
      let scoreP2 = 0;
      let targetWins = ${targetScore};

      let matchState = 'SERVE'; // 'SERVE' | 'RALLY' | 'POINT' | 'MATCH_OVER'
      let serveTimer = 50;
      let rallyHits = 0;
      let banner = { text: 'CURVE PONG', sub: 'Swipe paddle to curve the ball!', color: '#0ea5e9', alpha: 1 };

      let cameraShake = { x: 0, y: 0, count: 0, intensity: 0 };
      let particles = [];
      let ballTrail = [];

      const ball = {
        x: COURT_X + COURT_W / 2,
        y: COURT_Y + COURT_H / 2,
        vx: 0,
        vy: 0,
        spin: 0,
        radius: BALL_RADIUS,
        visible: true
      };

      const p1 = {
        x: COURT_X + COURT_W / 2 - PADDLE_W / 2,
        y: COURT_Y + COURT_H - 24,
        width: PADDLE_W,
        height: PADDLE_H,
        vx: 0,
        targetX: COURT_X + COURT_W / 2 - PADDLE_W / 2,
        touchId: null
      };

      const p2 = {
        x: COURT_X + COURT_W / 2 - PADDLE_W / 2,
        y: COURT_Y + 12,
        width: PADDLE_W,
        height: PADDLE_H,
        vx: 0,
        targetX: COURT_X + COURT_W / 2 - PADDLE_W / 2
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
          p1.touchId = t.identifier;
          p1.targetX = Math.max(COURT_X, Math.min(COURT_X + COURT_W - p1.width, tx - p1.width / 2));
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
        serveTimer = 45;
        rallyHits = 0;
        speedGauge.innerText = '1.0x SPEED';
        ball.visible = true;
        ball.spin = 0;
        ballTrail = [];

        p1.targetX = COURT_X + COURT_W / 2 - PADDLE_W / 2;
        p1.x = p1.targetX;
        p2.targetX = COURT_X + COURT_W / 2 - PADDLE_W / 2;
        p2.x = p2.targetX;

        ball.x = COURT_X + COURT_W / 2;
        if (whoServes === 'p1') {
          ball.y = p1.y - 18;
          ball.vx = (Math.random() - 0.5) * 2;
          ball.vy = -6.5;
          banner = { text: 'YOUR SERVE', sub: 'Swipe left/right as you hit to curve!', color: '#06b6d4', alpha: 1 };
        } else {
          ball.y = p2.y + PADDLE_H + 18;
          ball.vx = (Math.random() - 0.5) * 2;
          ball.vy = 6.5;
          banner = { text: 'OPPONENT SERVE', sub: 'Prepare to return!', color: '#f43f5e', alpha: 1 };
        }
      }

      // Friendly Opponent (Player can win easily in under 30s)
      function updateAI() {
        let targetCenter = COURT_X + COURT_W / 2;

        if (ball.vy < 0) {
          // Ball is coming towards opponent: track with friendly slight reaction delay
          // Curves with spin will easily bypass the opponent!
          targetCenter = ball.x + (ball.spin * 0.3);
        } else {
          targetCenter = COURT_X + COURT_W / 2;
        }

        const desiredX = targetCenter - p2.width / 2;
        p2.targetX = Math.max(COURT_X, Math.min(COURT_X + COURT_W - p2.width, desiredX));
      }

      function addSparks(x, y, count, color) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 3 + Math.random() * 3,
            alpha: 1,
            decay: 0.04
          });
        }
      }

      function triggerShake(intensity, frames) {
        cameraShake.intensity = intensity;
        cameraShake.count = frames;
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

        if (matchState === 'SERVE') {
          serveTimer--;
          if (serveTimer <= 0) {
            matchState = 'RALLY';
          }
        }

        updateAI();

        // Move Player Paddle
        const prevP1X = p1.x;
        p1.x += (p1.targetX - p1.x) * 0.55;
        p1.vx = p1.x - prevP1X;

        // Move Opponent Paddle with relaxed tracking (0.22)
        const prevP2X = p2.x;
        p2.x += (p2.targetX - p2.x) * 0.22;
        p2.vx = p2.x - prevP2X;

        // Move Ball in RALLY
        if (matchState === 'RALLY') {
          // Magnus Effect: lateral curve from spin
          ball.vx += ball.spin * 0.045;
          ball.spin *= 0.985;

          ball.x += ball.vx;
          ball.y += ball.vy;

          // Side wall bounce
          if (ball.x - ball.radius <= COURT_X) {
            ball.x = COURT_X + ball.radius;
            ball.vx = Math.abs(ball.vx) * 0.95;
            AudioEngine.playWall();
          } else if (ball.x + ball.radius >= COURT_X + COURT_W) {
            ball.x = COURT_X + COURT_W - ball.radius;
            ball.vx = -Math.abs(ball.vx) * 0.95;
            AudioEngine.playWall();
          }

          // Player Paddle Collision (Bottom)
          if (
            ball.vy > 0 &&
            ball.y + ball.radius >= p1.y &&
            ball.y - ball.radius <= p1.y + p1.height &&
            ball.x >= p1.x - 4 &&
            ball.x <= p1.x + p1.width + 4
          ) {
            ball.y = p1.y - ball.radius;
            const hitRatio = (ball.x - (p1.x + p1.width / 2)) / (p1.width / 2);
            ball.vx = hitRatio * 6 + p1.vx * 0.3;
            ball.vy = -Math.abs(ball.vy) * 1.03;

            // Impart curve spin from player's paddle swipe!
            ball.spin = p1.vx * 0.5;
            rallyHits++;

            const currentSpeed = Math.hypot(ball.vx, ball.vy);
            speedGauge.innerText = (currentSpeed / 6.5).toFixed(1) + 'x SPEED';

            const isCurving = Math.abs(ball.spin) > 1.0;
            AudioEngine.playHit(isCurving);
            triggerShake(4, 5);
            addSparks(ball.x, ball.y, isCurving ? 16 : 8, '#06b6d4');
            sendNative({ type: 'HIT', hits: rallyHits });
          }

          // Opponent Paddle Collision (Top)
          if (
            ball.vy < 0 &&
            ball.y - ball.radius <= p2.y + p2.height &&
            ball.y + ball.radius >= p2.y &&
            ball.x >= p2.x - 4 &&
            ball.x <= p2.x + p2.width + 4
          ) {
            ball.y = p2.y + p2.height + ball.radius;
            const hitRatio = (ball.x - (p2.x + p2.width / 2)) / (p2.width / 2);
            ball.vx = hitRatio * 6 + p2.vx * 0.3;
            ball.vy = Math.abs(ball.vy) * 1.03;

            ball.spin = p2.vx * 0.5;
            rallyHits++;

            const currentSpeed = Math.hypot(ball.vx, ball.vy);
            speedGauge.innerText = (currentSpeed / 6.5).toFixed(1) + 'x SPEED';

            const isCurving = Math.abs(ball.spin) > 1.0;
            AudioEngine.playHit(isCurving);
            triggerShake(4, 5);
            addSparks(ball.x, ball.y, isCurving ? 16 : 8, '#f43f5e');
            sendNative({ type: 'HIT', hits: rallyHits });
          }

          // Point for Player
          if (ball.y < COURT_Y) {
            triggerPoint('p1');
          }

          // Point for Opponent
          if (ball.y > COURT_Y + COURT_H) {
            triggerPoint('p2');
          }

          if (ball.visible) {
            ballTrail.push({ x: ball.x, y: ball.y, alpha: 0.65 });
            if (ballTrail.length > 9) ballTrail.shift();
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          if (p.alpha <= 0) particles.splice(i, 1);
        }

        if (matchState === 'RALLY' && banner.alpha > 0) {
          banner.alpha -= 0.02;
        }
      }

      function triggerPoint(scorer) {
        if (matchState === 'POINT' || matchState === 'MATCH_OVER') return;

        matchState = 'POINT';
        ball.visible = false;
        ballTrail = [];

        AudioEngine.playScore();
        triggerShake(10, 15);

        if (scorer === 'p1') {
          scoreP1++;
          bottomScoreEl.innerText = scoreP1;
          addSparks(ball.x, COURT_Y + 20, '#06b6d4', 35);
          banner = { text: 'POINT FOR YOU! ⚡', sub: '+1 Point', color: '#06b6d4', alpha: 1.5 };
          sendNative({ type: 'POINT', scorer: 'p1', scoreP1, scoreP2 });

          if (scoreP1 >= targetWins) {
            matchState = 'MATCH_OVER';
            sendNative({ type: 'GAME_OVER', winner: 'p1', scoreP1, scoreP2 });
            return;
          }
        } else {
          scoreP2++;
          topScoreEl.innerText = scoreP2;
          addSparks(ball.x, COURT_Y + COURT_H - 20, '#f43f5e', 35);
          banner = { text: 'RIVAL POINT!', sub: '+1 Point', color: '#f43f5e', alpha: 1.5 };
          sendNative({ type: 'POINT', scorer: 'p2', scoreP1, scoreP2 });

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

      function drawCourt() {
        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);

        ctx.fillStyle = '#0a101f';
        ctx.fillRect(COURT_X, COURT_Y, COURT_W, COURT_H);

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.strokeRect(COURT_X, COURT_Y, COURT_W, COURT_H);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(COURT_X, COURT_Y + COURT_H / 2);
        ctx.lineTo(COURT_X + COURT_W, COURT_Y + COURT_H / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      function drawPaddles() {
        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);

        // Player Paddle (Bottom)
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(p1.x, p1.y, p1.width, p1.height, 7);
        ctx.fill();

        // Opponent Paddle (Top)
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(p2.x, p2.y, p2.width, p2.height, 7);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();
      }

      function drawBall() {
        if (!ball.visible) return;

        ctx.save();
        ctx.translate(cameraShake.x, cameraShake.y);

        for (let i = 0; i < ballTrail.length; i++) {
          const t = ballTrail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, BALL_RADIUS * (0.4 + (i / ballTrail.length) * 0.6), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245, 158, 11, ' + (t.alpha * (i / ballTrail.length)) + ')';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.shadowBlur = 0;
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
          ctx.font = '900 30px -apple-system, sans-serif';
          ctx.fillStyle = banner.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = banner.color;
          ctx.shadowBlur = 16;
          ctx.fillText(banner.text, width / 2, height / 2 - 30);

          if (banner.sub) {
            ctx.font = '600 13px -apple-system, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.shadowBlur = 0;
            ctx.fillText(banner.sub, width / 2, height / 2 + 36);
          }
          ctx.restore();
        }
      }

      function render() {
        ctx.clearRect(0, 0, width, height);
        drawCourt();
        drawBall();
        drawPaddles();
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
