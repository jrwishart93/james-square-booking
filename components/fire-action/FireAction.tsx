'use client';

import React from 'react';
import App from './App';

type FireActionProps = {
  showDetails?: boolean;
};

export default function FireAction({ showDetails }: FireActionProps) {
  return <App showDetails={showDetails} />;
}
