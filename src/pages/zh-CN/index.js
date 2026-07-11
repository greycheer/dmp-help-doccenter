import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const features = [
  {
    icon: '🔗',
    title: '多协议接入',
    desc: '支持 Wi-Fi、蓝牙、Zigbee、Matter 等协议，设备接入无缝集成。',
  },
  {
    icon: '📦',
    title: '产品全生命周期',
    desc: '从产品创建、配置到量产部署的完整产品管理能力。',
  },
  {
    icon: '👥',
    title: '角色权限管理',
    desc: '管理员、开发者、运营等多角色细粒度权限控制，安全协作。',
  },
  {
    icon: '📡',
    title: 'OTA 固件升级',
    desc: '可靠的空中固件升级，支持版本追踪、回滚与批量管理。',
  },
  {
    icon: '📊',
    title: '设备监控',
    desc: '设备实时状态追踪、事件日志与数据可视化。',
  },
  {
    icon: '🔧',
    title: '调试工具',
    desc: '设备日志、远程 shell、诊断工具，高效排障。',
  },
];

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="dmp-feature-card">
      <div className="dmp-feature-card__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="DMP 平台帮助中心 — 设备管理、产品开发与平台集成所需的全部文档。"
    >
      {/* Hero */}
      <section className="dmp-hero">
        <div className="dmp-hero__content">
          <div className="dmp-hero__badge">📘 文档 v2.0</div>
          <h1>
            DMP 平台
            <br />
            <span>帮助中心</span>
          </h1>
          <p>
            设备管理、产品开发与平台集成所需的全部内容，一站式直达。
          </p>
          <div className="dmp-hero__actions">
            <Link className="dmp-btn dmp-btn--primary" to="/zh-CN/docs/admin-manual/section-1/page-1">
              立即开始 →
            </Link>
            <Link className="dmp-btn dmp-btn--secondary" to="/zh-CN/docs/admin-manual/section-1/page-1">
              📖 管理员手册
            </Link>
            <Link className="dmp-btn dmp-btn--secondary" to="/zh-CN/docs/developer-manual/section-1/page-1">
              💻 开发者手册
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Cards */}
      <section className="dmp-quickstart">
        <div className="dmp-quickstart__inner">
          <h2 className="dmp-quickstart__subtitle">快速开始</h2>
          <p className="dmp-quickstart__desc">按角色选择对应手册</p>
          <div className="dmp-quick-cards">
            <Link className="dmp-quick-card" to="/zh-CN/docs/admin-manual/section-1/page-1">
              <div className="dmp-quick-card__icon">🛡️</div>
              <div style={{ flex: 1 }}>
                <h3>管理员手册</h3>
                <p>
                  面向平台所有者与管理员 — 账号管理、产品生命周期与运营流程。
                </p>
              </div>
              <span className="dmp-quick-card__arrow">→</span>
            </Link>
            <Link className="dmp-quick-card" to="/zh-CN/docs/developer-manual/section-1/page-1">
              <div className="dmp-quick-card__icon dmp-quick-card__icon--dev">⚙️</div>
              <div style={{ flex: 1 }}>
                <h3>开发者手册</h3>
                <p>
                  面向硬件开发者 — 设备接入、固件管理与调试工具。
                </p>
              </div>
              <span className="dmp-quick-card__arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="dmp-features">
        <div className="dmp-features__inner">
          <h2>平台能力</h2>
          <p className="dmp-features__subtitle">
            物联网设备管理的完整工具链
          </p>
          <div className="dmp-feature-grid">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dmp-cta">
        <div className="dmp-cta__inner">
          <h2>准备好开始了吗？</h2>
          <p>
            进入文档，立即开始在 DMP 平台上构建。
          </p>
          <Link className="dmp-btn dmp-btn--primary" to="/zh-CN/docs/admin-manual/section-1/page-1">
            阅读文档 →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
