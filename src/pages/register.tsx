import React, { useState } from 'react';
import { Header } from "../components/ui/Header";
import { useNavigate } from 'react-router-dom';
import "./register.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    // ...reset error/message...
  const res = await fetch(`${import.meta.env.BACK_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) navigate("/login");
    else setError("Registration failed");
  };

  return (
    <div className="relative bg-transparent flex flex-col items-center h-screen overflow-y-auto space-y-32">
      <Header />
      <section className="register-form-container mt-40" aria-label="Register Form">
        <h2>Tell us about yourself before hopping in</h2>
        <form className="register-form" noValidate onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text" id="name" name="name"
            placeholder="Your full name" required autoComplete="name"
          />

          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email" id="email" name="email"
            placeholder="you@example.com" required autoComplete="email"
          />

          <button type="submit" className="submit-btn">Welcome</button>

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <p className="footer-text">
            We already know you?{" "}
            <a className="login-link" onClick={() => navigate("/login")}>Login</a>
          </p>
        </form>
      </section>
    </div>
  );
}
