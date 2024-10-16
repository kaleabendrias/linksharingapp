"use client";

import Image from "next/image";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState, FormEvent } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../firebase";
import BackToHome from "./BackToHome";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address.");
      setLoading(false);
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      console.log("id: ", idToken);

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setLoading(false);
      router.push("/");
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        const errorCode = "code" in e ? (e as any).code : "unknown";
        console.error("Error code:", errorCode);
        console.error("Error during login:", errorMessage);

        if (errorCode === "auth/user-not-found") {
          setError("No user found with this email.");
        } else if (errorCode === "auth/invalid-credential") {
          setError("Incorrect password.");
        } else if (errorCode === "auth/invalid-email") {
          setError("Invalid email format.");
        } else {
          setError(`Error: ${errorMessage}`);
        }
      } else {
        setError("An unknown error occurred.");
      }
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-start p-4">
          <BackToHome />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md pb-8 px-8 pt-2 bg-white rounded-lg">
            <div className="flex justify-center items-start mb-12">
              <Image src="/logo.png" alt="devlinks" width={40} height={40} />
              <p className="font-bold text-4xl">devlinks</p>
            </div>
            <h2 className="text-4xl font-bold text-left mb-4">Login</h2>
            <p className="text-sm text-left text-gray-600 mb-8">
              Add your details below to get back into the app
            </p>
            <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-gray-700"
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
              <div>
                <label
                  htmlFor="password"
                  className="block text-md font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
              <a
                href="/auth/forgot"
                className="w-full text-sm text-blue-600 text-right"
              >
                Forgot password?
              </a>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-4 py-2 text-sm font-medium text-white ${
                    loading ? "bg-gray-400" : "bg-indigo-600"
                  } border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/auth/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Create account
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
