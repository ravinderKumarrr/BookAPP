import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import logo from "../assets/book_app_logo.png";

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
      "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      alert("Login successful!");

      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-5 text-slate-800 antialiased selection:bg-sky-500 selection:text-white"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, rgb(30, 58, 138) 0%, rgb(10, 17, 40) 55%, rgb(7, 13, 30) 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <style>{`
        .sip-curved-banner {
          border-radius: 2.25rem 2.25rem 3rem 3rem;
          background: linear-gradient(
            145deg,
            #0f172a 0%,
            #1e3a8a 55%,
            #0284c7 100%
          );
          position: relative;
          overflow: hidden;
        }

        .sip-curved-banner::after {
          content: "";
          position: absolute;
          top: -30%;
          right: -20%;
          width: 220px;
          height: 220px;
          background: radial-gradient(
            circle,
            rgba(56, 189, 248, 0.28) 0%,
            rgba(2, 132, 199, 0) 70%
          );
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      <main
        className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-auto transition-all"
        style={{
          maxWidth: 820,
          flexDirection: "row",
          minHeight: 520,
          boxShadow:
            "rgba(10, 25, 47, 0.4) 0px 25px 50px -12px, rgba(186, 230, 253, 0.25) 0px 0px 0px 1px",
        }}
      >
        {/* Left: Sign-in form */}
        <div
          className="p-6 sm:p-8 flex flex-col"
          style={{
            flex: "1.2 1 0%",
            justifyContent: "center",
            padding: "2.5rem",
          }}
        >
          {/* Brand logo */}
          <div className="mb-6 flex items-center">
            <img src={logo} alt="BookApp" className="h-16 w-auto" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold text-slate-700 mb-1.5"
                htmlFor="email"
              >
                Email Address
              </label>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                  style={{ color: "#0f172a" }}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-xs font-semibold text-slate-700"
                  htmlFor="password"
                >
                  Password
                </label>

                <Link
                  className="inline-flex items-center gap-1 text-xs font-medium hover:text-sky-700 transition-colors"
                  style={{ color: "#0284c7" }}
                  to="/forgot-password"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Forgot Password?
                </Link>
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  className="block w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                  style={{ color: "#0f172a" }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In button */}
            <div className="pt-2">
              <button
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl shadow-md text-white font-medium text-xs transition duration-150 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(10, 25, 47) 0%, rgb(15, 40, 78) 60%, rgb(2, 132, 199) 100%)",
                  boxShadow:
                    "rgba(2, 132, 199, 0.35) 0px 4px 14px -1px",
                }}
                type="submit"
              >
                <span>Sign In</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>
          </form>

          {/* OR divider */}
          <div className="relative my-4">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                OR
              </span>
            </div>
          </div>
        </div>

        {/* Right: Hello Friend banner */}
        <section
          className="sip-curved-banner px-6 py-7 text-center text-white flex flex-col items-center justify-center mt-auto"
          style={{
            flex: "0.9 1 0%",
            borderRadius: "4rem 0 0 4rem",
            padding: "3rem 2.25rem",
            marginTop: 0,
            minHeight: "100%",
          }}
        >
          <h3 className="text-xl font-bold tracking-tight text-white mb-1">
            Hello, Friend!
          </h3>

          <p
            className="text-xs max-w-xs mb-4 font-normal"
            style={{ color: "rgba(224, 242, 254, 0.9)" }}
          >
            New here? Create an account to get started.
          </p>

          <Link
            className="inline-flex items-center justify-center px-7 py-2 text-xs font-semibold text-white rounded-full hover:bg-white hover:text-slate-900 active:scale-95 transition-all duration-150 shadow-sm"
            style={{
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(4px)",
              boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 15px",
            }}
            to="/signup"
          >
            Sign Up
          </Link>
        </section>
      </main>
    </div>
  );
}