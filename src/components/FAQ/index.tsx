import React, { useState, useMemo, useEffect } from 'react';
import type { ReactElement } from 'react';
import styles from './styles.module.css';

interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  enabled: boolean;
}

interface FAQItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  order: number;
  enabled: boolean;
  featured: boolean;
}

interface FAQData {
  meta: {
    title: string;
    description: string;
    lastUpdated: string;
    version: string;
  };
  categories: FAQCategory[];
  faqs: FAQItem[];
}

export default function FAQ(): ReactElement {
  const [faqData, setFaqData] = useState<FAQData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFAQData = async () => {
      try {
        const response = await fetch('/data/faq.json');
        const data = await response.json();
        setFaqData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading FAQ data:', err);
        setError('Failed to load FAQ data');
        setIsLoading(false);
      }
    };
    
    loadFAQData();
  }, []);

  // Filter enabled categories and sort by order
  const enabledCategories = useMemo(() => {
    if (!faqData) return [];
    return faqData.categories
      .filter(cat => cat.enabled)
      .sort((a, b) => a.order - b.order);
  }, [faqData]);

  // Filter FAQs by category
  const filteredFAQs = useMemo(() => {
    if (!faqData) return [];
    
    let faqs = faqData.faqs.filter(faq => faq.enabled);
    
    if (selectedCategory !== 'all') {
      faqs = faqs.filter(faq => faq.categoryId === selectedCategory);
    }
    
    return faqs.sort((a, b) => a.order - b.order);
  }, [faqData, selectedCategory]);

  // Get count of FAQs per category
  const getCategoryCount = (categoryId: string): number => {
    if (!faqData) return 0;
    return faqData.faqs.filter(faq => faq.enabled && faq.categoryId === categoryId).length;
  };

  // Get total FAQ count
  const totalFAQCount = useMemo(() => {
    if (!faqData) return 0;
    return faqData.faqs.filter(faq => faq.enabled).length;
  }, [faqData]);

  // Get category name by id
  const getCategoryName = (categoryId: string): string => {
    const category = enabledCategories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Toggle accordion item
  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        Loading FAQs...
      </div>
    );
  }

  if (error || !faqData) {
    return (
      <div className={styles.error}>
        {error || 'Failed to load data'}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`${styles.categoryTab} ${selectedCategory === 'all' ? styles.active : ''}`}
        >
          All Questions
          <span className={styles.count}>{totalFAQCount}</span>
        </button>
        {enabledCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`${styles.categoryTab} ${selectedCategory === category.id ? styles.active : ''}`}
          >
            {category.name}
            <span className={styles.count}>{getCategoryCount(category.id)}</span>
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className={styles.faqList}>
        {filteredFAQs.map((faq) => (
          <div
            key={faq.id}
            className={`${styles.faqItem} ${openItems.has(faq.id) ? styles.open : ''}`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => toggleItem(faq.id)}
              aria-expanded={openItems.has(faq.id)}
            >
              <span className={styles.questionText}>{faq.question}</span>
              <span className={styles.icon}>
                {openItems.has(faq.id) ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </span>
            </button>
            {openItems.has(faq.id) && (
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
                {selectedCategory === 'all' && (
                  <span className={styles.categoryBadge}>
                    {getCategoryName(faq.categoryId)}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className={styles.noResults}>
          No FAQs found in this category.
        </div>
      )}
    </div>
  );
}
