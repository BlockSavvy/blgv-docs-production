import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '🏛️ Treasury Intelligence',
    link: '/platforms/treasury',
    description: (
      <>
        Professional Bitcoin treasury management with real-time analytics, 
        BTC-per-share tracking, and enterprise-grade financial reporting.
      </>
    ),
  },
  {
    title: '⚡ Decentralized Exchange',
    link: '/platforms/dex',
    description: (
      <>
        Advanced Bitcoin trading platform with Lightning Network integration,
        Taproot Assets support, and institutional-grade order execution.
      </>
    ),
  },
  {
    title: '⛏️ Bitcoin Mining Pool',
    link: '/platforms/pool',
    description: (
      <>
        Mission 1867 sustainable mining operations with renewable energy
        integration, transparent payouts, and enterprise Stratum protocols.
      </>
    ),
  },
  {
    title: '⚡ Lightning Service Provider',
    link: '/platforms/lsp',
    description: (
      <>
        Enterprise Lightning Network services with channel management,
        liquidity provision, and Lightning-as-a-Service for businesses.
      </>
    ),
  },
  {
    title: '📱 Mobile Treasury Wallet',
    link: '/platforms/mobile',
    description: (
      <>
        React Native + Expo mobile app with unified ecosystem access,
        biometric security, and cross-platform real-time synchronization.
      </>
    ),
  },
      {
      title: '🏗️ Architecture Overview',
      link: '/architecture-overview',
      description: (
        <>
          Comprehensive system architecture with multi-schema database design,
          real-time WebSocket connections, and Bitcoin-native infrastructure.
        </>
      ),
    },
];

function Feature({title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className="text--center">
          <h3 className={styles.featureTitle}>{title}</h3>
        </div>
        <div className="text--center padding-horiz--md">
          <p className={styles.featureDescription}>{description}</p>
          <a 
            href={link} 
            className={clsx('button button--primary button--sm', styles.featureButton)}
          >
            Learn More →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col">
            <h2 className={styles.sectionTitle}>
              🚀 Bitcoin-Native Financial Infrastructure
            </h2>
            <p className={styles.sectionSubtitle}>
              Explore the comprehensive BLGV ecosystem - from treasury management 
              to Lightning Network services, all built with Bitcoin-first principles 
              and enterprise-grade security.
            </p>
          </div>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        {/* Quick Links Section */}
        <div className={styles.quickLinks}>
          <h3 className={styles.quickLinksTitle}>🔥 Quick Start</h3>
          <div className={styles.quickLinksGrid}>
            <a href="/ENVIRONMENT_SECRETS" className={styles.quickLink}>
              <strong>Environment Setup</strong>
              <p>Configure secrets and environment variables</p>
            </a>
            <a href="/deployment/DEPLOYMENT" className={styles.quickLink}>
              <strong>Deployment Guide</strong>
              <p>Deploy to Digital Ocean with one command</p>
            </a>
            <a href="/sdk/README" className={styles.quickLink}>
              <strong>SDK Documentation</strong>
              <p>Integrate with the unified BLGV SDK</p>
            </a>
                      <a href="/architecture-overview" className={styles.quickLink}>
            <strong>System Architecture</strong>
            <p>Understand the BLGV ecosystem design</p>
          </a>
          </div>
        </div>
      </div>
    </section>
  );
} 