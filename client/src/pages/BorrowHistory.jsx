import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUndo, FaSyncAlt } from 'react-icons/fa';

const BorrowHistory = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/borrow/user-reservations');
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/borrow/history');
            setRecords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/borrow/return/${id}`);
            alert('Book returned!');
            fetchHistory();
        } catch (err) {
            alert('Return failed');
        }
    };

    const handleRenew = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/borrow/renew/${id}`);
            alert('Book renewed for 7 days!');
            fetchHistory();
        } catch (err) {
            alert('Renewal failed');
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Borrowing History</h1>
            <div className="glass-card">
                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>Book Title</th>
                                {user.role !== 'Student' && <th style={{ padding: '1rem' }}>User</th>}
                                <th style={{ padding: '1rem' }}>Borrow Date</th>
                                <th style={{ padding: '1rem' }}>Due Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{record.book_id?.title}</td>
                                    {user.role !== 'Student' && <td style={{ padding: '1rem' }}>{record.user_id?.name}</td>}
                                    <td style={{ padding: '1rem' }}>{new Date(record.borrow_date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(record.due_date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: record.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                                            color: record.status === 'Active' ? '#166534' : '#475569'
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        {record.status === 'Active' && (
                                            <>
                                                <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem' }} onClick={() => handleReturn(record._id)}>
                                                    <FaUndo /> Return
                                                </button>
                                                <button className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.4rem 0.8rem' }} onClick={() => handleRenew(record._id)}>
                                                    <FaSyncAlt /> Renew
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>My Active Waitlist Queue</h2>
            <div className="glass-card">
                {reservations.length === 0 ? <p style={{ color: 'var(--text-light)' }}>You have no active reservations.</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>Book Title</th>
                                <th style={{ padding: '1rem' }}>Reserved On</th>
                                <th style={{ padding: '1rem' }}>Waitlist Position</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(reser => (
                                <tr key={reser._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{reser.book_id?.title}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(reser.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {reser.status === 'Notified' ? (
                                            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Ready for Pickup!</span>
                                        ) : (
                                            <strong>#{reser.queueIndex}</strong>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: reser.status === 'Waitlist' || reser.status === 'Waiting' ? '#fef3c7' : '#dcfce7',
                                            color: reser.status === 'Waitlist' || reser.status === 'Waiting' ? '#92400e' : '#166534'
                                        }}>
                                            {reser.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BorrowHistory;
