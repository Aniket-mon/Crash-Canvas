import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from "../components/ui/Header";
import { Toast } from "primereact/toast";
import Dashboard from "./dashboard"; 

export default function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);
  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isLoggedIn = true; // temporarily force login

  const [showLoader] = useState(!isLoggedIn);

  useEffect(() => {
    if (location.state?.showSuccessToast) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'The wait is over !!',
        life: 3000,
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  if (showLoader) {
    return (
      <div className="relative bg-transparent flex flex-col items-center justify-center h-screen">
        <Header />
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-8" />
        <p className="text-xl font-semibold text-gray-700">
          You need to login before going there
        </p>
      </div>
    );
  }

return (
  <div className="h-screen overflow-y-auto">
    <Toast ref={toast} />
    <Dashboard />
  </div>
);

}
