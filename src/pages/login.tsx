import React, { useState } from 'react';
import { Header } from "../components/ui/Header";
import "./register.css";       
import { useNavigate } from 'react-router-dom';   
import toast from 'react-hot-toast';


export default function Login() {
    const navigate = useNavigate();    
    
    const [email, setEmail] = useState(""); 
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        const BASE_URL = import.meta.env.VITE_BACKEND_URL;

        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (res.ok) {
            setMessage("Logging in...");
            toast.success(data.message || "Login successful!");
            localStorage.setItem("isLoggedIn", "true");

            setTimeout(() => {
                navigate("/analysis");
            }, 2000); // delay to show spinner
        } else {
            toast.error(data.message || "Login failed");
            setError(data.message || "Login failed");
            setLoading(false);
        }
    };
    return (
        <div className="relative bg-[url('../../assets/D1.png')] bg-cover bg-center flex flex-col items-center justify-start h-screen overflow-y-auto space-y-32">
        <Header />

        <section className="register-form-container mt-40" aria-label="Register Form">
            <h2>We are glad to have you on board</h2>
            <form className="register-form" noValidate onSubmit={handleSubmit}>
            <div style={{ marginTop: "9px" }}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button 
            type="submit"
            className={`register-submit ${loading ? "submitted" : ""}`}
            disabled={loading}
            >
            <span className="btn-text">Hop in</span>
            <span className="btn-loader"></span>
            </button>

            <p className="footer-text">
                Don't be a stranger.  <a href="#" className="login-link"  onClick={() => navigate("/Register")}>Register</a>
            </p>
            </form>
        </section>
        </div>
    );
}
