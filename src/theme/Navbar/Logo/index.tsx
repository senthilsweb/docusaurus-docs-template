import React from 'react';
import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedLogo from './ThemedLogo';
import styles from './styles.module.css';

function LogoThemedImage(): JSX.Element {
  return <ThemedLogo className={styles.logo} />;
}

export default function NavbarLogo(): JSX.Element {
  const {
    navbar: { title, logo },
  } = useThemeConfig();
  const logoLink = useBaseUrl(logo?.href || '/');
  
  return (
    <Link to={logoLink} className={styles.logoLink}>
      <LogoThemedImage />
      {title && <span className={styles.title}>{title}</span>}
    </Link>
  );
}
