import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function SignupPage({
  onSignup,
  onClose,
  onSwitchToLogin,
}: {
  onSignup: (u: any) => void;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({
    label: "",
    color: "bg-slate-200",
    score: 0,
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!password) {
      setStrength({ label: "", color: "bg-slate-100", score: 0 });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
      setStrength({ label: "Weak", color: "bg-red-500", score: 1 });
    else if (score === 2)
      setStrength({ label: "Medium", color: "bg-yellow-500", score: 2 });
    else if (score === 3)
      setStrength({ label: "Strong", color: "bg-blue-500", score: 3 });
    else
      setStrength({ label: "Very Strong", color: "bg-green-500", score: 4 });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = {
        fullName,
        username,
        email,
        onboarded: false,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      onSignup({ uid: userCredential.user.uid, ...userData });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        fullName: result.user.displayName || "",
        username: result.user.email?.split("@")[0] || "",
        email: result.user.email || "",
        onboarded: false,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", result.user.uid), userData, {
        merge: true,
      });
      onSignup({ uid: result.user.uid, ...userData });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      {/* Background Overlay Click to Close */}
      <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-3xl shadow-2xl overflow-y-auto sm:overflow-hidden animate-scale-in">
        {/* Close Button - Hidden on mobile, visible on desktop */}
        <button
          onClick={onClose}
          className="hidden sm:flex absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-slate-100 items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
        >
          <X size={18} />
        </button>

        {/* Mobile Close Button - Visible only on mobile */}
        <button
          onClick={onClose}
          className="sm:hidden absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row h-full sm:h-auto">
          {/* Left Side - Brand Story - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-50 to-white p-10 border-r border-slate-100">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-12">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  <Zap size={22} fill="white" />
                </div>
                <span className="text-xl font-bold text-slate-900">
                  DZD<span className="text-blue-600">MARKETING</span>
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-black text-slate-900 leading-tight mb-10">
                  Elevate your
                  <br />
                  social presence
                  <br />
                  <span className="text-blue-600">instantly.</span>
                </h2>

                <div className="space-y-5">
                  {[
                    {
                      icon: Zap,
                      text: "INSTANT DELIVERY",
                      color: "text-blue-600",
                      bg: "bg-blue-100",
                    },
                    {
                      icon: Smartphone,
                      text: "24/7 SUPPORT",
                      color: "text-indigo-600",
                      bg: "bg-indigo-100",
                    },
                    {
                      icon: ShieldCheck,
                      text: "SECURE PAYMENTS",
                      color: "text-emerald-600",
                      bg: "bg-emerald-100",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}
                      >
                        <item.icon size={18} className={item.color} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 tracking-wider">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form - Full width on mobile, 7/12 on desktop */}
          <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-8 lg:p-10 min-h-screen sm:min-h-0">
            <div className="w-full max-w-md mx-auto">
              {/* Header */}
              <div className="mb-8 text-center lg:text-left">
                <div className="flex items-center justify-center lg:hidden mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                    <Zap size={22} fill="white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 ml-2">
                    DZD<span className="text-blue-600">MARKETING</span>
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                  Create Identity
                </h3>
                <p className="text-sm text-slate-500">
                  Join the elite marketing ecosystem.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Name"
                        className="w-full h-12 sm:h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="handle"
                        className="w-full h-12 sm:h-11 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@example.com"
                      className="w-full h-12 sm:h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 sm:h-11 pl-9 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength.score
                                ? strength.color
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <p className="text-xs font-medium text-slate-500">
                          Password strength:{" "}
                          <span className="text-slate-700">
                            {strength.label}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Confirm Identity
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className={`w-full h-12 sm:h-11 pl-9 pr-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500"
                          : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      }`}
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      agreed
                        ? "bg-blue-600 border-blue-600"
                        : "border-slate-300 bg-white hover:border-blue-400"
                    }`}
                  >
                    {agreed && (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                  </button>
                  <span className="text-xs text-slate-600">
                    Accept{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Terms of Service
                    </button>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-3 bg-white text-slate-400 font-semibold">
                      Or
                    </span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full h-12 sm:h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-slate-500 mt-6 pb-4 lg:pb-0">
                  Member already?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Log in
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
