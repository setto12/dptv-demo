"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/header/Logo";
import app from "@/app/config/app";

import { requestPasswordReset } from "@/services/auth";

const fieldClass =
"w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500";

const buttonClass =
"flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function ForgotPasswordPage() {
const [email, setEmail] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [sent, setSent] = useState(false);

async function handleSubmit(event) {
event.preventDefault();


try {
  setLoading(true);
  setError("");
  setSent(false);

  await requestPasswordReset(email);

  setSent(true);
} catch (err) {
  console.error(err);
  setError(
    err?.message || "Failed to send password reset email."
  );
} finally {
  setLoading(false);
}


}

return ( <main className="flex min-h-screen items-center justify-center bg-gray-100"> <div className="w-full max-w-md rounded-xl bg-white p-8 shadow"> <div className="mb-6 flex justify-center"> <Logo
         href={app.home}
         src={app.logo.src}
         alt={app.logo.alt}
         title={app.name}
         imageWidth={app.logo.width}
         imageHeight={app.logo.height}
       /> </div>


    <div className="mb-6">
      <h1 className="text-xl font-semibold">
        Forgot Password
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Enter your email address and we'll send you a
        password reset link.
      </p>
    </div>

    {sent ? (
      <div className="space-y-5">
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          If an account exists with that email address, a
          password reset link has been sent.
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 transition hover:text-blue-700"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    ) : (
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className={fieldClass}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={buttonClass}
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />

              <span>Sending...</span>
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 transition hover:text-blue-700"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    )}
  </div>
</main>


);
}
