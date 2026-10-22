
"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getJson, postJson } from "@/lib/api";

type AuthFormProps = {
    mode: "login" | "register";
};

type RegisterResponse = {
    id: string;
    email: string;
};

type LoginResponse = {
    access_token: string;
    token_type: string;
};

export default function AuthForm({ mode }: AuthFormProps) {
    const isRegister = mode === "register";
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get("registered") === "true") {
            setRegistrationMessage("Account created successfully. Please sign in.");
        }
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (isRegister && password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();

        setIsLoading(true);

        try {
            if (isRegister) {
                await postJson<RegisterResponse>("/auth/register", {
                    email,
                    password,
                });

                router.push("/login?registered=true");
            } else {
                const result = await postJson<LoginResponse>("/auth/login", {
                    email,
                    password,
                });

                // Verify the token before treating the user as authenticated.
                await getJson<{ id: string; email: string }>(
                    "/auth/me",
                    result.access_token
                );

                sessionStorage.setItem("access_token", result.access_token);

                router.push("/dashboard");
            }
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex flex-1 items-center justify-center px-5 py-12">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <Link href="/" className="text-lg font-bold">
                    InterviewPrep
                </Link>

                <h1 className="mt-8 text-2xl font-bold">
                    {isRegister ? "Create your account" : "Welcome back"}
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    {isRegister
                        ? "Start preparing for your next interview."
                        : "Sign in to continue your preparation."}
                </p>

                {registrationMessage && !isRegister && (
                    <p role="status" className="mt-4 text-sm text-green-700">
                        {registrationMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete={
                                    isRegister ? "new-password" : "current-password"
                                }
                                required
                                minLength={isRegister ? 8 : undefined}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-14 outline-none focus:border-blue-600"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 hover:text-blue-600"
                            >
                                {showPassword ? "Hide" : "👁"}
                            </button>
                        </div>
                    </div>

                    {isRegister && (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-14 outline-none focus:border-blue-600"
                                    placeholder="Confirm your password"
                                />

                                <button
                                    type="button"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 hover:text-blue-600"
                                >
                                    {showConfirmPassword ? "Hide" : "👁"}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading
                            ? "Please wait..."
                            : isRegister
                                ? "Create account"
                                : "Sign in"}
                    </button>

                    {message && (
                        <p role="alert" className="text-sm text-red-600">
                            {message}
                        </p>
                    )}
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    {isRegister
                        ? "Already have an account? "
                        : "Don't have an account? "}

                    <Link
                        href={isRegister ? "/login" : "/register"}
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        {isRegister ? "Sign in" : "Create account"}
                    </Link>
                </p>
            </section>
        </main>
    );
}
