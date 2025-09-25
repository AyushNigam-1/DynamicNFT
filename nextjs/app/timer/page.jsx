"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'
import Notification from '../components/Notification';
import Navbar from '../components/Navbar';
import { Settings } from '../components/Settings';
import { getLevel, setLevel } from '../services/level';
import { useWallet } from '../context/WalletContext';
import { getNftUri } from '../services/nft';
import { getHoursPerLevel } from '../services/hour_per_level';
import Timer from '../components/Timer';
import Rewards from '../components/Rewards';
import RewardPreview from '../components/RewardPreview';


export default function Home() {
    const { Wallet, account } = useWallet();

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
    const [timeDuration, setTimeDuration] = useState(0);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const getContract = async () => {
            const { contract } = await Wallet();
            setContract(contract);
        }
        getContract()
    }, [])

    // Fetch total study time when the component loads or a session is completed
    useEffect(() => {
        const fetchTotalStudyTime = async () => {
            const account = Cookies.get('userAccount');
            if (account) {
                try {
                    const response = await axios.get('/api/study-hours', {
                        params: { userAddress: account }
                    });
                    const res = await axios.get("/api/duration", {
                        params: { userAddress: account }
                    });
                    console.log("User duration:", res.data.timeDuration);
                    setTimeDuration(res.data.timeDuration || 0)
                    setSecondsLeft(res.data.timeDuration || 0);
                    setTotalStudyTime(response.data.totalStudyTime);
                } catch (error) {
                    console.error("Error fetching total study time:", error);
                }
            }
        };
        fetchTotalStudyTime();
    }, []);


    useEffect(() => {
        const fetchUserLevel = async () => {
            const account = Cookies.get('userAccount');
            if (account && contract) {
                try {
                    const response = await getLevel(account, contract);
                    const res = await getHoursPerLevel(contract, account)
                    const hours = Number(res.hours);
                    // console.log("hours", hours)
                    setHoursPerLevel(hours > 0 ? hours : 1);
                    setUserLevelFromContract(response.level);
                } catch (error) {
                    console.error("Error fetching user level from contract:", error);
                    // Handle cases where the user may not have an NFT yet
                    setUserLevelFromContract(0);
                }
            }
        };
        fetchUserLevel();
    }, [isDone, contract]);


    const getNftImageUri = async () => {
        console.log(Cookies.get('userAccount'))
        const { data } = await axios.get('/api/tokenid', { params: { userAddress: Cookies.get('userAccount') } });

        const nftUriResponse = await getNftUri(data.tokenId, contract);
        const nftUri = nftUriResponse.tokenURI;
        if (nftUri) {
            const base64Data = nftUri.split(',')[1];
            const decodedJson = atob(base64Data);
            const nftMetadata = JSON.parse(decodedJson);
            setNftImageUri(nftMetadata.image);
        }
    }
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
            resetTimer()
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
        setSecondsLeft(timeDuration);
        setShowPopup(false);
        Cookies.remove('timerSeconds');
    };
    // Save timer state to cookie every second while running
    useEffect(() => {
        if (isRunning) {
            Cookies.set('timerSeconds', secondsLeft.toString());
        }
    }, [secondsLeft, isRunning]);

    useEffect(() => {
        if (contract) {
            getNftImageUri();
        }
    }, [contract])

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
            console.log("saveTimeResponse", updatedTotalTime)
            setTotalStudyTime(updatedTotalTime);

            const oldLevel = Math.floor(oldTotalTime / 3600 / hoursPerLevel) + 1;
            const newLevel = Math.floor(updatedTotalTime / 3600 / hoursPerLevel) + 1;
            console.log(oldLevel, newLevel)
            if (newLevel > oldLevel) {
                setIsMinting(true);
                setPopupMessage("Level Up!");
                setShowPopup(true);

                try {
                    // 1. Call backend to generate signed message
                    const res = await axios.post("/api/level", { to: account });
                    const { totalTime, newLevel: levelFromBackend, signature } = res.data;

                    console.log("Backend signed data:", { totalTime, levelFromBackend, signature });

                    // 2. Call the contract with signed data
                    const tx = await setLevel(
                        contract,
                        account,
                        totalTime,
                        levelFromBackend,
                        signature
                    );
                    // await tx.wait();
                    console.log("Contract call successful:", tx.newLevel);

                    // 3. Reset total study time in your database
                    try {
                        await axios.delete(`/api/study-hours?userAddress=${account}`);
                        setTotalStudyTime(0); // update frontend state
                        console.log("Total study time reset to 0 in database.");
                    } catch (resetError) {
                        console.error("Error resetting total study time:", resetError);
                    }

                    // // 4. Fetch updated NFT URI
                    await getNftImageUri();

                } catch (error) {
                    console.error("Error during level-up process:", error);
                    setPopupMessage("Level-up failed");
                } finally {
                    setIsMinting(false);
                }
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

    const handleSetTimer = async () => {
        const newHours = Number(customHours) || 0;
        const newMinutes = Number(customMinutes) || 0;
        const newSeconds = Number(customSeconds) || 0;

        const totalSeconds = newHours * 3600 + newMinutes * 60 + newSeconds;

        if (totalSeconds > 0) {
            setTimerDurationInSeconds(totalSeconds);
            try {
                await axios.post("/api/duration", {
                    userAddress: Cookies.get('userAccount'),
                    timeDuration: totalSeconds,
                });
                setTimeDuration(totalSeconds); // update state locally
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || "Failed to update timeDuration");
            }
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



    if (hoursPerLevel === 0) {
        return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
    }

    const overallStudyTimeInHours = totalStudyTime / 3600;
    // const currentLevel = Math.floor(overallStudyTimeInHours / hoursPerLevel) + 1;
    const nextLevelGoalInHours = hoursPerLevel;
    const timeToNextLevelInSeconds = (nextLevelGoalInHours - overallStudyTimeInHours) * 3600;

    const progressSinceLastLevel = overallStudyTimeInHours % hoursPerLevel;

    // The Fix: Calculate elapsed time and use it for the percentage calculation
    const elapsedTimeInSeconds = timerDurationInSeconds - secondsLeft;
    const elapsedTimeInHours = elapsedTimeInSeconds / 3600;

    const newProgressPercentage = ((progressSinceLastLevel + elapsedTimeInHours) / hoursPerLevel) * 100;
    console.log(newProgressPercentage)
    const revealPercentage = Math.min(Math.max(newProgressPercentage, 0), 100);

    return (
        <>
            <Navbar />
            <div className="flex items-center flex-col justify-center px-56 text-white py-6 gap-6  m-auto ">
                {showPopup && <Notification nftImageUri={nftImageUri} message={popupMessage} onClose={() => setShowPopup(false)} />}
                <div className='flex w-full gap-8 justify-between items-center'>
                    <div className='flex gap-2 items-center text-gray-600 font-extrabold '>
                        <p className='font-mono  text-center text-2xl' >
                            Level: {userLevelFromContract}
                        </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <p className='font-mono text-gray-600 font-extrabold  text-center text-2xl' >
                            Next Level In: {formatTime(Math.max(timeToNextLevelInSeconds, 0))}
                        </p>
                    </div>
                </div>
                <Timer isDone={isDone} isRunning={isRunning} pauseTimer={pauseTimer} resetTimer={resetTimer} secondsLeft={secondsLeft} setShowSettingsModal={setShowSettingsModal} startTimer={startTimer} totalStudyTime={totalStudyTime} formatTime={formatTime} />

                {showSettingsModal && <Settings setShowSettingsModal={setShowSettingsModal} setCustomHours={setCustomHours} setCustomMinutes={setCustomMinutes} setCustomSeconds={setCustomSeconds} handleSetTimer={handleSetTimer} customMinutes={customMinutes} customSeconds={customSeconds} customHours={customHours} />}
                {/* <div className='h-[1px] w-full bg-gray-400' /> */}

                <p className='text-center font-mono font-bold text-gray-600 text-2xl' >
                    Your Rewards
                </p>
                <Rewards nftImageUri={nftImageUri} revealPercentage={revealPercentage} userLevelFromContract={userLevelFromContract} />

            </div >
        </>
    );
}
