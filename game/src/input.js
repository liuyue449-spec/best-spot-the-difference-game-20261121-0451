// Spot Hunt：输入处理——点中不同处算找到，点错扣时间；键盘辅助操作。
import { toCanvasCoords } from './render.js';

// 在某一块画布上点了一下，返回命中结果：
// { hit: diff } 找到一处；{ miss: true } 点错；{ done: true } 点在已找到处。
export function handlePanelClick(state, canvas, clientX, clientY) {
  const { x, y } = toCanvasCoords(canvas, clientX, clientY);
  const level = state.level;
  for (const d of level.diffs) {
    if (state.found.some((f) => f.id === d.id)) continue;
    const dx = x - d.x, dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return { hit: d, x, y };
  }
  for (const d of state.found) {
    const dx = x - d.x, dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return { done: true, x, y };
  }
  return { miss: true, x, y };
}

// 键盘：H 提示，R 重开本关，Esc 回开始画面，1/2/3 选关（仅开始画面）。
export function bindKeyboard(state, actions) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') { if (state.phase === 'playing') actions.useHint(); }
    else if (e.key === 'r' || e.key === 'R') { if (state.phase === 'playing') actions.restartLevel(); }
    else if (e.key === 'Escape') { actions.showStart(); }
    else if (state.phase === 'start' && ['1', '2', '3'].includes(e.key)) {
      actions.startLevel(Number(e.key) - 1);
    }
  });
}
