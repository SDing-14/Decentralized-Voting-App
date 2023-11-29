
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// Enable CORS for all requests
app.use(cors());

// This will parse any incoming JSON payloads
app.use(express.json());

app.post('/deployContract', (req, res) => {
    const { candidates, duration } = req.body;

    // Save candidates data to a file
    fs.writeFileSync('candidates.json', JSON.stringify({ candidates }), 'utf8');

    // Replace 'yourNetwork' with the actual network you want to use, for example 'rinkeby' or 'mainnet'
    exec(`npx hardhat run scripts/deploy.js --network goerli`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send(`Deployment failed: ${stderr}`);
        }
        res.send(`Contract deployed successfully: ${stdout}`);
    });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
