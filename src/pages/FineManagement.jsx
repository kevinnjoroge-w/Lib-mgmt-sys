import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCheck } from 'react-icons/fa';

const FineManagement = () => {
    const { user } = useAuth();
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fineRate, setFineRate] = useState(10);
    const [updatingRate, setUpdatingRate] = useState(false);

    useEffect(() => {
        fetchFines();
        if (user.role === 'Admin') {
            fetchFineRate();
        }
    }, [user.role]);

    const fetchFines = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/fines');
            setFines(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFineRate = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/settings/fine_rate_per_day');
            setFineRate(res.data.value);
        } catch (err) {
            console.error(err);
        }
    };

    const updateFineRate = async () => {
        setUpdatingRate(true);
        try {
            await axios.post('http://localhost:5000/api/settings', { key: 'fine_rate_per_day', value: fineRate });
            alert('Fine rate updated for future returns!');
        } catch (err) {
            alert('Failed to update fine rate');
        } finally {
            setUpdatingRate(false);
        }
    };

    const handlePay = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/fines/pay/${id}`);
            alert('Fine marked as paid!');
            fetchFines();
        } catch (err) {
            alert('Payment update failed');
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Fine Management</h1>

            {user.role === 'Admin' && (
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <h3>System Settings</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Daily Fine Rate (KSh)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={fineRate}
                                onChange={(e) => setFineRate(e.target.value)}
                                style={{ marginBottom: 0, width: '150px' }}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ alignSelf: 'flex-end' }}
                            onClick={updateFineRate}
                            disabled={updatingRate}
                        >
                            {updatingRate ? 'Updating...' : 'Save Rate'}
                        </button>
                    </div>
                </div>
            )}
            <div className="glass-card">
                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>User</th>
                                <th style={{ padding: '1rem' }}>Origin (Book)</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fines.map(fine => (
                                <tr key={fine._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{fine.user_id?.name} ({fine.user_id?.email})</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        {fine.borrow_id?.book_id?.title || 'Unknown Book'}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>KSh {fine.amount}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: fine.paid_status === 'Paid' ? '#dcfce7' : '#fee2e2',
                                            color: fine.paid_status === 'Paid' ? '#166534' : '#991b1b'
                                        }}>
                                            {fine.paid_status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{new Date(fine.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {fine.paid_status === 'Unpaid' && user.role !== 'Student' && (
                                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handlePay(fine._id)}>
                                                <FaCheck /> Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {fines.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No fines found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FineManagement;
