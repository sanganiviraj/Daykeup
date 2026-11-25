// Side-view duel against a shadow warrior. Fighters are skeletons driven by blended poses.
export const getShadowDuelHtml = (enemyHp: number = 70): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Shadow Duel</title>
  <style>
    * {
      margin: 0; padding: 0; box-sizing: border-box;
      user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent; touch-action: none;
    }
    html, body {
      width: 100%; height: 100%; overflow: hidden; background: #140a2a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #gameCanvas { display: block; width: 100%; height: 100%; }
    .hud { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
    .bars { position: absolute; top: 52px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
    .bar { width: 43%; }
    .bar.right { text-align: right; }
    .name { font-size: 11px; font-weight: 900; letter-spacing: 2px; color: #fff; text-shadow: 0 2px 6px rgba(0,0,0,0.7); margin-bottom: 3px; }
    .track { position: relative; height: 13px; border-radius: 7px; background: rgba(0,0,0,0.55); border: 2px solid rgba(255,255,255,0.5); overflow: hidden; }
    .ghost, .fill { position: absolute; top: 0; bottom: 0; left: 0; width: 100%; border-radius: 5px; }
    .right .ghost, .right .fill { left: auto; right: 0; }
    .ghost { background: #fde047; }
    .fill.p { background: linear-gradient(180deg, #ffb066, #ff7315); }
    .fill.e { background: linear-gradient(180deg, #c4a1ff, #8b5cf6); }
    .guard { margin-top: 4px; height: 5px; width: 70%; border-radius: 3px; background: rgba(0,0,0,0.45); overflow: hidden; }
    .guard > div { height: 100%; width: 100%; background: #38bdf8; border-radius: 3px; }
    .right .guard { margin-left: auto; }
    .combo {
      position: absolute; top: 118px; left: 0; right: 0; text-align: center; font-size: 26px; font-weight: 900;
      color: #fde047; text-shadow: 0 3px 10px rgba(0,0,0,0.8); letter-spacing: 2px; opacity: 0; transition: opacity 0.15s;
    }
    .banner {
      position: absolute; top: 32%; left: 0; right: 0; text-align: center; font-size: 54px; font-weight: 900;
      color: #fff; letter-spacing: 4px; text-shadow: 0 6px 24px rgba(0,0,0,0.8); opacity: 0;
    }
    .banner.show { animation: pop 1s ease-out forwards; }
    .banner.hold { opacity: 1; }
    @keyframes pop { 0% { transform: scale(2.2); opacity: 0; } 18% { transform: scale(1); opacity: 1; } 75% { opacity: 1; } 100% { transform: scale(0.95); opacity: 0; } }
    .controls { position: absolute; left: 0; right: 0; bottom: 0; height: 196px; pointer-events: none; }
    .btn {
      position: absolute; pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #fff; border-radius: 50%; border: 2.5px solid var(--c); overflow: hidden;
      background: radial-gradient(circle at 35% 28%, var(--c2) 0%, var(--c3) 62%, rgba(8,4,16,0.88) 100%);
      box-shadow: 0 6px 16px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.28), 0 0 0 0 var(--c);
      transition: transform 0.06s ease-out, box-shadow 0.12s ease-out, filter 0.06s;
    }
    .btn::before { content: ''; position: absolute; left: 14%; right: 14%; top: 5%; height: 32%; border-radius: 50%; background: linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0)); pointer-events: none; }
    .btn svg { width: 46%; height: 46%; fill: currentColor; stroke: none; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.55)); position: relative; }
    .btn .lbl { font-size: 9.5px; font-weight: 900; letter-spacing: 1.2px; margin-top: 1px; text-shadow: 0 1px 3px rgba(0,0,0,0.7); position: relative; }
    .btn.down { transform: scale(0.9); filter: brightness(1.35); box-shadow: 0 2px 6px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.2), 0 0 0 7px rgba(255,255,255,0.14), 0 0 22px var(--c); }
    /* d-pad: two joined pills on the left thumb */
    .cl { position: absolute; left: 0; bottom: 0; width: 190px; height: 130px; transform-origin: bottom left; pointer-events: none; }
    .cr { position: absolute; right: 0; bottom: 0; width: 240px; height: 196px; transform-origin: bottom right; pointer-events: none; }
    .move { border-radius: 24px; width: 78px; height: 78px; }
    .move::before { border-radius: 24px; }
    .move svg { width: 40%; height: 40%; }
    #btnLeft { left: 14px; bottom: 22px; --c: #cbd5e1; --c2: #64748b; --c3: #1e293b; }
    #btnRight { left: 100px; bottom: 22px; --c: #cbd5e1; --c2: #64748b; --c3: #1e293b; }
    /* action buttons: arc around the right thumb */
    #btnPunch { right: 16px; bottom: 20px; width: 92px; height: 92px; --c: #ffb066; --c2: #ff8a3d; --c3: #b3470a; }
    #btnKick { right: 118px; bottom: 28px; width: 78px; height: 78px; --c: #c4b5fd; --c2: #8b5cf6; --c3: #4c1d95; }
    #btnBlock { right: 100px; bottom: 114px; width: 68px; height: 68px; --c: #7dd3fc; --c2: #38bdf8; --c3: #0c4a6e; }
    #btnJump { right: 22px; bottom: 122px; width: 64px; height: 64px; --c: #86efac; --c2: #22c55e; --c3: #14532d; }
    #btnPunch .lbl { font-size: 11px; }
    .overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: none; align-items: center; justify-content: center;
      flex-direction: column; background: rgba(9,9,11,0.6); pointer-events: auto;
    }
    .overlay.show { display: flex; }
    .overlay h1 { font-size: 34px; font-weight: 900; color: #fff; letter-spacing: 2px; }
    .overlay p { margin-top: 6px; font-size: 14px; font-weight: 700; color: #cbd5e1; }
    .overlay button { margin-top: 18px; padding: 14px 34px; border-radius: 16px; border: none; background: #ff7315; color: #fff; font-size: 16px; font-weight: 900; letter-spacing: 1px; }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <div class="hud">
    <div class="bars">
      <div class="bar">
        <div class="name">YOU</div>
        <div class="track"><div class="ghost" id="pGhost"></div><div class="fill p" id="pFill"></div></div>
        <div class="guard"><div id="pGuard"></div></div>
      </div>
      <div class="bar right">
        <div class="name">SHADOW</div>
        <div class="track"><div class="ghost" id="eGhost"></div><div class="fill e" id="eFill"></div></div>
      </div>
    </div>
    <div class="combo" id="combo"></div>
    <div class="banner" id="banner"></div>
    <div class="controls">
      <div class="cl">
      <div class="btn move" id="btnLeft" aria-label="Move left"><svg viewBox="0 0 24 24"><path d="M15.5 4.5 6.5 12l9 7.5V4.5z"/></svg></div>
      <div class="btn move" id="btnRight" aria-label="Move right"><svg viewBox="0 0 24 24"><path d="M8.5 4.5 17.5 12l-9 7.5V4.5z"/></svg></div>
      </div>
      <div class="cr">
      <div class="btn" id="btnJump" aria-label="Jump"><svg viewBox="0 0 24 24"><path d="M12 4.5 19.5 12l-2 2-5.5-5.5L6.5 14l-2-2L12 4.5zM12 11.5l7.5 7.5-2 2L12 15.5 6.5 21l-2-2 7.5-7.5z"/></svg><span class="lbl">JUMP</span></div>
      <div class="btn" id="btnBlock" aria-label="Block"><svg viewBox="0 0 24 24"><path d="M12 2.2 19.6 5v6.2c0 4.7-3.1 8.4-7.6 10.6-4.5-2.2-7.6-5.9-7.6-10.6V5L12 2.2z"/></svg><span class="lbl">BLOCK</span></div>
      <div class="btn" id="btnKick" aria-label="Kick"><svg viewBox="0 0 24 24"><path d="M8 3h5l.6 8.2 6 2.7a2.2 2.2 0 0 1 1.3 2V19a1.5 1.5 0 0 1-1.5 1.5H8.5A1.5 1.5 0 0 1 7 19V4.5A1.5 1.5 0 0 1 8 3z"/></svg><span class="lbl">KICK</span></div>
      <div class="btn" id="btnPunch" aria-label="Punch"><svg viewBox="0 0 24 24"><path d="M5 11.5V9a1.8 1.8 0 0 1 3.1-1.2A1.8 1.8 0 0 1 11 6.9a1.8 1.8 0 0 1 3.1.6 1.8 1.8 0 0 1 3 1.3V10h.4A2.1 2.1 0 0 1 19.6 12v2.6c0 3.4-2.5 6-6 6H11c-3.5 0-6-2.6-6-6v-3.1z"/></svg><span class="lbl">PUNCH</span></div>
      </div>
    </div>
    <div class="overlay" id="overlay">
      <h1 id="overlayTitle">DEFEATED</h1>
      <p id="overlaySub">Block, then strike back</p>
      <button id="retryBtn">REMATCH</button>
    </div>
  </div>

  <script>
    (function () {
      const LW = 420;                     // logical arena width
      const ENEMY_HP = ${enemyHp};
      const PLAYER_HP = 100;
      const GROUND_PAD = 34;
      const MIN_GAP = 46;
      const THIGH = 38, SHIN = 38, TORSO = 46, NECK = 15, UPPER = 26, FORE = 25;
      const GRAVITY = 1500, JUMP_V = 480;
      const PARRY_WINDOW = 0.17;
      // Enemy tuning: lower damage / slower, less accurate reactions = easier.
      const ENEMY_DMG = 0.6;
      const AI_SLOW = 1.4;       // wind-up length multiplier (bigger = easier to read)
      const AI_REACT = 0.25;       // minimum reaction delay before it can guard (s)
      const AI_REACT_SPAN = 0.2;
      const AI_BLOCK = 0.25;       // chance it guards a normal attack
      const AI_PUNISH = 0.15;      // chance it punishes your recovery
      const AI_COOL = 1.8;        // pause between its attacks (s)
      const STEP = 1 / 120;

      const $ = (id) => document.getElementById(id);
      const canvas = $('gameCanvas');
      const ctx = canvas.getContext('2d');
      const pFill = $('pFill'), pGhost = $('pGhost'), eFill = $('eFill'), eGhost = $('eGhost'), pGuard = $('pGuard');
      const comboEl = $('combo'), banner = $('banner'), overlay = $('overlay');

      let W = 0, H = 0, dpr = 1, S = 1, GY = 0, bg = null;

      function send(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      // ---------- Poses ----------
      const KEYS = ['lean', 'head', 'fS', 'fE', 'rS', 'rE', 'fH', 'fK', 'rH', 'rK', 'shift'];
      const mk = (o) => Object.assign({ lean: 0.12, head: 0.02, fS: 0.55, fE: 1.85, rS: 0.4, rE: 2.0, fH: 0.5, fK: 0.45, rH: -0.05, rK: 0.5, shift: 0 }, o);
      const STANCE = mk({});
      const BLOCK = mk({ lean: 0.2, head: 0.1, fS: 0.95, fE: 1.75, rS: 0.8, rE: 2.0, fH: 0.65, fK: 0.75, rH: 0.1, rK: 0.8, shift: -2 });
      const HIT = mk({ lean: -0.4, head: -0.35, fS: -0.35, fE: 0.5, rS: -0.55, rE: 0.4, fH: 0.35, fK: 0.3, rH: -0.3, rK: 0.45, shift: -10 });
      const STUN = mk({ lean: 0.35, head: 0.4, fS: 0.2, fE: 0.4, rS: 0.1, rE: 0.5, fH: 0.4, fK: 0.7, rH: -0.1, rK: 0.8, shift: -3 });
      const JUMP = mk({ lean: 0.1, head: 0, fS: 0.9, fE: 1.6, rS: 0.6, rE: 1.8, fH: 1.0, fK: 1.3, rH: 0.4, rK: 1.5 });
      const WIN = mk({ lean: -0.05, head: -0.25, fS: 2.7, fE: 0.3, rS: 2.4, rE: 0.5, fH: 0.3, fK: 0.2, rH: -0.3, rK: 0.2 });
      const KO = mk({ lean: -0.05, head: -0.3, fS: -0.8, fE: 0.2, rS: -1.0, rE: 0.3, fH: 0.15, fK: 0.05, rH: -0.15, rK: 0.05 });

      // Attacks: startup / active / recovery windows, strike limb and pose pair.
      const ATTACKS = {
        jab: {
          startup: 0.07, active: 0.09, recovery: 0.17, dmg: 5, stun: 0.22, kb: 60, lunge: 70, limb: 'handF', spd: 1,
          wind: mk({ fS: 0.25, fE: 2.2, lean: -0.02, shift: -5 }),
          hit: mk({ fS: 1.5, fE: 0.03, rS: 0.5, rE: 2.1, lean: 0.3, shift: 12, fH: 0.65, fK: 0.55 }),
        },
        cross: {
          startup: 0.09, active: 0.09, recovery: 0.2, dmg: 7, stun: 0.26, kb: 90, lunge: 90, limb: 'handR', spd: 1,
          wind: mk({ rS: -0.1, rE: 2.3, lean: -0.1, shift: -8, fS: 0.7, fE: 1.9 }),
          hit: mk({ rS: 1.5, rE: 0.03, fS: 0.6, fE: 1.9, lean: 0.38, shift: 20, fH: 0.7, fK: 0.6, rH: -0.25, rK: 0.45 }),
        },
        heavy: {
          startup: 0.13, active: 0.1, recovery: 0.3, dmg: 9, stun: 0.5, kb: 230, lunge: 110, limb: 'handF', spd: 1,
          wind: mk({ fS: -0.5, fE: 2.6, lean: -0.24, shift: -12, rS: 0.9, rE: 1.8 }),
          hit: mk({ fS: 1.58, fE: -0.05, rS: 0.2, rE: 2.0, lean: 0.5, shift: 28, fH: 0.85, fK: 0.7, rH: -0.35, rK: 0.4 }),
        },
        kick: {
          startup: 0.16, active: 0.11, recovery: 0.3, dmg: 11, stun: 0.42, kb: 210, lunge: 40, limb: 'footR', spd: 1,
          wind: mk({ rH: 0.95, rK: 1.7, lean: -0.1, shift: -2, fS: 0.95, fE: 1.6, rS: 0.5, rE: 1.9, fH: 0.4, fK: 0.5 }),
          hit: mk({ rH: 1.5, rK: 0.1, lean: -0.32, head: 0.1, shift: 10, fS: 1.0, fE: 1.5, rS: -0.6, rE: 0.5, fH: 0.35, fK: 0.35 }),
        },
        jkick: {
          startup: 0.02, active: 0.4, recovery: 0.12, dmg: 8, stun: 0.3, kb: 130, lunge: 0, limb: 'footF', spd: 1,
          wind: mk({ fH: 1.0, fK: 1.0, rH: 0.4, rK: 1.5 }),
          hit: mk({ fH: 1.42, fK: 0.1, rH: 0.2, rK: 1.6, lean: 0.12, fS: 0.9, fE: 1.4, rS: -0.3, rE: 0.6 }),
        },
      };

      // ---------- Fighters ----------
      function makeFighter(isPlayer) {
        const f = {
          isPlayer: isPlayer,
          x: isPlayer ? 130 : 290, face: isPlayer ? 1 : -1, vx: 0, kbv: 0, lungev: 0,
          jy: 0, vy: 0, hp: isPlayer ? PLAYER_HP : ENEMY_HP, maxHp: isPlayer ? PLAYER_HP : ENEMY_HP,
          guard: 100, guardIdle: 0, state: 'idle', st: 0, atk: null, hitDone: false, queued: null, queuedT: 0,
          pose: Object.assign({}, STANCE), walkPh: 0, blockT: 99, rot: 0, koT: 0,
          combo: 0, comboT: 0, lastPunchT: 99, flash: 0, hitsTaken: 0, hitT: 0, armor: 0, heat: 0, scale: isPlayer ? 1 : 1.06,
          cmd: { dir: 0, block: false, jump: false, attack: null },
          sk: { hip: [0, 0], sh: [0, 0], head: [0, 0], elbF: [0, 0], handF: [0, 0], elbR: [0, 0], handR: [0, 0], kneeF: [0, 0], footF: [0, 0], kneeR: [0, 0], footR: [0, 0] },
          trail: [], tail: [], ai: { cool: 1.0, react: 0, sawThreat: false, willBlock: false, blockTimer: 0, chain: 0, retreat: 0, punish: false, punishFor: null, sawAir: false, antiAir: false, hitSeen: false, counter: false },
        };
        for (let i = 0; i < 6; i++) f.tail.push([f.x, 120]);
        return f;
      }

      let P, E, state, stateT, timeScale, hitstop, shake, sparks, rings, matchT, maxCombo, comboShow;
      let embers = [];
      const inp = { left: false, right: false, block: false };

      function initGame() {
        P = makeFighter(true);
        E = makeFighter(false);
        state = 'intro'; stateT = 0; timeScale = 1; hitstop = 0; shake = 0; matchT = 0;
        sparks = []; rings = []; maxCombo = 0; comboShow = 0;
        inp.left = inp.right = inp.block = false;
        ['btnLeft', 'btnRight', 'btnBlock', 'btnPunch', 'btnKick', 'btnJump'].forEach((id) => $(id).classList.remove('down'));
        overlay.classList.remove('show');
        banner.classList.remove('hold');
        showBanner('FIGHT!');
        pFill.style.width = '100%'; pGhost.style.width = '100%'; eFill.style.width = '100%'; eGhost.style.width = '100%';
        comboEl.style.opacity = '0';
        computeSkeleton(P); computeSkeleton(E);
      }

      function showBanner(text) {
        banner.innerText = text;
        banner.classList.remove('show');
        void banner.offsetWidth;
        banner.classList.add('show');
      }

      // ---------- Skeleton (logical units, y is height above ground) ----------
      function computeSkeleton(f) {
        const p = f.pose, d = f.face, k = f.scale, sk = f.sk;
        const fDy = (THIGH * Math.cos(p.fH) + SHIN * Math.cos(p.fH - p.fK)) * k;
        const rDy = (THIGH * Math.cos(p.rH) + SHIN * Math.cos(p.rH - p.rK)) * k;
        const hx = f.x + p.shift * d;
        const hy = f.jy + Math.max(fDy, rDy);
        sk.hip[0] = hx; sk.hip[1] = hy;
        // legs
        sk.kneeF[0] = hx + Math.sin(p.fH) * THIGH * k * d; sk.kneeF[1] = hy - Math.cos(p.fH) * THIGH * k;
        sk.footF[0] = sk.kneeF[0] + Math.sin(p.fH - p.fK) * SHIN * k * d; sk.footF[1] = sk.kneeF[1] - Math.cos(p.fH - p.fK) * SHIN * k;
        sk.kneeR[0] = hx + Math.sin(p.rH) * THIGH * k * d; sk.kneeR[1] = hy - Math.cos(p.rH) * THIGH * k;
        sk.footR[0] = sk.kneeR[0] + Math.sin(p.rH - p.rK) * SHIN * k * d; sk.footR[1] = sk.kneeR[1] - Math.cos(p.rH - p.rK) * SHIN * k;
        // torso, head
        sk.sh[0] = hx + Math.sin(p.lean) * TORSO * k * d; sk.sh[1] = hy + Math.cos(p.lean) * TORSO * k;
        sk.head[0] = sk.sh[0] + Math.sin(p.lean + p.head) * NECK * k * d; sk.head[1] = sk.sh[1] + Math.cos(p.lean + p.head) * NECK * k;
        // arms
        sk.elbF[0] = sk.sh[0] + Math.sin(p.fS) * UPPER * k * d; sk.elbF[1] = sk.sh[1] - Math.cos(p.fS) * UPPER * k;
        sk.handF[0] = sk.elbF[0] + Math.sin(p.fS + p.fE) * FORE * k * d; sk.handF[1] = sk.elbF[1] - Math.cos(p.fS + p.fE) * FORE * k;
        sk.elbR[0] = sk.sh[0] + Math.sin(p.rS) * UPPER * k * d; sk.elbR[1] = sk.sh[1] - Math.cos(p.rS) * UPPER * k;
        sk.handR[0] = sk.elbR[0] + Math.sin(p.rS + p.rE) * FORE * k * d; sk.handR[1] = sk.elbR[1] - Math.cos(p.rS + p.rE) * FORE * k;
      }

      // ---------- Combat ----------
      function startAttack(f, type) {
        const a = ATTACKS[type];
        const slow = f.isPlayer ? 1 : AI_SLOW;     // enemy telegraphs a little longer
        f.atk = { type: type, t: 0, a: a, startup: a.startup * slow, active: a.active, recovery: a.recovery * (f.isPlayer ? 1 : 1.0) };
        f.state = 'attack';
        f.heat += 1;
        f.hitDone = false;
        f.lungeFired = false;
        if (type === 'jab' || type === 'cross' || type === 'heavy') f.lastPunchT = 0;
      }

      function attackTotal(atk) { return atk.startup + atk.active + atk.recovery; }

      function requestAttack(f, kind) {
        // kind: 'punch' | 'kick'
        f.queued = kind; f.queuedT = 0.22;
      }

      function nextPunchType(f) {
        // chain: jab -> cross -> heavy when the previous punch was recent.
        if (f.lastPunchT < 0.55 && f.atk) {
          if (f.atk.type === 'jab') return 'cross';
          if (f.atk.type === 'cross') return 'heavy';
        }
        return 'jab';
      }

      function tryConsumeQueue(f) {
        if (!f.queued) return;
        const air = f.jy > 2;
        if (f.state === 'attack') {
          const atk = f.atk;
          const inRecovery = atk.t >= atk.startup + atk.active;
          const isPunch = atk.type === 'jab' || atk.type === 'cross';
          if (inRecovery && f.queued === 'punch' && isPunch && atk.t > atk.startup + atk.active + atk.recovery * 0.35) {
            const t = nextPunchType(f);
            f.queued = null; startAttack(f, t);
          } else if (inRecovery && f.queued === 'kick' && atk.type !== 'kick' && atk.t > atk.startup + atk.active + atk.recovery * 0.5) {
            f.queued = null; startAttack(f, 'kick');
          }
          return;
        }
        if (f.state === 'idle' || f.state === 'walk') {
          if (air) {
            if (f.queued === 'kick' || f.queued === 'punch') { f.queued = null; startAttack(f, 'jkick'); }
          } else if (f.queued === 'punch') {
            const t = nextPunchType(f);
            f.queued = null; startAttack(f, t);
          } else {
            f.queued = null; startAttack(f, 'kick');
          }
        }
      }

      function applyHit(att, def) {
        const a = att.atk.a;
        const blocking = def.state === 'block' && def.jy < 2;
        const sx = att.sk[a.limb][0], sy = att.sk[a.limb][1];

        if (blocking) {
          if (def.isPlayer && def.blockT < PARRY_WINDOW) {
            // Perfect guard: stagger the attacker and open them up.
            att.state = 'stun'; att.st = 0.85; att.atk = null; att.queued = null;
            att.kbv = -att.face * 120;
            def.flash = 0.2; def.guard = Math.min(100, def.guard + 20);
            addBurst(sx, sy, '#fde047', 14, 1.5); addRing(sx, sy, '#fde047', 60);
            hitstop = 0.12; shake = 9;
            send({ type: 'PARRY' });
            showBanner('PARRY!');
            return;
          }
          if (!def.isPlayer) {
            if (Math.random() < (att.heat >= 1.3 ? 0.8 : 0.5)) { def.ai.blockTimer = 0; def.ai.counter = true; def.ai.cool = 0.05; }
            def.guard = Math.max(30, def.guard + a.dmg * 2.6 * 0.7);
          }
          def.guard -= a.dmg * 2.6;
          def.hp -= a.dmg * 0.1;
          def.kbv = att.face * a.kb * 0.55;
          addBurst(sx, sy, '#7dd3fc', 7, 0.9); addRing(sx, sy, '#7dd3fc', 34);
          hitstop = 0.04; shake = 3;
          if (def.guard <= 0) {
            def.guard = 55; def.state = 'stun'; def.st = 0.9; def.atk = null; def.queued = null;
            addBurst(def.x, 90, '#38bdf8', 12, 1.3);
            showBanner('GUARD BREAK');
          }
          if (def.isPlayer) send({ type: 'BLOCK' });
          return;
        }

        let dmg = a.dmg * (att.isPlayer ? 1 : ENEMY_DMG);
        const countered = def.state === 'attack' && def.atk.t < def.atk.startup + def.atk.active;
        if (countered) dmg *= 1.3;

        const armoredWindup = !def.isPlayer && def.state === 'attack' && def.atk.type !== 'jab' && def.atk.t < def.atk.startup;
        if (armoredWindup) {
          // Heavy enemy moves push through light hits while winding up.
          def.hp = Math.max(0, def.hp - dmg * 0.6);
          def.kbv = att.face * a.kb * 0.2;
          def.flash = 0.08;
        } else if (def.armor > 0) {
          // Wake-up armor after a long combo: damage goes through but the victim isn't staggered.
          def.hp = Math.max(0, def.hp - dmg * 0.6);
          def.kbv = att.face * a.kb * 0.3;
          def.flash = 0.1;
        } else {
          def.hp = Math.max(0, def.hp - dmg);
          def.hitsTaken = def.hitT > 0 ? def.hitsTaken + 1 : 1;
          def.hitT = 1.0;
          let stun = Math.max(0.12, a.stun * Math.pow(0.7, def.hitsTaken - 1));
          let kb = a.kb;
          if (def.hitsTaken >= 3) {
            // Third hit launches the victim clear of the combo and grants brief armor.
            kb = Math.max(kb, 200) * 1.5; stun = Math.max(stun, 0.4);
            def.armor = stun + 0.55; def.hitsTaken = 0; def.hitT = 0;
          }
          def.state = 'hit'; def.st = stun; def.atk = null; def.queued = null;
          def.kbv = att.face * kb;
          def.flash = 0.18; def.blockT = 99;
        }
        const heavy = att.atk.type === 'heavy' || att.atk.type === 'kick';
        addBurst(sx, sy, heavy ? '#ffedd5' : '#ffb066', heavy ? 14 : 9, heavy ? 1.4 : 1);
        if (heavy) addRing(sx, sy, '#ffedd5', 48);
        hitstop = heavy ? 0.09 : 0.055;
        shake = heavy ? 8 : 4;
        att.combo = att.comboT > 0 ? att.combo + 1 : 1;
        att.comboT = 1.1;
        if (att.isPlayer) {
          maxCombo = Math.max(maxCombo, att.combo);
          comboShow = 1.1;
          if (att.combo >= 2) { comboEl.innerText = att.combo + ' HIT COMBO'; comboEl.style.opacity = '1'; }
          send({ type: 'HIT', combo: att.combo });
        } else {
          send({ type: 'DAMAGE', hp: def.hp });
        }
        if (def.hp <= 0) startKO(def, att);
      }

      function startKO(loser, winner) {
        loser.state = 'ko'; loser.koT = 0; loser.kbv = winner.face * 260; loser.vy = 260;
        loser.atk = null;
        state = 'ending'; stateT = 0; timeScale = 0.3;
        winner.winner = true;
        hitstop = 0.14; shake = 14;
        addRing(loser.x, 90, '#ffffff', 90);
        showBanner('K.O.');
      }

      function addBurst(x, y, color, n, power) {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, s = (80 + Math.random() * 240) * power;
          sparks.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.28 + Math.random() * 0.2, max: 0.5, c: color, len: 5 + Math.random() * 9 });
        }
      }
      function addRing(x, y, color, r) { rings.push({ x: x, y: y, r: 6, max: r, life: 0.22, c: color }); }

      // ---------- Enemy AI ----------
      function aiThink(e, p, dt) {
        const ai = e.ai, c = e.cmd;
        c.dir = 0; c.block = false; c.jump = false; c.attack = null;
        if (state !== 'fight') return;
        const rage = e.hp < e.maxHp * 0.35;
        const d = Math.abs(p.x - e.x);
        ai.cool -= dt; ai.retreat -= dt;
        if (rage) ai.cool -= dt * 0.5;

        // Read the player's attacks: only after a human-like reaction delay.
        const threat = p.state === 'attack' && p.atk.t < p.atk.startup + p.atk.active && d < 135;
        if (threat && !ai.sawThreat) {
          ai.sawThreat = true;
          ai.react = AI_REACT + Math.random() * AI_REACT_SPAN;
          ai.willBlock = Math.random() < (rage ? AI_BLOCK + 0.15 : AI_BLOCK) + (e.hitT > 0 ? 0.25 : 0);
          // Spamming gets read: the more attacks in a row, the more reliably the shadow guards.
          if (p.heat >= 1.3) { ai.willBlock = Math.random() < 0.9; ai.react = 0.06 + Math.random() * 0.06; }
          // Back-dash out of a slow kick instead of eating it.
          if (!ai.willBlock && p.atk.type === 'kick' && e.state !== 'attack' && Math.random() < 0.4) e.kbv = -e.face * 190;
        }
        if (!threat) ai.sawThreat = false;
        if (ai.react > 0) {
          ai.react -= dt;
          if (ai.react <= 0 && ai.willBlock && e.state !== 'attack') ai.blockTimer = 0.4;
        }
        if (e.state === 'hit') ai.hitSeen = true;
        else if (ai.hitSeen && (e.state === 'idle' || e.state === 'walk')) {
          ai.hitSeen = false;
          if (Math.random() < 0.5) ai.blockTimer = 0.4;          // turtle up after a beating
          else { ai.cool = Math.min(ai.cool, 0.05); ai.counter = true; } // or hit back right away
        }
        if (ai.blockTimer > 0) { ai.blockTimer -= dt; c.block = true; return; }

        if (e.state === 'attack') {
          // follow-up punches in a chain
          if (ai.chain > 0 && !e.queued && e.atk.t > e.atk.startup + e.atk.active) { requestAttack(e, 'punch'); ai.chain--; }
          return;
        }
        if (e.state !== 'idle' && e.state !== 'walk') return;
        ai.chain = 0;

        // Opportunistic reads, rolled once per player action.
        const pRecovering = p.state === 'attack' && p.atk.t > p.atk.startup + p.atk.active;
        if (pRecovering && ai.punishFor !== p.atk) {
          ai.punishFor = p.atk;
          ai.punish = Math.random() < (rage ? AI_PUNISH + 0.25 : AI_PUNISH);
        }
        if (p.jy > 25 && !ai.sawAir) { ai.sawAir = true; ai.antiAir = Math.random() < 0.5; }
        if (p.jy <= 0) ai.sawAir = false;

        if (ai.antiAir && p.jy > 25 && d < 130) { ai.antiAir = false; c.attack = 'kick'; ai.cool = 0.7; return; }
        if (ai.punish && d < 108 && (pRecovering || p.state === 'stun')) {
          ai.punish = false;
          c.attack = Math.random() < 0.5 ? 'kick' : 'punch';
          ai.chain = c.attack === 'punch' ? 1 + (Math.random() < 0.5 ? 1 : 0) : 0;
          ai.cool = 0.5 + Math.random() * 0.4; return;
        }

        if (ai.retreat > 0 && d < 150) { c.dir = p.x > e.x ? -1 : 1; return; }

        if (ai.counter && d < 112) { ai.counter = false; ai.cool = 0.6 + Math.random() * 0.3; c.attack = Math.random() < 0.65 ? 'punch' : 'kick'; ai.chain = c.attack === 'punch' ? (Math.random() < 0.5 ? 1 : 0) : 0; return; }
        ai.counter = false;
        if (d > 98) { c.dir = (p.x > e.x) ? 1 : -1; return; }

        if (ai.cool <= 0 && d <= 104) {
          const blocking = p.state === 'block';
          const r = Math.random();
          if (blocking && r < 0.6) { c.attack = 'kick'; ai.chain = 0; }
          else if (r < 0.28) { c.attack = 'kick'; ai.chain = 0; }
          else { c.attack = 'punch'; ai.chain = Math.random() < 0.55 ? (Math.random() < 0.5 ? 1 : 2) : 0; }
          ai.cool = (rage ? AI_COOL * 0.6 : AI_COOL) + Math.random() * 0.6;
          if (Math.random() < 0.55) ai.retreat = 0.35 + Math.random() * 0.3;
          return;
        }
        if (d < 70) { c.dir = (p.x > e.x) ? -1 : 1; }
      }

      // ---------- Fighter update ----------
      function updateFighter(f, o, dt) {
        const c = f.cmd;
        f.flash = Math.max(0, f.flash - dt);
        f.comboT = Math.max(0, f.comboT - dt);
        f.hitT = Math.max(0, f.hitT - dt);
        f.heat = Math.max(0, f.heat - dt / 0.8);
        f.armor = Math.max(0, f.armor - dt);
        if (f.hitT === 0) f.hitsTaken = 0;
        if (f.comboT === 0) f.combo = 0;
        f.lastPunchT += dt;
        f.blockT += dt;
        f.queuedT -= dt; if (f.queuedT <= 0) f.queued = null;

        const grounded = f.jy <= 0 && f.vy <= 0;

        // state machine
        if (f.state === 'ko') {
          f.koT += dt;
        } else if (f.state === 'hit' || f.state === 'stun') {
          f.st -= dt;
          if (f.st <= 0) f.state = 'idle';
        } else if (f.state === 'attack') {
          f.atk.t += dt;
          const atk = f.atk;
          if (!f.lungeFired && atk.t >= atk.startup) { f.lungeFired = true; f.lungev = f.face * atk.a.lunge; }
          if (!f.hitDone && atk.t >= atk.startup && atk.t <= atk.startup + atk.active) {
            const tip = f.sk[atk.a.limb];
            const ocx = o.sk.hip[0];
            const dxFront = (ocx - tip[0]) * f.face;
            if (dxFront <= 24 && dxFront >= -22 && tip[1] >= o.jy + 18 && tip[1] <= o.jy + 150 && o.state !== 'ko') {
              f.hitDone = true;
              applyHit(f, o);
            }
          }
          tryConsumeQueue(f);
          if (f.state === 'attack' && atk.t >= attackTotal(atk) && (f.jy <= 0 || atk.type !== 'jkick')) {
            f.state = 'idle';
          }
          if (f.state === 'attack' && atk.type === 'jkick' && grounded) { f.state = 'idle'; }
        } else if (f.state === 'block') {
          if (!c.block || !grounded) f.state = 'idle';
        }

        if (f.state === 'idle' || f.state === 'walk') {
          if (c.attack && state === 'fight') { requestAttack(f, c.attack); c.attack = null; }
          tryConsumeQueue(f);
        }
        if ((f.state === 'idle' || f.state === 'walk') && state === 'fight') {
          if (c.jump && grounded) { f.vy = JUMP_V; f.vx = c.dir * 100; c.jump = false; }
          if (c.block && grounded && f.state !== 'attack') { f.state = 'block'; f.blockT = 0; }
          else if (grounded) {
            const fwd = (c.dir * f.face) > 0;
            const spd = f.isPlayer ? (fwd ? 108 : 86) : (fwd ? 88 : 70) * (f.hp < f.maxHp * 0.35 ? 1.2 : 1);
            f.vx = c.dir * spd;
            f.state = c.dir !== 0 ? 'walk' : 'idle';
            f.walkPh += Math.abs(f.vx) * dt / 15 * (fwd ? 1 : -1);
          }
        }
        if (f.state === 'block' || f.state === 'attack' || f.state === 'hit' || f.state === 'stun' || f.state === 'ko') {
          if (grounded) f.vx = 0;
        }

        // guard regen
        if (f.state !== 'block') { f.guardIdle += dt; if (f.guardIdle > 0.6) f.guard = Math.min(100, f.guard + 22 * dt); } else f.guardIdle = 0;

        // movement
        f.x += (f.vx + f.kbv + f.lungev) * dt;
        f.kbv *= Math.exp(-9 * dt);
        f.lungev *= Math.exp(-14 * dt);
        if (f.jy > 0 || f.vy > 0) {
          f.vy -= GRAVITY * dt;
          f.jy += f.vy * dt;
          if (f.jy <= 0) {
            f.jy = 0;
            if (f.state === 'ko') { if (f.vy < -80 && f.koT < 0.5) { f.vy = -f.vy * 0.28; f.jy = 0.01; } else f.vy = 0; } else f.vy = 0;
            f.vx = 0;
          }
        }
        f.x = Math.max(GROUND_PAD, Math.min(LW - GROUND_PAD, f.x));
      }

      function separate() {
        const gap = Math.abs(P.x - E.x);
        if (gap < MIN_GAP && P.state !== 'ko' && E.state !== 'ko') {
          const push = (MIN_GAP - gap) / 2, dir = P.x < E.x ? -1 : 1;
          P.x += dir * push; E.x -= dir * push;
          P.x = Math.max(GROUND_PAD, Math.min(LW - GROUND_PAD, P.x));
          E.x = Math.max(GROUND_PAD, Math.min(LW - GROUND_PAD, E.x));
          if (Math.abs(P.x - E.x) < MIN_GAP - 0.5) {
            if (P.x <= GROUND_PAD + 0.5) E.x = P.x + MIN_GAP; else if (P.x >= LW - GROUND_PAD - 0.5) E.x = P.x - MIN_GAP;
            if (E.x <= GROUND_PAD + 0.5) P.x = E.x + MIN_GAP; else if (E.x >= LW - GROUND_PAD - 0.5) P.x = E.x - MIN_GAP;
          }
        }
      }

      // ---------- Pose selection ----------
      const T = Object.assign({}, STANCE);
      function setTarget(src) { for (let i = 0; i < KEYS.length; i++) T[KEYS[i]] = src[KEYS[i]]; }

      function poseFighter(f, dt, time) {
        let rate = 14;
        setTarget(STANCE);
        const air = f.jy > 2;
        const breathe = Math.sin(time * 3.2 + (f.isPlayer ? 0 : 1.5));

        if (f.state === 'ko') {
          setTarget(KO); rate = 10;
        } else if (f.state === 'hit') {
          setTarget(HIT); rate = 40;
        } else if (f.state === 'stun') {
          setTarget(STUN); rate = 20;
        } else if (f.state === 'attack') {
          const atk = f.atk, a = atk.a;
          if (atk.t < atk.startup) { setTarget(a.wind); rate = 34 / (f.isPlayer ? 1 : AI_SLOW); }
          else if (atk.t < atk.startup + atk.active) { setTarget(a.hit); rate = 70; }
          else { setTarget(air ? JUMP : STANCE); rate = 15; }
        } else if (f.winner) {
          setTarget(WIN); rate = 9;
        } else if (f.state === 'block') {
          setTarget(BLOCK); rate = 28;
        } else if (air) {
          setTarget(JUMP); rate = 16;
        } else {
          T.lean += breathe * 0.012; T.fE += breathe * 0.05; T.rE -= breathe * 0.04;
          if (f.state === 'walk') {
            const s = Math.sin(f.walkPh), cs = Math.cos(f.walkPh);
            T.fH = 0.5 + 0.3 * s; T.rH = -0.05 - 0.3 * s;
            T.fK = 0.45 + 0.6 * Math.max(0, cs); T.rK = 0.5 + 0.6 * Math.max(0, -cs);
            T.lean += 0.05; rate = 24;
          }
        }
        const k = 1 - Math.exp(-rate * dt);
        for (let i = 0; i < KEYS.length; i++) {
          const key = KEYS[i];
          f.pose[key] += (T[key] - f.pose[key]) * k;
        }

        // KO rotation about the feet
        if (f.state === 'ko') {
          const target = 1.5;
          f.rot += (target - f.rot) * (1 - Math.exp(-4.5 * dt));
        } else f.rot = 0;

        computeSkeleton(f);

        // headband tails trail behind the head
        const hx = f.sk.head[0] - f.face * 6, hy = f.sk.head[1] + 3;
        f.tail[0][0] = hx; f.tail[0][1] = hy;
        for (let i = 1; i < f.tail.length; i++) {
          const pt = f.tail[i], pr = f.tail[i - 1];
          pt[0] += (-f.face * 40 - f.vx * 0.4 - f.kbv * 0.2) * dt;
          pt[1] -= 55 * dt;
          let dx = pt[0] - pr[0], dy = pt[1] - pr[1];
          const len = Math.sqrt(dx * dx + dy * dy) || 1, want = 8;
          pt[0] = pr[0] + dx / len * want; pt[1] = pr[1] + dy / len * want;
        }

        // strike trail
        if (f.state === 'attack' && f.atk.t > f.atk.startup * 0.4 && f.atk.t < f.atk.startup + f.atk.active + 0.06) {
          const tip = f.sk[f.atk.a.limb];
          f.trail.push({ x: tip[0], y: tip[1], age: 0 });
        }
        for (let i = f.trail.length - 1; i >= 0; i--) { f.trail[i].age += dt; if (f.trail[i].age > 0.16) f.trail.splice(i, 1); }
      }

      // ---------- Player input ----------
      function playerCommands() {
        const c = P.cmd;
        c.dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        c.block = inp.block;
      }

      // ---------- Rendering ----------
      function sx(x) { return x * S; }
      function sy(y) { return GY - y * S; }

      function buildBackground() {
        if (!document.createElement) return;
        const c = document.createElement('canvas');
        if (!c || !c.getContext) return;
        c.width = Math.floor(W * dpr); c.height = Math.floor(H * dpr);
        const g = c.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const hor = GY - 20 * S;
        const sky = g.createLinearGradient(0, 0, 0, hor);
        sky.addColorStop(0, '#120826'); sky.addColorStop(0.35, '#3b1550'); sky.addColorStop(0.62, '#a3304a'); sky.addColorStop(0.85, '#ef6a2e'); sky.addColorStop(1, '#ffb347');
        g.fillStyle = sky; g.fillRect(0, 0, W, hor + 2);
        // sun
        const sunX = W * 0.5, sunY = hor - 52 * S, sunR = 56 * S;
        const glow = g.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, sunR * 3.2);
        glow.addColorStop(0, 'rgba(255,230,160,0.9)'); glow.addColorStop(0.35, 'rgba(255,140,60,0.35)'); glow.addColorStop(1, 'rgba(255,100,40,0)');
        g.fillStyle = glow; g.fillRect(0, 0, W, hor);
        g.fillStyle = '#fff1c1'; g.beginPath(); g.arc(sunX, sunY, sunR, 0, Math.PI * 2); g.fill();
        // mountain layers
        const layers = [['#6b2a55', 0.52, 70, 0.011, 0.0], ['#3f1a47', 0.38, 55, 0.017, 2.0], ['#22102f', 0.24, 40, 0.025, 4.0]];
        layers.forEach(function (L) {
          g.fillStyle = L[0]; g.beginPath(); g.moveTo(0, hor);
          for (let x = 0; x <= W; x += 6) {
            const y = hor - (L[1] * 90 * S) - Math.sin(x * L[3] + L[4]) * L[2] * S * 0.5 - Math.sin(x * L[3] * 2.7 + L[4]) * L[2] * S * 0.18;
            g.lineTo(x, y);
          }
          g.lineTo(W, hor); g.closePath(); g.fill();
        });
        // pagoda on the right
        const px = W * 0.8, pb = hor - 14 * S;
        g.fillStyle = '#12081c';
        g.fillRect(px - 16 * S, pb - 30 * S, 32 * S, 30 * S);
        for (let i = 0; i < 3; i++) {
          const w = (46 - i * 9) * S, y = pb - (30 + i * 22) * S;
          g.beginPath(); g.moveTo(px - w, y); g.quadraticCurveTo(px - w * 0.4, y - 3 * S, px, y - 14 * S); g.quadraticCurveTo(px + w * 0.4, y - 3 * S, px + w, y); g.lineTo(px + w * 0.8, y + 5 * S); g.lineTo(px - w * 0.8, y + 5 * S); g.closePath(); g.fill();
          if (i < 2) g.fillRect(px - (w * 0.45), y, w * 0.9, 17 * S);
        }
        g.fillRect(px - 1.5 * S, pb - 108 * S, 3 * S, 22 * S);
        // torii gate on the left
        const tx = W * 0.2, tb = hor - 8 * S;
        g.fillRect(tx - 34 * S, tb - 78 * S, 8 * S, 78 * S);
        g.fillRect(tx + 26 * S, tb - 78 * S, 8 * S, 78 * S);
        g.beginPath(); g.moveTo(tx - 52 * S, tb - 78 * S); g.quadraticCurveTo(tx, tb - 70 * S, tx + 52 * S, tb - 78 * S); g.lineTo(tx + 56 * S, tb - 88 * S); g.quadraticCurveTo(tx, tb - 80 * S, tx - 56 * S, tb - 88 * S); g.closePath(); g.fill();
        g.fillRect(tx - 40 * S, tb - 62 * S, 80 * S, 6 * S);
        // ground
        const fl = g.createLinearGradient(0, GY - 20 * S, 0, H);
        fl.addColorStop(0, '#2a1230'); fl.addColorStop(0.15, '#180a22'); fl.addColorStop(1, '#07030c');
        g.fillStyle = fl; g.fillRect(0, GY - 20 * S, W, H - GY + 20 * S);
        g.fillStyle = 'rgba(255,170,90,0.55)'; g.fillRect(0, GY - 20 * S, W, 2 * S);
        g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 1;
        for (let i = 1; i < 6; i++) { const y = GY + i * i * 3.2 * S; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
        bg = c;
      }

      function limb(ctx2, a, b, w) {
        ctx2.lineWidth = w * S;
        ctx2.beginPath(); ctx2.moveTo(sx(a[0]), sy(a[1])); ctx2.lineTo(sx(b[0]), sy(b[1])); ctx2.stroke();
      }

      function drawFighterBody(f, rim, body) {
        const sk = f.sk, k = f.scale, big = f.isPlayer ? 1 : 1.12;
        const passes = [[rim, 2.8], [body, 0]];
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let pi = 0; pi < 2; pi++) {
          const col = passes[pi][0], ex = passes[pi][1];
          ctx.strokeStyle = col; ctx.fillStyle = col;
          limb(ctx, sk.sh, sk.elbR, (8 + ex) * k); limb(ctx, sk.elbR, sk.handR, (6.5 + ex) * k);
          limb(ctx, sk.hip, sk.kneeR, (12 + ex) * k); limb(ctx, sk.kneeR, sk.footR, (8.5 + ex) * k);
          // rear foot
          ctx.lineWidth = (6 + ex) * S * k; ctx.beginPath(); ctx.moveTo(sx(sk.footR[0]), sy(sk.footR[1])); ctx.lineTo(sx(sk.footR[0] + f.face * 9 * k), sy(sk.footR[1] - 1)); ctx.stroke();
          limb(ctx, sk.hip, sk.sh, (17 * big + ex) * k);
          limb(ctx, sk.sh, sk.head, (6 + ex) * k);
          ctx.beginPath(); ctx.arc(sx(sk.head[0]), sy(sk.head[1] + 3 * k), (10 + ex * 0.6) * S * k, 0, Math.PI * 2); ctx.fill();
          limb(ctx, sk.hip, sk.kneeF, (12.5 + ex) * k); limb(ctx, sk.kneeF, sk.footF, (9 + ex) * k);
          ctx.lineWidth = (6.5 + ex) * S * k; ctx.beginPath(); ctx.moveTo(sx(sk.footF[0]), sy(sk.footF[1])); ctx.lineTo(sx(sk.footF[0] + f.face * 10 * k), sy(sk.footF[1] - 1)); ctx.stroke();
          limb(ctx, sk.sh, sk.elbF, (8.5 + ex) * k); limb(ctx, sk.elbF, sk.handF, (7 + ex) * k);
          ctx.beginPath(); ctx.arc(sx(sk.handF[0]), sy(sk.handF[1]), (5 + ex * 0.5) * S * k, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(sx(sk.handR[0]), sy(sk.handR[1]), (5 + ex * 0.5) * S * k, 0, Math.PI * 2); ctx.fill();
        }
      }

      function drawFighter(f, reflect) {
        const accent = f.isPlayer ? '#ff7315' : '#a78bfa';
        const rim = f.flash > 0 ? '#ffffff' : (f.isPlayer ? 'rgba(255,150,70,0.75)' : 'rgba(167,139,250,0.75)');
        const body = f.flash > 0 ? '#ffffff' : '#07060d';
        ctx.save();
        if (f.rot !== 0) {
          const px = sx(f.x), py = GY;
          ctx.translate(px, py); ctx.rotate(-f.face * f.rot); ctx.translate(-px, -py + (f.rot / 1.5) * 9 * S);
        }
        drawFighterBody(f, rim, body);
        if (reflect) { ctx.restore(); return; }

        // headband tails
        const tl = f.tail;
        ctx.strokeStyle = accent; ctx.lineCap = 'round';
        for (let i = 1; i < tl.length; i++) {
          ctx.lineWidth = Math.max(1, (5 - i * 0.7)) * S;
          ctx.beginPath(); ctx.moveTo(sx(tl[i - 1][0]), sy(tl[i - 1][1])); ctx.lineTo(sx(tl[i][0]), sy(tl[i][1])); ctx.stroke();
        }
        // headband + eye
        const hd = f.sk.head, k = f.scale;
        ctx.lineWidth = 3 * S * k; ctx.strokeStyle = accent;
        ctx.beginPath(); ctx.moveTo(sx(hd[0] - 9 * k), sy(hd[1] + 5 * k)); ctx.lineTo(sx(hd[0] + 9 * k), sy(hd[1] + 5 * k)); ctx.stroke();
        ctx.strokeStyle = f.isPlayer ? '#fff4d6' : '#ff4d4d'; ctx.lineWidth = 2.2 * S;
        ctx.beginPath(); ctx.moveTo(sx(hd[0] + f.face * 3 * k), sy(hd[1] + 1 * k)); ctx.lineTo(sx(hd[0] + f.face * 9 * k), sy(hd[1] + 1 * k)); ctx.stroke();
        if (!f.isPlayer) { // topknot
          ctx.fillStyle = '#07060d'; ctx.beginPath(); ctx.arc(sx(hd[0] - f.face * 5), sy(hd[1] + 14 * k), 4.5 * S, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }

      function drawTrail(f) {
        const t = f.trail;
        if (t.length < 2) return;
        ctx.lineCap = 'round';
        for (let i = 1; i < t.length; i++) {
          const a = 1 - t[i].age / 0.16;
          ctx.strokeStyle = f.isPlayer ? 'rgba(255,190,120,' + (a * 0.6) + ')' : 'rgba(200,180,255,' + (a * 0.6) + ')';
          ctx.lineWidth = (1 + 3.2 * a * a) * S;
          ctx.beginPath(); ctx.moveTo(sx(t[i - 1].x), sy(t[i - 1].y)); ctx.lineTo(sx(t[i].x), sy(t[i].y)); ctx.stroke();
        }
      }

      function drawShadow(f) {
        const a = Math.max(0, 0.38 - f.jy / 260);
        ctx.fillStyle = 'rgba(0,0,0,' + a + ')';
        ctx.beginPath(); ctx.ellipse(sx(f.sk.hip[0] * 0 + f.x), GY + 3 * S, 30 * S * f.scale, 6 * S, 0, 0, Math.PI * 2); ctx.fill();
      }

      function seedEmbers() {
        embers = [];
        for (let i = 0; i < 22; i++) embers.push({ x: Math.random() * LW, y: Math.random() * 300, vy: 8 + Math.random() * 14, vx: (Math.random() - 0.5) * 10, r: 0.8 + Math.random() * 1.6, a: 0.3 + Math.random() * 0.6 });
      }

      function render(time, dt) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.save();
        if (shake > 0.1) { ctx.translate((Math.random() - 0.5) * shake * 0.6, (Math.random() - 0.5) * shake * 0.6); }
        if (bg) { ctx.drawImage(bg, 0, 0, W, H); } else { ctx.fillStyle = '#2a1230'; ctx.fillRect(0, 0, W, H); }

        // embers
        for (let i = 0; i < embers.length; i++) {
          const e = embers[i];
          ctx.fillStyle = 'rgba(255,170,90,' + e.a + ')';
          ctx.beginPath(); ctx.arc(sx(e.x), GY - e.y * S, e.r * S, 0, Math.PI * 2); ctx.fill();
        }

        // reflections
        ctx.save();
        ctx.translate(0, GY * 2); ctx.scale(1, -1);
        ctx.globalAlpha = 0.16;
        drawFighter(P, true); drawFighter(E, true);
        ctx.restore();
        const fade = ctx.createLinearGradient(0, GY, 0, GY + 90 * S);
        fade.addColorStop(0, 'rgba(24,10,34,0.35)'); fade.addColorStop(1, 'rgba(7,3,12,1)');
        ctx.fillStyle = fade; ctx.fillRect(0, GY + 1, W, H - GY);

        drawShadow(P); drawShadow(E);
        drawFighter(E, false); drawFighter(P, false);
        drawTrail(P); drawTrail(E);

        // rings & sparks
        for (let i = rings.length - 1; i >= 0; i--) {
          const r = rings[i]; r.life -= dt; r.r += (r.max - r.r) * Math.min(1, dt * 16);
          if (r.life <= 0) { rings.splice(i, 1); continue; }
          ctx.strokeStyle = r.c; ctx.globalAlpha = Math.max(0, r.life / 0.22); ctx.lineWidth = 3 * S;
          ctx.beginPath(); ctx.arc(sx(r.x), sy(r.y), r.r * S, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.lineCap = 'round';
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy -= 500 * dt;
          if (s.life <= 0) { sparks.splice(i, 1); continue; }
          const a = Math.max(0, s.life / s.max), sp = Math.sqrt(s.vx * s.vx + s.vy * s.vy) || 1;
          ctx.strokeStyle = s.c; ctx.globalAlpha = Math.min(1, a * 2); ctx.lineWidth = 2.4 * S;
          ctx.beginPath(); ctx.moveTo(sx(s.x), sy(s.y)); ctx.lineTo(sx(s.x - s.vx / sp * s.len * a), sy(s.y - s.vy / sp * s.len * a)); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      function updateHud(dt) {
        const pp = Math.max(0, P.hp / P.maxHp * 100), ep = Math.max(0, E.hp / E.maxHp * 100);
        pFill.style.width = pp + '%'; eFill.style.width = ep + '%';
        const pg = parseFloat(pGhost.style.width) || 100, eg = parseFloat(eGhost.style.width) || 100;
        pGhost.style.width = (pg > pp ? Math.max(pp, pg - 38 * dt) : pp) + '%';
        eGhost.style.width = (eg > ep ? Math.max(ep, eg - 38 * dt) : ep) + '%';
        pGuard.style.width = Math.max(0, P.guard) + '%';
        pGuard.style.background = P.guard < 30 ? '#f87171' : '#38bdf8';
        if (comboShow > 0) { comboShow -= dt; if (comboShow <= 0) comboEl.style.opacity = '0'; }
      }

      // ---------- Loop ----------
      let last = 0, acc = 0, clock = 0, endClock = 0;
      function simStep(dt) {
        stateT += dt;
        if (state === 'intro' && stateT > 0.85) { state = 'fight'; stateT = 0; }
        if (state === 'fight') matchT += dt;

        playerCommands();
        aiThink(E, P, dt);
        // face the opponent while grounded
        if (P.state !== 'ko') P.face = E.x >= P.x ? 1 : -1;
        if (E.state !== 'ko') E.face = P.x >= E.x ? 1 : -1;
        updateFighter(P, E, dt);
        updateFighter(E, P, dt);
        separate();

        for (let i = 0; i < embers.length; i++) {
          const e = embers[i]; e.x += e.vx * dt; e.y += e.vy * dt;
          if (e.y > 330) { e.y = 0; e.x = Math.random() * LW; }
        }

      }

      let finished = false;
      function finishMatch() {
        if (finished) return;
        finished = true;
        state = 'over';
        if (P.winner) {
          banner.innerText = 'VICTORY'; banner.classList.remove('show'); banner.classList.add('hold');
          send({ type: 'STAGE_CLEAR', hp: Math.round(P.hp), combo: maxCombo, time: Math.round(matchT * 10) / 10 });
        } else {
          $('overlayTitle').innerText = 'DEFEATED';
          $('overlaySub').innerText = 'Block, parry, then strike back';
          overlay.classList.add('show');
          send({ type: 'GAME_OVER' });
        }
      }

      function frame(now) {
        const real = Math.min(0.05, (now - (last || now)) / 1000);
        last = now; clock += real;
        if (state === 'ending') {
          // KO slow-motion is timed in real seconds so it never drags.
          endClock += real;
          timeScale = endClock < 0.7 ? 0.3 : 1;
          if (endClock > 1.5) finishMatch();
        }
        if (hitstop > 0) {
          hitstop -= real;
        } else {
          acc += real * timeScale;
          while (acc >= STEP) { simStep(STEP); acc -= STEP; }
        }
        // pose + trail run every frame for smooth visuals
        const vis = hitstop > 0 ? 0 : real * timeScale;
        poseFighter(P, vis, clock); poseFighter(E, vis, clock);
        shake = Math.max(0, shake - 38 * real);
        updateHud(real);
        render(clock, real);
        requestAnimationFrame(frame);
      }

      // ---------- Input ----------
      function hold(id, on, off) {
        const el = $(id);
        const press = function (e) { e.preventDefault(); el.classList.add('down'); on(); };
        const release = function (e) { e.preventDefault(); el.classList.remove('down'); off && off(); };
        el.addEventListener('touchstart', press, { passive: false });
        el.addEventListener('touchend', release, { passive: false });
        el.addEventListener('touchcancel', release, { passive: false });
        el.addEventListener('mousedown', press);
        el.addEventListener('mouseup', release);
        el.addEventListener('mouseleave', release);
      }
      hold('btnLeft', function () { inp.left = true; }, function () { inp.left = false; });
      hold('btnRight', function () { inp.right = true; }, function () { inp.right = false; });
      hold('btnBlock', function () { inp.block = true; }, function () { inp.block = false; });
      hold('btnPunch', function () { if (state === 'fight') requestAttack(P, 'punch'); });
      hold('btnKick', function () { if (state === 'fight') requestAttack(P, 'kick'); });
      hold('btnJump', function () { if (state === 'fight') P.cmd.jump = true; });
      $('retryBtn').addEventListener('click', function () { restart(); });
      $('retryBtn').addEventListener('touchend', function (e) { e.preventDefault(); restart(); });

      function restart() { finished = false; endClock = 0; initGame(); }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth || 390; H = window.innerHeight || 640;
        canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
        S = W / LW;
        const k = Math.min(1, W / 390);
        if (document.querySelectorAll) document.querySelectorAll('.cl, .cr').forEach(function (el) { el.style.transform = 'scale(' + k + ')'; });
        GY = Math.min(H * 0.66, H - 236);
        buildBackground();
      }
      resize();
      window.addEventListener('resize', resize);

      seedEmbers();
      initGame();
      requestAnimationFrame(frame);

      function onMessage(e) {
        try { const data = JSON.parse(e.data); if (data.action === 'RESTART') restart(); } catch (err) {}
      }
      window.addEventListener('message', onMessage);
      document.addEventListener('message', onMessage);
    })();
  </script>
</body>
</html>
`;
