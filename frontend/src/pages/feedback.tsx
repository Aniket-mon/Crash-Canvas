import React, { useState } from 'react';

export default function Feedback() {
    // Remove loading state and effect to keep loading screen infinite
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            {/* CSS spinner */}
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
