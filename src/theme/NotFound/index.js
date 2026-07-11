import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import NotFound from '@theme-original/NotFound';

/**
 * 文档路径 404 兜底：EN/ZH 文档结构有少量差异，语言切换时若目标页不存在，
 * 自动跳转到对应语言的文档根，避免用户卡在 404。
 */
export default function NotFoundWrapper() {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const base = siteConfig.baseUrl;

  useEffect(() => {
    let p = pathname;
    if (p.startsWith(base)) p = '/' + p.slice(base.length);
    if (!p.startsWith('/')) p = '/' + p;
    if (p.startsWith('/zh-CN/docs')) {
      window.location.replace(base + 'zh-CN/docs/');
    } else if (p.startsWith('/docs')) {
      window.location.replace(base + 'docs/');
    }
  }, [pathname]);

  return <NotFound />;
}
