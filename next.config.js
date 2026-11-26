/** @type {import('next').NextConfig} */

// 静态导出相关配置仅在 STATIC_EXPORT=1 时启用，本地 pnpm dev / pnpm start 不受影响。
const staticExport = process.env.STATIC_EXPORT === '1'
  ? {
      output: 'export',
      // 生成目录式结构（chart/index.html），GitHub Pages / OSS 静态托管对子目录路由更友好
      trailingSlash: true,
      // GitHub 项目页挂在 /<repo>/ 子路径下；根路径托管（OSS、自定义域名）不设 BASE_PATH 即可
      ...(process.env.BASE_PATH ? {
        basePath: process.env.BASE_PATH,
        assetPrefix: process.env.BASE_PATH,
      } : {}),
    }
  : {};

const nextConfig = {
  transpilePackages: ['lunar-javascript'],
  ...staticExport,
};

module.exports = nextConfig;
