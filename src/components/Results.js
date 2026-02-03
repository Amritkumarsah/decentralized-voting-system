import { useEffect, useState } from "react";
import api from "../services/api";

function Results() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    api.get("/results").then(res => setResults(res.data));
  }, []);

  if (!results) return <p>Loading...</p>;

  return (
    <div>
      <h2>Voting Results</h2>
      <pre>{JSON.stringify(results, null, 2)}</pre>
       <div className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-3">Live Results</h3>

      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between">
          Candidate A <span className="badge bg-primary">10</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          Candidate B <span className="badge bg-success">8</span>
        </li>
      </ul>
    </div>

    </div>
  );
}

export default Results;
