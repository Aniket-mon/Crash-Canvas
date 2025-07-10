import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from "../components/ui/Header";
import { Toast } from "primereact/toast";


export default function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);
  // Immediately determine if loader should show
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
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
        <div
          className="
            w-12 h-12
            border-4 border-t-4 border-gray-200
            border-t-gray-600
            rounded-full
            animate-spin
            mb-8
          "
        />
        <p className="text-xl font-semibold text-gray-700">
          You need to login before going there
        </p>
      </div>
    );
  }

  // Normal analysis page content (for logged-in users)
  return (
    <div className="relative bg-transparent flex flex-col items-center justify-start h-screen overflow-y-auto space-y-32">
      <Header />
      <Toast ref={toast} />
      <div
        className="
          w-12 h-12
          border-4 border-t-4 border-gray-200
          border-t-gray-600
          rounded-full
          animate-spin
        "
      />
      <p className="text-lg font-medium">Let the dev cook</p>
    </div>
  );
}
