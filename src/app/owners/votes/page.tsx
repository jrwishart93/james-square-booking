'use client';

import { FormEvent, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

interface VoteOption {
  id: string;
  label: string;
}

interface OwnerVoteDoc {
  id: string;
  title: string;
  description?: string;
  url?: string;
  status: 'open' | 'closed' | 'archived';
  options: VoteOption[];
  createdAtLabel: string;
}

const AccessDenied = () => (
  <div className="max-w-3xl mx-auto p-6">
    <p className="text-lg font-medium text-red-600">Access denied. Owners only.</p>
  </div>
);

const OwnersVotesPage = () => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [votes, setVotes] = useState<OwnerVoteDoc[]>([]);
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [initialSelections, setInitialSelections] = useState<Record<string, string>>({});
  const [ballotsLoaded, setBallotsLoaded] = useState(false);
  const [savingVoteId, setSavingVoteId] = useState<string | null>(null);
  const [voteMessages, setVoteMessages] = useState<Record<string, string>>({});

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

  useEffect(() => {
    if (!isOwner) return;

    let active = true;

    const fetchVotes = async () => {
      setFetchState('loading');
      try {
        const votesQuery = query(collection(db, 'owner_votes'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(votesQuery);
        if (!active) return;

        const mapped: OwnerVoteDoc[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const createdAt = (data.createdAt as { toDate?: () => Date })?.toDate?.();
          const createdAtLabel = createdAt ? createdAt.toLocaleString() : 'No date';

          const rawOptions = Array.isArray(data.options) ? data.options : [];
          const options: VoteOption[] = rawOptions
            .map((entry) => {
              if (!entry) return null;
              if (typeof entry === 'string') {
                return { id: entry, label: entry } satisfies VoteOption;
              }
              if (typeof entry === 'object') {
                const value = entry as Record<string, unknown>;
                const optionId =
                  typeof value.id === 'string' && value.id.trim()
                    ? value.id.trim()
                    : typeof value.value === 'string' && value.value.trim()
                      ? value.value.trim()
                      : undefined;
                const optionLabel =
                  typeof value.label === 'string' && value.label.trim()
                    ? value.label.trim()
                    : typeof value.title === 'string' && value.title.trim()
                      ? value.title.trim()
                      : optionId;
                if (!optionId || !optionLabel) {
                  return null;
                }
                return { id: optionId, label: optionLabel } satisfies VoteOption;
              }
              return null;
            })
            .filter((option): option is VoteOption => Boolean(option));

          const statusRaw = typeof data.status === 'string' ? data.status.toLowerCase() : 'closed';
          const status: OwnerVoteDoc['status'] =
            statusRaw === 'open' || statusRaw === 'archived' ? (statusRaw as OwnerVoteDoc['status']) : 'closed';

          return {
            id: docSnap.id,
            title: typeof data.title === 'string' && data.title.trim() ? data.title : 'Untitled vote',
            description:
              typeof data.description === 'string' && data.description.trim()
                ? data.description
                : undefined,
            url: typeof data.url === 'string' && data.url.trim() ? data.url : undefined,
            status,
            options,
            createdAtLabel,
          };
        });

        setVotes(mapped);
        setFetchState('success');
      } catch (error) {
        console.error('Failed to load owner votes', error);
        if (active) {
          setFetchState('error');
        }
      }
    };

    fetchVotes();

    return () => {
      active = false;
    };
  }, [isOwner]);

  useEffect(() => {
    if (!isOwner || !user) {
      setSelectedOptions({});
      setInitialSelections({});
      setBallotsLoaded(false);
      return;
    }

    if (votes.length === 0) {
      setSelectedOptions({});
      setInitialSelections({});
      setBallotsLoaded(true);
      return;
    }

    let active = true;
    setBallotsLoaded(false);

    const loadBallots = async () => {
      try {
        const entries = await Promise.all(
          votes.map(async (vote) => {
            const ballotRef = doc(db, 'owner_votes', vote.id, 'ballots', user.uid);
            const ballotSnap = await getDoc(ballotRef);
            if (!active) return null;
            if (!ballotSnap.exists()) return { voteId: vote.id, optionId: undefined as string | undefined };
            const ballotData = ballotSnap.data() as Record<string, unknown>;
            const optionId = typeof ballotData.optionId === 'string' ? ballotData.optionId : undefined;
            return { voteId: vote.id, optionId };
          }),
        );

        if (!active) return;

        const initial: Record<string, string> = {};
        const selected: Record<string, string> = {};
        entries.forEach((entry) => {
          if (!entry || !entry.optionId) return;
          initial[entry.voteId] = entry.optionId;
          selected[entry.voteId] = entry.optionId;
        });

        setInitialSelections(initial);
        setSelectedOptions((prev) => ({ ...selected, ...prev }));
      } catch (error) {
        console.error('Failed to load ballots', error);
      } finally {
        if (active) {
          setBallotsLoaded(true);
        }
      }
    };

    loadBallots();

    return () => {
      active = false;
    };
  }, [isOwner, user, votes]);

  const handleOptionChange = (voteId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [voteId]: optionId }));
    setVoteMessages((prev) => ({ ...prev, [voteId]: '' }));
  };

  const handleCastVote = async (event: FormEvent<HTMLFormElement>, voteId: string) => {
    event.preventDefault();

    if (!user) {
      setVoteMessages((prev) => ({ ...prev, [voteId]: 'You must be signed in.' }));
      return;
    }

    if (!isOwner) {
      setVoteMessages((prev) => ({ ...prev, [voteId]: 'Owners only.' }));
      return;
    }

    const chosenOption = selectedOptions[voteId];

    if (!chosenOption) {
      setVoteMessages((prev) => ({ ...prev, [voteId]: 'Select an option before casting your vote.' }));
      return;
    }

    setSavingVoteId(voteId);
    setVoteMessages((prev) => ({ ...prev, [voteId]: 'Saving vote...' }));

    try {
      await setDoc(doc(db, 'owner_votes', voteId, 'ballots', user.uid), {
        optionId: chosenOption,
        castAt: serverTimestamp(),
      });

      setInitialSelections((prev) => ({ ...prev, [voteId]: chosenOption }));
      setVoteMessages((prev) => ({ ...prev, [voteId]: 'Vote saved.' }));
    } catch (error) {
      console.error('Failed to cast vote', error);
      setVoteMessages((prev) => ({ ...prev, [voteId]: 'Failed to save vote. Please try again.' }));
    } finally {
      setSavingVoteId(null);
    }
  };

  if (loading || isChecking) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  if (!user || !isOwner) {
    return <AccessDenied />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Owners Votes</h1>
      <p className="text-gray-700">
        Access voting packs, ballot summaries, and outcomes. Items appear in reverse chronological
        order.
      </p>

      {fetchState === 'loading' && <p className="text-gray-600">Loading votes...</p>}
      {fetchState === 'error' && (
        <p className="text-red-600">Failed to load votes. Please try again later.</p>
      )}
      {fetchState === 'success' && votes.length === 0 && (
        <p className="text-gray-600">No votes have been posted yet.</p>
      )}

      {fetchState === 'success' && votes.length > 0 && (
        <div className="space-y-5">
          {votes.map((vote) => {
            const selectedOptionId = selectedOptions[vote.id] ?? '';
            const existingSelection = initialSelections[vote.id];
            const existingOption = vote.options.find((option) => option.id === existingSelection);
            const isOpen = vote.status === 'open';
            const buttonLabel = existingSelection ? 'Update vote' : 'Cast vote';
            const showButton = isOpen && vote.options.length > 0;

            return (
              <div key={vote.id} className="rounded-2xl border border-gray-200 p-4 space-y-3">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{vote.title}</h2>
                  <p className="text-sm text-gray-500">Posted {vote.createdAtLabel}</p>
                  {vote.description && <p className="text-gray-700">{vote.description}</p>}
                  {vote.url && (
                    <a href={vote.url} target="_blank" rel="noopener noreferrer" className="underline text-sm">
                      View supporting documents
                    </a>
                  )}
                </div>

                {!isOpen && (
                  <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                    {existingOption ? (
                      <span>
                        Voting closed. You selected <span className="font-medium">{existingOption.label}</span>.
                      </span>
                    ) : (
                      <span>Voting closed. No ballot recorded.</span>
                    )}
                  </div>
                )}

                {isOpen && vote.options.length === 0 && (
                  <p className="text-sm text-gray-600">No options configured for this vote.</p>
                )}

                {showButton && (
                  <form
                    onSubmit={(event) => handleCastVote(event, vote.id)}
                    className="space-y-3"
                  >
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-medium text-gray-700">Select an option</legend>
                      {vote.options.map((option) => (
                        <label key={option.id} className="flex items-center gap-2 text-sm text-gray-800">
                          <input
                            type="radio"
                            name={`vote-${vote.id}`}
                            value={option.id}
                            checked={selectedOptionId === option.id}
                            onChange={() => handleOptionChange(vote.id, option.id)}
                            disabled={!ballotsLoaded || savingVoteId === vote.id}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </fieldset>

                    <button
                      type="submit"
                      disabled={!ballotsLoaded || !selectedOptionId || savingVoteId === vote.id}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingVoteId === vote.id ? 'Saving...' : buttonLabel}
                    </button>
                    {voteMessages[vote.id] && (
                      <p className="text-sm text-gray-600" aria-live="polite">
                        {voteMessages[vote.id]}
                      </p>
                    )}
                    {existingOption && (
                      <p className="text-xs text-gray-500" aria-live="polite">
                        Current ballot: <span className="font-medium">{existingOption.label}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnersVotesPage;
