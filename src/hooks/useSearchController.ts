import { SearchResult, DiscoveryAction } from '../types';
import React, { useState, useEffect } from 'react';
import { catalogueRepository } from '../services/catalogueRepository';

export const useSearchController = (onNavigate: (page: string, params?: any) => void) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [discoveryActions, setDiscoveryActions] = useState<DiscoveryAction[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length >= 2) {
        const { results, discovery } = catalogueRepository.search(query);
        setSuggestions(results.map(r => ({
          ...r,
          action: () => {
            setSearchFocused(false);
            onNavigate('search-result', r);
          }
        })));
        setDiscoveryActions(discovery);
      } else {
        setSuggestions([]);
        setDiscoveryActions([]);
      }
      setSelectedIndex(-1);
    }, 150);
    return () => clearTimeout(handler);
  }, [query, onNavigate]);

  const handleSuggestionClick = (action: () => void) => {
    setQuery('');
    action();
  };

  const allItemsLength = suggestions.length + discoveryActions.length;

  const handleSearchSubmit = () => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      handleSuggestionClick(suggestions[selectedIndex].action!);
    } else if (selectedIndex >= suggestions.length && selectedIndex < allItemsLength) {
      const dAction = discoveryActions[selectedIndex - suggestions.length];
      handleSuggestionClick(() => {
        setSearchFocused(false);
        onNavigate('search-result', { url: dAction.url });
      });
    } else if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].action!);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allItemsLength - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
    }
  };

  return {
    query,
    setQuery,
    suggestions,
    discoveryActions,
    searchFocused,
    setSearchFocused,
    selectedIndex,
    setSelectedIndex,
    handleSuggestionClick,
    handleSearchSubmit,
    handleKeyDown
  };
};
