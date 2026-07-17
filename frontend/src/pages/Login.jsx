import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mern-notes-app-6t9w.onrender.com/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email); // Store user email to greet user
      navigate("/notes");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div style={{ marginBottom: "24px", display: "inline-flex", gap: "8px", alignItems: "center" }}>
          <span className="logo-icon">S</span>
          <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.03em" }}>Scribble</span>
        </div>
        <h2>Welcome Back 👋</h2>
        <p className="sub">Log in to manage your notes and ideas</p>

        {error && (
          <div style={{
            background: "var(--danger-light)",
            color: "var(--danger-color)",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: "13.5px",
            fontWeight: "600",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.2s ease"
          }}>
            <span>⚠️</span>
            <span style={{ flexGrow: 1, textAlign: "left" }}>{error}</span>
          </div>
        )}

        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  style={{
                    animation: "spin 1s linear infinite",
                    width: "18px",
                    height: "18px",
                    marginRight: "4px"
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="30 30"
                    strokeLinecap="round"
                    style={{ opacity: 0.2 }}
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="20 40"
                    strokeLinecap="round"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <span className="link" onClick={() => navigate("/register")}>
          New to Scribble? Create an account
        </span>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;
