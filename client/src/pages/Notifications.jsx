import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/notifications/${user._id}`);
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/read/${id}`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/read-all/${user._id}`);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading notifications...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Notifications</h1>
                <button className="btn" onClick={markAllAsRead} style={{ background: '#e2e8f0' }}>Mark All Read</button>
            </div>
            
            {notifications.length === 0 ? (
                <p>No notifications.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(notif => (
                        <div key={notif._id} className="glass-card" style={{
                            borderLeft: notif.read ? 'none' : '4px solid var(--primary)',
                            background: notif.read ? 'white' : '#f8fafc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontWeight: notif.read ? 'normal' : 'bold' }}>{notif.message}</p>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                    {new Date(notif.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!notif.read && (
                                <button className="btn" onClick={() => markAsRead(notif._id)}>Mark Read</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
