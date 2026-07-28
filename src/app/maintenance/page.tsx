import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Održavanje | Dežurstva.com',
  description: 'Trenutno radimo na poboljšanju stranice. Uskoro se vraćamo!',
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary-color px-6 text-center">
      <div className="mb-6 animate-pulse text-6xl">🚑</div>

      <h1 className="mb-4 text-3xl font-bold text-gray-800 sm:text-4xl">
        Trenutno smo na terenu
      </h1>

      <p className="mb-2 max-w-xl text-lg text-gray-600">
        Dežurstva.com je privremeno u dežurnoj pauzi zbog{' '}
        <span className="font-semibold text-secondary-color">
          nadogradnje sustava
        </span>
        .
      </p>

      <p className="mb-8 max-w-xl text-gray-600">
        Ekipa marljivo radi na tome da vam ponudimo bolju stranicu. Kao i naši
        medicinski timovi i spasioci, uskoro se vraćamo &ndash; brzo i
        spremni!
      </p>

      <div className="flex items-center gap-2 rounded-full border border-secondary-color/30 bg-white px-5 py-2 text-sm text-gray-500 shadow-sm">
        <span className="h-2 w-2 animate-ping rounded-full bg-secondary-color" />
        Radovi u tijeku &mdash; hvala na strpljenju
      </div>

      <p className="mt-10 text-sm text-gray-400">
        Za hitna pitanja javite nam se na{' '}
        <a
          href="mailto:info@dezurstva.com"
          className="font-medium text-secondary-color underline underline-offset-2"
        >
          info@dezurstva.com
        </a>
      </p>
    </main>
  );
}