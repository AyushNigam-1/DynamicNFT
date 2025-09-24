import { useEffect, useState } from "react";

export const Settings = ({ setCustomHours, setCustomMinutes, setCustomSeconds, setTheme, setShowSettingsModal, customHours, customMinutes, customSeconds, theme, handleSetTimer }) => {
    // State to control the modal's animation
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // This useEffect runs once when the modal is mounted.
        // We use a small delay to ensure the component is rendered
        // with its initial opacity/scale before we start the transition.
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleCloseModal = () => {
        // This function handles the "closing" logic.
        // First, we trigger the exit animation by setting the state to false.
        setIsAnimating(false);
        // Then, after the animation duration (300ms), we tell the parent
        // component to unmount this modal from the DOM.
        setTimeout(() => {
            setShowSettingsModal(false);
        }, 300); // This duration must match the CSS transition duration.
    };

    return (
        // The backdrop transitions with a blur effect.
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 transition-all duration-300 backdrop-blur-sm font-mono">
            <style jsx>{`
                .hide-arrows::-webkit-outer-spin-button,
                .hide-arrows::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .hide-arrows[type="number"] {
                    -moz-appearance: textfield;
                }
            `} </style>
            {/* The modal content itself animates scale and opacity based on the `isAnimating` state. */}
            <div className={`bg-white/75 text-gray-600 rounded-2xl p-5 max-w-xl w-full  flex flex-col gap-5 transition-all duration-300 ease-in-out  ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} >
                <div className="flex flex-col gap-3">
                    <div className='flex justify-between'>
                        <h2 className="text-2xl font-bold text-center font-mono ">Settings</h2>
                        <button
                            onClick={handleCloseModal}
                            className=" rounded-md font-semibold text-xl  text-gray-400  transition-all duration-300 transform hover:scale-105 focus:outline-none  flex gap-1 items-center cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='h-[1px] w-full bg-gray-600' />
                <div className='flex items-center gap-2 text-gray-300 text-lg  font-mono font-bold'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Timer
                </div>
                <div className="flex justify-between p-1 items-center border border-gray-600 rounded-2xl">
                    <div className="flex flex-col gap-1">
                        <input
                            type="number"
                            placeholder="00"
                            value={customHours}
                            onChange={(e) => setCustomHours(e.target.value)}
                            className="hide-arrows w-40 px-4 py-2 text-center text-white rounded-xl 0 text-lg focus:outline-none "
                        />
                    </div>
                    :
                    <div className="flex flex-col gap-1">
                        <input
                            type="number"
                            placeholder="00"
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(e.target.value)}
                            className="hide-arrows w-40 px-4 py-2 text-center text-white rounded-xl text-lg focus:outline-none "
                        />
                    </div>
                    :
                    <div className="flex flex-col  gap-1">
                        <input
                            type="number"
                            placeholder="00"
                            value={customSeconds}
                            onChange={(e) => setCustomSeconds(e.target.value)}
                            className="hide-arrows w-40 px-4 py-2 text-center text-white rounded-xl  text-lg focus:outline-none "
                        />
                    </div>
                </div>
                {/* <div className='flex items-center gap-2 text-gray-300 text-lg  font-mono font-bold'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                    </svg>
                    Theme
                </div>
                <div className="flex justify-between p-1 rounded-2xl border border-gray-600">
                    <button
                        onClick={() => setTheme('light')}
                        className={`px-4 py-2 rounded-xl text-lg text-gray-400 transition-colors duration-200 flex items-center justify-center gap-2 w-full cursor-pointer ${theme === 'light'
                            ? 'bg-gray-400 text-gray-900'
                            : ''
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                        Light
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={`px-4 py-2 text-gray-400 rounded-xl text-lg  transition-colors duration-200 w-full  flex items-center justify-center gap-2  cursor-pointer ${theme === 'dark'
                            ? 'bg-gray-400 text-gray-900'
                            : ''
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                        Dark
                    </button>
                    <button
                        onClick={() => setTheme('system')}
                        className={`px-4 py-2 rounded-xl text-lg text-gray-400 transition-colors duration-200 w-full  flex items-center justify-center gap-2 cursor-pointer ${theme === 'system'
                            ? 'bg-gray-400 text-gray-900'
                            : ''
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                        </svg>
                        System
                    </button>
                </div> */}
                <div className='h-[1px] w-full bg-gray-600' />
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleSetTimer}
                        className="py-2 px-8 rounded-md font-mono text-xl  text-gray-800 bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none  flex gap-1 items-center cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}
