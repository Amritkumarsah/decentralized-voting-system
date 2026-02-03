import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', electionDate: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/admin/category', newCategory);
            setMessage('Category added successfully!');
            setNewCategory({ name: '', description: '', electionDate: '' });
            fetchCategories();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Error adding category');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this election type?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/category/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Failed to delete category");
        }
    };

    return (
        <div className="manage-section">
            <h2>Election Types (e.g., Lok Sabha)</h2>
            <form onSubmit={handleAddCategory} className="admin-form">
                <input
                    type="text"
                    placeholder="Election Name (e.g., Lok Sabha 2024)"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Election Date"
                    value={newCategory.electionDate}
                    onChange={(e) => setNewCategory({ ...newCategory, electionDate: e.target.value })}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Election Type'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}

            <ul className="item-list">
                {categories.map(cat => (
                    <li key={cat._id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{cat.name}</strong> - {cat.description} <br />
                            <small className="text-secondary">Date: {cat.electionDate ? new Date(cat.electionDate).toDateString() : 'N/A'}</small>
                        </div>
                        <button
                            className="btn btn-sm btn-danger ms-3"
                            onClick={() => handleDelete(cat._id)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCategories;
