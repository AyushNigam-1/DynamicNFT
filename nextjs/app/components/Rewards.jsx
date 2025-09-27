const Rewards = ({ userLevelFromContract, revealPercentage, nftImageUri, setPopupMessage,
    setShowPopup }) => {
    return (
        <>
            <div className="flex w-full gap-2 font-mono">
                <div className='flex text-gray-600 rounded-xl' >
                    <div className='flex items-center gap-2 '>
                        <p className='font-bold text-xl text-center text-nowrap' >Level {userLevelFromContract}</p>
                    </div>
                </div>
                <div className='h-2 my-auto  w-full bg-gray-800/75 ' >
                    <div className={`h-full bg-gray-300`} style={{ width: `${revealPercentage}%` }}></div>
                </div>
                <div className='flex  text-gray-600 rounded-xl ' >
                    <div className='flex items-center gap-2 h-full w-full'>

                        <p className='font-bold text-xl text-center text-nowrap' >Level {userLevelFromContract + 1}</p>
                    </div>
                </div>
                <div className='h-2 w-full bg-gray-800/75 my-auto' >
                </div>
                <div className='flex  text-gray-600 rounded-xl' >
                    <div className='flex items-center gap-2 h-full w-full'>
                        <p className='font-bold text-xl text-center text-nowrap' >Level {userLevelFromContract + 2}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full ">
                <div className=' bg-white/50 text-gray-300 rounded-xl p-2 w-50 h-50 relative' >
                    {nftImageUri ? (
                        <img
                            src={nftImageUri}
                            alt="Your minted NFT reward"
                            className="blur-lg absolute"
                        />
                    ) : (
                        <img
                            src="https://placehold.co/600x400/3282b8/ffffff?text=STUDY+COMPLETED"
                            alt="Reward image"
                            className="blur-xl absolute"
                        />
                    )}
                    <div className="flex justify-center items-center flex-col absolute h-full w-full">
                        <button className="flex cursor-pointer gap-1 items-center p-2 px-4 rounded-lg bg-gray-600 font-semibold text-gray-200 font-mono" onClick={() => { setPopupMessage("View"); setShowPopup(true) }}  >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            View
                        </button>
                    </div>
                </div>
                <div className=' bg-white/50 text-gray-300 rounded-xl p-2 relative w-72 h-72' >
                    <img
                        src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract + 1}.svg`}
                        alt="Your minted NFT reward"
                        className="absolute inset-0 w-68 h-68 object-cover transition-all duration-1000 z-10 blur-lg"
                    />
                    <div className='flex justify-center  items-center flex-col z-20 absolute h-full w-full'>
                        <p className='font-mono font-extrabold text-gray-600 text-center text-xl' >
                            Progress
                        </p>
                        <p className='font-mono font-bold text-gray-600 text-center text-3xl ' >
                            {revealPercentage.toFixed(1)}%
                        </p>
                    </div>
                </div>
                <div className=' bg-white/75 text-gray-200 rounded-xl p-2 w-50 h-50 relative ' >
                    <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract + 2}.svg`} alt="" className='blur-lg absolute' />
                    <div className='flex justify-center items-center flex-col absolute h-full w-full'>
                        <button disabled className=" flex gap-1 items-center p-2 px-4 rounded-lg bg-gray-600 font-semibold text-gray-200 font-mono" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            Locked
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Rewards