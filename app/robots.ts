import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

// output: 'export' 静态托管要求显式声明为静态路由
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/preview-versions/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
