import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  gradient: 'purple' | 'pink' | 'orange';
};

const FeatureList: FeatureItem[] = [
  {
    title: 'User Guide',
    description: 'Learn how to use the Zynomi platform effectively. From patient management to trial workflows, get started with our comprehensive user documentation.',
    buttonText: 'Start Learning',
    link: '/docs/getting-started',
    gradient: 'purple',
  },
  {
    title: 'Developer Guide',
    description: 'Integrate with Zynomi APIs, understand the architecture, and build custom solutions with our detailed developer documentation and code examples.',
    buttonText: 'Start Building',
    link: '/docs/architecture-overview',
    gradient: 'pink',
  },
  {
    title: 'API Reference',
    description: 'Complete API documentation with endpoints, request/response schemas, authentication guides, and interactive examples for all Zynomi services.',
    buttonText: 'Explore APIs',
    link: '/api-reference',
    gradient: 'orange',
  },
];

function Feature({title, description, buttonText, link, gradient}: FeatureItem) {
  return (
    <div className={styles.featureCol}>
      <Link to={link} className={styles.featureLink}>
        <div className={`${styles.featureCard} ${styles[gradient]}`}>
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
          <button className={styles.featureButton}>{buttonText}</button>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresRow}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
