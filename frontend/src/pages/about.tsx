import React, { useState } from 'react';
import { Header } from "../components/ui/Header";

export default function About() {
    // Remove loading state and effect to keep loading screen infinite
    return (
        <div className="relative bg-transparent flex flex-col items-center justify-start h-screen overflow-y-auto space-y-32">
            <Header />
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
