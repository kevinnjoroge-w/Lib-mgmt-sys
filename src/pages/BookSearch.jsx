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
    const [newBook, setNewBook] = useState({ title: '', author: '', ISBN: '', category_id: '', genre: '' });
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [borrowDuration, setBorrowDuration] = useState(14);
    const [categories, setCategories] = useState([]);

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
                                    <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>ISBN: {book.ISBN}</span>
                                </div>
                                {book.genre && (
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: '600' }}>Genre:</span> {book.genre}
                                    </p>
                                )}
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                {book.status === 'Available' ? (
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                                        setSelectedBookId(book._id);
                                        setShowBorrowModal(true);
                                    }}>Borrow</button>
                                ) : (
                                    <button className="btn" style={{ flex: 1, background: '#e2e8f0', cursor: 'not-allowed' }} disabled>Unavailable</button>
                                )}
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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BookSearch;
