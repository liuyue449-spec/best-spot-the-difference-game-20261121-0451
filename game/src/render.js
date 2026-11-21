// Spot Hunt：把场景画到左右两块画布上，再叠加找不同游戏的标记与提示。
import { PANEL_W, PANEL_H } from './config.js';
import { paintScene } from './scenes.js';

// 重画一幅画：底稿 + 已找到的圆圈标记 +（可选）提示圈。
export function drawPanel(canvas, levelIndex, variant, found, hint) {
  const ctx = canvas.getContext('2d');
  paintScene(ctx, levelIndex, variant);
  for (const d of found) {
    ring(ctx, d.x, d.y, d.r, '#2a9d8f', 5);
    ring(ctx, d.x, d.y, d.r - 8, '#2a9d8f', 2);
    check(ctx, d.x, d.y);
  }
  if (hint) {
    const pulse = 1 + 0.12 * Math.sin(Date.now() / 180);
    ring(ctx, hint.x, hint.y, hint.r * pulse, '#e9c46a', 4, [8, 6]);
  }
}

function ring(ctx, x, y, r, color, width, dash) {
  ctx.save();
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.arc(x, y, Math.max(r, 4), 0, Math.PI * 2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  ctx.restore();
}

function check(ctx, x, y) {
  ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x - 2, y + 8); ctx.lineTo(x + 11, y - 9);
  ctx.strokeStyle = '#2a9d8f'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}

// 错点时在点击处画一个短暂的红叉，由主循环在 600ms 后重画清除。
export function drawWrongMark(canvas, levelIndex, variant, found, x, y) {
  const ctx = canvas.getContext('2d');
  paintScene(ctx, levelIndex, variant);
  for (const d of found) { ring(ctx, d.x, d.y, d.r, '#2a9d8f', 5); check(ctx, d.x, d.y); }
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10); ctx.lineTo(x - 10, y + 10);
  ctx.strokeStyle = '#e63946'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
}

// HUD：剩余时间条、计数、分数、连击、提示余量。
export function updateHud(el, state) {
  const level = state.level;
  el.timerText.textContent = fmtTime(state.timeLeftMs);
  const pct = Math.max(0, (state.timeLeftMs / (level.seconds * 1000)) * 100);
  el.timerFill.style.width = pct + '%';
  el.timerFill.classList.toggle('low', state.timeLeftMs < 30000);
  el.countText.textContent = `已找到 ${state.found.length} / ${level.diffs.length} · 还剩 ${level.diffs.length - state.found.length} 处`;
  el.countTextEn.textContent = `${state.found.length}/${level.diffs.length} found`;
  el.scoreText.textContent = String(state.score);
  el.comboText.textContent = state.combo >= 2 ? `连击 x${state.combo}` : '';
  el.hintBtn.textContent = `提示 (${state.hintsLeft})`;
  el.hintBtn.disabled = state.hintsLeft <= 0 || state.phase !== 'playing';
  el.levelName.textContent = `第 ${state.levelIndex + 1} 关 · ${level.name}`;
}

export function fmtTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// 画布坐标换算：点击位置（CSS 像素）→ 画布逻辑坐标。
export function toCanvasCoords(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * PANEL_W,
    y: ((clientY - rect.top) / rect.height) * PANEL_H,
  };
}
