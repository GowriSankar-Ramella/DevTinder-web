import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Layout from './components/Layout'
import Login from './components/Login'
import Feed from './components/Feed'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileEditPage from './components/ProfileEditPage'
import Connections from './components/Connections'
import Requests from './components/Requests'
import Liked from './components/Saved'
import Signup from './components/Signup'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatus } from './utils/authSlice'
import { useEffect } from 'react'

function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(store => store.auth.isLoading)
  useEffect(() => {
    console.log("Entered protected")
    dispatch(checkAuthStatus())
  }, [])
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><Liked /></ProtectedRoute>} />
      </Route>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
