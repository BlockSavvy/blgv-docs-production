import React from 'react';
import AIAssistant from '../components/AIAssistant';

// Root wrapper component for Docusaurus theme
export default function Root({ children }) {
  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
} 