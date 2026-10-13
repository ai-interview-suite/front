
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { postFormData } from "@/lib/api";

type InterviewQuestion = {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  expected_topics: string[];
};

type InterviewStartResponse = {
  interview_id: string;
  questions: InterviewQuestion[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!resume || resume.type !== "application/pdf") {
      setError("Please select a PDF resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription.trim());

    setLoading(true);

    try {
      const result = await postFormData<InterviewStartResponse>(
        "/interview/start",
        formData,
        token
      );

      if (!result.interview_id || result.questions.length !== 5) {
        throw new Error("The server returned an invalid interview response.");
      }

      sessionStorage.setItem(
        `interview-${result.interview_id}`,
        JSON.stringify(result.questions)
      );

      router.push(`/interview/${result.interview_id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <a href="/dashboard" className="text-xl font-bold">
            InterviewPrep
          </a>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("access_token");
              router.push("/login");
            }}
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Sign out
          </button>
        </header>

        <section className="mt-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Prepare for your next interview
          </h1>

          <p className="mt-3 text-slate-600">
            Upload your resume and add the job description to generate five
            personalized interview questions.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="resume"
                className="mb-2 block text-sm font-semibold"
              >
                Resume (PDF)
              </label>

              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                required
                onChange={(event) =>
                  setResume(event.target.files?.[0] ?? null)
                }
                className="block w-full rounded-lg border border-slate-300 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-medium file:text-blue-700"
              />

              <p className="mt-2 text-xs text-slate-500">
                Select a PDF containing readable resume text.
              </p>
            </div>

            <div>
              <label
                htmlFor="jobDescription"
                className="mb-2 block text-sm font-semibold"
              >
                Job description
              </label>

              <textarea
                id="jobDescription"
                required
                rows={8}
                maxLength={15000}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
                className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600"
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {jobDescription.length}/15000
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating questions..." : "Start interview"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
