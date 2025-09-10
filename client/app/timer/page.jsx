"use client";

import { useState, useEffect } from 'react';

const timerDurationInSeconds = 60 * 60; // 60 minutes

export default function Home() {
    const [secondsLeft, setSecondsLeft] = useState(timerDurationInSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [hoursPerLevel, setHoursPerLevel] = useState(0);

    // Fetch HOURS_PER_LEVEL from the backend
    useEffect(() => {
        const fetchHoursPerLevel = async () => {
            try {
                // Corrected API endpoint to match the one you provided earlier
                const response = await fetch('/api/get-hours');
                if (!response.ok) {
                    throw new Error('Failed to fetch HOURS_PER_LEVEL');
                }
                const data = await response.json();
                console.log(parseInt(data.hoursPerLevel, 10))
                setHoursPerLevel(parseInt(data.hoursPerLevel, 10));
            } catch (error) {
                console.error("Error fetching HOURS_PER_LEVEL:", error);
            }
        };
        fetchHoursPerLevel();
    }, []);

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
    };

    // Calculate the total progress percentage for this session
    const sessionProgressPercentage = ((timerDurationInSeconds - secondsLeft) / timerDurationInSeconds) * 100;

    // Map the session progress to the overall progress based on HOURS_PER_LEVEL
    // This assumes the user starts at 0 completed hours. To get true progress,
    // you would need to also fetch the user's completed hours from the blockchain.
    const overallProgress = hoursPerLevel > 0 ? (sessionProgressPercentage / 100) * (1 / hoursPerLevel) * 100 : 0;
    const revealPercentage = Math.min(Math.max(overallProgress, 0), 100);

    return (
        <div className="flex items-center flex-col justify-center min-h-screen bg-gray-800  text-white p-4 gap-8">
            <div className='bg-gray-700 w-[60vw] rounded-xl flex  flex-col justify-center gap-8 p-8' >
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
                    <button
                        onClick={pauseTimer}
                        className="px-6 py-3 font-semibold text-lg text-gray-800 bg-gray-400 rounded-md  hover:bg-gray-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </button>
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
