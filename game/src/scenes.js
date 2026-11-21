// Spot Hunt：三幅原创场景的向量画法。
// paintScene(ctx, levelIndex, variant)：variant 0 画左图 A，1 画右图 B。
// 两幅画共用同一套底稿，只在 config.js 登记的几处不同点上分叉，
// 所以左右画面除不同处外像素级一致——这正是找不同游戏的底线。
import { PANEL_W, PANEL_H } from './config.js';

function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
function rr(ctx, x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}
function poly(ctx, points, fill) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.stroke();
}
function text(ctx, s, x, y, size, color, align = 'center', weight = '700') {
  ctx.font = `${weight} ${size}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// ---------------------------------------------------------------- 客厅
function paintLivingRoom(ctx, v) {
  // 墙与地板
  ctx.fillStyle = '#f6e3c8'; ctx.fillRect(0, 0, PANEL_W, 300);
  ctx.fillStyle = '#c98f5e'; ctx.fillRect(0, 300, PANEL_W, 140);
  line(ctx, 0, 300, PANEL_W, 300, '#a9713f', 3);
  // 窗户：左上，窗帘 + 窗外
  rr(ctx, 48, 40, 120, 130, 8, '#fff8ea');
  ctx.fillStyle = '#bfe3f2'; ctx.fillRect(56, 48, 104, 114);
  line(ctx, 108, 48, 108, 162, '#fff8ea', 6);
  line(ctx, 56, 105, 160, 105, '#fff8ea', 6);
  if (v === 0) { // A：太阳
    circle(ctx, 92, 82, 20, '#ffb703');
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      line(ctx, 92 + Math.cos(a) * 26, 82 + Math.sin(a) * 26, 92 + Math.cos(a) * 34, 82 + Math.sin(a) * 34, '#ffb703', 3);
    }
  } else { // B：云
    ellipse(ctx, 82, 84, 22, 12, '#ffffff');
    ellipse(ctx, 100, 78, 18, 13, '#ffffff');
    ellipse(ctx, 98, 88, 20, 10, '#ffffff');
  }
  rr(ctx, 38, 32, 16, 146, 6, '#e2725b'); // 左窗帘
  rr(ctx, 162, 32, 16, 146, 6, '#e2725b'); // 右窗帘
  // 墙上的画：月亮 / 小鸟
  rr(ctx, 150, 108, 64, 68, 6, '#7a5c3e');
  ctx.fillStyle = '#1d3557'; ctx.fillRect(156, 114, 52, 56);
  if (v === 0) {
    ctx.beginPath(); ctx.arc(182, 142, 12, 0, Math.PI * 2); ctx.fillStyle = '#f4d35e'; ctx.fill();
    ctx.beginPath(); ctx.arc(176, 138, 11, 0, Math.PI * 2); ctx.fillStyle = '#1d3557'; ctx.fill();
  } else {
    ellipse(ctx, 182, 138, 10, 6, '#ffffff'); // 鸟身
    poly(ctx, [[192, 136], [202, 132], [192, 141]], '#ffffff'); // 鸟喙
    circle(ctx, 176, 134, 2, '#1d3557');
  }
  // 挂钟：3:00 / 4:30
  circle(ctx, 302, 72, 30, '#fffdf6');
  line(ctx, 302, 72, 302, 72, '#333', 1);
  ctx.beginPath(); ctx.arc(302, 72, 30, 0, Math.PI * 2); ctx.strokeStyle = '#7a5c3e'; ctx.lineWidth = 4; ctx.stroke();
  if (v === 0) { line(ctx, 302, 72, 302, 52, '#333', 4); line(ctx, 302, 72, 320, 72, '#333', 4); }
  else { line(ctx, 302, 72, 314, 88, '#333', 4); line(ctx, 302, 72, 302, 90, '#333', 4); }
  circle(ctx, 302, 72, 3, '#e2725b');
  // 书架：右上
  rr(ctx, 480, 110, 96, 120, 6, '#8b5e3c');
  ctx.fillStyle = '#6f4526'; ctx.fillRect(486, 150, 84, 6);
  ctx.fillStyle = '#6f4526'; ctx.fillRect(486, 190, 84, 6);
  const spines = ['#e2725b', '#457b9d', '#2a9d8f', '#e9c46a', '#e76f51'];
  spines.forEach((c, i) => rr(ctx, 490 + i * 16, 118, 12, 32, 2, v === 1 && i === 1 ? '#3d5a80' : c));
  rr(ctx, 492, 158, 12, 32, 2, '#e9c46a'); rr(ctx, 508, 158, 12, 32, 2, '#2a9d8f');
  rr(ctx, 524, 158, 12, 32, 2, '#e76f51'); rr(ctx, 540, 158, 12, 32, 2, '#457b9d');
  rr(ctx, 494, 198, 40, 28, 3, '#e2725b'); rr(ctx, 540, 198, 24, 28, 3, '#2a9d8f');
  // 沙发 + 橘猫
  rr(ctx, 330, 260, 220, 80, 18, '#e2725b');
  rr(ctx, 330, 240, 220, 44, 18, '#ef8354');
  rr(ctx, 330, 260, 18, 80, 9, '#c95f47'); rr(ctx, 532, 260, 18, 80, 9, '#c95f47');
  ellipse(ctx, 440, 252, 62, 26, '#f4a261'); // 猫身
  circle(ctx, 388, 238, 22, '#f4a261'); // 猫头
  poly(ctx, [[372, 224], [378, 206], [386, 222]], '#f4a261');
  poly(ctx, [[396, 222], [404, 206], [410, 224]], '#f4a261');
  line(ctx, 380, 238, 384, 238, '#7a3b1e', 2); line(ctx, 392, 238, 396, 238, '#7a3b1e', 2); // 闭眼
  poly(ctx, [[384, 246], [392, 246], [388, 250]], '#e2725b'); // 鼻子
  if (v === 0) { // A：尾巴翘起
    ctx.beginPath(); ctx.moveTo(498, 258); ctx.quadraticCurveTo(522, 238, 512, 214);
    ctx.strokeStyle = '#f4a261'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
  } else { // B：尾巴平放
    ctx.beginPath(); ctx.moveTo(498, 258); ctx.quadraticCurveTo(528, 262, 540, 252);
    ctx.strokeStyle = '#f4a261'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
  }
  // 茶几 + 茶杯：2 只 / 1 只
  rr(ctx, 280, 330, 130, 14, 6, '#8b5e3c');
  line(ctx, 292, 344, 292, 372, '#6f4526', 6); line(ctx, 398, 344, 398, 372, '#6f4526', 6);
  ellipse(ctx, 322, 322, 16, 10, '#457b9d'); // 茶壶
  rr(ctx, 318, 306, 8, 10, 3, '#457b9d');
  if (v === 0) {
    rr(ctx, 352, 312, 20, 14, 3, '#e9c46a'); rr(ctx, 384, 312, 20, 14, 3, '#e76f51');
  } else {
    rr(ctx, 368, 312, 20, 14, 3, '#e9c46a');
  }
  // 地毯
  ellipse(ctx, 300, 400, 150, 22, '#e9c46a');
  ellipse(ctx, 300, 400, 110, 15, '#e76f51');
  // 绿植：3 朵花 / 2 朵
  rr(ctx, 48, 352, 34, 30, 5, '#e2725b');
  line(ctx, 65, 352, 65, 316, '#2a9d8f', 4);
  line(ctx, 65, 340, 48, 326, '#2a9d8f', 4); line(ctx, 65, 336, 82, 322, '#2a9d8f', 4);
  circle(ctx, 58, 312, 7, '#ff8fa3'); circle(ctx, 74, 306, 7, '#ff8fa3');
  if (v === 0) circle(ctx, 66, 322, 7, '#ffd166');
  ellipse(ctx, 48, 344, 10, 5, '#2a9d8f'); ellipse(ctx, 84, 340, 10, 5, '#2a9d8f');
}

// ---------------------------------------------------------------- 拉面摊
function paintRamenStall(ctx, v) {
  // 夜空与地面
  ctx.fillStyle = '#1d3557'; ctx.fillRect(0, 0, PANEL_W, 260);
  ctx.fillStyle = '#2a2a3a'; ctx.fillRect(0, 340, PANEL_W, 100);
  ctx.fillStyle = '#3a3a4d'; ctx.fillRect(0, 340, PANEL_W, 8);
  for (const [sx, sy] of [[40, 30], [200, 60], [300, 24], [470, 80], [560, 140], [120, 120], [380, 150]]) {
    circle(ctx, sx, sy, 2, '#ffffff');
  }
  if (v === 0) { circle(ctx, 540, 52, 22, '#f4d35e'); } // A：满月
  else { // B：弯月
    circle(ctx, 540, 52, 22, '#f4d35e');
    circle(ctx, 550, 46, 20, '#1d3557');
  }
  // 远处楼影
  rr(ctx, 30, 180, 60, 80, 4, '#16233d'); rr(ctx, 500, 160, 70, 100, 4, '#16233d');
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#ffd166'; ctx.fillRect(42 + i * 14, 196 + (i % 2) * 22, 8, 10); }
  // 灯笼：字不同
  line(ctx, 96, 40, 96, 66, '#333', 3);
  ellipse(ctx, 96, 96, 26, 30, '#e63946');
  line(ctx, 96, 66, 96, 126, '#ffd166', 4);
  text(ctx, v === 0 ? '拉' : '麺', 96, 97, 30, '#fff8ea');
  // 摊位顶棚
  poly(ctx, [[60, 150], [540, 150], [560, 190], [40, 190]], '#e63946');
  for (let x = 80; x < 540; x += 40) line(ctx, x, 150, x, 190, '#fff8ea', 2);
  line(ctx, 60, 150, 60, 340, '#8b5e3c', 8); line(ctx, 540, 150, 540, 340, '#8b5e3c', 8);
  // 菜单板：价格不同
  rr(ctx, 448, 100, 84, 56, 6, '#fff8ea');
  text(ctx, '拉面', 490, 116, 16, '#1d3557');
  text(ctx, v === 0 ? '¥12' : '¥15', 490, 140, 18, '#e63946');
  // 师傅
  circle(ctx, 428, 218, 20, '#f2c29b'); // 头
  rr(ctx, 404, 238, 48, 70, 10, '#fff8ea'); // 身
  rr(ctx, 404, 238, 48, 12, 6, v === 0 ? '#fff8ea' : '#457b9d'); // 毛巾：白 / 蓝
  line(ctx, 414, 214, 418, 206, '#333', 3); // 头巾带
  circle(ctx, 420, 218, 2, '#333'); circle(ctx, 436, 218, 2, '#333');
  // 柜台 + 两碗拉面
  rr(ctx, 180, 300, 260, 44, 8, '#8b5e3c');
  rr(ctx, 180, 300, 260, 10, 5, '#a9713f');
  ellipse(ctx, 268, 306, 34, 14, '#e63946'); // 碗 1
  ellipse(ctx, 268, 300, 28, 9, '#f4d35e'); // 面
  if (v === 0) circle(ctx, 268, 300, 6, '#fff8ea'); // A：1 个蛋
  else { circle(ctx, 260, 300, 6, '#fff8ea'); circle(ctx, 276, 300, 6, '#fff8ea'); } // B：2 个蛋
  ellipse(ctx, 372, 306, 34, 14, '#457b9d'); // 碗 2
  ellipse(ctx, 372, 300, 28, 9, '#f4d35e');
  if (v === 0) { // A：3 道蒸汽
    for (const sx of [360, 372, 384]) {
      ctx.beginPath(); ctx.moveTo(sx, 292); ctx.quadraticCurveTo(sx + 6, 272, sx, 252);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.stroke();
    }
  } else { // B：2 道蒸汽
    for (const sx of [364, 380]) {
      ctx.beginPath(); ctx.moveTo(sx, 292); ctx.quadraticCurveTo(sx + 6, 272, sx, 252);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.stroke();
    }
  }
  // 筷子
  line(ctx, 240, 292, 262, 306, '#e9c46a', 3); line(ctx, 244, 288, 266, 302, '#e9c46a', 3);
  // 凳子 + 猫：耳朵不同
  rr(ctx, 500, 330, 56, 12, 4, '#6f4526'); line(ctx, 508, 342, 508, 372, '#6f4526', 5); line(ctx, 548, 342, 548, 372, '#6f4526', 5);
  ellipse(ctx, 528, 316, 22, 12, '#8d99ae');
  circle(ctx, 512, 302, 12, '#8d99ae');
  poly(ctx, [[504, 294], [508, 282], [514, 293]], '#8d99ae');
  if (v === 0) poly(ctx, [[520, 293], [524, 282], [528, 294]], '#8d99ae');
  else poly(ctx, [[520, 296], [526, 290], [530, 296]], '#8d99ae'); // B：一只耳朵折下
  line(ctx, 506, 302, 509, 302, '#333', 2); line(ctx, 518, 302, 521, 302, '#333', 2);
  // 自行车：车铃有无
  circle(ctx, 120, 380, 22, '#333'); circle(ctx, 200, 380, 22, '#333');
  ctx.beginPath(); ctx.arc(120, 380, 22, 0, Math.PI * 2); ctx.strokeStyle = '#8d99ae'; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.arc(200, 380, 22, 0, Math.PI * 2); ctx.strokeStyle = '#8d99ae'; ctx.lineWidth = 4; ctx.stroke();
  line(ctx, 120, 380, 160, 340, '#8d99ae', 4); line(ctx, 200, 380, 160, 340, '#8d99ae', 4);
  line(ctx, 160, 340, 186, 340, '#8d99ae', 4);
  if (v === 0) circle(ctx, 168, 336, 6, '#ffd166'); // A：车铃
  // 彩灯串
  for (let x = 70; x <= 530; x += 46) {
    circle(ctx, x, 196 + Math.sin(x / 60) * 6, 5, ['#ff8fa3', '#ffd166', '#90be6d', '#4cc9f0'][Math.floor(x / 46) % 4]);
  }
}

// ---------------------------------------------------------------- 灯塔渔村
function paintLighthouse(ctx, v) {
  // 天空与海
  ctx.fillStyle = '#a8dadc'; ctx.fillRect(0, 0, PANEL_W, 240);
  ctx.fillStyle = '#457b9d'; ctx.fillRect(0, 240, PANEL_W, 200);
  ctx.fillStyle = '#1d3557'; ctx.fillRect(0, 240, PANEL_W, 6);
  // 云：1 朵 / 2 朵
  ellipse(ctx, 520, 108, 30, 12, '#ffffff'); ellipse(ctx, 540, 100, 22, 12, '#ffffff');
  if (v === 1) { ellipse(ctx, 470, 122, 20, 9, '#ffffff'); ellipse(ctx, 486, 116, 15, 9, '#ffffff'); }
  // 海鸥：3 只 / 2 只
  const gulls = v === 0 ? [[400, 60], [436, 48], [468, 66]] : [[400, 60], [468, 66]];
  for (const [gx, gy] of gulls) {
    ctx.beginPath(); ctx.moveTo(gx - 10, gy); ctx.quadraticCurveTo(gx - 3, gy - 8, gx, gy);
    ctx.quadraticCurveTo(gx + 3, gy - 8, gx + 10, gy);
    ctx.strokeStyle = '#1d3557'; ctx.lineWidth = 3; ctx.stroke();
  }
  // 灯塔
  rr(ctx, 120, 90, 56, 150, 6, '#fff8ea');
  ctx.fillStyle = '#e63946'; ctx.fillRect(120, 120, 56, 18); ctx.fillRect(120, 160, 56, 18); ctx.fillRect(120, 200, 56, 18);
  rr(ctx, 132, 62, 32, 28, 6, '#1d3557');
  ctx.fillStyle = '#ffd166'; ctx.fillRect(138, 68, 20, 16);
  poly(ctx, [[126, 62], [164, 62], [148, 44]], '#e63946');
  // 塔顶旗帜：方向不同
  line(ctx, 148, 44, 148, 22, '#333', 3);
  if (v === 0) poly(ctx, [[148, 22], [176, 28], [148, 34]], '#e63946');
  else poly(ctx, [[148, 22], [120, 28], [148, 34]], '#e63946');
  // 光束：方向不同
  ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffd166';
  if (v === 0) poly(ctx, [[132, 76], [20, 40], [20, 110]]);
  else poly(ctx, [[164, 76], [300, 40], [300, 110]]);
  ctx.restore();
  // 小屋：窗户灯光不同
  rr(ctx, 196, 300, 84, 60, 6, '#e9c46a');
  poly(ctx, [[190, 302], [238, 272], [286, 302]], '#e63946');
  ctx.fillStyle = v === 0 ? '#ffd166' : '#5a4a3a'; ctx.fillRect(222, 318, 20, 20); // 窗
  line(ctx, 232, 318, 232, 338, '#8b5e3c', 2); line(ctx, 222, 328, 242, 328, '#8b5e3c', 2);
  rr(ctx, 252, 322, 16, 38, 3, '#8b5e3c');
  // 沙滩
  ctx.fillStyle = '#e9c46a'; ctx.fillRect(0, 360, PANEL_W, 80);
  // 渔船：帆色不同
  ellipse(ctx, 332, 300, 44, 10, '#8b5e3c');
  line(ctx, 332, 300, 332, 226, '#6f4526', 4);
  if (v === 0) poly(ctx, [[332, 228], [332, 292], [368, 292]], '#fff8ea');
  else poly(ctx, [[332, 228], [332, 292], [368, 292]], '#e63946');
  if (v === 1) { line(ctx, 340, 244, 360, 244, '#fff8ea', 3); line(ctx, 340, 262, 360, 262, '#fff8ea', 3); }
  // 海浪：浪花有无
  for (const [wx, wy] of [[60, 280], [180, 300], [300, 330], [500, 290], [420, 372]]) {
    ctx.beginPath(); ctx.moveTo(wx - 26, wy); ctx.quadraticCurveTo(wx, wy - 10, wx + 26, wy);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; ctx.stroke();
  }
  if (v === 0) { // A：额外一朵浪花
    ctx.beginPath(); ctx.moveTo(394, 372); ctx.quadraticCurveTo(420, 358, 446, 372);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.stroke();
  }
  // 螃蟹：钳子一上一下 / 两只都上
  ellipse(ctx, 486, 392, 18, 12, '#e76f51');
  circle(ctx, 478, 384, 3, '#333'); circle(ctx, 494, 384, 3, '#333');
  line(ctx, 472, 388, 458, 376, '#e76f51', 4); line(ctx, 458, 376, 452, 382, '#e76f51', 4);
  if (v === 0) { line(ctx, 500, 388, 514, 376, '#e76f51', 4); line(ctx, 514, 376, 520, 382, '#e76f51', 4); }
  else { line(ctx, 500, 388, 514, 398, '#e76f51', 4); line(ctx, 514, 398, 520, 392, '#e76f51', 4); }
  // 贝壳：3 个 / 2 个
  ellipse(ctx, 84, 402, 10, 7, '#ff8fa3'); ellipse(ctx, 104, 406, 10, 7, '#ffd166');
  if (v === 0) ellipse(ctx, 94, 394, 9, 6, '#ffffff');
  // 木桶：有 / 无
  if (v === 0) {
    rr(ctx, 256, 384, 24, 26, 4, '#8b5e3c');
    line(ctx, 256, 392, 280, 392, '#ffd166', 3); line(ctx, 256, 402, 280, 402, '#ffd166', 3);
  }
  // 岩石与海草
  ellipse(ctx, 560, 400, 34, 14, '#8d99ae'); ellipse(ctx, 30, 420, 26, 12, '#8d99ae');
  line(ctx, 550, 396, 544, 372, '#2a9d8f', 4); line(ctx, 552, 396, 560, 370, '#2a9d8f', 4);
}

export function paintScene(ctx, levelIndex, variant) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  if (levelIndex === 0) paintLivingRoom(ctx, variant);
  else if (levelIndex === 1) paintRamenStall(ctx, variant);
  else paintLighthouse(ctx, variant);
}
