import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { INDIAN_STATES, MAJOR_PARTIES } from '../../utils/constants';

const ManageCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        partyName: '',
        partySymbol: '',
        state: '',
        constituency: '',
        voteCategoryId: '',
        age: '',
        gender: "Male",
        manifesto: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCandidates();
        fetchCategories();
    }, []);

    const fetchCandidates = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/candidates');
            setCandidates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePartyChange = (e) => {
        const partyName = e.target.value;
        const selectedParty = MAJOR_PARTIES.find(p => p.name === partyName);
        setFormData({
            ...formData,
            partyName,
            partySymbol: selectedParty ? selectedParty.symbol : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/admin/candidate', formData);
            setMessage('Candidate added successfully!');
            setFormData({
                fullName: '', partyName: '', partySymbol: '', state: '',
                constituency: '', voteCategoryId: '', age: '', gender: 'Male', manifesto: ''
            });
            fetchCandidates();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Error adding candidate');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this candidate?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/candidate/${id}`);
            fetchCandidates();
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.error || err.message || "Failed to delete candidate";
            alert(`Error deleting: ${errMsg}`);
        }
    };

    return (
        <div className="manage-section">
            <h2>Add Candidate</h2>
            <form onSubmit={handleSubmit} className="admin-form candidate-form">

                {/* Election Type First */}
                <select
                    value={formData.voteCategoryId}
                    onChange={(e) => setFormData({ ...formData, voteCategoryId: e.target.value })}
                    required
                >
                    <option value="">Select Election Type</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <div className="form-row">
                    <input
                        type="text" placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
                    <div className="gender-select">
                        <label>Gender: </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <input
                        type="number" placeholder="Age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                        min="25"
                    />
                </div>

                <div className="form-row">
                    {/* Party Selection with Autofill for Symbol */}
                    <select
                        value={formData.partyName}
                        onChange={handlePartyChange}
                        required
                    >
                        <option value="">Select Party</option>
                        {MAJOR_PARTIES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        <option value="Other">Other (Enter Manually)</option>
                    </select>

                    {/* Manual Party Name if Other */}
                    {formData.partyName === 'Other' && (
                        <input
                            type="text" placeholder="Enter Party Name"
                            onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                        />
                    )}

                    <input
                        type="text" placeholder="Party Symbol URL"
                        value={formData.partySymbol}
                        onChange={(e) => setFormData({ ...formData, partySymbol: e.target.value })}
                        required
                    />
                    {formData.partySymbol && <img src={formData.partySymbol} alt="Symbol Preview" className="symbol-preview" />}
                </div>

                <div className="form-row">
                    <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                    >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <input
                        type="text" placeholder="Constituency (e.g. Varanasi)"
                        value={formData.constituency}
                        onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                        required
                    />
                </div>

                <textarea
                    placeholder="Manifesto / Description"
                    value={formData.manifesto}
                    onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                ></textarea>

                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Candidate'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}

            <h3>Existing Candidates</h3>
            <ul className="item-list candidate-list">
                {candidates.map(c => (
                    <li key={c._id}>
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="candidate-card-mini">
                                <img src={c.partySymbol} alt="Symbol" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/747/747376.png"} />
                                <div>
                                    <strong>{c.fullName}</strong> ({c.partyName}) <br />
                                    <small>{c.state} - {c.constituency}</small> <br />
                                    <small className="tag">{c.voteCategory?.name}</small>
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-danger ms-3"
                                onClick={() => handleDelete(c._id)}
                            >
                                <i className="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCandidates;
