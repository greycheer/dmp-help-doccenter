import React from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

/**
 * 语言切换下拉框（hover 展开）：
 *  - /docs/X          ↔ /zh-CN/docs/X   （文档页，slug 已对齐）
 *  - /                ↔ /zh-CN/          （首页）
 *  - /zh-CN/docs/X    ↔ /docs/X
 */
export default function LangSwitch() {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const base = siteConfig.baseUrl;

  let p = pathname;
  if (p.startsWith(base)) p = '/' + p.slice(base.length);
  if (!p.startsWith('/')) p = '/';
  if (p === '//') p = '/';

  const isZh = p.startsWith('/zh-CN');

  let enPath, zhPath;
  if (isZh) {
    zhPath = p;
    enPath = p.replace(/^\/zh-CN/, '') || '/';
  } else {
    enPath = p;
    zhPath = p.startsWith('/docs') ? '/zh-CN' + p : '/zh-CN/';
  }

  const currentLabel = isZh ? '中文' : 'EN';

  return (
    <div className="dropdown dropdown--hoverable navbar__item lang-switch">
      <a
        className="navbar__link"
        href="#"
        aria-label="Switch language"
        onClick={(e) => e.preventDefault()}
      >
        <span className="lang-switch__globe" aria-hidden="true">🌐</span>
        <span>{currentLabel}</span>
        <span className="lang-switch__caret" aria-hidden="true">▾</span>
      </a>
      <ul className="dropdown__menu">
        <li>
          <Link
            to={enPath}
            className={clsx('dropdown__link', !isZh && 'dropdown__link--active')}
          >
            English
          </Link>
        </li>
        <li>
          <Link
            to={zhPath}
            className={clsx('dropdown__link', isZh && 'dropdown__link--active')}
          >
            中文
          </Link>
        </li>
      </ul>
    </div>
  );
}
