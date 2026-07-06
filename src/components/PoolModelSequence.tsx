'use client';

import { useState } from 'react';

import LazyPoolModelCard from '@/components/LazyPoolModelCard';

const poolModels = [
  {
    id: 'clean-model',
    title: 'Interactive 3D Pool Model',
    subtitle: 'Explore the digital pool model',
    description:
      'Use this cleaned GLB model as the primary coordination reference for layout, circulation, repair scope conversations and early refurbishment discussions.',
    footer:
      'This model is a working visual reference created from the scan and may be refined as further photos, measurements and survey information become available.',
    modelSrc: '/images/pool/pool-area-3D-model.glb',
    modelName: 'James Square pool area 3D model',
    loadingLabel: 'Loading the modelled pool area…',
    ariaLabel: 'Interactive 3D model of the James Square heated indoor pool layout',
    size: 'standard' as const,
    thumbnailSrc: '/images/pool/A7625DAD-1761-4487-8704-E5D0658BE78A.png',
    thumbnailAlt: 'Preview render of the interactive James Square 3D pool model',
    thumbnailPosition: 'object-[68%_42%]',
    autoSpin: true,
    autoSpinSpeed: 1.4,
    priority: true,
  },
  {
    id: 'photo-scan',
    title: '3D Photo Pool Scan',
    subtitle: 'View the real pool area in 3D',
    description:
      'Compare the cleaned model against the original photo scan to understand captured geometry, finishes and areas that may need survey confirmation.',
    modelSrc: '/images/pool/pool-photo-scan.glb',
    modelName: 'James Square pool photo scan',
    loadingLabel: 'Loading the pool photo scan…',
    ariaLabel: 'Interactive 3D photo scan of the James Square heated indoor pool area',
    size: 'standard' as const,
    thumbnailSrc: '/images/pool/BC0D4867-E841-4F44-B7B8-90030F8D2E6B.jpeg',
    thumbnailAlt: 'Preview photo of the James Square pool water and mirrored wall',
    thumbnailPosition: 'object-[62%_62%]',
    autoSpin: true,
    autoSpinSpeed: 1.1,
  },
  {
    id: 'plant-room',
    title: '3D Photo Plant Room Scan',
    subtitle: 'Step inside the pool plant room',
    description:
      'Review this separate scan for plant, office and back-of-house context that supports contractor access planning and services discussions.',
    modelSrc: '/images/pool/plant-room-office-scan.glb',
    modelName: 'James Square plant room and office scan',
    loadingLabel: 'Loading the plant room and office scan…',
    ariaLabel: 'Interactive 3D scan of the James Square pool plant room and office',
    size: 'standard' as const,
    thumbnailSrc: '/images/pool/IMG_4149.jpeg',
    thumbnailAlt: 'Preview photo of the pool plant room filters, pipes and equipment',
    thumbnailPosition: 'object-[46%_55%]',
    autoSpin: true,
    autoSpinSpeed: 1.1,
  },
];

export default function PoolModelSequence() {
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {poolModels.map((model) => (
        <LazyPoolModelCard
          key={model.id}
          {...model}
          isActive={activeModelId === model.id}
          onActivate={() => setActiveModelId(model.id)}
        />
      ))}
    </div>
  );
}
