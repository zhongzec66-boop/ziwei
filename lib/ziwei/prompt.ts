import type { ZiweiChart, Palace, Star } from './types';
import { BRANCHES, STEMS } from './constants';

const STAR_GROUP_LABEL: Record<Star['type'], string> = {
  major: '主星',
  minor: '辅曜',
  lucky: '吉曜',
  sha: '煞曜',
};
const STAR_GROUP_ORDER: Star['type'][] = ['major', 'minor', 'lucky', 'sha'];

function formatStar(s: Star): string {
  let text = s.name;
  if (s.siHua) text += `（化${s.siHua}）`;
  if (s.brightnessRaw) text += s.brightnessRaw;
  return text;
}

function palaceToText(p: Palace): string {
  const groups: Record<Star['type'], string[]> = { major: [], minor: [], lucky: [], sha: [] };
  for (const s of p.stars) groups[s.type].push(formatStar(s));

  const tags: string[] = [];
  if (p.isMingGong) tags.push('命宫');
  if (p.isShenGong) tags.push('身宫');
  if (p.isCurrentDaXian) tags.push('当前大限');

  const lines: string[] = [
    `【${p.name}·${STEMS[p.stem]}${BRANCHES[p.branch]}】${tags.length ? `（${tags.join('、')}）` : ''}`,
  ];

  if (p.isEmpty) {
    const borrowed = p.borrowedStars?.length ? `主星：${p.borrowedStars.join('、')}` : '';
    lines.push(`  空宫，借对宫${p.borrowedFromName ?? ''}${borrowed}`);
  }
  for (const type of STAR_GROUP_ORDER) {
    if (groups[type].length) lines.push(`  ${STAR_GROUP_LABEL[type]}：${groups[type].join('、')}`);
  }
  if (p.selfSihua?.length) {
    lines.push(`  宫干自化：${p.selfSihua.map(m => `${m.starName}化${m.siHua}`).join('、')}`);
  }
  if (p.daXianAge) lines.push(`  大限年龄：${p.daXianAge[0]}~${p.daXianAge[1]}岁`);
  return lines.join('\n');
}

/** 把结构化命盘序列化成可直接喂给在线模型的文本 */
export function chartToText(chart: ZiweiChart): string {
  const b = chart.birthInfo;
  const l = chart.lunarInfo;
  const lines: string[] = ['## 基本信息'];

  if (b.name) lines.push(`命主：${b.name}`);
  lines.push(`性别：${b.gender === 'male' ? '男' : '女'}${chart.yinYangGender ? `（${chart.yinYangGender}）` : ''}`);
  lines.push(`公历：${b.year}年${b.month}月${b.day}日 ${BRANCHES[b.hour]}时`);
  const loc = [b.province, b.city].filter(Boolean).join('');
  if (loc) lines.push(`出生地：${loc}`);
  lines.push(`农历：${l.lunarYear}年${l.isLeapMonth ? '闰' : ''}${l.lunarMonth}月${l.lunarDay}日`);
  if (l.fourPillars) lines.push(`四柱（节气）：${l.fourPillars.join(' ')}`);
  if (l.fourPillarsLunar) lines.push(`四柱（农历）：${l.fourPillarsLunar.join(' ')}`);
  lines.push(`五行局：${chart.wuxingJuName}`);
  lines.push(`命宫在${BRANCHES[chart.mingGongBranch]}，身宫在${BRANCHES[chart.shenGongBranch]}`);
  if (chart.mingZhu) lines.push(`命主星：${chart.mingZhu}`);
  if (chart.shenZhu) lines.push(`身主星：${chart.shenZhu}`);

  const siHua: string[] = [];
  for (const p of chart.palaces) {
    for (const s of p.stars) {
      if (s.siHua) siHua.push(`${s.name}化${s.siHua}（入${p.name}）`);
    }
  }
  if (siHua.length) lines.push(`本命四化：${siHua.join('，')}`);

  lines.push('', '## 十二宫');
  for (const p of chart.palaces) lines.push(palaceToText(p));

  const dx = chart.daXians[chart.currentDaXianIndex];
  if (dx) {
    lines.push('', '## 当前大限');
    lines.push(`${dx.startAge}~${dx.endAge}岁，行限${dx.palaceName}${dx.stemName ? `（${dx.stemName}干）` : ''}`);
    if (dx.siHua) {
      lines.push(`大限四化：${dx.siHua.lu}化禄、${dx.siHua.quan}化权、${dx.siHua.ke}化科、${dx.siHua.ji}化忌`);
    }
  }
  return lines.join('\n');
}

const SYSTEM_RULES = `你是一位精通倪海厦体系（三合派）紫微斗数的命理师。请严格依据下面给出的命盘数据回答问题：
1. 所有推断必须基于盘内真实存在的宫位、星曜、四化与大限，不得臆造数据中没有的星曜或宫位；
2. 采用倪海厦体系的术语与观点（宫干自化、三方四正、子午流注等），论述要落到具体星曜与宫位；
3. 用简体中文输出，分点分段、结构清晰，先给结论再给依据，最后给可执行建议；
4. 命理分析仅供文化参考，不作绝对断言。`;

/** 单盘解读：组装发给在线模型的完整提示词 */
export function buildInterpretPrompt(chart: ZiweiChart, question: string): string {
  return `${SYSTEM_RULES}

# 命盘数据
${chartToText(chart)}

# 本次问题
${question.trim()}`;
}

/** 合盘解读：组装发给在线模型的完整提示词 */
export function buildHemingPrompt(chartA: ZiweiChart, chartB: ZiweiChart, question?: string): string {
  const nameA = chartA.birthInfo.name || '甲方';
  const nameB = chartB.birthInfo.name || '乙方';
  return `${SYSTEM_RULES}

下面是两个人的紫微命盘，请进行合盘分析：比较双方命宫与夫妻宫的星曜搭配、生年四化与宫干自化的交互、大限走势是否同步，指出互补之处与矛盾风险，并给出具体建议。

# ${nameA}命盘
${chartToText(chartA)}

# ${nameB}命盘
${chartToText(chartB)}

# 本次问题
${question?.trim() || '请对两人进行全面的合盘分析（感情匹配、相处模式、风险节点与具体建议）。'}`;
}
