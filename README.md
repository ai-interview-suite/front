# InterviewPrep

The web front end for the [AI Interview Service](https://github.com/ai-interview-suite/api).
Users sign up, upload a resume and a job description, answer five AI-generated
interview questions, and get a scored report with per-question feedback.

Built with Next.js 16, React 19 and Tailwind CSS 4.

## Setup

The app needs the API running; follow the setup in the
[api README](https://github.com/ai-interview-suite/api#setup) first.

```bash
npm install
```

Create `.env.local` in this folder (next to `package.json` — Next.js does not read
env files from parent folders) and point it at the API, without a trailing slash:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

If this is missing, every request fails with "Backend URL is not configured."
`NEXT_PUBLIC_*` values are read when the dev server starts, so restart it after
changing them.

## Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `localhost`, not
`127.0.0.1`: the API's CORS settings only allow `http://localhost:3000`.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/register`, `/login` | Create an account and sign in |
| `/dashboard` | Upload a resume PDF and job description to start an interview |
| `/interviews` | List of your interviews with status, score and recommendation |
| `/interview/[interviewId]` | Answer the five questions and submit |
| `/interview/[interviewId]/results` | Overall score, recommendation and per-question feedback |

## Project layout

```
src/
  app/                 Routes (App Router), one folder per page above
  components/
    auth-form.tsx      Shared login/register form
  lib/
    api.ts             Fetch helpers that call the API with the bearer token
```

## Notes and limitations

- The access token is kept in `sessionStorage`, so closing the tab signs you out.
- Interview questions are also kept in `sessionStorage` when an interview starts.
  "Continue" on an in-progress interview therefore only works in the same browser
  session; elsewhere the interview page reports that the questions are unavailable.
- If the API returns an unhandled `500`, the browser reports "Failed to fetch"
  because the error response has no CORS headers. Check the API's terminal for the
  real error — a wrong `DATABASE_URL` is the usual cause.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
