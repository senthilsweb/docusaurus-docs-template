import React from 'react';
import type { ReactElement } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Github, MessageCircle, Twitter } from 'lucide-react';
import styles from './styles.module.css';

// Social platform icon mapping
const socialIcons: Record<string, React.ComponentType<any>> = {
  github: Github,
  discord: MessageCircle,
  twitter: Twitter,
};

// Themed logo SVG that uses CSS variables
function ThemedLogoFooter() {
  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
      className={styles.logo}
    >
      <style>
        {`.footer-logo-bg { fill: var(--ifm-color-primary, #4A154B); }`}
      </style>
      <rect width="40" height="40" rx="10" className="footer-logo-bg" />
      <rect x="26" y="4" width="5" height="5" rx="1" fill="rgba(255,255,255,0.7)" />
      <rect x="32" y="4" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      <rect x="26" y="10" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      <rect x="32" y="10" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      <text x="12" y="28" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize="20" fontWeight="700" fill="white">&gt;</text>
    </svg>
  );
}

function Footer(): ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const currentYear = new Date().getFullYear();
  
  // Get footer config from themeConfig
  const footerConfig = siteConfig.themeConfig.footer as any;
  const copyright = footerConfig?.copyright || `© ${currentYear} Project Contributors. MIT License.`;
  const footerLinks = footerConfig?.links || [];
  const socialLinks = footerConfig?.socialLinks || [];

  // Filter out Connect section (handled separately via socialLinks)
  const linkSections = footerLinks.filter((section: any) => section.title !== 'Connect');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo and Copyright Section */}
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logoLink}>
            <ThemedLogoFooter />
          </Link>
          <p className={styles.copyright}>{copyright}</p>
        </div>

        {/* Links Columns - Dynamic rendering */}
        <div className={styles.linksContainer}>
          {linkSections.map((section: any, sectionIndex: number) => (
            section.items?.length > 0 && (
              <div key={sectionIndex} className={styles.column}>
                <h3 className={styles.columnTitle}>{section.title}</h3>
                <ul className={styles.linksList}>
                  {section.items.map((link: any, index: number) => (
                    <li key={index}>
                      {link.to ? (
                        <Link to={link.to}>{link.label}</Link>
                      ) : link.href ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Connect</h3>
              <div className={styles.socialIcons}>
                {socialLinks.map((social: any, index: number) => {
                  const IconComponent = socialIcons[social.platform];
                  return IconComponent ? (
                    <a 
                      key={index}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={social.platform}
                    >
                      <IconComponent size={24} />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
