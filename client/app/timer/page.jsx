'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Modal component for the pop-up
const Modal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 rounded-xl p-8 max-w-sm mx-4 text-center space-y-4 shadow-xl border border-gray-600">
                <p className="text-xl font-semibold text-white">{message}</p>
                <button
                    onClick={onClose}
                    className="px-6 py-2 font-semibold text-lg text-gray-800 bg-teal-400 rounded-full hover:bg-teal-500 transition-colors duration-200 focus:outline-none"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const timerDurationInSeconds = 1 * 10; // 60 minutes

export default function Home() {
    const [secondsLeft, setSecondsLeft] = useState(timerDurationInSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [hoursPerLevel, setHoursPerLevel] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isMinting, setIsMinting] = useState(false);
    const [totalStudyTime, setTotalStudyTime] = useState(0);

    // Fetch total study time when the component loads or a session is completed
    useEffect(() => {
        const fetchTotalStudyTime = async () => {
            const account = Cookies.get('userAccount');
            if (account) {
                try {
                    const response = await axios.get('/api/log-study-hours/mongo', {
                        params: { userId: account }
                    });
                    console.log("Fetched total study time:", response.data.totalStudyTime);
                    setTotalStudyTime(response.data.totalStudyTime);
                } catch (error) {
                    console.error("Error fetching total study time:", error);
                }
            }
        };
        fetchTotalStudyTime();
    }, [isDone]);

    // Fetch HOURS_PER_LEVEL from the backend
    useEffect(() => {
        const fetchHoursPerLevel = async () => {
            try {
                const response = await axios.get('/api/get-hours');
                setHoursPerLevel(Number(response.data.hoursPerLevel));
            } catch (error) {
                console.error("Error fetching HOURS_PER_LEVEL:", error);
            }
        };
        fetchHoursPerLevel();
    }, []);

    // Timer logic
    useEffect(() => {
        let timer;
        if (isRunning && secondsLeft > 0) {
            timer = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setIsRunning(false);
            setIsDone(true);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning, secondsLeft]);

    // Handle session completion and minting
    useEffect(() => {
        if (isDone) {
            handleSessionComplete();
        }
    }, [isDone]);

    const handleSessionComplete = async () => {
        const account = Cookies.get('userAccount');
        try {
            // Save the newly completed study time to the database
            const saveTimeResponse = await axios.post('/api/log-study-hours/mongo', {
                userId: account,
                timeInSeconds: timerDurationInSeconds
            });

            const updatedData = saveTimeResponse.data;
            const updatedTotalTime = updatedData.totalStudyTime;
            setTotalStudyTime(updatedTotalTime);
            console.log("Study time saved successfully. New total time:", updatedTotalTime);

            // Check if total study time has crossed the threshold for minting
            if (updatedTotalTime / 3600 >= hoursPerLevel) {
                setIsMinting(true);
                setPopupMessage("Session complete! Minting your NFT reward...");
                setShowPopup(true);

                // Call the minting API
                const mintResponse = await axios.post('/api/mint', { to: account });

                const data = mintResponse.data;
                setPopupMessage(`Hurrah! You have completed your very first session and received NFT with Token ID: ${data.tokenId}!`);

            } else {
                setPopupMessage("Session complete! Keep studying to earn your NFT reward.");
                setShowPopup(true);
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            const errorMessage = error.response?.data?.error || error.message;
            setPopupMessage(`An error occurred: ${errorMessage}`);
            setShowPopup(true);
        } finally {
            setIsMinting(false);
        }
    };

    // Check for a saved timer state in a cookie on initial load
    useEffect(() => {
        const savedTime = Cookies.get('timerSeconds');
        if (savedTime) {
            setSecondsLeft(Number(savedTime));
        }
    }, []);

    // Save timer state to cookie every second while running
    useEffect(() => {
        if (isRunning) {
            Cookies.set('timerSeconds', secondsLeft.toString());
        }
    }, [secondsLeft, isRunning]);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        const pad = (num) => num.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsDone(false);
        }
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsDone(false);
        setSecondsLeft(timerDurationInSeconds);
        setShowPopup(false);
        Cookies.remove('timerSeconds');
    };

    const overallStudyTimeInHours = totalStudyTime / 3600;
    const sessionTimeInHours = timerDurationInSeconds / 3600;
    const progressSinceLastLevel = overallStudyTimeInHours % hoursPerLevel;
    const progressPercentage = (progressSinceLastLevel / hoursPerLevel) * 100;
    const newProgressPercentage = ((progressSinceLastLevel + sessionTimeInHours) / hoursPerLevel) * 100;
    const revealPercentage = Math.min(Math.max(newProgressPercentage, 0), 100);

    return (
        <div className="flex items-center flex-col justify-center  text-white p-4 gap-8 ">
            {showPopup && <Modal message={popupMessage} onClose={() => setShowPopup(false)} />}
            <p className="mt-4 text-xl font-semibold text-gray-400">
                Total Study Time: {formatTime(totalStudyTime)}
            </p>
            <div className='bg-gray-700 w-[60vw] rounded-xl flex  flex-col justify-center gap-8 p-8'>
                <div className=" flex flex-col items-center justify-center ">
                    <span className="text-9xl font-mono font-bold text-gray-400">
                        {formatTime(secondsLeft)}
                    </span>
                    <p className="text-sm text-gray-400 mt-2">
                        {isDone ? 'Time\'s Up!' : isRunning ? 'In Progress' : 'Ready'}
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    {!isRunning && !isDone && (
                        <button
                            onClick={startTimer}
                            className="px-6 py-3 font-semibold text-lg text-gray-800 bg-gray-400 rounded-md  hover:bg-gray-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>
                        </button>
                    )}
                    {isRunning && (
                        <button
                            onClick={pauseTimer}
                            className="px-6 py-3 font-semibold text-lg text-gray-800 bg-gray-400 rounded-md  hover:bg-gray-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                        </button>
                    )}
                    {(!isRunning || isDone) && (
                        <button
                            onClick={resetTimer}
                            className="px-6 py-3 font-semibold text-lg text-gray-800 bg-gray-400 rounded-md  hover:bg-gray-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-4 ">
                <div className="relative aspect-video w-[60vw] h-80 bg-gray-700 rounded-xl overflow-hidden ">
                    <img
                        src="https://placehold.co/600x400/3282b8/ffffff?text=STUDY+COMPLETED"
                        alt="Reward image"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                        style={{ clipPath: `inset(${100 - revealPercentage}% 0 0 0)` }}
                    />
                    {revealPercentage < 100 && (
                        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center opacity-75">
                            <p className="text-center text-3xl text-gray-400">Progress: {Math.floor(revealPercentage)}%</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
