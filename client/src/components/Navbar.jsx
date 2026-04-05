import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaSignOutAlt, FaChartLine, FaHistory, FaSearch, FaUser, FaMoneyBillWave, FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            // Fetch initial unread count
            axios.get(`http://localhost:5000/api/notifications/${user._id}`)
                .then(res => {
                    const unread = res.data.filter(n => !n.read).length;
                    setUnreadCount(unread);
                })
                .catch(err => console.error(err));

            // Socket connection
            const socket = io('http://localhost:5000');
            socket.emit('join_room', user._id);
            
            socket.on('receive_notification', (notification) => {
                setUnreadCount(prev => prev + 1);
            });

            return () => socket.disconnect();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 5%',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaBook /> St. Bakhita Library
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaSearch /> Browse</Link>
                        {user.role !== 'Student' && (
                            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaChartLine /> Dashboard</Link>
                        )}
                        <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaHistory /> My Books</Link>
                        <Link to="/fines" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaMoneyBillWave /> Fines</Link>
                        <Link to="/notifications" style={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
                            <FaBell /> 
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-8px', right: '-12px',
                                    background: 'red', color: 'white', borderRadius: '50%',
                                    padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}><FaUser /> {user.name} ({user.role})</span>
                            <button onClick={handleLogout} className="btn" style={{ background: '#fee2e2', color: '#dc2626', padding: '0.5rem 1rem' }}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontWeight: '600' }}>Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
