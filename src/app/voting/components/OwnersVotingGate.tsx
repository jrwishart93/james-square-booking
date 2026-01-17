import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const OWNERS_PASSKEY = '3579';
const OWNERS_ACCESS_KEY = 'owners_voting_access';

interface OwnersVotingGateProps {
  children: React.ReactNode;
}

const OwnersVotingGate: React.FC<OwnersVotingGateProps> = ({ children }) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = sessionStorage.getItem(OWNERS_ACCESS_KEY);
    setIsUnlocked(stored === 'true');
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (passkey.trim() === OWNERS_PASSKEY) {
      sessionStorage.setItem(OWNERS_ACCESS_KEY, 'true');
      setIsUnlocked(true);
      setError(null);
      return;
    }
    setError('The passkey provided is not valid for owners voting.');
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <div className="rounded-[32px] bg-white border border-slate-200 shadow-[0_24px_70px_rgba(15,23,42,0.14)] overflow-hidden">
        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-cyan-50">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <Lock size={18} className="text-cyan-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Owners only</h2>
              <p className="text-sm text-slate-600">
                This vote is restricted to verified owners of James Square.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <Input
            label="Owners voting passkey"
            placeholder="Enter passkey"
            value={passkey}
            onChange={(event) => {
              setPasskey(event.target.value);
              setError(null);
            }}
            className="bg-white border-slate-200 focus:ring-cyan-500"
          />
          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <Button type="submit" fullWidth>
            Unlock owners voting
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OwnersVotingGate;
