"use client";

import { createContext, useState, useContext } from 'react';
import { toast } from 'react-hot-toast';

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (schoolId) => {
    let isAdding = false;
    let isRemoving = false;
    let isAtLimit = false;

    setCompareList(prev => {
      if (prev.includes(schoolId)) {
        isRemoving = true;
        return prev.filter(id => id !== schoolId);
      }
      if (prev.length >= 3) {
        isAtLimit = true;
        return prev;
      }
      isAdding = true;
      return [...prev, schoolId];
    });

    if (isAdding) toast.success('Added to comparison!');
    if (isRemoving) toast.success('Removed from comparison.');
    if (isAtLimit) toast.error('You can only compare up to 3 schools at a time.');
  };

  const value = { compareList, toggleCompare };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};