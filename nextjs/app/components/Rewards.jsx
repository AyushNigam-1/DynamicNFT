const Rewards = ({ userLevelFromContract, revealPercentage, nftImageUri }) => {
    return (
        <>

            <div className="flex w-full gap-2">
                <div className='flex  text-gray-600 rounded-xl' >
                    <div className='flex items-center gap-2 '>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg> */}
                        <p className='font-bold text-xl text-center' >Level {userLevelFromContract - 1}</p>
                    </div>
                </div>
                <div className='h-2 my-auto  w-full bg-gray-800/75 ' >
                    <div className={`h-full bg-gray-400`} style={{ width: `${revealPercentage}%` }}></div>
                </div>
                <div className='flex  text-gray-600 rounded-xl ' >
                    <div className='flex items-center gap-2 h-full w-full'>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg> */}
                        <p className='font-bold text-xl text-center' >Level {userLevelFromContract}</p>
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
                        <p className='font-bold text-xl text-center' >Level {userLevelFromContract + 1}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full ">
                <div className=' bg-white/50 text-gray-300 rounded-xl p-2 w-50 h-50' >
                    <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract - 1}.svg`} alt="" className=' brightness-50 ' />
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
                <div className=' bg-white/50 text-gray-300 rounded-xl p-2 w-50 h-50' >
                    <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract + 1}.svg`} alt="" className=' brightness-50 w-50 h-full ' />

                    {/* <div className='flex justify-center items-center flex-col absolute h-full w-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        <p className='font-bold' >Level {userLevelFromContract - 1}</p>
                    </div> */}
                </div>
            </div>
        </>
        // <div className="grid grid-cols-16 w-full">
        //     <div className='h-50 col-span-2 bg-white/50 text-gray-300 rounded-xl my-auto relative' >
        //         <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract - 1}.svg`} alt="" className='absolute brightness-50 w-full h-full ' />
        //         <div className='flex justify-center items-center flex-col absolute h-full w-full'>
        //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
        //                 <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        //             </svg>
        //             <p className='font-bold' >Level {userLevelFromContract - 1}</p>
        //         </div>
        //     </div>
        //     <div className='h-2 col-span-4 w-full bg-gray-800/75 my-auto' >
        //         <div className={`h-full bg-gray-400`} style={{ width: `${revealPercentage}%` }}></div>
        //     </div>
        //     <div className="relative h-80 col-span-4 bg-gray-800/75 rounded-xl overflow-hidden ">
        //         {nftImageUri ? (
        //             <img
        //                 src={nftImageUri}
        //                 alt="Your minted NFT reward"
        //                 className="absolute inset-0 w-80 h-80 object-cover transition-all duration-1000 blur-xl"
        //             // style={{ clipPath: `inset(${100 - revealPercentage}% 0 0 0)` }}
        //             />
        //         ) : (
        //             <img
        //                 src="https://placehold.co/600x400/3282b8/ffffff?text=STUDY+COMPLETED"
        //                 alt="Reward image"
        //                 className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
        //                 style={{ clipPath: `inset(${100 - revealPercentage}% 0 0 0)` }}
        //             />
        //         )}
        //         {revealPercentage < 100 && (
        //             <div className="absolute inset-0 bg-gray-800/75 flex items-center justify-center opacity-75 ">
        //                 <div className='flex  items-center gap-2 flex-col justify-center'>
        //                     {/* <p className='font-mono font-bold text-gray-300 text-center text-lg' >
        //                                 Progress :
        //                             </p> */}
        //                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
        //                         <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        //                     </svg>

        //                     <p className='font-mono font-bold text-gray-200 text-center text-2xl' >
        //                         {revealPercentage.toFixed(1)}%
        //                     </p>
        //                     <p className='font-semibold' >Level {userLevelFromContract}</p>

        //                 </div>
        //             </div>
        //         )}
        //     </div>
        //     <div className='h-2 col-span-4 bg-gray-800/75 my-auto' >

        //     </div>
        //     <div className='h-50 col-span-2 bg-gray-800/75 text-gray-300 rounded-xl my-auto relative' >
        //         <img src={`https://gold-endless-fly-679.mypinata.cloud/ipfs/bafybeihjewyl2sgnf57zsuov3vt7zl7anrtu2jikhavulcczajk4hi7s64/level-${userLevelFromContract + 1}.svg`} alt="" className='absolute brightness-50 blur-xl w-full h-full' />
        //         <div className='flex justify-center items-center flex-col absolute h-full w-full'>
        //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
        //                 <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        //             </svg>


        //             <p className='font-semibold' >Level {userLevelFromContract + 1}</p>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Rewards