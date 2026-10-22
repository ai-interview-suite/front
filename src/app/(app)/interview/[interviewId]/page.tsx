
"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { postJson } from "@/lib/api";

type InterviewQuestion = {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  expected_topics: string[];
};

type SaveAnswerResponse = {
  message: string;
  interview_id: string;
  question_id: number;
};

type InterviewResult = {
  interview_id: string;
  overall_score: number;
  recommendation: string;
  conclusion: string;
  total_questions: number;
  question_results: unknown[];
};

export default function InterviewPage() {
  return (
    <Suspense fallback={<div>Loading interview...</div>}>
      <InterviewContent />
    </Suspense>
  );
}


function InterviewContent() {
  const params = useParams<{ interviewId: string }>();
  const interviewId = params.interviewId;
  const router = useRouter();

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`interview-${interviewId}`);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as InterviewQuestion[];

        if (Array.isArray(parsed) && parsed.length === 5) {
          setQuestions(parsed);
        } else {
          setError("Interview questions are unavailable. Please start again.");
        }
      } catch {
        setError("Unable to read interview questions. Please start again.");
      }
    } else {
      setError("Interview questions are unavailable. Please start a new interview.");
    }

    setReady(true);
  }, [interviewId]);

  const question = questions[currentIndex];
  const answeredCount = questions.filter(
    (item) => (answers[item.id] ?? "").trim().length > 0
  ).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (questions.length !== 5) {
      setError("The five interview questions are not available.");
      return;
    }

    const unanswered = questions.filter(
      (item) => !(answers[item.id] ?? "").trim()
    );

    if (unanswered.length > 0) {
      setError(`Please answer all five questions before submitting.`);
      return;
    }

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // Save each answer only once during this page session.
      for (const item of questions) {
        if (savedIds.includes(item.id)) {
          continue;
        }

        await postJson<SaveAnswerResponse>(
          `/interview/${interviewId}/answers`,
          {
            question_id: item.id,
            answer: answers[item.id].trim(),
          },
          token
        );

        setSavedIds((previous) =>
          previous.includes(item.id) ? previous : [...previous, item.id]
        );
      }

      // The backend evaluates and saves the final report.
      await postJson<InterviewResult>(
        `/interview/${interviewId}/submit`,
        {},
        token
      );

      router.push(`/interview/${interviewId}/results`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit the interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <main className="p-8">Loading interview...</main>;
  }

  if (questions.length !== 5) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-xl font-bold">Interview unavailable</h1>
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Back to dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <section>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-slate-500">
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {question.category.replaceAll("_", " ")}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                {question.difficulty}
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-bold leading-snug">
              {question.question}
            </h1>

            <label
              htmlFor={`answer-${question.id}`}
              className="mb-2 mt-8 block text-sm font-semibold"
            >
              Your answer
            </label>

            <textarea
              id={`answer-${question.id}`}
              rows={8}
              maxLength={5000}
              required
              value={answers[question.id] ?? ""}
              disabled={loading || savedIds.length > 0}
              onChange={(event) =>
                setAnswers((previous) => ({
                  ...previous,
                  [question.id]: event.target.value,
                }))
              }
              placeholder="Explain your approach and provide examples..."
              className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100"
            />

            <p className="mt-1 text-right text-xs text-slate-500">
              {(answers[question.id] ?? "").length}/5000
            </p>

            {savedIds.length > 0 && !loading && (
              <p className="mt-3 text-sm text-amber-700">
                Some answers have already been saved. Retry submission without
                editing answers.
              </p>
            )}

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                disabled={currentIndex === 0 || loading}
                onClick={() => setCurrentIndex((index) => index - 1)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium disabled:opacity-40"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setError("");
                    setCurrentIndex((index) => index + 1);
                  }}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Next question
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Evaluating answers..." : "Submit interview"}
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
