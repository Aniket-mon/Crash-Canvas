import React, { useState } from 'react';
import { Header } from "../components/ui/Header";
import "./register.css";       
import { useNavigate } from 'react-router-dom';   

export default function Login() {
    const navigate = useNavigate();                   


    return (
        <div className="relative bg-transparent flex flex-col items-center justify-start h-screen overflow-y-auto space-y-32">
        <Header />

        <section className="register-form-container mt-40" aria-label="Register Form">
            <h2>We are glad to have you on board</h2>
            <form className="register-form" noValidate>
            <label htmlFor="name">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
            />

            <button type="submit" className="submit-btn">
                Hop in
            </button>


            <p className="footer-text">
                Don't be a stranger.  <a href="#" className="login-link"  onClick={() => navigate("/Register")}>Register</a>
            </p>
            </form>
        </section>
        </div>
    );
}
