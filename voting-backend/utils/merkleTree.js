const { MerkleTree } = require("merkletreejs");
const crypto = require("crypto");

// Proper hash FUNCTION (this is the key fix)
function sha256(data) {
  return crypto.createHash("sha256").update(data).digest();
}

function getMerkleRoot(votes) {
  if (!votes || votes.length === 0) return null;

  // Create leaves
  const leaves = votes.map(vote =>
    sha256(vote.voterId + vote.candidateId)
  );

  // Pass hash FUNCTION, not hash object
  const tree = new MerkleTree(leaves, sha256, { sortPairs: true });

  return tree.getRoot().toString("hex");
}

module.exports = {
  getMerkleRoot
};
