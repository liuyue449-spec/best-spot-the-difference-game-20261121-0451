// Spot Hunt：全部音效都用 WebAudio 现场合成，不带任何音频文件。
// 找到是上扬的双音，点错是低沉的一声，过关是一段小琶音。
let audioCtx = null;

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type = 'sine', vol = 0.12) {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startAt + dur);
  osc.connect(gain); gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt); osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export const sfx = {
  find() { tone(660, 0, 0.18); tone(990, 0.09, 0.25); },
  combo(n) { tone(660, 0, 0.15); tone(880, 0.07, 0.15); tone(660 + n * 60, 0.14, 0.22); },
  miss() { tone(160, 0, 0.25, 'triangle', 0.14); },
  hint() { tone(520, 0, 0.12); tone(780, 0.1, 0.18); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3)); },
  lose() { [392, 330, 262].forEach((f, i) => tone(f, i * 0.15, 0.3, 'triangle', 0.1)); },
  click() { tone(440, 0, 0.06, 'sine', 0.06); },
};
