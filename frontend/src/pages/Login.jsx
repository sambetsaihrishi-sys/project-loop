import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:8001/auth/login",
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

      setMessage("Login successful");

      window.location.href = "/";
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Login failed"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">L</div>

        <h1>Welcome back</h1>

        <p>
          Sign in to your Project LOOP workspace
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Sign In
          </button>
        </form>

        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

        <span className="login-footer">
          AI-powered customer feedback intelligence
        </span>
      </div>
    </div>
  );
}

export default Login;