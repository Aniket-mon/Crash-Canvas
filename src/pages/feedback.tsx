import React, { useState } from 'react';
import { Header } from "../components/ui/Header";
import { Rating, RatingChangeEvent } from "primereact/rating";
import "./about.css";
import "./feed.css";        

export default function Feedback() {

    const [value, setValue] = useState<number | undefined>(undefined);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
        setValue(undefined);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    // Remove loading state and effect to keep loading screen infinite
    return (
        <div className="relative bg-[url('../../assets/D1.png')] bg-cover bg-center flex flex-col items-center justify-start h-screen overflow-y-auto space-y-32">
            <Header />
            <div className='flex justify-content-center mt-[50px]'>
                <h1
                  className="kameron-font"
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 100,
                    marginTop: "2rem",
                    marginLeft: "1rem",
                    color: "#191919",
                    textAlign: "left",
                    lineHeight: "1.1",
                    letterSpacing: "-1px",
                    maxWidth: "600px"
                  }}
                >
                  Your feedback matters &lt;^ - ^&gt;
                </h1>
            </div>
            <div className="card flex justify-content-center align-items-center mt-40 ">
                <div className="scale-[4.5]">
                    <Rating
                    value={value}
                    onChange={(e: RatingChangeEvent) => setValue(e.value === null ? undefined : e.value)}
                      pt={{
                            root: { className: "gap-2" },
                            onIcon: {
                            className: "text-[#f5116c] border-black"
                            },
                            offIcon: {
                            className: "text-gray-400 "
                            }
                        }}
                    />
                </div>
            </div>
            <div className="feedback-container">
        <button 
            className={`feed-submit ${isSubmitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitted}
        >
            <span className="btn-text">Submit Feedback</span>
            <span className="btn-loader"></span>
        </button>
        
        {isSubmitted && (
            <div className="confirmation-box">
            <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <span>Your response has been submitted!</span>
            </div>
        )}
        </div>
        </div>
    );
}
