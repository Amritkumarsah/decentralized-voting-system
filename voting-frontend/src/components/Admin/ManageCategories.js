import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Toast from '../Toast';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', electionDate: '' });
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const showToast = useCallback((message, type = "info") => setToast({ show: true, message, type }), []);
    const handleCloseToast = () => setToast({ ...toast, show: false });

    const initializeDefaults = useCallback(async () => {
        const defaults = [
            { name: "Lok Sabha Election", description: "Parliamentary General Election", electionDate: "2024-05-01" },
            { name: "Vidhan Sabha Election", description: "State Assembly Election", electionDate: "2025-10-15" },
            { name: "Municipal Election", description: "Local Body Election", electionDate: "2024-12-10" },
            { name: "Panchayat Election", description: "Rural Local Body Election", electionDate: "2025-02-20" }
        ];

        try {
            setLoading(true);
            for (const cat of defaults) {
                await axios.post('http://localhost:5000/api/admin/category', cat);
            }
            showToast("Initialized default election types", "success");
            // Refresh list
            const res = await axios.get('http://localhost:5000/api/admin/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to init defaults", err);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/categories');
            setCategories(res.data);

            // Auto-init defaults if empty (User Request: add various type of election init)
            if (res.data.length === 0) {
                initializeDefaults();
            }
        } catch (err) {
            console.error(err);
        }
    }, [initializeDefaults]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/admin/category', newCategory);
            showToast('Category added successfully!', 'success');
            setNewCategory({ name: '', description: '', electionDate: '' });
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.error || 'Error adding category', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this election type?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/category/${id}`);
            fetchCategories();
            showToast('Category deleted successfully', 'success');
        } catch (err) {
            console.error(err);
            showToast("Failed to delete category", "error");
        }
    };

    return (
        <div className="manage-section">
            <h2>Election Types</h2>
            <form onSubmit={handleAddCategory} className="admin-form">
                <input
                    type="text"
                    placeholder="Election Name"
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
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={handleCloseToast} />
        </div>
    );
};

export default ManageCategories;
