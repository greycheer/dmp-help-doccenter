import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const features = [
  {
    icon: '🔗',
    title: 'Multi-Protocol Connection',
    desc: 'Support for Wi-Fi, Bluetooth, Zigbee, and Matter protocols for seamless device integration.',
  },
  {
    icon: '📦',
    title: 'Product Lifecycle',
    desc: 'Complete product management from creation and configuration to mass production deployment.',
  },
  {
    icon: '👥',
    title: 'Role-Based Access',
    desc: 'Granular permission control with admin, developer, and operator roles for secure collaboration.',
  },
  {
    icon: '📡',
    title: 'OTA Firmware Updates',
    desc: 'Reliable over-the-air firmware upgrade with version tracking, rollback, and batch management.',
  },
  {
    icon: '📊',
    title: 'Device Monitoring',
    desc: 'Real-time status tracking, event logging, and data visualization for connected devices.',
  },
  {
    icon: '🔧',
    title: 'Debugging Tools',
    desc: 'Interactive device logs, remote shell access, and diagnostic utilities for efficient troubleshooting.',
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
      description="DMP Platform Help Center — Everything you need to manage devices, develop products, and integrate with the DMP platform."
    >
      {/* Hero */}
      <section className="dmp-hero">
        <div className="dmp-hero__content">
          <div className="dmp-hero__badge">📘 Documentation v2.0</div>
          <h1>
            DMP Platform
            <br />
            <span>Help Center</span>
          </h1>
          <p>
            Everything you need to manage devices, develop products, and
            integrate with the DMP platform — all in one place.
          </p>
          <div className="dmp-hero__actions">
            <Link className="dmp-btn dmp-btn--primary" to="/docs/admin-manual/introduction/purpose-of-the-manual">
              Get Started →
            </Link>
            <Link className="dmp-btn dmp-btn--secondary" to="/docs/category/for-admin-user">
              📖 Admin Manual
            </Link>
            <Link className="dmp-btn dmp-btn--secondary" to="/docs/category/for-developer">
              💻 Developer Manual
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Cards */}
      <section className="dmp-quickstart">
        <div className="dmp-quickstart__inner">
          <h2 className="dmp-quickstart__subtitle">Get Started</h2>
          <p className="dmp-quickstart__desc">Choose the right manual for your role</p>
          <div className="dmp-quick-cards">
            <Link className="dmp-quick-card" to="/docs/category/for-admin-user">
              <div className="dmp-quick-card__icon">🛡️</div>
              <div style={{ flex: 1 }}>
                <h3>Admin User Manual</h3>
                <p>
                  For platform owners and administrators — account management,
                  product lifecycle, and operational workflows.
                </p>
              </div>
              <span className="dmp-quick-card__arrow">→</span>
            </Link>
            <Link className="dmp-quick-card" to="/docs/category/for-developer">
              <div className="dmp-quick-card__icon dmp-quick-card__icon--dev">⚙️</div>
              <div style={{ flex: 1 }}>
                <h3>Developer Manual</h3>
                <p>
                  For hardware developers — device integration, firmware
                  management, and debugging tools.
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
          <h2>Platform Capabilities</h2>
          <p className="dmp-features__subtitle">
            A comprehensive toolkit for IoT device management
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
          <h2>Ready to get started?</h2>
          <p>
            Jump into the documentation and start building on the DMP platform
            today.
          </p>
          <Link className="dmp-btn dmp-btn--primary" to="/docs/category/for-admin-user">
            Read the Docs →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
