import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

export default function Profile() {

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState('');
    const navigate = useNavigate();

    const profileWindowHandler = () => {
        setIsProfileOpen(!isProfileOpen);
    }



    const logOutHandler = () => {
        localStorage.clear();
        navigate('/');
    }

    useEffect(() => {
        setConnectedAccount(localStorage.getItem('accounts'));
    }, [])




    return (
        <>
            <div className='cursor-pointer' onClick={profileWindowHandler}>
                <FaCircleUser size="1.4rem" />
            </div>
            {isProfileOpen &&
                <div className='absolute rounded-md w-[10rem] text-nowrap py-2 px-2 my-4 bg-slate-300 mt-6 top-12 right-2'>
                    <ul role="list" className="divide-y divide-gray-100">
                        <li className="flex justify-between gap-x-6 py-2 pl-2 cursor-pointer">
                            <div className="flex items-center min-w-0">
                                <FaCircleUser />
                                <div className="pl-2 min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">{connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}</p>
                                </div>
                            </div>

                        </li>
                        <li className="flex justify-between gap-x-6 py-2 pl-2 cursor-pointer">
                            <div className="flex items-center min-w-0">
                                <FiLogOut />
                                <div className="pl-2 min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray-900" onClick={logOutHandler}>Log Out</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            }
        </>
    )
}
