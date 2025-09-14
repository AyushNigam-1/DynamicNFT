"use client";

import { useState } from 'react';
import Cookies from 'js-cookie';
export default function Navbar({ onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className=" bg-gray-700 ">
            <div className='flex items-center justify-between py-6 px-8 w-[60vw] mx-auto'>
                <div className="text-xl font-bold text-gray-400">
                    My dApp
                </div>
                {Cookies.get("userAccount") && (
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="cursor-pointer p-1 rounded-full bg-gray-600 hover:bg-gray-500 focus:outline-none "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 m-4 mr-0 w-48 p-2 bg-gray-700 flex flex-col gap-2 rounded-md shadow-lg z-10 ">
                                <p className="block p-2 text-xl truncate text-gray-400 border-b border-gray-600">
                                    {Cookies.get("userAccount")}
                                </p>

                                <button
                                    onClick={onLogout}
                                    className="cursor-pointer w-full text-left flex gap-2 items-center  p-2 text-xl text-gray-400 hover:bg-gray-600 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                    </svg>

                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
