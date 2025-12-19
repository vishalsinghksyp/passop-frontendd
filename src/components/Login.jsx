import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MIN_LOADING_TIME = 800;

const Login = ({ setIsLoggedIn, setUserEmail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const startTime = Date.now();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      setTimeout(() => {
        if (res.ok) {
          // Save token and email
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", email);

          setIsLoggedIn(true);
          setUserEmail(email); // Update app state

          navigate("/");
        } else {
          setError(data.message || "Invalid email or password");
        }
        setLoading(false);
      }, remaining);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }, remaining);
    }
  };

  const inputClass = `w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg
    placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
      loading ? "opacity-60 cursor-not-allowed" : ""
    }`;

  return (
    <div className="grow justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <div className="flex justify-center items-center gap-1 p-6">
        <h1 className="font-extrabold text-3xl text-white">Password</h1>
        <h1 className="font-extrabold text-3xl text-emerald-400">Manager</h1>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          <p className="text-sm text-gray-300 text-center mt-1">
            Login to access your vault
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
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
                className={`w-5 h-5 absolute right-3 top-9 opacity-80 hover:opacity-100 ${
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-3 ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <span>Unlocking vault…</span>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                </>
              ) : (
                <>
                  <span>Login</span>
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

          <p className="text-sm text-gray-300 text-center mt-6">
            New here?{" "}
            <Link
              to="/Signup"
              className="text-emerald-400 font-medium cursor-pointer hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
