# 云效 Pages 静态部署说明

本项目已适配纯静态导出，构建产物为 `out/` 目录，可直接托管在云效 Pages / GitHub Pages /
任意静态文件服务器上，不需要 Node.js 运行时。

## 本地验证

```bash
pnpm install
STATIC_EXPORT=1 pnpm build   # Windows PowerShell: $env:STATIC_EXPORT=1; pnpm build
# 产物在 out/，可用任意静态服务器预览，例如：
npx serve out
```

不加 `STATIC_EXPORT=1` 时 `pnpm dev` / `pnpm build` 行为与原版完全一致（含服务端能力）。

## 云效 Flow 流水线配置

1. 代码源选择本 Codeup 仓库
2. 新建 Node.js 构建节点（Node ≥ 20.9），构建命令：

   ```bash
   corepack enable
   pnpm install --frozen-lockfile
   STATIC_EXPORT=1 pnpm build
   ```

3. 构建产物 / 发布目录填：`out`
4. 发布到「云效 Pages」，按提示分配访问域名或绑定自定义域名

## 为静态导出做的适配（相对上游开源版）

- `next.config.js`：仅当 `STATIC_EXPORT=1` 时启用 `output: 'export'`
- `app/robots.ts`、`app/sitemap.ts`：增加 `export const dynamic = 'force-static'`
- `app/knowledge/[star]/[topic]/page.tsx`：开源版论断库为空、静态参数为 0 条时，
  输出占位路由让导出构建通过（页面仍由 `notFound()` 兜底）
- `app/library/search/page.tsx`：由服务端 `searchParams` 改为客户端
  `useSearchParams` + Suspense，搜索逻辑本身就是纯前端模块，功能不变

## 不包含的能力

开源版不含 AI 解读后端（`/api/interpret`、`/api/heming`），页面在接口缺失时
展示可复制的完整提示词；静态托管下该行为保持不变。
