import { useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Eye,
  EyeOff,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem(
        "loop_token",
        response.data.access_token
      );

      window.location.href = "/";
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loop-login-page">

      {/* LEFT SIDE */}
      <section className="login-showcase">

        <div className="showcase-glow glow-one"></div>
        <div className="showcase-glow glow-two"></div>

        <div className="login-brand">
          <div className="login-brand-logo">L</div>

          <div>
            <strong>LOOP</strong>
            <span>Feedback Intelligence</span>
          </div>
        </div>

        <div className="showcase-content">

          <div className="showcase-badge">
            <Sparkles size={15} />
            AI-powered customer intelligence
          </div>

          <h1>
            Turn customer feedback into
            <span> actionable intelligence.</span>
          </h1>

          <p>
            Understand what your customers are saying,
            discover recurring issues, and make smarter
            product decisions with LOOP.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">
                <BrainCircuit size={20} />
              </div>

              <div>
                <strong>AI-Powered Insights</strong>
                <span>
                  Discover meaningful patterns in customer feedback.
                </span>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <BarChart3 size={20} />
              </div>

              <div>
                <strong>Sentiment & Theme Analysis</strong>
                <span>
                  Understand customer sentiment and emerging topics.
                </span>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <MessageSquareText size={20} />
              </div>

              <div>
                <strong>Voice of Customer</strong>
                <span>
                  Transform raw feedback into actionable reports.
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="showcase-footer">
          <ShieldCheck size={16} />
          Secure workspace • Role-based access • Customer intelligence
        </div>
      </section>


      {/* RIGHT SIDE */}
      <section className="login-form-section">

        <div className="mobile-login-brand">
          <div className="login-brand-logo">L</div>
          <strong>LOOP</strong>
        </div>

        <div className="login-form-container">

          <div className="form-heading">
            <div className="welcome-icon">
              <Sparkles size={22} />
            </div>

            <h2>Welcome back</h2>

            <p>
              Sign in to your LOOP workspace to continue.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="login-field">
              <label>Email address</label>

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <div className="password-label">
                <label>Password</label>
              </div>

              <div className="password-input-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </div>

            {message && (
              <div className="login-error">
                {message}
              </div>
            )}

            <button
              className="loop-signin-btn"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in to LOOP"}
              </span>

              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="login-security">
            <ShieldCheck size={15} />
            Your workspace is securely protected
          </div>

        </div>

        <div className="login-bottom-text">
          Project LOOP · AI Customer Feedback Intelligence
        </div>

      </section>

    </div>
  );
}

export default Login;