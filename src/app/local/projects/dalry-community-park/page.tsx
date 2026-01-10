import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageContainer from '@/components/layout/PageContainer';

const pageTitle = 'Friends of Dalry Community Park';
const pageDescription = 'Community meeting and local projects relating to Dalry Community Park.';
const twitterDescription = 'Community meeting and future plans for Dalry Community Park.';
const pageUrl = 'https://www.james-square.com/local/projects/dalry-community-park';
const imageUrl = 'https://www.james-square.com/images/area/Dalry-play%20park.PNG';

const meetingTitle = 'Friends of Dalry Community Park – Community Meeting';
const meetingDescription =
  'Community meeting to follow up on issues raised last year and discuss future events in Dalry Community Park.';
const meetingLocation = 'St Bride’s Community Centre, 10 Orwell Terrace';
const meetingDate = new Date(Date.UTC(2026, 0, 12, 20, 30));
const meetingStart = '20260112T190000Z';
const meetingEnd = '20260112T203000Z';
const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  meetingTitle
)}&dates=${meetingStart}/${meetingEnd}&details=${encodeURIComponent(meetingDescription)}&location=${encodeURIComponent(
  meetingLocation
)}`;
const icsFilePath = '/calendar/friends-of-dalry-community-park-2026.ics';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'article',
    images: [
      {
        url: imageUrl,
        width: 1152,
        height: 1536,
        alt: 'Dalry Community Park play park',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: twitterDescription,
    images: [imageUrl],
  },
};

export const dynamic = 'force-dynamic';

export default function DalryCommunityParkPage() {
  const now = new Date();
  const isPostMeeting = now > meetingDate;

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-5xl py-12 space-y-10">
        <Link
          href="/local#local-projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <span aria-hidden>←</span>
          Back to Local Projects
        </Link>

        <header className="space-y-6">
          <Image
            src="/images/area/Dalry-play park.PNG"
            alt="Dalry Community Park play park"
            width={1152}
            height={1536}
            priority
            sizes="(min-width: 1024px) 480px, 100vw"
            className="w-full h-auto rounded-3xl border border-slate-200/70 dark:border-slate-800/70 object-contain"
          />

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100">
              {pageTitle}
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Friends of Dalry Community Park are holding a community meeting to follow up on issues raised with the
              Project Manager at last year’s meeting. All residents are welcome to attend and take part in discussions
              about the future of the park.
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm space-y-6">
          {!isPostMeeting ? (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Meeting details</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monday 12 January · 7:00pm – 8:30pm · {meetingLocation}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Agenda items include:</p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>🗑️ Bins and litter</li>
                  <li>🎨 Graffiti</li>
                  <li>🐾 Muddy desire line</li>
                  <li>⛔ Duff Street entrance</li>
                </ul>
              </div>

              <p className="text-slate-700 dark:text-slate-300">
                There will also be discussion about whether to arrange a community event in the park later in the
                spring or summer, including ideas on what this could look like and forming a small working group to take
                it forward.
              </p>

              <p className="font-semibold text-slate-900 dark:text-slate-100">All welcome.</p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add to Calendar</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    Add to Google Calendar
                  </a>
                  <a
                    href={icsFilePath}
                    download="friends-of-dalry-community-park-2026.ics"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
                  >
                    Add to Apple Calendar
                  </a>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-700 dark:text-slate-300">
              A meeting of Friends of Dalry Community Park was held recently to follow up on issues raised with the
              Project Manager. A summary of discussions and any agreed next steps will be shared in due course.
            </p>
          )}
        </section>

        <Link
          href="/local#local-projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <span aria-hidden>←</span>
          Back to Local Projects
        </Link>
      </div>
    </PageContainer>
  );
}
