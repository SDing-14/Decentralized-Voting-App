let WALLET_CONNECTED= '';
let contractAddress = "0x4DdB87D1AfF59C3F6975a08Aa02bd7A92A6d782F";
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

const connectMetamask = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    WALLET_CONNECTED = await signer.getAddress();
    var element = document.getElementById("wallet");
    var element = document.getElementById("metamasknotification");
    element.innerHTML = "Wallet Connected" + WALLET_CONNECTED;
}

const getAllCandidates = async() => {
    var p3 = document.getElementById("p3");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    p3.innerHTML = "Getting all candidates";
    const candidates = await contractInstance.getAllVotes();
    console.log(candidates);
    var table = document.getElementById("myTable");

    for (var i = 0; i < candidates.length; i++) {
        var row = table.insertRow(i+1);
        var idCell = row.insertCell();
        var nameCell = row.insertCell();
        var vc = row.insertCell();

        idCell.innerHTML = i;
        nameCell.innerHTML = candidates[i].name;
        vc.innerHTML = candidates[i].voteCount;
    }

    p3.innerHTML = "Candidates added";
}

const addCandidate = async () => {
  if (WALLET_CONNECTED !== '') {
      var candidateNameInput = document.getElementById("candidateNameInput");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      try {
          const tx = await contractInstance.addCandidate(candidateNameInput.value);
          await tx.wait();
          console.log("Candidate added:", candidateNameInput.value);
          candidateNameInput.value = '';
          await getAllCandidates();
      } catch (error) {
          console.error("Error adding candidate:", error);
      }
  } else {
      console.log("Please connect your wallet");
  }
}

const voteStatus = async () => {
  if (WALLET_CONNECTED !== '') { // It's better to check for an empty string rather than 0 for WALLET_CONNECTED
    var status = document.getElementById("status");
    var remainingTime = document.getElementById("time");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    
    // The variable was declared as 'status' but was used as 'currentStatus'
    const currentStatus = await contractInstance.getVotingStatus();
    const time = await contractInstance.getRemainingTime();
    
    status.innerHTML = currentStatus ==1  ? "Voting is open" : "Voting is closed"; // Fixed the variable name here
    remainingTime.innerHTML = "Remaining time: " + time; // Make sure this element ID exists in your HTML
  } 
  else {
    var status = document.getElementById("status");
    status.innerHTML = "Please connect your wallet";
  }
}

const addVote = async () => {
  if (WALLET_CONNECTED !== '') {
    var voteIndexInput = document.getElementById("vote"); // Corrected to "vote"
    if (!voteIndexInput) {
      console.error("Vote input element not found");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please wait, adding a vote to the contract";
    try {
      // Assuming that the smart contract expects a number for the vote
      const voteIndex = parseInt(voteIndexInput.value, 10);
      const tx = await contractInstance.vote(voteIndex);
      await tx.wait();
      cand.innerHTML = "Vote added";
    } catch (error) {
      console.error("Error submitting vote:", error);
      cand.innerHTML = "Error submitting vote. See console for details.";
    }
  } else {
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please connect your wallet";
  }
}


async function initiateVoting() {
  // Get candidate names from the form
  const candidateName1 = document.getElementById('candidateName1').value;
  // Repeat for other candidate names

  // Connect to the smart contract
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

  // Call the smart contract function to initiate voting
  await contractInstance.startVoting([candidateName1 /*, other candidate names */]);

  // Handle contract ID recording to .env file (this might need to be done server-side)
}

document.getElementById('candidateForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission
  addCandidate();
});