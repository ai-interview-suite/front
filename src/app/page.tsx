
export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            InterviewPrep
          </h1>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            AI Powered
          </span>
        </header>

        <section className="py-24 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Prepare with confidence
          </p>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your next interview starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            Upload your resume, add a job description, and
            practice personalized interview questions with AI.
          </p>

          <button
            type="button"
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Get Started
          </button>
        </section>
      </div>
    </main>
  );
}
