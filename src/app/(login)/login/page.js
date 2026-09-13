"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/header/Logo";
import app from "@/app/config/app";

import { login } from "@/services/auth";

const fieldClass =
"w-full rounded-lg border px-3 py-2 pr-10 outline-none transition focus:ring-2 focus:ring-blue-500";

const buttonClass =
"flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(event) {
event.preventDefault();


try {
  setLoading(true);
  setError("");

  await login(email, password);

  router.push("/");
  router.refresh();
} catch (err) {
  console.error(err);
  setError(err.message);
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


    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">
            Password
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 transition hover:text-blue-700"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className={fieldClass}
          />

          <button
type="button"
onClick={() =>
setShowPassword((current) => !current)
}
className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition hover:text-gray-700"
aria-label={
showPassword
? "Hide password"
: "Show password"
}

>

{showPassword ? ( <svg
   xmlns="http://www.w3.org/2000/svg"
   width="20"
   height="20"
   fill="none"
   viewBox="0 0 24 24"
   stroke="currentColor"
   strokeWidth="2"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M3 3l18 18"
   />


  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M10.584 10.587a2 2 0 002.829 2.829"
  />

  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9.88 4.24A10.94 10.94 0 0112 4c5.5 0 9.5 5.5 9.5 5.5s-1.39 2.09-3.84 3.72M6.23 6.23C3.8 7.8 2.5 9.5 2.5 9.5"
  />
</svg>


) : ( <svg
   xmlns="http://www.w3.org/2000/svg"
   width="20"
   height="20"
   fill="none"
   viewBox="0 0 24 24"
   stroke="currentColor"
   strokeWidth="2"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
   />


  <circle
    cx="12"
    cy="12"
    r="2.5"
  />
</svg>


)} </button>

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

            <span>Signing In...</span>
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="mt-6 text-center">
        <Link
          href="/signup"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Don't have an account? Sign Up
        </Link>
      </div>
    </form>
  </div>
</main>


);
}
