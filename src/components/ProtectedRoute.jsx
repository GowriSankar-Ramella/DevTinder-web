import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
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
    return children
}

export default ProtectedRoute