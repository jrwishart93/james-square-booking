'use client';

import { FormEvent, useRef, useState } from 'react';
import { CctvErrors, CctvRequest, validateCctvRequest } from '@/lib/cctvRequest';

const today = () => new Date().toISOString().slice(0, 10);
const initial: CctvRequest = { requestorName:'',email:'',telephone:'',property:'',preferredContact:'email',incidentDate:'',timePrecision:'exact',incidentTime:'',timeFrom:'',timeTo:'',incidentType:'crime',location:'',detailedLocation:'',policeStatus:'not-reported',policeReportDate:'',policeReference:'',officerDetails:'',narrative:'',identifyingDetails:'',signature:'',submissionDate:today(),privacyAcknowledgement:false,policeAcknowledgement:false,website:'' };
const inputClass = 'mt-1 min-h-11 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-950 focus:outline focus:outline-2 focus:outline-blue-600';

class CctvApiError extends Error {}

async function sendRequest(data: CctvRequest) {
  // WebKit can reject a relative fetch target with a DOMException reading
  // "The string did not match the expected pattern" in installed/standalone
  // contexts. Resolve the route against the current page so fetch always gets
  // a fully qualified, same-origin URL.
  const endpoint = new URL('/api/cctv/request', window.location.href);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await response.json().catch(() => null) as { error?: string; requestId?: string } | null;

  if (!response.ok) {
    throw new CctvApiError(body?.error || 'We could not submit your request. Please try again.');
  }
  if (!body?.requestId || !/^JS-\d{8}-\d{4}$/.test(body.requestId)) {
    throw new CctvApiError('The server returned an invalid request reference. Please try again.');
  }
  return body.requestId;
}

