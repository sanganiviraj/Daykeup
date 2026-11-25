// Side-scrolling hill climb. Truck = one rigid body riding on two spring wheels.
export const getMonsterTruckHtml = (targetDistance: number = 80): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Monster Truck</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #gameCanvas { display: block; width: 100%; height: 100%; }
    .hud { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
    .stats { position: absolute; top: 14px; left: 18px; }
    .dist {
      font-size: 34px; font-weight: 900; color: #fff;
      text-shadow: 0 3px 10px rgba(0,0,0,0.55); letter-spacing: 1px;
    }
    .dist small { font-size: 15px; font-weight: 800; opacity: 0.85; margin-left: 4px; }
    .coins {
      margin-top: 4px; font-size: 16px; font-weight: 800; color: #fde047;
      text-shadow: 0 2px 6px rgba(0,0,0,0.55);
    }
    .progress {
      margin-top: 8px; width: 150px; height: 8px; border-radius: 4px;
      background: rgba(255,255,255,0.25); overflow: hidden;
    }
    .progress > div { height: 100%; width: 0%; background: #ff7315; border-radius: 4px; }
    .fuel { margin-top: 8px; display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 900; color: #fff; text-shadow: 0 2px 6px rgba(0,0,0,0.55); }
    .fuelTrack { width: 112px; height: 10px; border-radius: 5px; background: rgba(255,255,255,0.25); overflow: hidden; }
    .fuelTrack > div { height: 100%; width: 100%; background: #22c55e; border-radius: 5px; transition: background 0.2s; }
    .helper {
      position: absolute; top: 38%; left: 0; right: 0; text-align: center;
      font-size: 17px; font-weight: 800; color: #fff; letter-spacing: 1.5px;
      text-shadow: 0 3px 10px rgba(0,0,0,0.6); transition: opacity 0.5s; opacity: 1;
    }
    .controls {
      position: absolute; left: 0; right: 0; bottom: 0; padding: 0 18px 18px;
      display: flex; justify-content: space-between; pointer-events: none;
    }
    .pedal {
      pointer-events: auto; width: 38%; max-width: 170px; height: 84px; border-radius: 22px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 900; letter-spacing: 2px; color: #fff;
      border: 3px solid rgba(255,255,255,0.55); transition: transform 0.06s, filter 0.06s;
    }
    .pedal.brake { background: rgba(239,68,68,0.82); }
    .pedal.gas { background: rgba(34,197,94,0.86); }
    .pedal.down { transform: scale(0.94); filter: brightness(1.25); }
    .overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: none;
      align-items: center; justify-content: center; flex-direction: column;
      background: rgba(9,9,11,0.55); pointer-events: auto;
    }
    .overlay.show { display: flex; }
    .overlay h1 { font-size: 30px; font-weight: 900; color: #fff; letter-spacing: 1px; }
    .overlay p { margin-top: 6px; font-size: 14px; font-weight: 700; color: #cbd5e1; }
    .overlay button {
      margin-top: 18px; padding: 14px 34px; border-radius: 16px; border: none;
      background: #ff7315; color: #fff; font-size: 16px; font-weight: 900; letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <div class="hud">
    <div class="stats">
      <div class="dist"><span id="distVal">0</span><small>/ ${targetDistance} m</small></div>
      <div class="coins">&#9679; <span id="coinVal">0</span></div>
      <div class="progress"><div id="progressFill"></div></div>
      <div class="fuel"><span>FUEL</span><div class="fuelTrack"><div id="fuelFill"></div></div></div>
    </div>
    <div class="helper" id="helper">HOLD GAS - EASE OFF ON STEEP HILLS</div>
    <div class="controls">
      <div class="pedal brake" id="brakeBtn">BRAKE</div>
      <div class="pedal gas" id="gasBtn">GAS</div>
    </div>
    <div class="overlay" id="overlay">
      <h1 id="overlayTitle">FLIPPED!</h1>
      <p id="overlaySub">Tap to retry</p>
      <button id="retryBtn">TRY AGAIN</button>
    </div>
  </div>

  <script>
    (function () {
      const TARGET_M = ${targetDistance};
      const PX_PER_M = 50;
      const START_X = 200;
      const FINISH_X = START_X + TARGET_M * PX_PER_M;
      const BASE_Y = 0;

      // Physics (mass = 1)
      const GRAVITY = 1300;
      const INERTIA = 1500;
      const SPRING_K = 75;
      const SPRING_C = 13;
      const WHEEL_R = 24;
      const WHEEL_X = 44;
      const WHEEL_Y = 18;
      const DRIVE = 820;
      const BRAKE_FORCE = 1100;
      const REVERSE = 480;
      const MAX_SPEED = 560;
      const WHEELIE = 5.2;
      const FUEL_MAX = 100;
      const FUEL_BURN = 9;
      const FUEL_CAN = 32;
      const STEP = 1 / 120;

      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const distVal = document.getElementById('distVal');
      const coinVal = document.getElementById('coinVal');
      const progressFill = document.getElementById('progressFill');
      const fuelFill = document.getElementById('fuelFill');
      const helper = document.getElementById('helper');
      const overlay = document.getElementById('overlay');
      const overlayTitle = document.getElementById('overlayTitle');
      const overlaySub = document.getElementById('overlaySub');
      const retryBtn = document.getElementById('retryBtn');
      const gasBtn = document.getElementById('gasBtn');
      const brakeBtn = document.getElementById('brakeBtn');

      let W = 0, H = 0, dpr = 1;
      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth || 360;
        H = window.innerHeight || 640;
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      function sendNative(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      // ---------- Terrain (y grows downward) ----------
      function smooth(t) {
        t = Math.min(Math.max(t, 0), 1);
        return t * t * (3 - 2 * t);
      }
      // Kicker: steep ramp up, then a sharp drop-off to land from.
      function kicker(x, x0, rise, drop) {
        return rise * smooth((x - x0) / 150) - (rise + drop) * smooth((x - x0 - 150) / 230) + drop * smooth((x - x0 - 380) / 450);
      }
      const KICKERS = [];
      for (let k = 0; k < 8; k++) {
        KICKERS.push({ x0: 1500 + k * 1050, rise: 68 + k * 3, drop: 45 + k * 5 });
      }
      function ground(x) {
        const ramp = Math.min(Math.max((x - 420) / 600, 0), 1);
        const amp = ramp * (34 + Math.min(Math.max(x - 420, 0) / 55, 60));

        // Hills flatten out around each ramp so the jump itself is the test.
        let calm = 0;
        for (let k = 0; k < KICKERS.length; k++) {
          const x0 = KICKERS[k].x0;
          calm = Math.max(calm, smooth((x - (x0 - 260)) / 160) * (1 - smooth((x - (x0 + 420)) / 160)));
        }
        let y = BASE_Y - amp * (1 - calm) * (Math.sin(x / 210) + 0.45 * Math.sin(x / 88 + 1.3));

        if (x > 900) {
          // Rocky stretches: sharp bumps that bounce a truck going too fast.
          const zone = Math.sin(x / 520);
          if (zone > 0.1) y -= zone * 15 * (1 - calm) * Math.pow(Math.abs(Math.sin(x / 46)), 3);
        }
        for (let k = 0; k < KICKERS.length; k++) {
          const q = KICKERS[k];
          if (x > q.x0 - 10 && x < q.x0 + 900) y -= kicker(x, q.x0, q.rise, q.drop);
        }
        return y;
      }
      function slope(x) {
        return (ground(x + 1) - ground(x - 1)) / 2;
      }

      // ---------- State ----------
      let truck, coins, cans, fuel, coinCount, gameState, gasDown, brakeDown, wheelAngle, camX, camY, particles, shake;

      function initGame() {
        truck = { x: START_X, y: ground(START_X) - WHEEL_R - WHEEL_Y - 2, vx: 0, vy: 0, a: 0, w: 0 };
        coins = [];
        for (let i = 0; i < Math.floor(TARGET_M * 0.6); i++) {
          const cx = 520 + i * 190 + (i % 3) * 25;
          if (cx > FINISH_X - 200) break;
          coins.push({ x: cx, y: ground(cx) - 70 - (i % 2) * 40, got: false });
        }
        cans = [];
        for (let cx = 800; cx < FINISH_X - 250; cx += 780) {
          cans.push({ x: cx, y: ground(cx) - 85, got: false });
        }
        fuel = FUEL_MAX;
        coinCount = 0;
        gameState = 'PLAYING';
        gasDown = false;
        brakeDown = false;
        wheelAngle = 0;
        particles = [];
        shake = 0;
        camX = truck.x - W * 0.3;
        camY = truck.y;
        overlay.classList.remove('show');
        helper.style.opacity = '1';
        distVal.innerText = '0';
        coinVal.innerText = '0';
        progressFill.style.width = '0%';
        fuelFill.style.width = '100%';
        gasBtn.classList.remove('down');
        brakeBtn.classList.remove('down');
      }

      // ---------- Input (multi-touch safe) ----------
      function bindPedal(el, setter) {
        const press = (e) => { e.preventDefault(); setter(true); el.classList.add('down'); helper.style.opacity = '0'; };
        const release = (e) => { e.preventDefault(); setter(false); el.classList.remove('down'); };
        el.addEventListener('touchstart', press, { passive: false });
        el.addEventListener('touchend', release, { passive: false });
        el.addEventListener('touchcancel', release, { passive: false });
        el.addEventListener('mousedown', press);
        el.addEventListener('mouseup', release);
        el.addEventListener('mouseleave', release);
      }
      bindPedal(gasBtn, (v) => { gasDown = v; });
      bindPedal(brakeBtn, (v) => { brakeDown = v; });
      retryBtn.addEventListener('click', () => initGame());
      retryBtn.addEventListener('touchend', (e) => { e.preventDefault(); initGame(); });

      // ---------- Physics ----------
      function wheelWorld(t, side) {
        const lx = side * WHEEL_X;
        const c = Math.cos(t.a), s = Math.sin(t.a);
        return { rx: c * lx - s * WHEEL_Y, ry: s * lx + c * WHEEL_Y };
      }

      function step(dt) {
        const t = truck;
        let ax = 0, ay = GRAVITY, aw = 0;
        let contacts = 0;
        let tanX = 1, tanY = 0;

        for (let side = -1; side <= 1; side += 2) {
          const o = wheelWorld(t, side);
          const px = t.x + o.rx, py = t.y + o.ry;
          const gy = ground(px);
          const sl = slope(px);
          const inv = 1 / Math.sqrt(1 + sl * sl);
          const nx = sl * inv, ny = -inv;       // up-facing surface normal
          const tx = inv, ty = sl * inv;        // forward surface tangent
          const dist = (gy - py) * inv;         // wheel centre height above surface
          const pen = WHEEL_R - dist;
          if (pen <= 0) continue;

          contacts++;
          tanX = tx; tanY = ty;
          const vpx = t.vx - t.w * o.ry;
          const vpy = t.vy + t.w * o.rx;
          const vn = vpx * nx + vpy * ny;
          const vt = vpx * tx + vpy * ty;

          let fn = SPRING_K * pen - SPRING_C * vn;
          fn = Math.max(0, Math.min(fn, 5500));
          let ft = -0.22 * vt;
          ft = Math.max(-fn * 1.4 - 60, Math.min(fn * 1.4 + 60, ft));

          const fx = fn * nx + ft * tx;
          const fy = fn * ny + ft * ty;
          ax += fx; ay += fy;
          aw += (o.rx * fy - o.ry * fx) / INERTIA;
        }

        const fwd = t.vx * Math.cos(t.a) + t.vy * Math.sin(t.a);
        if (contacts > 0) {
          let drive = 0;
          if (gameState === 'PLAYING') {
            if (gasDown && fuel > 0 && fwd < MAX_SPEED) drive += DRIVE;
            if (brakeDown) drive -= fwd > 25 ? BRAKE_FORCE : REVERSE;
          } else if (fwd > 0) {
            drive = -BRAKE_FORCE * 0.6;
          }
          ax += tanX * drive * (contacts / 2);
          ay += tanY * drive * (contacts / 2);
          // Power transfer lifts the nose: flooring it on a steep climb flips you backwards.
          if (gameState === 'PLAYING' && gasDown && fuel > 0) aw -= WHEELIE * (contacts / 2);
        } else if (gameState === 'PLAYING') {
          // Air control: gas pitches nose up, brake pitches nose down.
          if (gasDown && fuel > 0) aw -= 4.2;
          if (brakeDown) aw += 4.2;
        }

        if (gameState === 'PLAYING' && gasDown && fuel > 0) {
          fuel = Math.max(0, fuel - FUEL_BURN * dt);
        }
        t.vx += ax * dt;
        t.vy += ay * dt;
        t.w += aw * dt;
        t.w *= 1 - 0.9 * dt;
        t.vx *= 1 - 0.05 * dt;
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.a += t.w * dt;
        wheelAngle += (fwd / WHEEL_R) * dt;

        // Crash when the cab roof touches the ground.
        if (gameState === 'PLAYING') {
          const c = Math.cos(t.a), s = Math.sin(t.a);
          const hx = t.x + c * 6 - s * -40, hy = t.y + s * 6 + c * -40;
          if (hy >= ground(hx) - 3) crash();
        }
      }

      function crash(title, sub) {
        gameState = 'GAME_OVER';
        shake = 14;
        for (let i = 0; i < 18; i++) {
          particles.push({ x: truck.x, y: truck.y - 20, vx: (Math.random() - 0.5) * 420, vy: -Math.random() * 380, life: 1, c: '#fbbf24' });
        }
        overlayTitle.innerText = title || 'FLIPPED!';
        overlaySub.innerText = sub || 'The truck rolled over';
        overlay.classList.add('show');
        sendNative({ type: 'GAME_OVER', distance: currentMeters(), coins: coinCount });
      }

      function currentMeters() {
        return Math.max(0, Math.floor((truck.x - START_X) / PX_PER_M));
      }

      function checkProgress() {
        const m = Math.min(currentMeters(), TARGET_M);
        distVal.innerText = String(m);
        progressFill.style.width = Math.min(100, (m / TARGET_M) * 100) + '%';

        for (let i = 0; i < coins.length; i++) {
          const c = coins[i];
          if (c.got) continue;
          const dx = c.x - truck.x, dy = c.y - (truck.y - 10);
          if (dx * dx + dy * dy < 2800) {
            c.got = true;
            coinCount++;
            coinVal.innerText = String(coinCount);
            for (let k = 0; k < 6; k++) {
              particles.push({ x: c.x, y: c.y, vx: (Math.random() - 0.5) * 200, vy: -Math.random() * 200, life: 0.7, c: '#fde047' });
            }
            sendNative({ type: 'COIN', coins: coinCount });
          }
        }

        for (let i = 0; i < cans.length; i++) {
          const c = cans[i];
          if (c.got) continue;
          const dx = c.x - truck.x, dy = c.y - (truck.y - 10);
          if (dx * dx + dy * dy < 3600) {
            c.got = true;
            fuel = Math.min(FUEL_MAX, fuel + FUEL_CAN);
            sendNative({ type: 'FUEL' });
          }
        }
        fuelFill.style.width = fuel + '%';
        fuelFill.style.background = fuel < 25 ? '#ef4444' : '#22c55e';

        if (gameState === 'PLAYING' && fuel <= 0 && Math.abs(truck.vx) < 12) {
          crash('OUT OF FUEL!', 'Grab the red fuel cans');
          return;
        }

        if (gameState === 'PLAYING' && truck.x >= FINISH_X) {
          gameState = 'STAGE_CLEAR';
          shake = 6;
          sendNative({ type: 'STAGE_CLEAR', distance: TARGET_M, coins: coinCount });
        }
      }

      // ---------- Rendering ----------
      function drawBackground() {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#38bdf8');
        g.addColorStop(0.7, '#bae6fd');
        g.addColorStop(1, '#fef9c3');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        // Sun
        ctx.fillStyle = 'rgba(255, 244, 179, 0.9)';
        ctx.beginPath(); ctx.arc(W * 0.8, H * 0.16, 34, 0, Math.PI * 2); ctx.fill();

        // Parallax hills
        for (let layer = 0; layer < 2; layer++) {
          const f = layer === 0 ? 0.12 : 0.3;
          ctx.fillStyle = layer === 0 ? '#7dd3a8' : '#4ade80';
          ctx.beginPath();
          ctx.moveTo(0, H);
          for (let sx = 0; sx <= W; sx += 12) {
            const wx = sx + camX * f;
            const y = H * (layer === 0 ? 0.58 : 0.66) - 38 * Math.sin(wx / (layer === 0 ? 170 : 110)) - 16 * Math.sin(wx / 63);
            ctx.lineTo(sx, y);
          }
          ctx.lineTo(W, H);
          ctx.closePath();
          ctx.fill();
        }
      }

      function drawTerrain() {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let sx = 0; sx <= W + 8; sx += 6) {
          ctx.lineTo(sx, ground(sx + camX) - camY + H * 0.62);
        }
        ctx.lineTo(W + 8, H);
        ctx.closePath();
        ctx.fillStyle = '#a16207';
        ctx.fill();

        ctx.beginPath();
        for (let sx = 0; sx <= W + 8; sx += 6) {
          const y = ground(sx + camX) - camY + H * 0.62;
          if (sx === 0) ctx.moveTo(sx, y); else ctx.lineTo(sx, y);
        }
        ctx.lineWidth = 9;
        ctx.strokeStyle = '#22c55e';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      function drawFinish() {
        const sx = FINISH_X - camX;
        if (sx < -60 || sx > W + 60) return;
        const gy = ground(FINISH_X) - camY + H * 0.62;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(sx - 3, gy - 120, 6, 120);
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 3; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#0f172a' : '#f8fafc';
            ctx.fillRect(sx + 3 + c * 14, gy - 120 + r * 14, 14, 14);
          }
        }
      }

      function drawCoins(time) {
        for (let i = 0; i < coins.length; i++) {
          const c = coins[i];
          if (c.got) continue;
          const sx = c.x - camX;
          if (sx < -30 || sx > W + 30) continue;
          const sy = c.y - camY + H * 0.62 + Math.sin(time / 280 + i) * 4;
          const squash = Math.abs(Math.cos(time / 380 + i));
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#a16207';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 5 + 11 * squash, 13, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }

      function drawCans(time) {
        for (let i = 0; i < cans.length; i++) {
          const c = cans[i];
          if (c.got) continue;
          const sx = c.x - camX;
          if (sx < -30 || sx > W + 30) continue;
          const sy = c.y - camY + H * 0.62 + Math.sin(time / 300 + i) * 5;
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx - 12, sy - 15, 24, 30);
          ctx.fillStyle = '#fecaca';
          ctx.fillRect(sx - 7, sy - 8, 14, 8);
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(sx - 4, sy - 21, 12, 7);
        }
      }

      function drawWheel(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wheelAngle);
        ctx.fillStyle = '#1f2937';
        ctx.beginPath(); ctx.arc(0, 0, WHEEL_R, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 4;
        for (let k = 0; k < 10; k++) {
          const ang = (k / 10) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (WHEEL_R - 1), Math.sin(ang) * (WHEEL_R - 1));
          ctx.lineTo(Math.cos(ang) * (WHEEL_R + 3), Math.sin(ang) * (WHEEL_R + 3));
          ctx.stroke();
        }
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-2, -10, 4, 20);
        ctx.restore();
      }

      function drawTruck() {
        const sx = truck.x - camX;
        const sy = truck.y - camY + H * 0.62;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(truck.a);

        // Axle struts
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-WHEEL_X, WHEEL_Y); ctx.lineTo(-WHEEL_X + 8, 0);
        ctx.moveTo(WHEEL_X, WHEEL_Y); ctx.lineTo(WHEEL_X - 8, 0);
        ctx.stroke();

        // Body
        ctx.fillStyle = '#ff7315';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-58, -18, 116, 26, 8) : ctx.rect(-58, -18, 116, 26);
        ctx.fill();
        // Cab
        ctx.beginPath();
        ctx.moveTo(-26, -18); ctx.lineTo(-16, -40); ctx.lineTo(18, -40); ctx.lineTo(34, -18);
        ctx.closePath();
        ctx.fillStyle = '#ea580c';
        ctx.fill();
        // Window
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.moveTo(-18, -20); ctx.lineTo(-11, -35); ctx.lineTo(14, -35); ctx.lineTo(26, -20);
        ctx.closePath();
        ctx.fill();
        // Stripe + lights
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-52, -6, 104, 4);
        ctx.fillStyle = '#fef9c3';
        ctx.fillRect(54, -12, 6, 8);

        drawWheel(-WHEEL_X, WHEEL_Y);
        drawWheel(WHEEL_X, WHEEL_Y);
        ctx.restore();
      }

      function drawParticles(dt) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 700 * dt; p.life -= dt * 1.4;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x - camX, p.y - camY + H * 0.62, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      function render(time, dt) {
        ctx.save();
        if (shake > 0) {
          ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
          shake = Math.max(0, shake - 40 * dt);
        }
        drawBackground();
        drawTerrain();
        drawFinish();
        drawCoins(time);
        drawCans(time);
        drawTruck();
        drawParticles(dt);
        ctx.restore();
      }

      // ---------- Loop ----------
      let lastTime = 0, acc = 0;
      function loop(now) {
        const frame = Math.min(0.05, (now - (lastTime || now)) / 1000);
        lastTime = now;
        acc += frame;
        while (acc >= STEP) {
          if (gameState !== 'GAME_OVER') step(STEP);
          acc -= STEP;
        }
        if (gameState !== 'GAME_OVER') checkProgress();

        // Smooth follow camera (look slightly ahead of the truck).
        const targetX = truck.x - W * 0.3 + Math.max(0, truck.vx) * 0.12;
        camX += (targetX - camX) * Math.min(1, frame * 6);
        camY += (truck.y - camY) * Math.min(1, frame * 3);

        render(now, frame);
        requestAnimationFrame(loop);
      }

      initGame();
      requestAnimationFrame(loop);

      function onMessage(e) {
        try {
          const data = JSON.parse(e.data);
          if (data.action === 'RESTART') initGame();
        } catch (err) {}
      }
      window.addEventListener('message', onMessage);
      document.addEventListener('message', onMessage);
    })();
  </script>
</body>
</html>
`;
