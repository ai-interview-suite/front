"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson, postJson } from "@/lib/api";

type TokenResponse = {
    access_token: string;
    token_type: string;
};

export default function GoogleCallbackPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Signing you in...");

    useEffect(() => {
        async function finishLogin() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (!code) {
                setMessage("Google login failed. Please try again.");
                return;
            }

            // Remove the one-time code from the visible URL.
            window.history.replaceState({}, "", "/auth/google/callback");

            try {
                const result = await postJson<TokenResponse>(
                    "/auth/google/exchange",
                    { code }
                );

                await getJson<{ id: string; email: string }>(
                    "/auth/me",
                    result.access_token
                );

                sessionStorage.setItem("access_token", result.access_token);
                router.replace("/dashboard");
            } catch {
                setMessage("Google login failed. Please try again.");
            }
        }

        void finishLogin();
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center">
            <p role="status">{message}</p>
        </main>
    );
}