import React, { useState } from 'react';
import { Header } from "../components/ui/Header";
import "./register.css";          
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';






export default function Register() {
    const navigate = useNavigate();

    return (
        <div className="relative bg-transparent flex flex-col items-center justify-start h-screen overflow-y-auto space-y-32">
        {/* Preserve your global background from Main.tsx via Tailwind or a wrapper div */}
        <Header />

        <section className="register-form-container mt-40" aria-label="Register Form">
            <h2>Tell us about yourself before hopping in</h2>
            <form className="register-form" noValidate>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                required
                autoComplete="name"
            />

            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
            />

            <button type="submit" className="submit-btn">
                Welcome
            </button>

            <p className="footer-text">
                We already know you? <a className="login-link" onClick={() => navigate("/Login")}>Login</a>
            </p>
            </form>
        </section>
        </div>
    );
}
