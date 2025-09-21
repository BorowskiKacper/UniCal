import React, { useState } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  linkGoogleAccount,
  getCurrentUser,
} from "../firebase/auth";
import SubmitButton from "./SubmitButton";

const AuthPopup = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "signin",
  showAccountLinking = false,
}) => {
  const [mode, setMode] = useState(initialMode); // "signin", "signup", "link"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { user } = await signInWithGoogle();
      onAuthSuccess(user);
      handleClose();
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { user } = await signInWithEmail(email, password);
      onAuthSuccess(user);
      handleClose();
    } catch (error) {
      // Error is already handled in the auth function
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { user } = await signUpWithEmail(email, password);
      onAuthSuccess(user);
      handleClose();
    } catch (error) {
      // Error is already handled in the auth function
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountLinking = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { user } = await linkGoogleAccount();
      onAuthSuccess(user);
      handleClose();
    } catch (error) {
      setError("Failed to link Google account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      {/* Popup */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {mode === "signup"
                ? "Sign Up"
                : mode === "link"
                ? "Link Account"
                : "Sign In"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="mb-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                or
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form
            onSubmit={mode === "signup" ? handleEmailSignUp : handleEmailSignIn}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              <div className="flex justify-center">
                <SubmitButton
                  text={
                    isLoading
                      ? "Please wait..."
                      : mode === "signup"
                      ? "Sign up"
                      : "Sign in"
                  }
                  onClick={
                    mode === "signup" ? handleEmailSignUp : handleEmailSignIn
                  }
                  isDisabled={isLoading}
                  disableLightning={true}
                />
              </div>
            </div>
          </form>

          {/* Mode Switch */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              <>
                {mode === "signup"
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  onClick={() => {
                    setMode(mode === "signup" ? "signin" : "signup");
                    resetForm();
                  }}
                  className="hover:text-amber-700 text-amber-600  dark:text-emerald-400 dark:hover:text-green-400 font-medium"
                >
                  {mode === "signup" ? "Sign in" : "Sign up"}
                </button>
              </>
            </p>
          </div>

          {/* Account Linking */}
          {showAccountLinking && mode === "signin" && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Want to link your Google account?
              </p>
              <button
                onClick={handleAccountLinking}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isLoading ? "Linking..." : "Link Google Account"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
