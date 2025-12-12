import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { addQuestion } from '../services/storageService';
import { useNavigate } from 'react-router-dom';

const AskQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{title?: string, options?: string}>({});

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
    const newErrors: {title?: string, options?: string} = {};
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const validOptions = options.filter(o => o.trim().length > 0);
      await addQuestion(title, description, validOptions);
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
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
