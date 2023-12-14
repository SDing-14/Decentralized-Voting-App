// Load environment variables from .env file
require('dotenv').config();

// Importing required modules
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const ethers = require('ethers'); // Ethereum library

// Initialize express app
const app = express();
const port = 3000; // Server port

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(fileUpload({ extended: true })); // Enable file uploading
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use(express.json()); // Parse JSON bodies

// Ethereum network and wallet setup
const API_URL = process.env.API_URL; // Ethereum network API URL from .env file
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Private key from .env file for signing transactions
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Address of the deployed contract

// Import the ABI (Application Binary Interface) of the Voting contract
const { abi } = require('./artifacts/contracts/vote.sol/Voting.json');

// Setup Ethereum provider and signer
const provider = new ethers.providers.JsonRpcProvider(API_URL); // Connect to Ethereum network
const signer = new ethers.Wallet(PRIVATE_KEY, provider); // Create a signer from the private key

// Create a contract instance
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Route to serve the main page (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to add a candidate to the contract (handler not shown for brevity)
app.post("/addCandidate", async (req, res) => {
    // ... your existing /addCandidate handler
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
