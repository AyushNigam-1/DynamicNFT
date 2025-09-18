"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'
import Notification from '../components/Notification';
import Navbar from '../components/Navbar';
import { Settings } from '../components/Settings';

export default function Home() {
    const [timerDurationInSeconds, setTimerDurationInSeconds] = useState(30 * 60); // Default to 30 minutes
    const [secondsLeft, setSecondsLeft] = useState(timerDurationInSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [hoursPerLevel, setHoursPerLevel] = useState(1); // Initialize with 1 to prevent NaN
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isMinting, setIsMinting] = useState(false);
    const [totalStudyTime, setTotalStudyTime] = useState(0);
    const [nftImageUri, setNftImageUri] = useState(null);
    const [customHours, setCustomHours] = useState("");
    const [customMinutes, setCustomMinutes] = useState("");
    const [customSeconds, setCustomSeconds] = useState("");
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [userLevelFromContract, setUserLevelFromContract] = useState(0); // State for the user's level from the contract
    const [theme, setTheme] = useState('system');

    // Handle theme changes and persistence
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // Fetch total study time when the component loads or a session is completed
    useEffect(() => {
        const fetchTotalStudyTime = async () => {
            const account = Cookies.get('userAccount');
            if (account) {
                try {
                    const response = await axios.get('/api/study-hours', {
                        params: { userAddress: account }
                    });
                    setTotalStudyTime(response.data.totalStudyTime);
                } catch (error) {
                    console.error("Error fetching total study time:", error);
                }
            }
        };
        fetchTotalStudyTime();
    }, [isDone]);
    useEffect(() => {
        const fetchUserLevel = async () => {
            const account = Cookies.get('userAccount');
            if (account) {
                try {
                    const response = await axios.get('/api/level', {
                        params: { userAddress: account }
                    });
                    setUserLevelFromContract(response.data.level);
                } catch (error) {
                    console.error("Error fetching user level from contract:", error);
                    // Handle cases where the user may not have an NFT yet
                    setUserLevelFromContract(0);
                }
            }
        };
        fetchUserLevel();
    }, [isDone, totalStudyTime]);
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
        const savedDuration = Number(Cookies.get('timerDuration'));
        const savedTime = Number(Cookies.get('timerSeconds'));
        if (!isNaN(savedDuration) && savedDuration > 0) {
            setTimerDurationInSeconds(savedDuration);
            setSecondsLeft(isNaN(savedTime) ? savedDuration : savedTime);
        }
    }, []);

    // Save timer state to cookie every second while running
    useEffect(() => {
        if (isRunning) {
            Cookies.set('timerSeconds', secondsLeft.toString());
        }
    }, [secondsLeft, isRunning]);
    useEffect(() => {
        getNftImageUri();
    }, [])

    const getNftImageUri = async () => {
        const { data } = await axios.get('/api/tokenid', { params: { userAddress: Cookies.get('userAccount') } });
        const nftUriResponse = await axios.get('/api/nft', { params: { tokenId: data.tokenId } });
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
            const saveTimeResponse = await axios.post('/api/study-hours', {
                userAddress: account,
                timeInSeconds: timerDurationInSeconds
            });

            const updatedData = saveTimeResponse.data;
            const updatedTotalTime = updatedData.totalStudyTime;
            console.log(saveTimeResponse)
            setTotalStudyTime(updatedTotalTime);

            const oldLevel = Math.floor(oldTotalTime / 3600 / hoursPerLevel) + 1;
            const newLevel = Math.floor(updatedTotalTime / 3600 / hoursPerLevel) + 1;

            if (newLevel > oldLevel) {
                setIsMinting(true);
                setPopupMessage("Level");
                setShowPopup(true);

                await axios.post('/api/level', { to: account, level: newLevel })
                try {
                    axios.delete(`/api/study-hours?userAddress=${account}`)
                    setTotalStudyTime(0); // Update local state immediately
                    console.log("Total study time reset to 0 in database.");
                } catch (resetError) {
                    console.error("Error resetting total study time:", resetError);
                }
                // Fetch the NFT URI using the token ID
                getNftImageUri();
            }
            else {
                setPopupMessage("Session");
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
    const handleSetTimer = () => {
        const newHours = Number(customHours) || 0;
        const newMinutes = Number(customMinutes) || 0;
        const newSeconds = Number(customSeconds) || 0;

        const totalSeconds = newHours * 3600 + newMinutes * 60 + newSeconds;

        if (totalSeconds > 0) {
            setTimerDurationInSeconds(totalSeconds);
            setSecondsLeft(totalSeconds);
            setIsRunning(false);
            setShowPopup(false);
            Cookies.set('timerDuration', totalSeconds.toString());
            Cookies.remove('timerSeconds');
            setShowSettingsModal(false);
        } else {
            // Optional: Provide feedback to the user if the input is invalid
            console.log("Invalid time entered. Please enter a duration greater than 0.");
        }
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
    // const currentLevel = Math.floor(overallStudyTimeInHours / hoursPerLevel) + 1;
    const nextLevelGoalInHours = userLevelFromContract * hoursPerLevel;
    const timeToNextLevelInSeconds = (nextLevelGoalInHours - overallStudyTimeInHours) * 3600;

    const progressSinceLastLevel = overallStudyTimeInHours % hoursPerLevel;

    // The Fix: Calculate elapsed time and use it for the percentage calculation
    const elapsedTimeInSeconds = timerDurationInSeconds - secondsLeft;
    const elapsedTimeInHours = elapsedTimeInSeconds / 3600;

    const newProgressPercentage = ((progressSinceLastLevel + elapsedTimeInHours) / hoursPerLevel) * 100;
    const revealPercentage = Math.min(Math.max(newProgressPercentage, 0), 100);

    return (
        <>
            <Navbar />
            <div className="flex items-center flex-col justify-center px-56 text-white py-8 gap-8 container m-auto">
                {showPopup && <Notification nftImageUri={nftImageUri} message={popupMessage} onClose={() => setShowPopup(false)} />}
                <div className='flex w-full gap-8 justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                        <p className='font-mono font-bold text-gray-500 text-center text-2xl' >
                            Level:
                        </p>
                        <p className='font-mono font-bold text-gray-400 text-center text-2xl' >
                            {userLevelFromContract}
                        </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <p className='font-mono font-bold text-gray-500 text-center text-xl' >
                            Next Level In :
                        </p>
                        <p className='font-mono font-bold text-gray-400 text-center text-2xl' >
                            {formatTime(Math.max(timeToNextLevelInSeconds, 0))}
                        </p>
                    </div>
                </div>
                <div className='bg-gray-800/75 w-full  rounded-xl flex  flex-col justify-center gap-6 p-6 items-center'>
                    <div className='flex  items-center gap-2'>
                        <p className='font-mono font-bold text-gray-500 text-center text-md' >
                            Total :
                        </p>
                        <p className='font-mono font-bold text-gray-400 text-center text-xl' >
                            {formatTime(totalStudyTime)}
                        </p>
                    </div>
                    <span className="text-9xl font-mono font-bold text-gray-400">
                        {formatTime(secondsLeft)}
                    </span>
                    <p className=" text-gray-500 font-mono font-bold ">
                        {isDone ? 'Time\'s Up!' : isRunning ? 'In Progress' : 'Ready'}
                    </p>
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
                            onClick={() => setShowSettingsModal(true)} className="px-6 py-3 font-semibold text-lg text-gray-800 bg-gray-400 rounded-md  hover:bg-gray-500 transition-colors duration-200 focus:outline-none cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                {showSettingsModal && <Settings setShowSettingsModal={setShowSettingsModal} setTheme={setTheme} setCustomHours={setCustomHours} setCustomMinutes={setCustomMinutes} setCustomSeconds={setCustomSeconds} theme={theme} handleSetTimer={handleSetTimer} customMinutes={customMinutes} customSeconds={customSeconds} customHours={customHours} />}

                <p className='text-center font-mono font-bold text-gray-500 text-2xl ' >
                    Your Reward
                </p>
                <div className="space-y-4 w-full">
                    <div className="relative h-80 w-80 bg-gray-800/75 rounded-xl overflow-hidden  mx-auto">
                        {nftImageUri ? (
                            <img
                                src={nftImageUri}
                                alt="Your minted NFT reward"
                                className="absolute inset-0 w-80 h-80 object-cover transition-all duration-1000 "
                                style={{ clipPath: `inset(${100 - revealPercentage}% 0 0 0)` }}
                            />
                        ) : (
                            <img
                                src="https://placehold.co/600x400/3282b8/ffffff?text=STUDY+COMPLETED"
                                alt="Reward image"
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                                style={{ clipPath: `inset(${100 - revealPercentage}% 0 0 0)` }}
                            />
                        )}
                        {revealPercentage < 100 && (
                            <div className="absolute inset-0 bg-gray-800/75 flex items-center justify-center opacity-75">
                                <div className='flex  items-center gap-2'>
                                    {/* <p className='font-mono font-bold text-gray-300 text-center text-lg' >
                                        Progress :
                                    </p> */}
                                    <p className='font-mono font-bold text-gray-200 text-center text-2xl' >
                                        {revealPercentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
}
