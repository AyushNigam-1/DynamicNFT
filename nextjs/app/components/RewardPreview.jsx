import { useEffect, useState } from "react";

const RewardPreview = (onClose, level) => {
    const [isAnimating, setIsAnimating] = useState(false);
    console.log(level)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-70  transition-opacity duration-300">
            <div className={`bg-white/75 text-gray-600 rounded-xl p-6 max-w-2xl mx-4 text-center shadow-xl transition-all duration-300 ease-in-out flex flex-col gap-5 items-center 
                ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <h2 className="text-2xl font-bold mb-4 text-gray-600">Level {level}</h2>
                <div className="relative w-72  rounded-lg overflow-hidden mb-4">
                    {level ? (
                        <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${level} `} alt="Your NFT" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Loading...</div>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="mt-4 w-full px-6 py-3 text-lg rounded-lg bg-gray-600 text-gray-200 font-semibold transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default RewardPreview