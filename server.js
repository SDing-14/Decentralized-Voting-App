const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Database setup
let db = new sqlite3.Database('./contractDatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create contracts table if it doesn't exist with a default value for address
db.run(`CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL DEFAULT 'default_value'
)`);

// Enable CORS for all requests
app.use(cors());

// This will parse any incoming JSON payloads
app.use(express.json());

app.post('/deployContract', (req, res) => {
    const { candidates, duration } = req.body;

    // Save candidates data to a file
    fs.writeFileSync('candidates.json', JSON.stringify({ candidates }), 'utf8');

    // Replace 'goerli' with the actual network you want to use
    exec(`npx hardhat run scripts/deploy.js --network goerli`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send(`Deployment failed: ${stderr}`);
        }
        // Assuming stdout contains the contract address in the last line after deployment
        const addressLine = stdout.trim().split('\n').pop();
        const contractAddress = addressLine.match(/0x[a-fA-F0-9]{40}/);

        if (contractAddress && contractAddress[0]) {
            // Insert the contract address into the database
            db.run(`INSERT INTO contracts (address) VALUES (?)`, [contractAddress[0]], function(err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Failed to save contract address');
                }
                console.log(`Contract address saved with ID ${this.lastID}`);
                res.send(`Contract deployed successfully at: ${contractAddress[0]}`);
            });
        } else {
            res.status(500).send('Could not parse contract address');
        }
    });
});

// Route to get the latest contract address
app.get('/contract-address', (req, res) => {
  // Query the database for the most recent contract address
  db.get("SELECT address FROM contracts ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving contract address");
    } else if (row) {
      res.json({ address: row.address });
    } else {
      res.status(404).send("No contract address found");
    }
  });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
