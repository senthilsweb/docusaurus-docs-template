import React from 'react';
import styles from './styles.module.css';

// These gradients use CSS variables that will be set by the theme
// The actual colors come from --ifm-color-primary and --accent-color
const getGradients = () => [
  'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-light) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-darkest) 0%, var(--ifm-color-primary) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-light) 0%, var(--ifm-color-primary-lighter) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-darker) 0%, var(--ifm-color-primary-lightest) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-dark) 0%, var(--ifm-color-primary-light) 100%)',
  'linear-gradient(135deg, var(--accent-color) 0%, var(--ifm-color-primary) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--accent-color) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-lighter) 0%, var(--ifm-color-primary-lightest) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-darkest) 0%, var(--ifm-color-primary-light) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-dark) 0%, var(--ifm-color-primary-lighter) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-lighter) 50%, var(--ifm-color-primary-lightest) 100%)',
  'linear-gradient(135deg, var(--ifm-color-primary-dark) 0%, var(--accent-color) 100%)',
];

export default function BlogPostItems({ items }) {
  const gradients = getGradients();
  
  return (
    <div className={styles.blogGrid}>
      {items.map(({content: BlogPostContent}, index) => {
        const { metadata } = BlogPostContent;
        const { permalink, title, authors, frontMatter, description, tags, date } = metadata;
        
        // Check for custom thumbnail in frontMatter
        const customThumbnail = frontMatter?.thumbnail || frontMatter?.image || null;
        
        // Use gradient index based on position, wrapping around
        const gradientIndex = index % gradients.length;
        const gradient = gradients[gradientIndex];
        
        // Get author name
        const authorName = authors?.[0]?.name || 'Team';
        
        // Format date
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        return (
          <a
            href={permalink}
            key={permalink}
            className={styles.blogCard}
          >
            {/* Hero thumbnail area with title overlay */}
            <div className={styles.blogCardHero}>
              <div 
                className={styles.blogCardHeroInner}
                style={customThumbnail ? {} : { background: gradient }}
              >
                {customThumbnail && (
                  <img src={customThumbnail} alt={title} loading="lazy" />
                )}
                {/* Title overlay on the gradient */}
                {!customThumbnail && (
                  <h3 className={styles.blogCardTitleOverlay}>{title}</h3>
                )}
              </div>
            </div>
            
            {/* Content area - tags and excerpt */}
            <div className={styles.blogCardContent}>
              {/* Tags */}
              <div className={styles.blogCardTags}>
                {tags && tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className={styles.blogCardTag}>
                    {tag.label}
                  </span>
                ))}
                {tags && tags.length > 3 && (
                  <span className={styles.blogCardTag}>{tags.length - 3}+</span>
                )}
              </div>
              
              {/* Excerpt/Description */}
              <p className={styles.blogCardExcerpt}>
                {description || 'Read more about this release...'}
              </p>
              
              {/* Date and Author */}
              <div className={styles.blogCardMeta}>
                <span className={styles.blogCardAuthor}>{authorName}</span>
                <span className={styles.blogCardDot}>·</span>
                <span className={styles.blogCardDate}>{formattedDate}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
