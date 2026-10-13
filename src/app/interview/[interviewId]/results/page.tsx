
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJson } from "@/lib/api";

type Recommendation =
  | "excellent"
  | "good"
  | "borderline"
  | "needs_improvement";

type QuestionResult = {
  question_id: number;
  score: number;
  technical_accuracy: number;
  relevance: number;
  completeness: number;
  communication: number;
  evidence: string[];
  strengths: string[];
  weaknesses: string[];
  feedback: string;
};

type InterviewResult = {
  interview_id: string;
  overall_score: number;
  recommendation: Recommendation;
  conclusion: string;
  total_questions: number;
  question_results: QuestionResult[];
};

const dimensions = [
  { key: "technical_accuracy", label: "Technical accuracy" },
  { key: "relevance", label: "Relevance" },
  { key: "completeness", label: "Completeness" },
  { key: "communication", label: "Communication" },
] as const;

export default function ResultsPage() {
  const params = useParams<{ interviewId: string }>();
  const interviewId = params.interviewId;
  const router = useRouter();

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResult() {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const data = await getJson<InterviewResult>(
          `/interview/${interviewId}/result`,
          token
        );

        if (!cancelled) {
          setResult(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load interview results."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResult();

    return () => {
      cancelled = true;
    };
  }, [interviewId, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-slate-600">Loading your results...</p>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-2xl font-bold">Unable to load results</h1>
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error || "The interview report is unavailable."}
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Back to dashboard
        </button>
      </main>
    );
  }

  const recommendationLabels: Record<Recommendation, string> = {
    excellent: "Excellent",
    good: "Good",
    borderline: "Borderline",
    needs_improvement: "Needs improvement",
  };

  return (
    <main className="min-h-screen px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <a href="/dashboard" className="text-xl font-bold">
            InterviewPrep
          </a>

          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            New interview
          </button>
        </header>

        <section className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Interview report
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Your interview results
          </h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Overall score</p>
              <p className="mt-2 text-5xl font-bold">
                {result.overall_score}
                <span className="text-xl font-medium text-slate-400">
                  /100
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Recommendation</p>
              <p className="mt-3 text-2xl font-bold">
                {recommendationLabels[result.recommendation] ??
                  result.recommendation}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Based on your interview evaluation
              </p>
            </div>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold">Overall feedback</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {result.conclusion}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Questions evaluated: {result.total_questions}
            </p>
          </section>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Question-by-question review</h2>

          <div className="mt-5 space-y-6">
            {result.question_results.map((item) => (
              <article
                key={item.question_id}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold">
                    Question {item.question_id}
                  </h3>
                  <span className="rounded-lg bg-blue-50 px-3 py-2 font-bold text-blue-700">
                    {item.score}/100
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {dimensions.map((dimension) => (
                    <div key={dimension.key}>
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <span className="text-slate-600">
                          {dimension.label}
                        </span>
                        <span className="font-semibold">
                          {item[dimension.key]}/10
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${item[dimension.key] * 10}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h4 className="font-semibold">Evidence</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                    {item.evidence.map((entry, index) => (
                      <li key={index}>{entry}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">Strengths</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                      {item.strengths.map((entry, index) => (
                        <li key={index}>{entry}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold">Areas to improve</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                      {item.weaknesses.map((entry, index) => (
                        <li key={index}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <h4 className="font-semibold">Actionable feedback</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.feedback}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Start another interview
          </button>
        </div>
      </div>
    </main>
  );
}
