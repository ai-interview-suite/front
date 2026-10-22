"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson } from "@/lib/api";

type InterviewStatus = "in_progress" | "completed";

type InterviewSummary = {
  interview_id: string;
  job_description: string;
  status: InterviewStatus;
  total_questions: number;
  answered_questions: number;
  overall_score: number | null;
  recommendation: string | null;
  created_at: string;
};

const statusLabels: Record<InterviewStatus, string> = {
  in_progress: "In progress",
  completed: "Completed",
};

const recommendationLabels: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  borderline: "Borderline",
  needs_improvement: "Needs improvement",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function InterviewsPage() {
  const router = useRouter();

  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadInterviews() {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const data = await getJson<InterviewSummary[]>("/interview/", token);

        if (!cancelled) {
          setInterviews(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your interviews."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInterviews();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">My interviews</h1>

          <p className="mt-3 text-slate-600">
            Review your past interviews and pick up where you left off.
          </p>

          {loading ? (
            <p className="mt-8 text-slate-600">Loading your interviews...</p>
          ) : error ? (
            <p role="alert" className="mt-8 text-sm text-red-600">
              {error}
            </p>
          ) : interviews.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold">No interviews yet</p>
              <p className="mt-2 text-sm text-slate-500">
                Start your first interview to see it here.
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Start interview
              </button>
            </div>
          ) : (
            <ul className="mt-8 space-y-4">
              {interviews.map((interview) => {
                const completed = interview.status === "completed";
                const href = completed
                  ? `/interview/${interview.interview_id}/results`
                  : `/interview/${interview.interview_id}`;

                return (
                  <li key={interview.interview_id}>
                    <a
                      href={href}
                      className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm text-slate-500">
                            {dateFormatter.format(
                              new Date(interview.created_at)
                            )}
                          </p>
                          <p className="mt-2 line-clamp-2 leading-6 text-slate-700">
                            {interview.job_description}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-lg px-3 py-1 text-sm font-semibold ${
                            completed
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {statusLabels[interview.status] ?? interview.status}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                        <span>
                          Answered {interview.answered_questions}/
                          {interview.total_questions}
                        </span>

                        {interview.overall_score !== null && (
                          <span>
                            Score{" "}
                            <span className="font-semibold text-slate-900">
                              {interview.overall_score}/100
                            </span>
                          </span>
                        )}

                        {interview.recommendation && (
                          <span>
                            {recommendationLabels[interview.recommendation] ??
                              interview.recommendation}
                          </span>
                        )}

                        <span className="ml-auto font-medium text-blue-600">
                          {completed ? "View results" : "Continue"}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
