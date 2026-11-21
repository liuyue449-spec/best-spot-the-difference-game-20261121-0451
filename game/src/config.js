// Spot Hunt — 找不同大作战：关卡配置。
// 每一关是一幅手绘向量场景（见 scenes.js），左右两幅画只有下列几处不同。
// 坐标以单幅画布 600 x 440 为准，x/y 是不同点的中心，r 是点击判定半径。
export const PANEL_W = 600;
export const PANEL_H = 440;

export const LEVELS = [
  {
    id: 'living-room',
    name: '橘猫的午后客厅',
    en: 'Cat Nap Living Room',
    seconds: 150,
    hintCount: 3,
    blurb: '午后的阳光、打盹的橘猫、冒着热气的茶——7 处不同藏在客厅里。',
    diffs: [
      { id: 'tail', x: 520, y: 235, r: 30, label: '猫尾巴的姿势' },
      { id: 'clock', x: 302, y: 72, r: 28, label: '挂钟的时间' },
      { id: 'sun', x: 92, y: 82, r: 32, label: '窗外的太阳' },
      { id: 'cups', x: 378, y: 319, r: 26, label: '茶杯的数量' },
      { id: 'book', x: 512, y: 134, r: 26, label: '书架上书的颜色' },
      { id: 'picture', x: 182, y: 142, r: 30, label: '墙上画里的月亮' },
      { id: 'flowers', x: 66, y: 314, r: 28, label: '花瓶里的花朵' },
    ],
  },
  {
    id: 'ramen-stall',
    name: '深夜拉面摊',
    en: 'Midnight Ramen Stall',
    seconds: 180,
    hintCount: 3,
    blurb: '灯笼、蒸汽、深夜的一碗拉面——8 处不同藏在摊位前后。',
    diffs: [
      { id: 'lantern', x: 96, y: 96, r: 30, label: '灯笼上的字' },
      { id: 'egg', x: 268, y: 300, r: 24, label: '碗里的溏心蛋' },
      { id: 'steam', x: 372, y: 270, r: 28, label: '碗上的蒸汽' },
      { id: 'price', x: 490, y: 140, r: 26, label: '菜单上的价格' },
      { id: 'cat-ear', x: 524, y: 288, r: 26, label: '凳子上猫的耳朵' },
      { id: 'towel', x: 428, y: 244, r: 26, label: '师傅肩上的毛巾' },
      { id: 'bell', x: 168, y: 336, r: 24, label: '自行车的车铃' },
      { id: 'moon', x: 540, y: 52, r: 30, label: '天上的月亮' },
    ],
  },
  {
    id: 'lighthouse',
    name: '灯塔下的小渔村',
    en: 'Lighthouse Village',
    seconds: 210,
    hintCount: 2,
    blurb: '海浪、灯塔、海鸥与螃蟹——10 处不同藏在这座渔村里，最难的一关。',
    diffs: [
      { id: 'beam', x: 76, y: 75, r: 30, label: '灯塔光束的方向' },
      { id: 'gulls', x: 436, y: 48, r: 28, label: '天上的海鸥' },
      { id: 'sail', x: 345, y: 265, r: 30, label: '渔船帆的颜色' },
      { id: 'crab', x: 508, y: 388, r: 26, label: '螃蟹举起的钳子' },
      { id: 'flag', x: 148, y: 28, r: 26, label: '塔顶旗帜的方向' },
      { id: 'window', x: 232, y: 328, r: 24, label: '小屋窗户的灯光' },
      { id: 'cloud', x: 478, y: 119, r: 28, label: '天边的云朵' },
      { id: 'shells', x: 94, y: 396, r: 26, label: '沙滩上的贝壳' },
      { id: 'bucket', x: 268, y: 398, r: 24, label: '沙滩上的木桶' },
      { id: 'wave', x: 420, y: 365, r: 28, label: '海面的白色浪花' },
    ],
  },
];

// 计分：找到一处 +100；连击（5 秒内连续找到）每次 +25 叠加；
// 点错一次 -5 秒并打断连击；提示不扣分，但用完即止。
export const SCORE_FIND = 100;
export const SCORE_COMBO_STEP = 25;
export const COMBO_WINDOW_MS = 5000;
export const WRONG_PENALTY_SECONDS = 5;
export const HINT_SECONDS = 2.5;
