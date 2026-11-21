// Spot Hunt：游戏主循环与状态机。
// 阶段：start（开始画面）→ playing（找不同）→ level-clear（过关结算）
//      → game-over（时间到）→ victory（通关）。?shot= 参数只用于 maker 截图，
// 它走同一套状态机、画同一套代码，不改任何玩法。
import { LEVELS, PANEL_W, PANEL_H, SCORE_FIND, SCORE_COMBO_STEP, COMBO_WINDOW_MS, WRONG_PENALTY_SECONDS, HINT_SECONDS } from './config.js';
import { paintScene } from './scenes.js';
import { drawPanel, drawWrongMark, updateHud } from './render.js';
import { handlePanelClick, bindKeyboard } from './input.js';
import { sfx } from './audio.js';

const $ = (id) => document.getElementById(id);
const els = {
  canvasA: $('panel-a'), canvasB: $('panel-b'),
  timerText: $('timer-text'), timerFill: $('timer-fill'),
  countText: $('count-text'), countTextEn: $('count-en'),
  scoreText: $('score-text'), comboText: $('combo-text'),
  hintBtn: $('hint-btn'), restartBtn: $('restart-btn'), homeBtn: $('home-btn'),
  levelName: $('level-name'), toast: $('toast'),
  startScreen: $('start-screen'), clearModal: $('clear-modal'), overModal: $('over-modal'),
  winModal: $('win-modal'),
};

const state = {
  phase: 'start',
  levelIndex: 0,
  get level() { return LEVELS[this.levelIndex]; },
  found: [],           // 已找到的 diff 对象
  hintsLeft: 3,
  hint: null,          // 当前提示的 diff（带过期时间）
  timeLeftMs: 0,
  lastTick: 0,
  score: 0,
  levelScore: 0,
  combo: 0,
  lastFindAt: 0,
  totalScore: 0,
  bestCombo: 0,
  raf: 0,
};

function showToast(msg, kind = '') {
  els.toast.textContent = msg;
  els.toast.className = 'toast show ' + kind;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { els.toast.className = 'toast'; }, 1800);
}

function redraw() {
  drawPanel(els.canvasA, state.levelIndex, 0, state.found, state.hint);
  drawPanel(els.canvasB, state.levelIndex, 1, state.found, state.hint);
  updateHud(els, state);
}

function startLevel(i) {
  state.levelIndex = i;
  state.found = [];
  state.hintsLeft = state.level.hintCount;
  state.hint = null;
  state.timeLeftMs = state.level.seconds * 1000;
  state.combo = 0;
  state.levelScore = 0;
  state.phase = 'playing';
  state.lastTick = performance.now();
  els.startScreen.classList.add('hidden');
  els.clearModal.classList.add('hidden');
  els.overModal.classList.add('hidden');
  els.winModal.classList.add('hidden');
  sfx.click();
  redraw();
  showToast(`${state.level.name}：找出 ${state.level.diffs.length} 处不同！`);
  cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(tick);
}

function tick(now) {
  if (state.phase !== 'playing') return;
  const dt = now - state.lastTick;
  state.lastTick = now;
  state.timeLeftMs -= dt;
  if (state.hint && now > state.hint.until) { state.hint = null; redraw(); }
  if (state.timeLeftMs <= 0) { state.timeLeftMs = 0; return gameOver(); }
  updateHud(els, state);
  state.raf = requestAnimationFrame(tick);
}

function onPanelClick(canvas, e) {
  if (state.phase !== 'playing') return;
  const res = handlePanelClick(state, canvas, e.clientX, e.clientY);
  if (res.hit) {
    const now = performance.now();
    state.combo = now - state.lastFindAt < COMBO_WINDOW_MS ? state.combo + 1 : 1;
    state.lastFindAt = now;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const gain = SCORE_FIND + (state.combo - 1) * SCORE_COMBO_STEP;
    state.levelScore += gain; state.score += gain; state.totalScore += gain;
    state.found.push(res.hit);
    state.hint = null;
    if (state.combo >= 2) sfx.combo(state.combo); else sfx.find();
    showToast(`找到了：${res.hit.label}！+${gain}${state.combo >= 2 ? `（连击 x${state.combo}）` : ''}`, 'good');
    redraw();
    if (state.found.length === state.level.diffs.length) levelClear();
  } else if (res.miss) {
    state.timeLeftMs = Math.max(0, state.timeLeftMs - WRONG_PENALTY_SECONDS * 1000);
    state.combo = 0;
    sfx.miss();
    showToast(`这里没有不同，-5 秒`, 'bad');
    drawWrongMark(els.canvasA, state.levelIndex, 0, state.found, res.x, res.y);
    drawWrongMark(els.canvasB, state.levelIndex, 1, state.found, res.x, res.y);
    setTimeout(() => { if (state.phase === 'playing') redraw(); }, 600);
    updateHud(els, state);
  }
  // 点在已找到的圆圈里：什么都不做。
}

function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const rest = state.level.diffs.filter((d) => !state.found.some((f) => f.id === d.id));
  if (!rest.length) return;
  const d = rest[Math.floor(Math.random() * rest.length)];
  state.hintsLeft -= 1;
  state.hint = { ...d, until: performance.now() + HINT_SECONDS * 1000 };
  sfx.hint();
  showToast(`提示：看看「${d.label}」附近`);
  redraw();
  setTimeout(() => { if (state.hint && performance.now() > state.hint.until) { state.hint = null; redraw(); } }, HINT_SECONDS * 1000 + 50);
}

