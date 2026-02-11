import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaBook, FaUsers, FaExchangeAlt, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (user.role !== 'Student') {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reports/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, link }) => (
        <div
            className="glass-card"
            style={{
                flex: 1,
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: link ? 'pointer' : 'default',
                transition: 'transform 0.2s'
            }}
            onClick={() => link && navigate(link)}
            onMouseOver={(e) => link && (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseOut={(e) => link && (e.currentTarget.style.transform = 'translateY(0)')}
        >
            <div style={{ background: color, color: 'white', padding: '1rem', borderRadius: '12px', fontSize: '1.5rem', display: 'flex' }}>
                <Icon />
            </div>
            <div>
                <h4 style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{title}</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Welcome, {user.name}!</h1>

            {user.role !== 'Student' && stats && (
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                    <StatCard icon={FaBook} title="Total Books" value={stats.totalBooks} color="#3b82f6" link="/books" />
                    <StatCard icon={FaUsers} title="Total Users" value={stats.totalUsers} color="#8b5cf6" link={user.role === 'Admin' ? "/users" : null} />
                    <StatCard icon={FaExchangeAlt} title="Active Borrows" value={stats.activeBorrows} color="#10b981" link="/history" />
                    <StatCard icon={FaMoneyBillWave} title="Total Fines" value={`KSh ${stats.totalFines}`} color="#f59e0b" link="/fines" />
                </div>
            )}

            <div className="glass-card">
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>You have no recent activities to display.</p>
            </div>
        </div>
    );
};

export default Dashboard;
