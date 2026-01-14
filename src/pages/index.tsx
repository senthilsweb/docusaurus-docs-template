import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import * as LucideIcons from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import styles from './index.module.css';
import landingConfig from '../../landing.config';

// Dynamic Lucide Icon Component
function LucideIcon({ name, size = 24, ...props }: { name: string; size?: number; [key: string]: any }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    console.warn(`Lucide icon "${name}" not found`);
    return null;
  }
  return <IconComponent size={size} {...props} />;
}

// Theme-aware Logo Mark Component (like psctl)
function LogoMark() {
  return (
    <div className={styles.logoMark}>
      <div className={styles.logoGrid}>
        <div className={styles.logoGridItem} />
        <div className={clsx(styles.logoGridItem, styles.logoGridItemFaded)} />
        <div className={clsx(styles.logoGridItem, styles.logoGridItemFaded)} />
        <div className={clsx(styles.logoGridItem, styles.logoGridItemFaded)} />
      </div>
      <span className={styles.logoSymbol}>&gt;</span>
    </div>
  );
}

// Hero Section Component with Two-Column Layout
function HeroSection() {
  const { siteConfig } = useDocusaurusContext();
  const { hero } = landingConfig;
  const hasTwoColumnLayout = hero.heroImage && hero.heroImage.trim() !== '';
  
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={clsx(styles.heroGrid, !hasTwoColumnLayout && styles.heroGridCentered)}>
          {/* Left Side: Hero Content */}
          <div className={clsx(styles.heroContent, !hasTwoColumnLayout && styles.heroContentCentered)}>
            {/* Logo and Title Row */}
            <div className={styles.heroHeader}>
              <LogoMark />
              <Heading as="h1" className={styles.heroTitle}>
                {hero.title}
              </Heading>
            </div>
            
            {/* Tagline */}
            <p className={styles.heroTagline}>{hero.tagline}</p>
            
            {/* Description (optional) */}
            {hero.description && (
              <p className={styles.heroDescription}>{hero.description}</p>
            )}
            
            {/* CTA Buttons */}
            <div className={styles.heroButtons}>
              {hero.buttons.map((button, idx) => (
                <Link
                  key={idx}
                  className={clsx(
                    styles.heroButton,
                    button.variant === 'primary' 
                      ? styles.buttonPrimary 
                      : styles.buttonSecondary
                  )}
                  to={button.href}
                >
                  {button.label}
                  {button.icon && (
                    <LucideIcon name={button.icon} size={18} />
                  )}
                </Link>
              ))}
            </div>
            
            {/* Highlights Row with checkmarks */}
            {hero.highlights.length > 0 && (
              <div className={styles.heroHighlights}>
                {hero.highlights.map((highlight, idx) => (
                  <div key={idx} className={styles.highlight}>
                    <CheckCircle size={18} className={styles.highlightCheck} />
                    <span className={styles.highlightLabel}>{highlight.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Side: Hero Image */}
          {hasTwoColumnLayout && (
            <div className={styles.heroImageContainer}>
              <img 
                src={hero.heroImage} 
                alt={hero.heroImageAlt || 'Hero illustration'} 
                className={styles.heroImage}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Feature Card Component
function FeatureCard({ icon, iconColor, iconBackground, title, description }: {
  icon: string;
  iconColor: string;
  iconBackground: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.featureCard}>
      <div 
        className={styles.featureIcon}
        style={{ 
          backgroundColor: iconBackground,
          color: iconColor,
        }}
      >
        <LucideIcon name={icon} size={28} />
      </div>
      <div className={styles.featureContent}>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const { features } = landingConfig;
  
  if (!features.items || features.items.length === 0) {
    return null;
  }
  
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        {features.sectionTitle && (
          <Heading as="h2" className={styles.sectionTitle}>
            {features.sectionTitle}
          </Heading>
        )}
        <div className={styles.featuresGrid}>
          {features.items.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description={siteConfig.tagline}
    >
      <HeroSection />
      <main>
        <FeaturesSection />
      </main>
    </Layout>
  );
}
