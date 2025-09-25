import { useState } from "react";
import RewardPreview from "./RewardPreview";

const Rewards = ({ userLevelFromContract, revealPercentage, nftImageUri }) => {
    const [level, setLevel] = useState(null)

    const [showNftModal, setShowNftModal] = useState(false);

    return (
        <>
            <div className="flex w-full gap-2 font-mono">
                <div className='flex  text-gray-600 rounded-xl' >
                    <div className='flex items-center gap-2 '>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg> */}
                        <p className='font-bold text-xl text-center text-nowrap' >Level {userLevelFromContract - 1}</p>
                    </div>
                </div>
                <div className='h-2 my-auto  w-full bg-gray-800/75 ' >
                    <div className={`h-full bg-gray-400`} style={{ width: `${revealPercentage}%` }}></div>
                </div>
                <div className='flex  text-gray-600 rounded-xl ' >
                    <div className='flex items-center gap-2 h-full w-full'>

                        <p className='font-bold text-xl text-center text-nowrap' >Level {userLevelFromContract}</p>
                    </div>
                </div>
                <div className='h-2  w-full bg-gray-800/75 my-auto' >
                    <div className={`h-full bg-gray-400`} style={{ width: `${revealPercentage}%` }}></div>
                </div>
                <div className='flex  text-gray-600 rounded-xl' >
                    <div className='flex items-center gap-2 h-full w-full'>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg> */}
                        {/* <button className="bg-gray-600 text-gray-200 flex gap-2 p-2 items-center rounded-xl"> */}
                        <p className='font-bold text-xl text-center text-nowrap' >Level {userLevelFromContract + 1}</p>
                        {/* </button> */}
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full ">
                <div className=' bg-white/50 text-gray-300 rounded-xl p-2 w-50 h-50 relative' >
                    <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract - 1}.svg`} alt="" className='absolute blur-lg' />
                    <div className="flex justify-center items-center flex-col absolute h-full w-full">
                        <button className="flex cursor-pointer gap-1 items-center p-2 px-4 rounded-lg bg-gray-600 font-semibold text-gray-200 font-mono" onClick={() => { setLevel(userLevelFromContract - 1); setShowNftModal(true) }}  >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            View
                        </button>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14  text-gray-600 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg> */}
                    </div>
                    {/* <div className='flex justify-center items-center flex-col absolute h-full w-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        <p className='font-bold' >Level {userLevelFromContract - 1}</p>
                    </div> */}
                </div>
                <div className=' bg-white/50 text-gray-300 rounded-xl p-2 relative w-72 h-72' >
                    {nftImageUri ? (
                        <img
                            src={nftImageUri}
                            alt="Your minted NFT reward"
                            className="absolute inset-0 w-68 h-68 object-cover transition-all duration-1000 z-10"
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
                    <div className='flex justify-center text-gray-800 items-center flex-col z-20 absolute h-full w-full'>

                        <p className='font-mono font-bold text-gray-400 text-center text-lg' >
                            Progress
                        </p>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg> */}

                        <p className='font-mono font-bold text-gray-600 text-center text-2xl ' >
                            {revealPercentage.toFixed(1)}%
                        </p>
                        {/* <p className='font-semibold' >Level {userLevelFromContract}</p> */}
                    </div>
                </div>
                <div className=' bg-white/75 text-gray-200 rounded-xl p-2 w-50 h-50 relative ' >
                    <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract + 1}.svg`} alt="" className='blur-xl absolute' />

                    <div className='flex justify-center items-center flex-col absolute h-full w-full'>
                        <button disabled className=" flex gap-1 items-center p-2 px-4 rounded-lg bg-gray-600 font-semibold text-gray-200 font-mono" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>

                            Locked
                        </button>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg> */}
                        {/* <p className='font-bold' >Level {userLevelFromContract - 1}</p> */}
                    </div>
                </div>

            </div>
            {showNftModal && (
                <RewardPreview
                    // nftImageUri={previewURI}
                    onClose={() => setShowNftModal(false)}
                    level={level}
                />
            )}
        </>
    )
}

export default Rewards