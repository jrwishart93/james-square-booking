'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import PageContainer from '@/components/layout/PageContainer';

const Agm2025Page = () => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    if (!user) {
      setIsOwner(false);
      return;
    }

    const verifyClaim = async () => {
      setIsChecking(true);
      try {
        const token = await user.getIdTokenResult(true);
        if (active) {
          setIsOwner(Boolean(token.claims?.owner));
        }
      } catch {
        if (active) {
          setIsOwner(false);
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    };

    verifyClaim();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading || isChecking) {
    return (
      <PageContainer>
        <div className="max-w-3xl mx-auto py-6">
          <p className="text-gray-600">Checking access...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user || !isOwner) {
    return (
      <PageContainer>
        <div className="max-w-3xl mx-auto py-6">
          <p className="text-lg font-medium text-red-600">Access denied. Owners only.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-6 space-y-4">
        <h1 className="text-3xl font-semibold">AGM 2025</h1>
        <p className="text-gray-700">
          This space will host agendas, minutes, documents, and action items for the 2025 Annual
          General Meeting. We will populate it as materials are prepared.
        </p>
        <p className="text-gray-700">
          Check back soon for downloadable packs, logistics information, and post-meeting summaries.
        </p>
      </div>
    </PageContainer>
  );
};

export default Agm2025Page;
