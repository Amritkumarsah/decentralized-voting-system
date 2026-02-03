const { ethers } = require("ethers");
require("dotenv").config();

const contractABI = require("../config/contractABI.json");

console.log("ABI array:", Array.isArray(contractABI)); 



const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL
);

/*provider.getBlockNumber()
  .then(block => console.log("Connected to Sepolia. Block:", block))
  .catch(err => console.error("RPC ERROR:", err));*/


const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);
/*(async () => {
  try {
    const count = await contract.getCandidatesCount();
    console.log("Candidates count from blockchain:", count.toString());
  } catch (err) {
    console.error("Contract call failed:", err.message);
  }
})();*/

console.log(
  "Functions:",
  contract.interface.fragments
    .filter(f => f.type === "function")
    .map(f => f.name)
);


module.exports = contract;
