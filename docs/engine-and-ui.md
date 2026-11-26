# 紫微排盘框架与数据流

项目使用 Next.js App Router、React、TypeScript、Tailwind CSS 和 Framer Motion。GitHub Pages 工作流用 `STATIC_EXPORT=1 BASE_PATH=/ziwei` 生成静态站点。

| 层级 | 入口 | 职责 |
| --- | --- | --- |
| 页面与交互 | `app/page.tsx`、`app/chart/page.tsx`、`app/heming` | 首页、排盘页和工作台 |
| 输入 | `components/BirthForm.tsx`、`lib/ziwei/share.ts` | 校验公历输入，按出生地经度修正时辰，处理晚子时换日，输出 `BirthInfo` |
| 排盘 | `lib/ziwei/algorithm.ts` | `generateChart(info)` 用 lunar-javascript 处理历法，再用 iztro 安星，并套用项目的门派配置和星曜亮度规则 |
| 规则与数据 | `lib/ziwei/school-config.ts`、`school-data.ts`、`school-tables.generated.ts`、`cities.ts` | 派别口径、星曜查表和城市经度 |
| 格局与四化 | `lib/ziwei/patterns.ts`、`patterns-*.ts`、`sihua.ts` | 根据命盘识别格局，提供本命、大限和流年所需的四化规则 |
| 命盘展示 | `components/ChartBoard.tsx`、`TimeNav.tsx`、`InsightPanel.tsx` | 十二宫盘面、时间切换、宫位信息 |
| 阅读资料 | `lib/classics`、`lib/nihai` | 古籍和相关资料。独立发布的全量解读数据见仓库 README 与 DATASET-LICENSE |

`BirthFormState → formToBirthInfo → BirthInfo → generateChart → ZiweiChart`

表单原始输入、标准化的出生信息与命盘结果分别定义在 `lib/ziwei/types.ts`。如需复用排盘，只需传入已规范化的 `BirthInfo` 调用 `generateChart`。从同款出生表单接入时，请先走 `formToBirthInfo`，以复用时辰换日逻辑。排盘页直接在浏览器生成命盘。这次 UI 调整保留原有算法及规则表。

本地运行

```sh
npm ci
npm run dev
```

生成与 GitHub Pages 一致的静态站点

```sh
STATIC_EXPORT=1 BASE_PATH=/ziwei npm run build
```
