"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FaEnvelope } from "react-icons/fa";
import { app } from "../firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const auth = getAuth(app);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md pb-8 px-8 pt-2 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center mb-12">
          <Image src="/logo.png" alt="devlinks" width={40} height={40} />
          <p className="font-bold text-4xl ml-2">devlinks</p>
        </div>
        <h2 className="text-3xl font-bold text-left mb-4">Forgot Password</h2>
        <p className="text-sm text-left text-gray-600 mb-8">
          Enter your email below to reset your password.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
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

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-medium text-white ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;