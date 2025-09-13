import { useEffect, useState } from "react";

export default function Modal({ message, onClose }) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Add a small delay to allow the initial render to complete before animating
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        // Start fade-out animation
        setIsAnimating(false);
        // Call parent's onClose after animation completes
        setTimeout(onClose, 300); // Duration matches transition duration
    };

    return (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-sm">
            <div
                className={`bg-gray-700 rounded-xl p-8 max-w-sm mx-4 text-center space-y-4 shadow-xl border border-gray-600 transition-all duration-300 ease-in-out
                ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <p className="text-xl font-semibold text-white">{message}</p>
                <button
                    onClick={handleClose}
                    className="px-6 py-3 font-semibold text-lg text-gray-800 bg-gray-400 rounded-md  hover:bg-gray-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
};