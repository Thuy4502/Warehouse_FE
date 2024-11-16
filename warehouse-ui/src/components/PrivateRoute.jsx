import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
    const role = localStorage.getItem("role");

    return (role === "Admin" || role === "Warehousekeeper") ? <Outlet/>:<Navigate to="/not-found"/>;
}

export default PrivateRoute