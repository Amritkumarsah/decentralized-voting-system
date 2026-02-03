import { ethers } from "ethers";
import contractABI from "../abi/contractABI.json";
import detectEthereumProvider from "@metamask/detect-provider";

const CONTRACT_ADDRESS = "0xA263fbe0fa7b2749928D7892ca374844F0A53865";

export const getContract = async (requireSigner = true) => {
  const provider = await detectEthereumProvider();

  if (!provider) {
    alert("MetaMask not installed");
    return;
  }

  const ethersProvider = new ethers.BrowserProvider(window.ethereum);
  const network = await ethersProvider.getNetwork();
  console.log("Connected to chain:", network.chainId);

  // Check if connected to Sepolia (Chain ID 11155111n for BigInt)
  if (network.chainId !== 11155111n && network.chainId !== 31337n) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0xaa36a7" }], // Hex chainId for 11155111
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        alert("Sepolia network is not added to your MetaMask. Please add it manually.");
      } else {
        // Only alert if we really need to switch for a write operation or vital read
        console.error(`Wrong Network! You are on chain ${network.chainId}.`);
      }
    }
  }

  // Validate code exists at address
  const code = await ethersProvider.getCode(CONTRACT_ADDRESS);
  if (code === "0x") {
    console.error(`Error: No contract found at ${CONTRACT_ADDRESS} on chain ${network.chainId}.`);
    throw new Error("Contract not found at specified address");
  }

  if (requireSigner) {
    const signer = await ethersProvider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  } else {
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, ethersProvider);
  }
};
