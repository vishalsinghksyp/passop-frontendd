import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const MIN_LOADING_TIME = 800; // ms
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    const startTime = Date.now();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => {
        if (res.ok) {
          setSuccess(data.message || "Account created successfully");
          setTimeout(() => navigate("/Login"), 1200);
        } else {
          setError(data.message || "Signup failed");
        }
        setLoading(false);
      }, remainingTime);
    } catch (err) {
      console.error(err);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }, remainingTime);
    }
  };

  const inputClass = `w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg
    placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400
    ${loading ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <div className="grow justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <div className="flex justify-center items-center gap-1 p-6">
        <h1 className="font-extrabold text-3xl text-white">Password</h1>
        <h1 className="font-extrabold text-3xl text-emerald-400">Manager</h1>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-2xl font-semibold text-center">Create Account</h2>
          <p className="text-sm text-gray-300 text-center mt-1">
            Secure your passwords in one place
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <img
                src={showPassword ? "./eye.png" : "./hidden.png"}
                alt="toggle password"
                className={`w-5 h-5 absolute right-3 top-9 opacity-80 hover:opacity-100
                  ${
                    loading ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                  }`}
                onClick={() => !loading && setShowPassword(!showPassword)}
              />
            </div>
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                {success}
              </div>
            )}
            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition
                flex items-center justify-center gap-3
                ${
                  loading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
                }`}
            >
              {loading ? (
                <>
                  <span>Securing your vault…</span>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <lord-icon
                    src="https://cdn.lordicon.com/urswgamh.json"
                    trigger="hover"
                    target="button"
                    colors="primary:#ffffff,secondary:#ffffff"
                    style={{ width: "24px", height: "24px" }}
                  ></lord-icon>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-300 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-emerald-400 font-medium cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
