import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContract } from "../services/web3";
import api from "../services/api";

function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0]._id); // Default to first category
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (localStorage.getItem("digilockerVerified") === "true" && localStorage.getItem("walletConnected") === "true") {
      fetchCategories();
    }
  }, []);

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  // 🔹 Load candidates from blockchain
  const isVerified = localStorage.getItem("digilockerVerified") === "true";
  const isConnected = localStorage.getItem("walletConnected") === "true";

  const navigate = useNavigate();

  useEffect(() => {
    if (!isVerified) {
      // Allow parent component or ProtectedRoute to handle redirect, avoiding double alert loop
      navigate("/");
      return;
    }

    if (!isConnected) {
      navigate("/metamask");
      return;
    }

    const checkVoteStatus = async () => {
      try {
        const aadhaar = localStorage.getItem("aadhaar");
        if (aadhaar) {
          const { data } = await api.get(`/user/status/${aadhaar}`);
          if (data.hasVoted) {
            showToast("⚠ You have already voted (Offline/Online). Redirecting...", "error");
            setTimeout(() => navigate('/results'), 3000);
          }
        }
      } catch (err) {
        console.error("Error checking vote status from DB:", err);
      }
    };

    if (isVerified && isConnected) {
      checkVoteStatus();
    }

    // 🔹 Load candidates from MongoDB (Admin Panel Data)
    const loadCandidates = async () => {
      if (!selectedCategory) return;

      try {
        setLoading(true);
        // Fetch from Backend API (MongoDB)
        const res = await api.get(`/admin/candidates?categoryId=${selectedCategory}`);

        // Map MongoDB data to UI format
        // We assign an index based on the array order to effectively map to "potential" blockchain indices
        const formattedCandidates = res.data.map((c, i) => ({
          index: i, // Virtual index (0, 1, 2...) matching the potential blockchain order
          name: c.fullName,
          party: c.partyName,
          symbol: c.partySymbol,
          state: c.state,
          constituency: c.constituency,
          id: c._id
        }));

        setCandidates(formattedCandidates);

        // Optional: Check blockchain count for debugging consistency
        try {
          const contract = await getContract(false);
          const count = await contract.getCandidatesCount();
          console.log(`Blockchain has ${count} candidates. MongoDB has ${formattedCandidates.length}.`);
        } catch (e) { console.warn("Could not check blockchain count"); }

      } catch (err) {
        console.error("Error loading candidates from DB:", err);
        showToast("Error loading candidates. Please check backend connection.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isVerified && isConnected) {
      checkVoteStatus();
      loadCandidates();
    }
  }, [isVerified, isConnected, navigate, selectedCategory]);

  // Prevent UI rendering if not authorized
  if (!isVerified || !isConnected) {
    return null;
  }

  // 🚀 Step 1: Triggered by "Confirm & Vote" button
  const initiateVote = () => {
    if (selected === "") {
      showToast("Please select a candidate first", "warning");
      return;
    }
    // Directly submit vote, skipping scanning
    submitVote();
  };

  // 🔥 Step 2: Called after Confirmation
  const submitVote = async () => {
    if (selected === "") {
      showToast("Please select a candidate first", "warning");
      return;
    }

    try {
      setLoading(true);
      // Use Read-Only Contract for Checks
      let contract = await getContract(false);

      // Check if voting is active 
      const isOpen = await contract.votingStarted();
      const isClosed = await contract.votingEnded();

      if (!isOpen) {
        showToast("⚠ Voting has not started yet. Please wait for the admin.", "warning");
        setLoading(false);
        return;
      }

      if (isClosed) {
        showToast("⚠ Voting has already ended.", "error");
        setLoading(false);
        return;
      }

      // Check if already voted
      const voter = await contract.voters(localStorage.getItem("walletAddress") || await (await contract.runner.getAddress()));
      if (voter) {
        showToast("⚠ You have already voted!", "warning");
        setLoading(false);
        return;
      }

      // Re-initialize with Signer for Write Operation
      contract = await getContract(true);
      const tx = await contract.vote(selected);
      await tx.wait();

      // Mark user as voted in DB
      try {
        const aadhaar = localStorage.getItem("aadhaar");
        if (aadhaar) {
          await api.post("/user/mark-voted", { aadhaar });
        }
      } catch (dbErr) {
        console.error("Failed to mark user as voted in DB:", dbErr);
        // Note: Vote is already on blockchain, so we don't block the UI, but it's an edge case.
      }

      showToast("✅ Vote successfully submitted!", "success");
      setTimeout(() => navigate('/results'), 2000);
    } catch (err) {
      // Parse common errors for better UI
      const msg = err.reason || err.message || "Transaction failed";
      if (msg.includes("Voting has ended")) {
        showToast("Voting has already ended.", "error");
      } else if (msg.includes("Voting has not started")) {
        showToast("Voting has not started yet.", "warning");
      } else if (msg.includes("You have already voted")) {
        showToast("You have already voted.", "warning");
      } else {
        showToast(msg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex flex-column align-items-center mb-5">
        <h2 className="text-white display-4 fw-bold text-center">Cast Your <span className="text-gradient">Vote</span></h2>

        {/* Category Selector */}
        <div className="mt-4 w-100" style={{ maxWidth: '400px' }}>
          <select
            className="form-select bg-dark text-white border-secondary p-3 rounded-3"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelected(""); // Reset candidate selection when category changes
            }}
          >
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {/* Show Election Date */}
          {selectedCategory && (() => {
            const cat = categories.find(c => c._id === selectedCategory);
            return cat && cat.electionDate ? (
              <div className="badge bg-primary-subtle text-primary-emphasis px-3 py-2 mt-3 rounded-pill border border-primary-subtle">
                <i className="bi bi-calendar-event me-2"></i>
                Voting Date: {new Date(cat.electionDate).toDateString()}
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center text-white-50">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p>Loading candidates for selection...</p>
        </div>
      ) : (
        <div className="row g-4 justify-content-center mb-5">
          {candidates.map((c) => (
            <div className="col-md-6 col-lg-4" key={c.index}>
              <div
                onClick={() => setSelected(c.index)}
                className={`glass-card p-4 h-100 cursor-pointer position-relative overflow-hidden transition-all ${selected === c.index ? 'border-primary shadow-lg' : ''}`}
                style={{
                  cursor: 'pointer',
                  transform: selected === c.index ? 'translateY(-10px)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderColor: selected === c.index ? '#00ff88' : 'rgba(255,255,255,0.1)'
                }}
              >
                {/* Selection Indicator */}
                {selected === c.index && (
                  <div className="position-absolute top-0 end-0 p-3">
                    <div className="bg-success rounded-circle d-flex justify-content-center align-items-center" style={{ width: '30px', height: '30px' }}>
                      <i className="bi bi-check-lg text-white"></i>
                    </div>
                  </div>
                )}

                <div className="d-flex flex-column align-items-center text-center">
                  <div
                    className="rounded-circle mb-3 d-flex justify-content-center align-items-center bg-white"
                    style={{
                      width: '80px',
                      height: '80px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      overflow: 'hidden'
                    }}
                  >
                    {c.symbol ? (
                      <img
                        src={c.symbol}
                        alt={c.party}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/747/747376.png";
                        }}
                      />
                    ) : (
                      <i className="bi bi-person-fill fs-1 text-secondary"></i>
                    )}
                  </div>

                  <h4 className="text-white fw-bold mb-1">{c.name}</h4>
                  <p className="text-white-50 mb-2 small">{c.party}</p>

                  <div className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill px-3 mb-1">
                    {c.constituency}, {c.state}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 p-4 glass rounded-4 border border-light border-opacity-10 text-center">
        <h4 className="text-white mb-3">Ready to Vote?</h4>
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4">
          <div className="text-center text-md-start">
            <span className="text-white-50 d-block small mb-1">SELECTED CANDIDATE</span>
            <span className="text-white fw-bold fs-4 text-primary-gradient">
              {selected !== "" ? candidates.find(c => c.index === selected)?.name : "None Selected"}
            </span>
          </div>

          <button
            className="btn btn-primary-glow btn-lg px-5 rounded-pill fw-bold"
            onClick={initiateVote}
            disabled={loading || selected === ""}
            style={{
              minWidth: '250px',
              opacity: selected === "" ? 0.6 : 1,
              cursor: selected === "" ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : "Confirm & Vote"}
          </button>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast.show && (
        <div
          className="position-fixed p-3 d-flex align-items-center gap-3 animated-fade-in-up glass-card"
          style={{
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            borderLeft: `5px solid ${toast.type === 'error' ? '#ff3333' : toast.type === 'success' ? '#00ff88' : '#ffcc00'}`,
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className={`rounded-circle d-flex justify-content-center align-items-center`}
            style={{
              width: '35px',
              height: '35px',
              minWidth: '35px',
              background: toast.type === 'error' ? 'rgba(255, 50, 50, 0.2)' : toast.type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 204, 0, 0.2)'
            }}>
            <i className={`bi ${toast.type === 'error' ? 'bi-exclamation-triangle-fill text-danger' : toast.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-warning'} fs-5`}></i>
          </div>
          <div>
            <h6 className="fw-bold text-white mb-0 text-capitalize">{toast.type}</h6>
            <p className="text-white-50 mb-0 small">{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="btn-close btn-close-white ms-auto" aria-label="Close"></button>
        </div>
      )}

    </div>
  );
}

export default Vote;
