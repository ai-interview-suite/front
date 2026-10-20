import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Tailored to the role",
    description:
      "Questions are generated from your resume and the job description, so you practice for the interview you will actually get.",
  },
  {
    title: "Detailed scoring",
    description:
      "Every answer is scored for technical accuracy, relevance, completeness and communication, with an overall score out of 100.",
  },
  {
    title: "Actionable feedback",
    description:
      "See the strengths and weaknesses in each answer, plus a summary of what to work on before the real interview.",
  },
  {
    title: "Track your progress",
    description:
      "Every interview is saved, so you can review past reports, compare scores and finish ones you started.",
  },
];

const steps = [
  {
    title: "Upload your resume",
    description: "Add your resume as a PDF and paste the job description.",
  },
  {
    title: "Answer five questions",
    description:
      "Work through technical, design and behavioral questions at your own pace.",
  },
  {
    title: "Get your report",
    description:
      "Receive a score, a recommendation and feedback on every answer.",
  },
];

const screenshots = [
  {
    src: "/screenshots/dashboard.png",
    title: "Start an interview",
    caption: "Upload a resume and paste the job description.",
  },
  {
    src: "/screenshots/interview.png",
    title: "Answer questions",
    caption: "Five questions, one at a time, with progress tracking.",
  },
  {
    src: "/screenshots/results.png",
    title: "Review your results",
    caption: "Overall score, recommendation and per-question breakdown.",
  },
  {
    src: "/screenshots/interviews.png",
    title: "See your history",
    caption: "All your interviews with status, score and recommendation.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              InterviewPrep
            </h1>

            <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 sm:inline">
              AI Powered
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Sign up
            </Link>
          </nav>
        </header>

        <section className="py-20 text-center sm:py-24">
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

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Get started free
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              I already have an account
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <Image
              src="/screenshots/results.png"
              alt="Interview results page showing an overall score of 82 out of 100"
              width={1280}
              height={800}
              priority
            />
          </div>
        </section>

        <section className="py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Why InterviewPrep
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Practice that feels like the real thing, with feedback you can
              act on.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>

          <ol className="mt-10 grid gap-5 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              See it in action
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Screenshots from a sample interview.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {screenshots.map((shot) => (
              <figure key={shot.src}>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
                  <Image
                    src={shot.src}
                    alt={`${shot.title}: ${shot.caption}`}
                    width={1280}
                    height={800}
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="font-semibold">{shot.title}</p>
                  <p className="text-sm text-slate-600">{shot.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="my-16 rounded-2xl bg-blue-600 px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to practice?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Create a free account and run your first mock interview in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 font-medium text-blue-700 transition hover:bg-blue-50"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-blue-300 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Log in
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          InterviewPrep · AI mock interviews tailored to your resume
        </footer>
      </div>
    </main>
  );
}
