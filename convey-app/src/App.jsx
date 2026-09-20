import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { usePushNotifications } from './hooks/usePushNotifications'
import SplashScreen from './pages/SplashScreen'
import CreateProfile from './pages/CreateProfile'
import PermissionSetup from './pages/PermissionSetup'
import Home from './pages/Home'
import ChatView from './pages/ChatView'
import ContactsList from './pages/ContactsList'
import GroupCreate from './pages/GroupCreate'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <SplashScreen />
  return user ? children : <Navigate to="/create-profile" replace />
}

export default function App() {
  const { user } = useAuth()
  usePushNotifications(!!user)

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/permissions" element={<PermissionSetup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><ChatView /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><ContactsList /></ProtectedRoute>} />
        <Route path="/group/create" element={<ProtectedRoute><GroupCreate /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
