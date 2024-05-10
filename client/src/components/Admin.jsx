import React from 'react'
import AdminSidebar from './AdminSidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

function Admin() {
    return (
        <>
            <Navbar />
            <div className='flex pt-20 w-full h-screen bg-white'>
                <AdminSidebar />
                <Outlet />
            </div>
        </>
    );
}

export default Admin