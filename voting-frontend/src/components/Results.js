import { useEffect, useState } from "react";
import api from "../services/api";
import { getContract } from "../services/web3";

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      // 1. Fetch Candidate Metadata from Database (Images, Party names)
      const { data: dbCandidates } = await api.get("/admin/candidates");

      // 2. Fetch Vote Counts from Blockchain (The source of truth)
      const contract = await getContract(false); // Read-only
      const count = await contract.getCandidatesCount();
      const blockchainCandidates = [];

      for (let i = 0; i < count; i++) {
        const candidate = await contract.getCandidate(i);
        // candidate returns [name, voteCount]
        blockchainCandidates.push({
          index: i,
          name: candidate[0],
          voteCount: Number(candidate[1]) // Convert BigInt to Number
        });
      }

      // 3. Merge Data (Assuming Order Matches: DB[0] is Blockchain[0])
      // If DB is empty, we will just show Blockchain names
      const mergedData = blockchainCandidates.map((bc, i) => {
        const dbMeta = dbCandidates[i] || {};
        return {
          ...bc,
          // Use DB image/party if available, else placeholders
          partySymbol: dbMeta.partySymbol || "https://cdn-icons-png.flaticon.com/512/747/747376.png",
          partyName: dbMeta.partyName || "Independent",
          fullName: bc.name // Trust Blockchain Name
        };
      });

      setCandidates(mergedData);
      setError("");
    } catch (err) {
      console.error("Error fetching results:", err);
      // If DB fetch fails, we might still have blockchain data? 
      // For now, simple error handling.
      setError("Waiting for election data...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="text-center text-white mt-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2 text-white-50">Loading live blockchain results...</p>
    </div>
  );

  return (
    <div className="container py-5 mt-5">
      <h2 className="text-white display-4 fw-bold text-center mb-5">
        Live <span className="text-gradient">Blockchain Results</span>
      </h2>

      {error && <div className="alert alert-info text-center">{error}</div>}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card p-4">

            {candidates.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 text-white-50 mb-3"></i>
                <p className="text-white-50">No votes cast yet or election not initialized.</p>
              </div>
            ) : (
              candidates.map((candidate) => {
                // Calculate progress bar width
                const maxVotes = Math.max(...candidates.map(c => c.voteCount), 1);
                const progressWidth = (candidate.voteCount / maxVotes) * 100;

                return (
                  <div key={candidate.index} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={candidate.partySymbol}
                          alt="symbol"
                          className="rounded-circle bg-white p-1 shadow-sm"
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                          onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/747/747376.png"}
                        />
                        <div>
                          <h5 className="text-white mb-0 fw-bold">{candidate.fullName}</h5>
                          <small className="text-white-50">{candidate.partyName}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="display-6 fw-bold text-primary-gradient">{candidate.voteCount}</span>
                        <small className="d-block text-white-50">Votes</small>
                      </div>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="progress bg-secondary bg-opacity-25" style={{ height: '8px', borderRadius: '10px' }}>
                      <div
                        className="progress-bar bg-gradient-primary"
                        role="progressbar"
                        style={{ width: `${progressWidth}%`, transition: 'width 1s ease-in-out' }}
                        aria-valuenow={candidate.voteCount}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          <div className="text-center mt-4">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-dark border border-secondary">
              <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
              <span className="text-white-50 small">Live Blockchain Data (Syncs every 5s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
