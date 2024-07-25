"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState, FormEvent } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { app } from "../firebase";
import { useRouter } from "next/navigation";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(getAuth(app), email, password);
      router.push("/auth/login");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-100">
      <div className="w-full max-w-md pb-8 px-8 pt-2 bg-white rounded-lg">
        <div className="flex justify-center items-start mb-12">
          <Image src="/logo.png" alt="devlinks" width={40} height={40} />
          <p className="font-bold text-4xl">devlinks</p>
        </div>
        <h2 className="text-4xl font-bold text-left mb-4">Create account</h2>
        <p className="text-md text-left text-gray-600 mb-8">
          Let&apos;s get you started sharing your links!
        </p>
        <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. alex@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Create password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock />
              </span>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="At least 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-sm font-medium text-white ${
                loading ? "bg-gray-400" : "bg-indigo-600"
              } border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Creating account..." : "Create new account"}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
