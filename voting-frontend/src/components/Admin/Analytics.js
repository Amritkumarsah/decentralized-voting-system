import React, { useEffect, useState } from 'react';
import api from '../../services/api';

import { getContract } from '../../services/web3';

const Analytics = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalVotes, setTotalVotes] = useState(0);



    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // 1. Fetch Candidates (DB Metadata)
            const { data: dbCandidates } = await api.get("/admin/candidates");

            // 2. Fetch Blockchain Vote Counts
            const contract = await getContract(false);
            const count = await contract.getCandidatesCount();

            const mergedStats = [];
            let total = 0;

            for (let i = 0; i < count; i++) {
                const candidate = await contract.getCandidate(i);
                // candidate: [name, voteCount]
                const voteCount = Number(candidate[1]);
                total += voteCount;

                // Match with DB metadata by index
                const dbMeta = dbCandidates[i] || {};

                mergedStats.push({
                    id: dbMeta._id || `bc-${i}`,
                    name: candidate[0], // Blockchain name is source of truth
                    party: dbMeta.partyName || "Independent",
                    symbol: dbMeta.partySymbol,
                    votes: voteCount,
                    // We calculate percentage later
                });
            }

            // Calculate Percentages
            const finalStats = mergedStats.map(s => ({
                ...s,
                percentage: total > 0 ? ((s.votes / total) * 100).toFixed(1) : 0
            }));

            // Sort by votes
            finalStats.sort((a, b) => b.votes - a.votes);

            setStats(finalStats);
            setTotalVotes(total);

        } catch (err) {
            console.error("Error fetching analytics:", err);
            // Don't show toast loop, just console
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 5000); // Live update
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-white mb-4">Election Analytics (Real-Time Blockchain)</h2>

            {/* Top Cards */}
            <div className="row mb-4 justify-content-center">
                <div className="col-md-4">
                    <div className="glass-card p-3 text-center">
                        <h5 className="text-white-50">Total Votes Cast</h5>
                        <h1 className="text-primary-gradient display-4 fw-bold">{totalVotes}</h1>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-3 text-center">
                        <h5 className="text-white-50">Leading Party</h5>
                        <h3 className="text-white fw-bold mt-2">
                            {stats.length > 0 && stats[0].votes > 0 ? stats[0].party : "-"}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="glass-card p-4">
                <h4 className="text-white mb-3">Candidate Performance</h4>
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Candidate</th>
                                <th>Party</th>
                                <th className="text-end">Votes</th>
                                <th className="text-end">Percentage</th>
                                <th>Graph</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading blockchain data...</td></tr>
                            ) : stats.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">No candidates found on Blockchain</td></tr>
                            ) : (
                                stats.map((stat, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {stat.symbol ? (
                                                    <img src={stat.symbol} alt="sym" className="rounded-circle bg-white p-1" width="30" height="30" />
                                                ) : <i className="bi bi-person-fill"></i>}
                                                {stat.name}
                                            </div>
                                        </td>
                                        <td>{stat.party}</td>
                                        <td className="text-end fw-bold">{stat.votes}</td>
                                        <td className="text-end">{stat.percentage}%</td>
                                        <td style={{ width: '200px' }}>
                                            <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }}>
                                                <div
                                                    className="progress-bar bg-gradient-primary"
                                                    style={{ width: `${stat.percentage}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Analytics;
