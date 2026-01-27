// src/context/WeddingContext.js
import React, { createContext, useContext } from 'react';
import { useWeddingData, useSlugDetection } from '../hooks/useWeddingData';

const WeddingContext = createContext(null);

export function WeddingProvider({ children, slug: propSlug }) {
  // Use provided slug or detect from URL/domain
  const detectedSlug = useSlugDetection();
  const slug = propSlug || detectedSlug;
  
  const weddingData = useWeddingData(slug);

  return (
    <WeddingContext.Provider value={weddingData}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  
  return context;
}

export default WeddingContext;
