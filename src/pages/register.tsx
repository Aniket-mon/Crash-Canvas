import React, { useState, useRef } from 'react';
import { Header } from "../components/ui/Header";
import { useNavigate } from 'react-router-dom';
import "./register.css";
import { Toast } from 'primereact/toast';



export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const soSuccess = () => {
      toast.current?.show({severity:'success', summary: 'Success. You are one of us now.', detail:'Redirecting to Login page', life: 3000});
  }

  const showError = () => {
      toast.current?.show({severity:'error', summary: 'Error', detail:'Double check and try again.', life: 3000});
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    if (!name || !email) {
      setError("Name and email are required");
      setLoading(false);
      return;
    }
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (res.ok) {
      soSuccess();
      setTimeout(() => {
        navigate("/login", { state: { showSuccessToast: true } });
      }, 2000); 
    } else {
      showError();
      setError(data.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[url('../../assets/D1.png')] bg-cover bg-center flex flex-col items-center h-screen overflow-y-auto space-y-32">
      <Header />
      <Toast ref={toast} />
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

          <button 
            type="submit"
            className={`register-submit ${loading ? "submitted" : ""}`}
            disabled={loading}
          >
            <span className="btn-text">Welcome</span>
            <span className="btn-loader"></span>
          </button>

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
