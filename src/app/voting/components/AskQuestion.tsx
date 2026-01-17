import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { addQuestion } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import { DURATION_PRESETS, DurationPreset } from '@/lib/voteExpiry';

const AskQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    options?: string;
    startsAt?: string;
    endsAt?: string;
  }>({});
  const [durationPreset, setDurationPreset] = useState<DurationPreset>('1m');
  const [useCustomWindow, setUseCustomWindow] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOptionField = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOptionField = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const validate = (): boolean => {
    const newErrors: {
      title?: string;
      options?: string;
      startsAt?: string;
      endsAt?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Question title is required';
      isValid = false;
    }

    const filledOptions = options.filter(o => o.trim().length > 0);
    if (filledOptions.length < 2) {
      newErrors.options = 'Please provide at least 2 options';
      isValid = false;
    }

    if (useCustomWindow) {
      if (!startsAt) {
        newErrors.startsAt = 'Please choose a start date and time';
        isValid = false;
      }

      if (!endsAt) {
        newErrors.endsAt = 'Please choose an end date and time';
        isValid = false;
      }

      if (startsAt && endsAt) {
        const startDate = new Date(startsAt);
        const endDate = new Date(endsAt);
        const now = new Date();

        if (Number.isNaN(startDate.getTime())) {
          newErrors.startsAt = 'Start time is invalid';
          isValid = false;
        }

        if (Number.isNaN(endDate.getTime())) {
          newErrors.endsAt = 'End time is invalid';
          isValid = false;
        }

        if (endDate <= startDate) {
          newErrors.endsAt = 'End time must be after the start time';
          isValid = false;
        }

        if (startDate <= now) {
          newErrors.startsAt = 'Start time must be in the future';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const validOptions = options.filter(o => o.trim().length > 0);
      const customWindow = useCustomWindow
        ? { startsAt: new Date(startsAt), expiresAt: new Date(endsAt) }
        : undefined;
      await addQuestion(
        title,
        description,
        validOptions,
        useCustomWindow ? undefined : durationPreset,
        customWindow,
      );
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setDurationPreset('1m');
      setUseCustomWindow(false);
      setStartsAt('');
      setEndsAt('');
    } catch (err) {
      console.error(err);
      alert('Failed to save question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in h-full">
        <div className="bg-emerald-50 p-5 rounded-full mb-6 border border-emerald-200 shadow-[0_16px_40px_rgba(16,185,129,0.18)]">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Question Published!</h2>
        <p className="text-slate-600 mb-10 max-w-sm leading-relaxed">
          Your question is now live. Users can find it immediately in the &quot;Vote&quot; tab.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button variant="outline" fullWidth onClick={() => setSuccess(false)}>Ask Another</Button>
          <Button fullWidth onClick={() => navigate('/vote')}>Go to Voting</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Ask a Question</h1>
        <p className="text-slate-600">Create a poll for other owners to vote on.</p>
      </div>

      <div className="
        rounded-3xl
        bg-white
        border border-slate-200
        p-6 md:p-8
        shadow-[0_24px_70px_rgba(15,23,42,0.14)]
      ">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-5">
            <Input
              label="Question Title"
              placeholder="e.g., Should we install solar panels?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5 ml-1">
                Description <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                className="
                  w-full rounded-2xl
                  bg-white
                  border border-slate-300
                  px-4 py-3
                  text-sm text-slate-900
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:ring-2 focus:ring-cyan-500
                  focus:border-cyan-400
                  shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                  transition-all
                  h-28 resize-none
                "
                placeholder="Add more context details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2">
              <label className="block text-sm font-semibold text-slate-800 ml-1">Options</label>
              <span className="text-xs text-slate-500 font-mono">Min 2 • Max 6</span>
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 group">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOptionField(index)}
                      className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      aria-label="Remove option"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && <p className="text-sm text-red-600 ml-1">{errors.options}</p>}

            {options.length < 6 && (
              <button
                type="button"
                onClick={addOptionField}
                className="
                  flex items-center text-sm font-medium
                  text-cyan-700 hover:text-cyan-900
                  transition-colors mt-2 px-2 py-1 rounded-lg hover:bg-cyan-50
                "
              >
                <Plus size={16} className="mr-1.5" /> Add Another Option
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <label className="block text-sm font-semibold text-slate-800 ml-1">Voting window</label>
              <span className="text-xs text-slate-500 font-mono">Default 1 month</span>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="voting-window"
                  checked={!useCustomWindow}
                  onChange={() => setUseCustomWindow(false)}
                  className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
                />
                Use duration preset
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="voting-window"
                  checked={useCustomWindow}
                  onChange={() => setUseCustomWindow(true)}
                  className="h-4 w-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
                />
                Set custom start &amp; end time
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((preset) => {
                const isActive = durationPreset === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDurationPreset(preset.value)}
                    disabled={useCustomWindow}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      isActive
                        ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-[0_10px_30px_rgba(6,182,212,0.1)]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300 hover:text-cyan-800'
                    } ${useCustomWindow ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            {useCustomWindow && (
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="datetime-local"
                  label="Voting starts (UK time)"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  error={errors.startsAt}
                />
                <Input
                  type="datetime-local"
                  label="Voting ends (UK time)"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  error={errors.endsAt}
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Publish Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