function starsFor(msLeft, totalMs) {
  const ratio = msLeft / totalMs;
  return ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
}

function levelClear() {
  state.phase = 'level-clear';
  cancelAnimationFrame(state.raf);
  const timeBonus = Math.ceil(state.timeLeftMs / 1000) * 2;
  state.score += timeBonus; state.totalScore += timeBonus;
  const stars = starsFor(state.timeLeftMs, state.level.seconds * 1000);
  sfx.win();
  $('clear-title').textContent = `第 ${state.levelIndex + 1} 关完成！`;
  $('clear-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  $('clear-detail').textContent = `本关得分 ${state.levelScore} + 时间奖励 ${timeBonus} = ${state.levelScore + timeBonus} · 最高连击 x${state.bestCombo}`;
  $('next-btn').textContent = state.levelIndex + 1 < LEVELS.length ? '下一关 →' : '查看总成绩 →';
  els.clearModal.classList.remove('hidden');
  updateHud(els, state);
}

function gameOver() {
  state.phase = 'game-over';
  cancelAnimationFrame(state.raf);
  sfx.lose();
  const rest = state.level.diffs.filter((d) => !state.found.some((f) => f.id === d.id));
  $('over-detail').textContent = `时间到！还差 ${rest.length} 处没找到：${rest.map((d) => d.label).join('、')}`;
  els.overModal.classList.remove('hidden');
  // 把没找到的用虚线圈标出来，复盘用。
  for (const d of rest) {
    for (const [canvas, v] of [[els.canvasA, 0], [els.canvasB, 1]]) {
      const ctx = canvas.getContext('2d');
      ctx.save(); ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.strokeStyle = '#e9c46a'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
    }
  }
}

function showVictory() {
  state.phase = 'victory';
  els.clearModal.classList.add('hidden');
  $('win-score').textContent = `总分 ${state.totalScore} · 三关全通！`;
  $('win-detail').textContent = `最高连击 x${state.bestCombo} · 找齐了全部 ${LEVELS.reduce((n, l) => n + l.diffs.length, 0)} 处不同`;
  els.winModal.classList.remove('hidden');
}

function showStart() {
  state.phase = 'start';
  cancelAnimationFrame(state.raf);
  els.clearModal.classList.add('hidden');
  els.overModal.classList.add('hidden');
  els.winModal.classList.add('hidden');
  els.startScreen.classList.remove('hidden');
  drawThumbnails();
}

function drawThumbnails() {
  document.querySelectorAll('.level-card canvas').forEach((c) => {
    const i = Number(c.dataset.level);
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.scale(c.width / PANEL_W, c.height / PANEL_H);
    paintScene(ctx, i, 0);
    ctx.restore();
  });
}

function nextLevel() {
  if (state.levelIndex + 1 < LEVELS.length) startLevel(state.levelIndex + 1);
  else showVictory();
}

// ---- 截图模式：走同一套状态机，只预置状态（maker 截图用） ----
function applyShotMode() {
  const shot = new URLSearchParams(location.search).get('shot');
  if (!shot || shot === 'start') { showStart(); return; }
  if (shot === 'play') {
    startLevel(0);
    state.found = LEVELS[0].diffs.slice(0, 3);
    state.score = 320; state.totalScore = 320; state.levelScore = 320;
    state.timeLeftMs = 120 * 1000;
    redraw();
    return;
  }
  if (shot === 'play2') {
    startLevel(1);
    state.found = [LEVELS[1].diffs[0], LEVELS[1].diffs[7]];
    state.score = 215; state.totalScore = 215; state.levelScore = 215;
    state.timeLeftMs = 150 * 1000;
    state.hintsLeft = 2;
    state.hint = { ...LEVELS[1].diffs[1], until: performance.now() + 60000 };
    redraw();
    return;
  }
  if (shot === 'win') {
    startLevel(0);
    state.found = [...LEVELS[0].diffs];
    state.score = 700; state.totalScore = 700; state.levelScore = 700;
    state.timeLeftMs = 96 * 1000;
    state.bestCombo = 3;
    redraw();
    levelClear();
    return;
  }
  showStart();
}

// ---- 接线 ----
els.canvasA.addEventListener('click', (e) => onPanelClick(els.canvasA, e));
els.canvasB.addEventListener('click', (e) => onPanelClick(els.canvasB, e));
els.hintBtn.addEventListener('click', useHint);
els.restartBtn.addEventListener('click', () => startLevel(state.levelIndex));
els.homeBtn.addEventListener('click', showStart);
$('next-btn').addEventListener('click', nextLevel);
$('retry-btn').addEventListener('click', () => startLevel(state.levelIndex));
$('over-home-btn').addEventListener('click', showStart);
$('again-btn').addEventListener('click', () => { state.score = 0; state.totalScore = 0; state.bestCombo = 0; startLevel(0); });
$('win-home-btn').addEventListener('click', showStart);
document.querySelectorAll('.level-card').forEach((card) => {
  card.addEventListener('click', () => startLevel(Number(card.dataset.level)));
});
bindKeyboard(state, { useHint, restartLevel: () => startLevel(state.levelIndex), showStart, startLevel });

applyShotMode();
