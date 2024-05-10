import React from 'react'
import Profile from './Profile';

function Navbar() {

  return (
    <header className='shadow-md h-16 fixed w-full bg-slate-100'>
      <div className='flex h-full justify-between items-center px-4 text-center '>
        <h4 className='font-bold'>Land Registration System.</h4>
        <Profile />
      </div>
    </header>
  )
}

export default Navbar