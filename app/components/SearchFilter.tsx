
import { useState, useMemo } from 'react';

// Custom hook for search functionality
export const useSearch = (data: unknown, searchKeys = ['name']) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    
    return (Array.isArray(data) ? data : []).filter((item: { [x: string]: any; }) => {
      return searchKeys.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
};