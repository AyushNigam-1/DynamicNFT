import { useEffect, useState } from "react";

export default function Notification({ nftImageUri, message, onClose }) {
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
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-sm font-mono">
            <div
                className={`bg-gray-700 rounded-xl p-6 max-w-2xl mx-4 text-center shadow-xl transition-all duration-300 ease-in-out flex flex-col gap-5 items-center 
                ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                {message === "Level" ? <>
                    <img width="68" height="68" src="https://img.icons8.com/emoji/68/party-popper.png" alt="party-popper" />
                    {/* <div className="flex gap-2 items-center">
                        <img width="48" height="48" src="https://img.icons8.com/emoji/48/party-popper.png" alt="party-popper" /> */}
                    <h4 className="text-3xl font-semibold text-white"> Congratulations </h4>
                    {/* <img width="58" height="58" src="https://img.icons8.com/emoji/58/party-popper.png" alt="party-popper" /> */}
                    {/* </div> */}
                    <p className="text-gray-300 text-lg">You Have Successfully Unlocked A New Level, Here Is Your NFT As A Reward</p>
                    <img src={nftImageUri} alt="" className="h-80 w-80" />
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 font-semibold text-lg text-gray-900 bg-gray-300 rounded-md  hover:bg-gray-400 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Close
                    </button>
                </> : <><div  >
                    <img width="98" height="98" src="https://img.icons8.com/emoji/98/party-popper.png" alt="party-popper" />
                </div>
                    <h4 className="text-3xl font-semibold text-white"> Hurrah, Session Completed! </h4>
                    <p className="text-gray-300 text-lg">Keep Studying To Earn Your NFT</p>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 font-semibold text-lg text-gray-900 bg-gray-300 rounded-md  hover:bg-gray-400 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Okay
                    </button></>}

            </div>
        </div>
    );
};