
// Fix: Added missing React import to resolve namespace issues for React.ReactNode
import React from 'react';

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: 'blue' | 'green' | 'amber' | 'red';
}

export interface Notice {
  title: string;
  items: string[];
  variant: 'amber' | 'red';
}
