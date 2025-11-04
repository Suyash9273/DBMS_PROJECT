import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const {userInfo} = useAuth();
    if(userInfo && userInfo.isAdmin) {
        return <Outlet/>;
    } else {
        return <Navigate to='/' replace/>//when we use replace then we can't go back to the route from which we go redirected using back button
    }
}

export default AdminRoute;