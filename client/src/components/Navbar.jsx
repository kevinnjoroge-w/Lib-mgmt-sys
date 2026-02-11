import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaSignOutAlt, FaChartLine, FaHistory, FaSearch, FaUser, FaMoneyBillWave } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
