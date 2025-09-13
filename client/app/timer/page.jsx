'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Modal from '../components/Modal';
import { get } from 'http';
// Modal component for the pop-up

const timerDurationInSeconds = 1 * 10; // 60 minutes

export default function Home() {
    const [secondsLeft, setSecondsLeft] = useState(timerDurationInSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [hoursPerLevel, setHoursPerLevel] = useState(1); // Initialize with 1 to prevent NaN
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isMinting, setIsMinting] = useState(false);
    const [totalStudyTime, setTotalStudyTime] = useState(0);
    const [nftImageUri, setNftImageUri] = useState(null);

    // Fetch total study time when the component loads or a session is completed
    useEffect(() => {
        const fetchTotalStudyTime = async () => {
            const account = Cookies.get('userAccount');
            if (account) {
                try {
                    const response = await axios.get('/api/log-study-hours/database', {
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
                const response = await axios.get('/api/hours-per-level');
                // Ensure value is a number and not 0 to prevent division issues
                const hours = Number(response.data.hoursPerLevel);
                setHoursPerLevel(hours > 0 ? hours : 1);
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

    // Check for a saved timer state in a cookie on initial load
    useEffect(() => {
        const savedTime = Number(Cookies.get('timerSeconds'));
        if (savedTime) {
            setSecondsLeft(savedTime);
        }
    }, []);

    // Save timer state to cookie every second while running
    useEffect(() => {
        if (isRunning) {
            Cookies.set('timerSeconds', secondsLeft.toString());
        }
    }, [secondsLeft, isRunning]);


    const getNftImageUri = async (tokenId) => {
        const nftUriResponse = await axios.get('/api/nft', { params: { tokenId } });
        const nftUri = nftUriResponse.data.tokenURI;
        if (nftUri) {
            const base64Data = nftUri.split(',')[1];
            const decodedJson = atob(base64Data);
            const nftMetadata = JSON.parse(decodedJson);
            setNftImageUri(nftMetadata.image);
        }
    }

    const handleSessionComplete = async () => {
        const account = Cookies.get('userAccount');
        try {
            const oldTotalTime = totalStudyTime;

            // Save the newly completed study time to the database
            const saveTimeResponse = await axios.post('/api/log-study-hours/database', {
                userId: account,
                timeInSeconds: timerDurationInSeconds
            });

            const updatedData = saveTimeResponse.data;
            const updatedTotalTime = updatedData.totalStudyTime;
            setTotalStudyTime(updatedTotalTime);

            const oldLevel = Math.floor(oldTotalTime / 3600 / hoursPerLevel);
            const newLevel = Math.floor(updatedTotalTime / 3600 / hoursPerLevel);

            // Check if total study time has crossed the threshold for minting
            if (newLevel > oldLevel) {
                setIsMinting(true);
                setPopupMessage("Session complete! Minting your NFT reward...");
                setShowPopup(true);

                // Call the minting API
                const mintResponse = await axios.post('/api/log-study-hours/contract', { to: account, hours: 1 });

                const { tokenId, contractAddress, txHash } = mintResponse.data;
                console.log(tokenId, contractAddress, txHash)

                // Fetch the NFT URI using the token ID
                const nftUri = getNftImageUri(tokenId);
                setNftImageUri(nftUri);


                // Optional: prompt MetaMask to track NFT
                // if (window.ethereum) {
                //     try {
                //         // This is the updated call to MetaMask
                //         await window.ethereum.request({
                //             method: 'wallet_watchAsset',
                //             params: {
                //                 type: 'ERC721',
                //                 options: {
                //                     address: contractAddress, // The NFT contract address
                //                     tokenId: tokenId, // The tokenId from the backend response
                //                     symbol: "STUDY",
                //                     decimals: 0,
                //                 },
                //             },
                //         });
                //     } catch (err) {
                //         console.warn("User rejected asset watch request:", err);
                //     }
                // }

                setPopupMessage(`🎉 NFT Minted! Token ID: ${tokenId}. 
        [View Transaction](https://sepolia.etherscan.io/tx/${txHash})`);
            }
            else {
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


    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
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

    if (hoursPerLevel === 0) {
        return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
    }

    const overallStudyTimeInHours = totalStudyTime / 3600;
    const currentLevel = Math.floor(overallStudyTimeInHours / hoursPerLevel) + 1;
    const nextLevelGoalInHours = currentLevel * hoursPerLevel;
    console.log(currentLevel, nextLevelGoalInHours - overallStudyTimeInHours, hoursPerLevel)
    const timeToNextLevelInSeconds = (nextLevelGoalInHours + 1 - overallStudyTimeInHours) * 3600;

    const progressSinceLastLevel = overallStudyTimeInHours % hoursPerLevel;
    const sessionTimeInHours = timerDurationInSeconds / 3600;
    const newProgressPercentage = ((progressSinceLastLevel + sessionTimeInHours) / hoursPerLevel) * 100;
    const revealPercentage = Math.min(Math.max(newProgressPercentage, 0), 100);

    return (
        <div className="flex items-center flex-col justify-center  text-white p-8 gap-8 w-[60vw] m-auto">
            {showPopup && <Modal message={popupMessage} onClose={() => setShowPopup(false)} />}
            <div className='flex w-full gap-8'>
                <div className=" text-xl  text-gray-500 bg-gray-700 flex flex-col w-full rounded-xl items-center justify-center py-4">
                    <p className='font-semibold' >
                        Total Time
                    </p>
                    <p className='text-3xl font-mono font-bold text-gray-400'>
                        {formatTime(totalStudyTime)}
                    </p>
                </div>
                <div className="text-xl font-semibold py-6 px-8 rounded-full  text-gray-500 bg-gray-700 ">
                    <p className='text-center ' >
                        Level
                    </p>
                    <p className='text-3xl font-mono font-bold text-center text-gray-400'>
                        {currentLevel}
                    </p>
                </div>
                <div className="text-xl font-semibold text-gray-500 bg-gray-700 flex flex-col w-full rounded-xl items-center justify-center py-4">
                    <p className='text-center' >
                        Next Level
                    </p>
                    <p className='text-3xl font-mono font-bold text-gray-400'>
                        {formatTime(Math.max(timeToNextLevelInSeconds, 0))}
                    </p>
                </div>
            </div>
            <div className='bg-gray-700 w-full  rounded-xl flex  flex-col justify-center gap-8 p-8'>
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
            <div className="space-y-4 w-full">
                <div className="relative w-full aspect-video h-80 bg-gray-700 rounded-xl overflow-hidden ">
                    {nftImageUri ? (
                        <img
                            src={nftImageUri}
                            alt="Your minted NFT reward"
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                        />
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
