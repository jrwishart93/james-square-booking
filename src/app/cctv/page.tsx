import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const requestPdf = '/docs/survey/James-Square-CCTV-Review-Request-v1.3-fillable.pdf';
const outcomePdf = '/docs/survey/James-Square-CCTV-Review-Outcome-v1.3-fillable.pdf';
const email = 'cctv@james-square.com';
const mailto = 'mailto:cctv@james-square.com?subject=Completed%20CCTV%20Review%20Request';

const button =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

export default function CctvPage() {
  return (
    <article className="mx-auto max-w-5xl text-slate-800 dark:text-slate-100">
      <Link
        href="/"
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline dark:text-slate-300 dark:hover:text-white"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to James Square
      </Link>

      <header className="max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Public information
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          CCTV Review Requests
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-200">
          Use this page to request that available CCTV recordings are reviewed following an
          incident at James Square.
        </p>
        <p className="mt-3 font-semibold text-slate-950 dark:text-white">
          This is a request for CCTV to be checked. It is not a request for footage to be sent
          directly to a resident or owner.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8 dark:border-blue-800 dark:bg-blue-950/40" aria-labelledby="key-information">
        <div className="flex gap-4">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-blue-700 dark:text-blue-300" />
          <div>
            <h2 id="key-information" className="text-xl font-bold text-slate-950 dark:text-white">What a CCTV review can confirm</h2>
            <div className="mt-3 space-y-3 leading-7">
              <p>James Square CCTV recordings can be reviewed to determine whether footage that may be relevant to an incident is available.</p>
              <p>For data-protection reasons, CCTV footage cannot normally be viewed by or supplied directly to residents or owners. You will only be told whether potentially relevant footage may be available.</p>
              <p>Where footage may be relevant, it can then be requested by Police Scotland, an insurer, solicitor or another organisation with a lawful and justified reason to receive it.</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="mt-5 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-5 dark:bg-amber-950/40" aria-labelledby="retention-warning">
        <div className="flex gap-3">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-amber-700 dark:text-amber-300" />
          <div>
            <h2 id="retention-warning" className="font-bold text-amber-950 dark:text-amber-100">Submit your request promptly</h2>
            <p className="mt-1 leading-7 text-amber-950 dark:text-amber-100">CCTV recordings are retained for a limited period and may be automatically overwritten. Submit the review request as soon as possible after the incident.</p>
          </div>
        </div>
      </aside>

      <section className="mt-12" aria-labelledby="police-reporting">
        <h2 id="police-reporting" className="text-2xl font-bold text-slate-950 dark:text-white">Report suspected crime to Police Scotland</h2>
        <p className="mt-4 max-w-3xl leading-7">If you believe a crime has occurred, report it to Police Scotland as soon as possible and obtain a police reference number.</p>
        <p className="mt-2 max-w-3xl leading-7">For non-emergency incidents, use the Police Scotland online contact form or call <strong>101</strong>. In an emergency, call <strong>999</strong>. Submitting a James Square form does not report an incident to Police Scotland.</p>
        <a href="https://www.scotland.police.uk/secureforms/contact/" target="_blank" rel="noopener noreferrer" className={`${button} mt-5 border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}>
          Report to Police Scotland online
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>

      <section className="mt-14" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-2xl font-bold text-slate-950 dark:text-white">How the review process works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ['Report the incident', 'If the matter may involve a crime, report it to Police Scotland and obtain a reference number.'],
            ['Complete the CCTV review request', 'Download and complete the James Square CCTV Review Request Form. Provide the incident date, approximate time, location and any information that may help identify the correct recording.'],
            ['James Square reviews the available recordings', 'The authorised CCTV reviewer will check the available recordings using the information supplied. The response will confirm only whether footage that may be relevant is available.'],
            ['Send the outcome to the relevant organisation', 'If potentially relevant footage may be available, the completed review outcome can be passed to the Police Scotland enquiry officer, insurer, solicitor or other authorised organisation. That organisation must contact James Square directly and provide an appropriate official or data-protection request.'],
          ].map(([title, copy], index) => (
            <li key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white dark:bg-blue-300 dark:text-slate-950">{index + 1}</span>
                <div><h3 className="font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">{copy}</p></div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 rounded-2xl border-2 border-blue-700 bg-white p-6 shadow-lg sm:p-9 dark:border-blue-400 dark:bg-slate-900" aria-labelledby="request-form-heading">
        <div className="flex items-center gap-3"><FileText aria-hidden="true" className="size-7 text-blue-700 dark:text-blue-300" /><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800 dark:bg-blue-900 dark:text-blue-100">Main form</span></div>
        <h2 id="request-form-heading" className="mt-5 text-3xl font-bold text-slate-950 dark:text-white">Request a CCTV review</h2>
        <p className="mt-3 max-w-3xl leading-7">Complete this form if you would like James Square to check whether potentially relevant CCTV footage may be available.</p>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="font-bold text-slate-950 dark:text-white">James Square CCTV Review Request Form</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Fillable PDF · v1.3 · approximately 294 KB</p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={requestPdf} target="_blank" rel="noopener noreferrer" className={`${button} bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400`}>
            <FileText aria-hidden="true" className="size-5" /> Open fillable request form <span className="sr-only">PDF (opens in a new tab)</span>
          </a>
          <a href={requestPdf} download="James-Square-CCTV-Review-Request-v1.3-fillable.pdf" className={`${button} border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}>
            <Download aria-hidden="true" className="size-5" /> Download request form <span className="sr-only">PDF</span>
          </a>
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <div><h3 className="font-bold text-slate-950 dark:text-white">Complete and return the form</h3><ol className="mt-3 list-decimal space-y-2 pl-5 leading-7"><li>Open and complete the form electronically.</li><li>Save a completed copy.</li><li>Alternatively, print and complete it by hand.</li><li>Email the completed form to James Square.</li></ol></div>
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700"><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Submission email</p><a className="mt-1 block break-all text-lg font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" href={mailto}>{email}</a><p className="mt-3 leading-7">Attach your completed request form to the email and include your name and James Square property or flat in the message.</p></div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/60" aria-labelledby="pdf-help">
        <h2 id="pdf-help" className="text-xl font-bold text-slate-950 dark:text-white">Completing the fillable PDF</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7"><li>Open the form and enter the required information.</li><li>Save a copy to your device before closing it.</li><li>Attach the saved form to an email addressed to <a className="break-all font-semibold text-blue-700 underline dark:text-blue-300" href={mailto}>{email}</a>.</li><li>Alternatively, print the form, complete it in dark ink and return it to the James Square caretaker.</li></ul>
        <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 dark:border-slate-700">For the most reliable form-filling and saving experience, download the PDF and open it using a dedicated PDF reader such as Adobe Acrobat Reader. Adobe is not required.</p>
      </section>

      <section className="mt-12 rounded-2xl border border-slate-300 bg-slate-100 p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-900/60" aria-labelledby="outcome-heading">
        <div className="flex flex-wrap items-center gap-3"><FileCheck2 aria-hidden="true" className="size-6 text-slate-600 dark:text-slate-300" /><span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white dark:bg-slate-200 dark:text-slate-900">For authorised James Square use</span></div>
        <h2 id="outcome-heading" className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">CCTV Review Outcome Form</h2>
        <p className="mt-3 max-w-3xl leading-7">The outcome form is completed by the authorised CCTV reviewer after available recordings have been checked.</p>
        <p className="mt-2 max-w-3xl leading-7">A completed copy may then be returned to the person who submitted the request. It will confirm whether potentially relevant footage may be available but will not describe what the footage shows.</p>
        <p className="mt-3 text-sm font-medium">Fillable PDF · v1.3 · approximately 250 KB</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={outcomePdf} target="_blank" rel="noopener noreferrer" className={`${button} border border-slate-400 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}>View outcome form <span className="sr-only">PDF (opens in a new tab)</span></a>
          <a href={outcomePdf} download="James-Square-CCTV-Review-Outcome-v1.3-fillable.pdf" className={`${button} text-slate-700 underline hover:text-slate-950 dark:text-slate-200 dark:hover:text-white`}><Download aria-hidden="true" className="size-4" /> Download outcome form <span className="sr-only">PDF</span></a>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="footage-available">
        <h2 id="footage-available" className="text-2xl font-bold text-slate-950 dark:text-white">If potentially relevant footage may be available</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div><h3 className="text-lg font-bold text-slate-950 dark:text-white">Police Scotland</h3><p className="mt-3 leading-7">Provide the completed CCTV Review Outcome Form to the Police Scotland enquiry officer.</p><p className="mt-3 leading-7">The enquiry officer should send an official AXON DESC evidence request or secure evidence-submission link to <a href={`mailto:${email}`} className="break-all font-semibold text-blue-700 underline dark:text-blue-300">{email}</a>.</p><p className="mt-3 leading-7">Once a valid request has been received and verified, authorised James Square staff can securely submit the relevant footage directly to Police Scotland.</p></div>
          <div><h3 className="text-lg font-bold text-slate-950 dark:text-white">Insurer, solicitor or another organisation</h3><p className="mt-3 leading-7">An insurer, solicitor or another organisation seeking the footage must contact <a href={`mailto:${email}`} className="break-all font-semibold text-blue-700 underline dark:text-blue-300">{email}</a>.</p><p className="mt-3 leading-7">The organisation will be required to explain why the footage is needed and provide an appropriate written data-protection disclosure request.</p><p className="mt-3 leading-7">Footage will only be disclosed after the request has been reviewed and authorised.</p></div>
        </div>
      </section>

      <section className="mt-14 border-t border-slate-300 pt-10 dark:border-slate-700" aria-labelledby="data-protection">
        <div className="flex gap-4"><LockKeyhole aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-slate-600 dark:text-slate-300" /><div><h2 id="data-protection" className="text-2xl font-bold text-slate-950 dark:text-white">Why footage cannot be sent directly to residents</h2><div className="mt-4 max-w-3xl space-y-3 leading-7"><p>CCTV recordings may contain images of residents, visitors, employees, vehicles and other identifiable individuals.</p><p>They must therefore be handled securely and only disclosed where there is an appropriate lawful basis.</p><p>James Square can review available recordings and confirm whether footage that may be relevant exists, but footage cannot normally be supplied directly to the person submitting the review request.</p></div></div></div>
      </section>

      <section className="mt-14 rounded-2xl bg-slate-900 p-6 text-white sm:p-8 dark:bg-blue-950" aria-labelledby="contact-heading">
        <Mail aria-hidden="true" className="size-7 text-blue-300" />
        <h2 id="contact-heading" className="mt-4 text-2xl font-bold">CCTV request contact</h2>
        <a href={mailto} className="mt-3 block break-all text-xl font-bold text-blue-300 underline underline-offset-4">{email}</a>
        <p className="mt-3 max-w-2xl leading-7 text-slate-200">Use this address to submit a completed request form or for an authorised organisation to make a formal request concerning potentially relevant footage.</p>
        <a href={mailto} className={`${button} mt-6 bg-white text-slate-950 hover:bg-blue-50`}><Mail aria-hidden="true" className="size-5" /> Email the CCTV contact</a>
      </section>
    </article>
  );
}
