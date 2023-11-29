require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const ethers = require('ethers');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS if needed
app.use(fileUpload({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const { abi } = require('./artifacts/contracts/vote.sol/Voting.json');
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Serve index.html at the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/addCandidate", async (req, res) => {
    // ... your existing /addCandidate handler
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
