import React, { useState, useMemo, useEffect } from 'react';
import type { ReactElement } from 'react';
import styles from './styles.module.css';

interface GlossaryTerm {
  domain: string;
  glossary: string;
  term: string;
  definition: string;
  abbreviation?: string;
}

export default function Glossary(): ReactElement {
  const [glossaryData, setGlossaryData] = useState<GlossaryTerm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGlossaryData = async () => {
      try {
        const response = await fetch('/data/business-glossary.json');
        const data = await response.json();
        setGlossaryData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading glossary data:', error);
        setIsLoading(false);
      }
    };
    
    loadGlossaryData();
  }, []);

  // Get unique starting letters
  const availableLetters = useMemo(() => {
    const letters = new Set(glossaryData.map(item => item.term[0].toUpperCase()));
    return Array.from(letters).sort();
  }, [glossaryData]);

  // Get domains with counts
  const domainsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    glossaryData.forEach(item => {
      counts[item.domain] = (counts[item.domain] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [glossaryData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = glossaryData;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.abbreviation && item.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDomain !== 'all') {
      filtered = filtered.filter(item => item.domain === selectedDomain);
    }

    if (selectedLetter) {
      filtered = filtered.filter(item =>
        item.term[0].toUpperCase() === selectedLetter
      );
    }

    return [...filtered].sort((a, b) => a.term.localeCompare(b.term));
  }, [glossaryData, searchTerm, selectedDomain, selectedLetter]);

  // Group by first letter for display
  const groupedData = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredData.forEach(item => {
      const firstLetter = item.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(item);
    });
    return groups;
  }, [filteredData]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLetter(null);
    setSelectedDomain('all');
  };

  const hasActiveFilters = searchTerm || selectedLetter || selectedDomain !== 'all';

  if (isLoading) {
    return (
      <div className={styles.loading}>
        Loading glossary...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Search and Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search terms, definitions, or abbreviations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={styles.clearSearch}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Domain Filter */}
        <div className={styles.domainFilter}>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Domains ({glossaryData.length})</option>
            {domainsWithCounts.map(([domain, count]) => (
              <option key={domain} value={domain}>
                {domain} ({count})
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear filters
          </button>
        )}
      </div>

      {/* Alphabet Navigation */}
      <div className={styles.alphabetNav}>
        <button
          onClick={() => setSelectedLetter(null)}
          className={`${styles.letterButton} ${selectedLetter === null ? styles.active : ''}`}
        >
          All
        </button>
        {availableLetters.map(letter => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
            className={`${styles.letterButton} ${selectedLetter === letter ? styles.active : ''}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className={styles.resultsCount}>
        Showing {filteredData.length} of {glossaryData.length} terms
      </div>

      {/* Glossary Terms */}
      <div className={styles.termsList}>
        {Object.entries(groupedData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, terms]) => (
            <div key={letter} className={styles.letterSection}>
              <h2 className={styles.letterHeader} id={`letter-${letter}`}>
                {letter}
              </h2>
              <div className={styles.termsGrid}>
                {terms.map((item, index) => (
                  <div key={`${item.term}-${index}`} className={styles.termCard}>
                    <div className={styles.termHeader}>
                      <h3 className={styles.termTitle}>{item.term}</h3>
                      {item.abbreviation && (
                        <span className={styles.abbreviation}>{item.abbreviation}</span>
                      )}
                    </div>
                    <p className={styles.definition}>{item.definition}</p>
                    <div className={styles.termMeta}>
                      <span className={styles.domain}>{item.domain}</span>
                      {item.glossary && (
                        <span className={styles.glossaryType}>{item.glossary}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {filteredData.length === 0 && (
        <div className={styles.noResults}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <h3>No terms found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
