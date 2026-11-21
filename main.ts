// Spot Hunt — 找不同大作战的交卷程序（Node 22，标准库 only）。
// 把仓库里的 game/（静态网页游戏）和 screenshots/（实机截图）原样抄到
// /output，再用 kit 自带的 vendor/makefun-game.ts 写出 /output/dossier.json
//（裁判读的那份摘要）。在 grader 之外，MAKEFUN_OUTPUT_DIR 代替 /output：
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// 两次运行必须写出完全相同的字节——这是 grader 的要求，也是本地自检项。
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// 先清掉旧输出，保证两次运行之间没有残留文件影响字节一致性。
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// 门禁上限照 RULES.txt 的 gate 行：screenshots 最多 4 张、每张 ≤256 KiB；
// game/ 最多 993 个文件目录、共 ≤48 MiB、路径 ≤1000 字节；
// dossier 正文上限 160 KiB。超了 buildDossier 会直接报错。
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
