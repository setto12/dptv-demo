"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/header/Logo";
import app from "@/app/config/app";

import { supabase } from "@/lib/supabase/client";
import { changePassword } from "@/services/auth";

const fieldClass =
"w-full rounded-lg border px-3 py-2 pr-10 outline-none transition focus:ring-2 focus:ring-blue-500";

const buttonClass =
"flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function ResetPasswordPage() {
const router = useRouter();

const [ready, setReady] = useState(false);

const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

useEffect(() => {
let mounted = true;


const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
  if (!mounted) {
    return;
  }

  if (event === "PASSWORD_RECOVERY" && session) {
    setReady(true);
  }
});

async function checkSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!mounted) {
    return;
  }

  if (session) {
    setReady(true);
  }
}

checkSession();

return () => {
  mounted = false;
  subscription.unsubscribe();
};


}, []);

async function handleSubmit(event) {
event.preventDefault();


if (newPassword !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

if (!newPassword) {
  setError("Please enter a new password.");
  return;
}

try {
  setLoading(true);
  setError("");

  await changePassword(newPassword);

  setSuccess(true);
  setNewPassword("");
  setConfirmPassword("");
  setShowNewPassword(false);
  setShowConfirmPassword(false);

  await supabase.auth.signOut();

  router.push("/login");
  router.refresh();
} catch (err) {
  console.error("Password reset failed:", err);

  setError(
    err?.message || "Failed to reset your password."
  );
} finally {
  setLoading(false);
}


}

if (!ready) {
return ( <main className="flex min-h-screen items-center justify-center bg-gray-100"> <div className="w-full max-w-md rounded-xl bg-white p-8 shadow"> <div className="mb-6 flex justify-center"> <Logo
           href={app.home}
           src={app.logo.src}
           alt={app.logo.alt}
           title={app.name}
           imageWidth={app.logo.width}
           imageHeight={app.logo.height}
         /> </div>


      <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
          aria-hidden="true"
        />

        <span>Verifying password reset link...</span>
      </div>
    </div>
  </main>
);


}

if (success) {
return ( <main className="flex min-h-screen items-center justify-center bg-gray-100"> <div className="w-full max-w-md rounded-xl bg-white p-8 shadow"> <div className="mb-6 flex justify-center"> <Logo
           href={app.home}
           src={app.logo.src}
           alt={app.logo.alt}
           title={app.name}
           imageWidth={app.logo.width}
           imageHeight={app.logo.height}
         /> </div>


      <div className="space-y-5 text-center">
        <div>
          <h1 className="text-xl font-semibold">
            Password Reset
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your password has been changed successfully.
          </p>
        </div>

        <Link
          href="/login"
          className="block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  </main>
);


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
        Reset Password
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Enter your new password below.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="new-password"
          className="mb-2 block text-sm font-medium"
        >
          New Password
        </label>

        <div className="relative">
          <input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            className={fieldClass}
          />

          <button
            type="button"
            onClick={() =>
              setShowNewPassword(
                (current) => !current
              )
            }
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition hover:text-gray-700"
            aria-label={
              showNewPassword
                ? "Hide new password"
                : "Show new password"
            }
          >
            {showNewPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.829M9.88 4.24A10.94 10.94 0 0112 4c5.5 0 9.5 5 9.5 5s-1.39 2.09-3.84 3.72M6.23 6.23C3.8 7.8 2.5 9.5 2.5 9.5S5.5 14 12 14c1.12 0 2.15-.17 3.08-.44"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.5 9.5S5.5 4 12 4s9.5 5.5 9.5 5.5S18.5 15 12 15 2.5 9.5 2.5 9.5z"
                />
                <circle
                  cx="12"
                  cy="9.5"
                  r="2.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-medium"
        >
          Confirm New Password
        </label>

        <div className="relative">
          <input
            id="confirm-password"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            className={fieldClass}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition hover:text-gray-700"
            aria-label={
              showConfirmPassword
                ? "Hide confirmed password"
                : "Show confirmed password"
            }
          >
            {showConfirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.829M9.88 4.24A10.94 10.94 0 0112 4c5.5 0 9.5 5 9.5 5s-1.39 2.09-3.84 3.72M6.23 6.23C3.8 7.8 2.5 9.5 2.5 9.5S5.5 14 12 14c1.12 0 2.15-.17 3.08-.44"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.5 9.5S5.5 4 12 4s9.5 5.5 9.5 5.5S18.5 15 12 15 2.5 9.5 2.5 9.5z"
                />
                <circle
                  cx="12"
                  cy="9.5"
                  r="2.5"
                />
              </svg>
            )}
          </button>
        </div>
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

            <span>Resetting Password...</span>
          </>
        ) : (
          "Reset Password"
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
  </div>
</main>


);
}
