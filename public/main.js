let WALLET_CONNECTED = '';
let contractAddress;

let contractAbi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

document.addEventListener('DOMContentLoaded', () => {
  fetchContractAddress();

  const voteCreationForm = document.getElementById('vote-creation-form');
  if (voteCreationForm) {
    voteCreationForm.addEventListener('submit', initiateVoting);
    } 
    else {
      console.error('Vote creation form not found');
  }
});

const fetchContractAddress = async () => {
  try {
      const response = await fetch('http://localhost:4000/contract-address');
      const data = await response.json();
      contractAddress = data.address;
      initializeContract();
      console.log("Fetched contract address:", contractAddress); // Log the fetched address
  } catch (error) {
      console.error("Could not fetch contract address:", error);
    }
};

const initializeContract = () => {
    if (!contractAddress) {
        console.error("Contract address is not available.");
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    // Additional initialization code...
};

const connectMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    WALLET_CONNECTED = await signer.getAddress();
    document.getElementById("metamasknotification").innerHTML = "Wallet Connected: " + WALLET_CONNECTED;
};

const getAllCandidates = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidates = await contractInstance.getAllVotes();
    let table = document.getElementById("myTable");
    candidates.forEach((candidate, index) => {
      let row = table.insertRow(index + 1);
      let idCell = row.insertCell(0);
      let nameCell = row.insertCell(1);
      let voteCountCell = row.insertCell(2);
      idCell.innerHTML = index;
      nameCell.innerHTML = candidate.name;
      voteCountCell.innerHTML = candidate.voteCount;
    });
};

const addCandidate = async () => {
    if (WALLET_CONNECTED) {
        const candidateNameInput = document.getElementById("candidateNameInput");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        try {
            const tx = await contractInstance.addCandidate(candidateNameInput.value);
            await tx.wait();
            candidateNameInput.value = '';
            getAllCandidates();
        } catch (error) {
            console.error("Error adding candidate:", error);
        }
    } else {
        console.log("Please connect your wallet");
    }
};

const voteStatus = async () => {
    if (WALLET_CONNECTED) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        try {
            const status = await contractInstance.getVotingStatus();
            const remainingTime = await contractInstance.getRemainingTime();
            document.getElementById("status").innerHTML = status ? "Voting is open" : "Voting is closed";
            document.getElementById("time").innerHTML = "Remaining time: " + remainingTime;
        } catch (error) {
            console.error("Error getting voting status:", error);
        }
    } else {
        console.log("Please connect your wallet");
    }
};

const addVote = async () => {
    if (WALLET_CONNECTED) {
        const voteIndexInput = document.getElementById("vote");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        try {
            const voteIndex = parseInt(voteIndexInput.value, 10);
            const tx = await contractInstance.vote(voteIndex);
            await tx.wait();
            document.getElementById("cand").innerHTML = "Vote added";
        } catch (error) {
            console.error("Error submitting vote:", error);
            document.getElementById("cand").innerHTML = "Error submitting vote. See console for details.";
        }
    } else {
        console.log("Please connect your wallet");
    }
};

async function initiateVoting(event) {
  console.log(0)

  event.preventDefault(); // Prevent the default form submission
  console.log(1)
  const candidateNames = [];
  for (let i = 1; i <= 5; i++) {
      const candidateName = document.getElementById(`candidate-name-${i}`).value;
      if (candidateName) {
          candidateNames.push(candidateName);
      }
  }
  console.log(2)
  const votingDurationInput = document.getElementById("voting-time");
  const votingDuration = votingDurationInput ? parseInt(votingDurationInput.value, 10) : 0;

  // Send this data to the backend server
  fetch('http://localhost:4000/deployContract', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidates: candidateNames, duration: votingDuration }),
  })
  .then(response => response.text())
  .then(data => {
      document.getElementById("creation-status").innerHTML = data;
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById("creation-status").innerHTML = "Error in contract deployment. Check console for details.";
  });
  console.log(3)
}

document.addEventListener('DOMContentLoaded', () => {
  // Get the form element
  const form = document.getElementById('vote-creation-form');

  // Check if the form exists
  if (form) {
      form.addEventListener('submit', initiateVoting);
  } else {
      console.error('Vote creation form not found');
  }
});