export default function CctvRequestForm() {
  const [form,setForm] = useState(initial); const [errors,setErrors] = useState<CctvErrors>({});
  const [state,setState] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [message,setMessage] = useState(''); const [reference,setReference] = useState('');
  const status = useRef<HTMLDivElement>(null);
  const set = <K extends keyof CctvRequest>(key: K, value: CctvRequest[K]) => setForm(old => ({...old,[key]:value}));
  const field = (key:keyof CctvRequest,label:string,type='text',required=true) => <label className="block font-medium">{label}{required && <span aria-hidden="true" className="text-red-700"> *</span>}<input className={inputClass} type={type} value={form[key] as string} onChange={e=>set(key,e.target.value as never)} required={required} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`${key}-error`:undefined}/>{errors[key]&&<span id={`${key}-error`} className="mt-1 block text-sm text-red-700">{errors[key]}</span>}</label>;
  const select = (key:keyof CctvRequest,label:string,options:[string,string][]) => <label className="block font-medium">{label} <span aria-hidden="true" className="text-red-700">*</span><select className={inputClass} value={form[key] as string} onChange={e=>set(key,e.target.value as never)}>{options.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select>{errors[key]&&<span className="text-sm text-red-700">{errors[key]}</span>}</label>;
  async function submit(event:FormEvent) {
    event.preventDefault(); if(state==='submitting') return;
    const checked=validateCctvRequest(form); if(!checked.success){setErrors(checked.errors);setState('error');setMessage('Please correct the highlighted fields.');queueMicrotask(()=>status.current?.focus());return;}
    setErrors({});setState('submitting');setMessage('Submitting your request…');
    try { const requestId=await sendRequest(checked.data); setReference(requestId);setState('success');setMessage(`Request submitted successfully. Your reference is ${requestId}.`);setForm({...initial,submissionDate:today()}); }
    catch(error){setState('error');setMessage(error instanceof CctvApiError ? error.message : 'We could not submit your request. Please try again. Your entries have been preserved.');}
    finally { queueMicrotask(()=>status.current?.focus()); }
  }
  return <form onSubmit={submit} noValidate className="mt-8 space-y-8">
    <p className="text-sm"><span className="text-red-700">*</span> Required field</p>
    <fieldset className="grid gap-5 sm:grid-cols-2"><legend className="mb-4 text-xl font-bold">Your details</legend>{field('requestorName','Requestor name')}{field('email','Email','email')}{field('telephone','Telephone','tel')}{field('property','James Square property / flat')}{select('preferredContact','Preferred contact method',[['email','Email'],['telephone','Telephone']])}</fieldset>
    <fieldset className="grid gap-5 sm:grid-cols-2"><legend className="mb-4 text-xl font-bold">Incident details</legend>{field('incidentDate','Incident date','date')}{select('timePrecision','Time is',[['exact','Exact'],['approximate','Approximate'],['window','A time window']])}{form.timePrecision==='window'?<>{field('timeFrom','From','time')}{field('timeTo','To','time')}</>:field('incidentTime',form.timePrecision==='exact'?'Exact time':'Approximate time','time')}{select('incidentType','Incident type',[['crime','Suspected crime'],['antisocial-behaviour','Antisocial behaviour'],['vehicle','Vehicle'],['delivery-package','Delivery / package'],['accident','Accident'],['other','Other']])}{field('location','Location')}{field('detailedLocation','Detailed location')}
      <label className="block font-medium sm:col-span-2">Incident narrative <span className="text-red-700">*</span><textarea className={inputClass} rows={6} value={form.narrative} onChange={e=>set('narrative',e.target.value)} aria-invalid={!!errors.narrative}/>{errors.narrative&&<span className="text-sm text-red-700">{errors.narrative}</span>}</label>
      {(form.incidentType==='vehicle'||form.incidentType==='delivery-package'||form.incidentType==='crime')&&<label className="block font-medium sm:col-span-2">Identifying details for people, vehicles, deliveries or packages{(form.incidentType==='vehicle'||form.incidentType==='delivery-package')&&<span className="text-red-700"> *</span>}<textarea className={inputClass} rows={4} value={form.identifyingDetails} onChange={e=>set('identifyingDetails',e.target.value)}/>{errors.identifyingDetails&&<span className="text-sm text-red-700">{errors.identifyingDetails}</span>}</label>}</fieldset>
    <fieldset className="grid gap-5 sm:grid-cols-2"><legend className="mb-4 text-xl font-bold">Police Scotland report</legend>{select('policeStatus','Reporting status',[['not-reported','Not reported'],['reported','Reported'],['not-applicable','Not applicable']])}{form.policeStatus==='reported'&&<>{field('policeReportDate','Report date','date')}{field('policeReference','Reference number')}{field('officerDetails','Officer / station details')}</>}</fieldset>
    <fieldset className="grid gap-5 sm:grid-cols-2"><legend className="mb-4 text-xl font-bold">Confirmation</legend>{field('signature','Typed signature / full name')}{field('submissionDate','Submission date','date')}<label className="flex gap-3 sm:col-span-2"><input type="checkbox" className="size-5 shrink-0" checked={form.privacyAcknowledgement} onChange={e=>set('privacyAcknowledgement',e.target.checked)}/><span>I acknowledge that my personal information will be used to assess this CCTV request. <span className="text-red-700">*</span>{errors.privacyAcknowledgement&&<span className="block text-sm text-red-700">{errors.privacyAcknowledgement}</span>}</span></label><label className="flex gap-3 sm:col-span-2"><input type="checkbox" className="size-5 shrink-0" checked={form.policeAcknowledgement} onChange={e=>set('policeAcknowledgement',e.target.checked)}/><span>I understand that submitting this form does not report a crime to Police Scotland. <span className="text-red-700">*</span>{errors.policeAcknowledgement&&<span className="block text-sm text-red-700">{errors.policeAcknowledgement}</span>}</span></label></fieldset>
    <label className="absolute -left-[10000px]" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>set('website',e.target.value)}/></label>
    <button disabled={state==='submitting'} className="min-h-12 rounded-lg bg-blue-700 px-6 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-60">{state==='submitting'?'Submitting…':'Submit CCTV review request'}</button>
    <div ref={status} tabIndex={-1} role={state==='error'?'alert':'status'} aria-live="polite" className={message?'rounded-lg border p-4 font-medium':''}>{message}</div>
    {state==='success'&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="presentation"><section ref={status} tabIndex={-1} role="status" aria-live="assertive" aria-labelledby="cctv-success-title" className="w-full max-w-lg rounded-2xl bg-white p-8 text-center text-slate-900 shadow-2xl outline-none motion-safe:animate-[pulse_600ms_ease-out_1] dark:bg-slate-900 dark:text-white"><div className="relative mx-auto flex size-20 items-center justify-center"><span className="absolute inset-0 rounded-full bg-green-300 opacity-40" aria-hidden="true"/><span className="relative flex size-16 items-center justify-center rounded-full bg-green-600 text-white" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4L19 6"/></svg></span></div><h3 id="cctv-success-title" className="mt-5 text-2xl font-bold">Request sent successfully</h3><p className="mt-3">Keep this reference number for your records:</p><p className="mt-3 rounded-lg bg-slate-100 px-4 py-3 font-mono text-2xl font-extrabold tracking-wide dark:bg-slate-800">{reference}</p><p className="mt-4 text-sm leading-6">This submission does not report a crime. Contact Police Scotland separately if appropriate.</p><button type="button" onClick={()=>{setState('idle');setMessage('');setReference('');}} className="mt-6 min-h-11 rounded-lg bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800">Close confirmation</button></section></div>}
  </form>;
}
