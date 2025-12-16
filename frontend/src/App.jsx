import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';

// Components
import Navbar from './components/navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import SharedWithMe from './pages/SharedWithMe';
import ViewFile from './pages/ViewFile';

// We will build these next, for now just placeholder
const Dashboard = () => <div className="p-10 text-center text-2xl">Dashboard (Coming Soon)</div>;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans">
          <Navbar />
          <Toaster position="top-center" />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>} />
            <Route path="/shared-with-me" element={
              <ProtectedRoute>
                <SharedWithMe />
              </ProtectedRoute>
            } />
            <Route path="/file/view/:id" element={
              <ProtectedRoute>
                <ViewFile />
              </ProtectedRoute>
            } />
            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;