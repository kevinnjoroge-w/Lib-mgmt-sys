import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookSearch from './pages/BookSearch';
import BorrowHistory from './pages/BorrowHistory';
import FineManagement from './pages/FineManagement';
import UserManagement from './pages/UserManagement';
import Notifications from './pages/Notifications';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles.length && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar />
                    <main style={{ padding: '2rem 5%' }}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/admin" element={<ProtectedRoute roles={['Admin', 'Librarian']}><Dashboard /></ProtectedRoute>} />
                            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/search" element={<ProtectedRoute><BookSearch /></ProtectedRoute>} />
                            <Route path="/history" element={<ProtectedRoute><BorrowHistory /></ProtectedRoute>} />
                            <Route path="/fines" element={<ProtectedRoute><FineManagement /></ProtectedRoute>} />
                            <Route path="/users" element={<ProtectedRoute roles={['Admin']}><UserManagement /></ProtectedRoute>} />
                            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
