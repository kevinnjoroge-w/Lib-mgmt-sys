import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const BookSearch = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState({ title: '', author: '', isbn: '', genre: '' });
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', ISBN: '', category_id: '', genre: '', isEbook: false, price: 0, sampleUrl: '', fileUrl: '' });
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [borrowDuration, setBorrowDuration] = useState(14);
    const [categories, setCategories] = useState([]);
    const [showReservationsModal, setShowReservationsModal] = useState(false);
    const [activeReservations, setActiveReservations] = useState([]);
    const [activeReservationBookId, setActiveReservationBookId] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(search).toString();
            const res = await axios.get(`http://localhost:5000/api/books?${params}`);
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBorrow = async () => {
        try {
            await axios.post('http://localhost:5000/api/borrow/borrow', {
                book_id: selectedBookId,
                days: parseInt(borrowDuration)
            });
            alert('Book borrowed successfully!');
            setShowBorrowModal(false);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Borrowing failed');
        }
    };

    const handleReserve = async (bookId) => {
        try {
            await axios.post(`http://localhost:5000/api/borrow/reserve/${bookId}`);
            alert('Book successfully reserved! You have been added to the waitlist.');
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not place reservation');
        }
    };

    const handleViewWaitlist = async (book) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/borrow/reservations/${book._id}`);
            setActiveReservations(res.data);
            setActiveReservationBookId(book._id);
            setShowReservationsModal(true);
        } catch (err) {
            alert('Failed to get waitlist');
        }
    };


    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/books', newBook);
            setShowAddModal(false);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add book');
        }
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`http://localhost:5000/api/books/${id}`);
                fetchBooks();
            } catch (err) {
                alert('Failed to delete book');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Book Catalog</h1>
                {user.role !== 'Student' && (
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><FaPlus /> Add Book</button>
                )}
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Title"
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0 }}
                    value={search.title}
                    onChange={(e) => setSearch({ ...search, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Author"
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0 }}
                    value={search.author}
                    onChange={(e) => setSearch({ ...search, author: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Genre"
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0 }}
                    value={search.genre}
                    onChange={(e) => setSearch({ ...search, genre: e.target.value })}
                />
                <button className="btn btn-primary" onClick={fetchBooks}><FaSearch /> Search</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {books.map(book => (
                        <div key={book._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{book.title}</h3>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>by {book.author}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        background: book.status === 'Available' ? '#dcfce7' : '#fee2e2',
                                        color: book.status === 'Available' ? '#166534' : '#991b1b'
                                    }}>
                                        {book.status}
                                    </span>
                                    {book.isEbook && (
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: '#e0e7ff',
                                            color: '#3730a3',
                                            marginLeft: '10px'
                                        }}>
                                            E-Book
                                        </span>
                                    )}
                                    <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>ISBN: {book.ISBN}</span>
                                </div>
                                {book.genre && (
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: '600' }}>Genre:</span> {book.genre}
                                    </p>
                                )}
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {book.isEbook ? (
                                    <>
                                        {book.sampleUrl && (
                                            <a href={book.sampleUrl} target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, background: '#f1f5f9', textAlign: 'center', textDecoration: 'none', color: '#0f172a' }}>Read Sample</a>
                                        )}
                                        <button className="btn btn-primary" style={{ flex: 1 }}>{book.price > 0 ? `Buy for Ksh ${book.price}` : 'Access Full Book'}</button>
                                    </>
                                ) : (book.status === 'Available' ? (
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                                        setSelectedBookId(book._id);
                                        setShowBorrowModal(true);
                                    }}>Borrow</button>
                                ) : (
                                    <>
                                        {book.status === 'Borrowed' ? (
                                            <>
                                                <button className="btn btn-primary" style={{ flex: 1, background: '#f59e0b', color: '#fff' }} onClick={() => handleReserve(book._id)}>Reserve Book</button>
                                                <button className="btn" style={{ flex: 1, background: '#fef3c7', color: '#b45309' }} onClick={() => handleViewWaitlist(book)}>View Waitlist</button>
                                            </>
                                        ) : (
                                            <button className="btn" style={{ flex: 1, background: '#e2e8f0', cursor: 'not-allowed' }} disabled>Unavailable</button>
                                        )}
                                    </>
                                ))}
                                {user.role !== 'Student' && (
                                    <>
                                        <button className="btn" style={{ background: '#e2e8f0' }}><FaEdit /></button>
                                        <button className="btn" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => handleDeleteBook(book._id)}><FaTrash /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showBorrowModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                        <h2>Borrow Book</h2>
                        <p style={{ marginBottom: '1rem' }}>How many days would you like to keep this book?</p>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            className="input-field"
                            value={borrowDuration}
                            onChange={(e) => setBorrowDuration(e.target.value)}
                            required
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleBorrow} className="btn btn-primary" style={{ flex: 1 }}>Confirm</button>
                            <button className="btn" style={{ flex: 1 }} onClick={() => setShowBorrowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 1000 }}>
                    <form onSubmit={handleAddBook} className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
                        <h2>Add New Book</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            className="input-field"
                            value={newBook.title}
                            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Author"
                            className="input-field"
                            value={newBook.author}
                            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="ISBN"
                            className="input-field"
                            value={newBook.ISBN}
                            onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Genre"
                            className="input-field"
                            value={newBook.genre}
                            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                        />
                        <select
                            className="input-field"
                            value={newBook.category_id}
                            onChange={(e) => setNewBook({ ...newBook, category_id: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={newBook.isEbook}
                                onChange={(e) => setNewBook({ ...newBook, isEbook: e.target.checked })}
                            />
                            Is this an E-Book?
                        </label>
                        {newBook.isEbook && (
                            <>
                                <input type="number" placeholder="Price (Optional, 0 for free)" className="input-field" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} />
                                <input type="url" placeholder="Sample URL" className="input-field" value={newBook.sampleUrl} onChange={(e) => setNewBook({ ...newBook, sampleUrl: e.target.value })} />
                            </>
                        )}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {showReservationsModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Waitlist Queue</h2>
                        {activeReservations.length === 0 ? (
                            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>No one is currently waiting for this book. You'll be first!</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                {activeReservations.map((res, idx) => (
                                    <li key={res._id} style={{ 
                                        padding: '1rem', 
                                        borderBottom: '1px solid var(--border)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '1rem',
                                        background: res.user_id?._id === user._id ? '#e0f2fe' : 'transparent',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ 
                                            width: '30px', 
                                            height: '30px', 
                                            background: 'var(--primary)', 
                                            color: '#fff', 
                                            borderRadius: '50%', 
                                            display: 'grid', 
                                            placeItems: 'center', 
                                            fontWeight: 'bold' 
                                        }}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <strong>{res.user_id?.name || 'Unknown User'}</strong>
                                            {res.user_id?._id === user._id && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#0369a1', fontWeight: 'bold' }}>(You)</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button className="btn" style={{ width: '100%' }} onClick={() => setShowReservationsModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookSearch;
