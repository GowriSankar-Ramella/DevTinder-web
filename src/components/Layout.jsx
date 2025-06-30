import { Navigate, Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import { useSelector } from "react-redux"

const Layout = () => {
    const user = useSelector(store => store.auth?.user)
    const isLoading = useSelector(store => store.auth.isLoading)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/home" replace />
    }
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default Layout