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

/**
 * Asynchronously fetches the smart contract address from the server.
 * On success, it initializes the contract with the fetched address.
 * It logs the fetched address to the console for verification.
 * If there's an error during fetching, it logs an error message to the console.
 */
const fetchContractAddress = async () => {
  try {
      // Send a GET request to the server to retrieve the contract address
      const response = await fetch('http://localhost:4000/contract-address');
      // Parse the JSON response to get the data
      const data = await response.json();
      // Store the fetched address in the contractAddress variable
      contractAddress = data.address;
      // Initialize the contract with the fetched address
      initializeContract();
      // Log the fetched address to the console for debugging purposes
      console.log("Fetched contract address:", contractAddress);
  } catch (error) {
      // Log any errors that occur during the fetch process
      console.error("Could not fetch contract address:", error);
    }
};


/**
 * Initializes the smart contract using the Ethereum provider and signer.
 * It checks if the contract address is available before proceeding.
 * If the contract address is not available, it logs an error message and exits the function.
 * If the address is available, it creates a new contract instance with the address and ABI.
 */
const initializeContract = () => {
  // Check if the contract address is available
  if (!contractAddress) {
      // Log an error and exit the function if the address is not available
      console.error("Contract address is not available.");
      return;
  }
  // Create a new provider using Ethereum's provider interface
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Get the signer from the provider
  const signer = provider.getSigner();
  // Create a new contract instance with the contract address, ABI, and signer
  const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
  // Note: The created contract instance can be used to interact with the smart contract
};


/**
 * Connects to the user's Metamask wallet.
 * This function establishes a connection to the Ethereum blockchain using Metamask.
 * It requests the user's account information from Metamask and updates the UI to show the connected wallet address.
 */
const connectMetamask = async () => {
  // Create a new Ethereum provider using the window.ethereum object provided by Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Request the user's Ethereum accounts. If Metamask is not connected, this will prompt a connection request.
  await provider.send("eth_requestAccounts", []);

  // Get the signer, which represents the Ethereum account that is currently selected in Metamask
  const signer = provider.getSigner();

  // Retrieve the address associated with the signer
  WALLET_CONNECTED = await signer.getAddress();

  // Update the UI to show the connected wallet address
  document.getElementById("metamasknotification").innerHTML = "Wallet Connected: " + WALLET_CONNECTED;
};


/**
 * Retrieves all the candidates from the smart contract and displays them in a table.
 * This function interacts with the Ethereum blockchain to fetch the list of candidates
 * and their respective vote counts, then dynamically updates the HTML table to display this information.
 */
const getAllCandidates = async () => {
  // Create a new Ethereum provider using the window.ethereum object provided by Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Request the user's Ethereum accounts. If Metamask is not connected, this will prompt a connection request.
  await provider.send("eth_requestAccounts", []);

  // Get the signer, which represents the Ethereum account that is currently selected in Metamask
  const signer = provider.getSigner();

  // Create an instance of the contract to interact with it using the signer
  const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

  // Call the getAllVotes function from the smart contract to retrieve all candidates and their vote counts
  const candidates = await contractInstance.getAllVotes();

  // Get the table element from the HTML where candidates will be displayed
  let table = document.getElementById("myTable");

  // Iterate over each candidate and add their details to the table
  candidates.forEach((candidate, index) => {
      // Insert a new row in the table for each candidate
      let row = table.insertRow(index + 1);

      // Create cells for the candidate's ID, name, and vote count
      let idCell = row.insertCell(0);
      let nameCell = row.insertCell(1);
      let voteCountCell = row.insertCell(2);

      // Set the inner HTML of the cells to display the candidate's details
      idCell.innerHTML = index;
      nameCell.innerHTML = candidate.name;
      voteCountCell.innerHTML = candidate.voteCount;
  });
};


/**
 * Adds a new candidate to the smart contract's list of candidates.
 * This function is triggered when the user inputs a candidate name and submits the form.
 * It requires that the user's wallet (e.g., Metamask) is connected to interact with the blockchain.
 */
const addCandidate = async () => {
  // Check if the wallet is connected before proceeding
  if (WALLET_CONNECTED) {
      // Retrieve the candidate name input from the form
      const candidateNameInput = document.getElementById("candidateNameInput");

      // Create a new Ethereum provider using the window.ethereum object provided by Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request the user's Ethereum accounts. If Metamask is not connected, this will prompt a connection request.
      await provider.send("eth_requestAccounts", []);

      // Get the signer, which represents the Ethereum account that is currently selected in Metamask
      const signer = provider.getSigner();

      // Create an instance of the contract to interact with it using the signer
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      try {
          // Call the addCandidate function from the smart contract to add a new candidate
          const tx = await contractInstance.addCandidate(candidateNameInput.value);

          // Wait for the transaction to be mined
          await tx.wait();

          // Clear the input field after submitting
          candidateNameInput.value = '';

          // Refresh the list of all candidates to reflect the newly added candidate
          getAllCandidates();
      } catch (error) {
          // Log any errors that occur during the process
          console.error("Error adding candidate:", error);
      }
  } else {
      // If the wallet is not connected, log a message to the console
      console.log("Please connect your wallet");
  }
};


/**
 * Checks the current voting status and remaining time of the voting period.
 * This function is triggered when the user clicks on the button to check the voting status.
 * It requires that the user's wallet (e.g., Metamask) is connected to interact with the blockchain.
 */
const voteStatus = async () => {
  // Check if the wallet is connected before proceeding
  if (WALLET_CONNECTED) {
      // Create a new Ethereum provider using the window.ethereum object provided by Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request the user's Ethereum accounts. If Metamask is not connected, this will prompt a connection request.
      await provider.send("eth_requestAccounts", []);

      // Get the signer, which represents the Ethereum account that is currently selected in Metamask
      const signer = provider.getSigner();

      // Create an instance of the contract to interact with it using the signer
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      try {
          // Call the getVotingStatus function from the smart contract to check if voting is open or closed
          const status = await contractInstance.getVotingStatus();

          // Call the getRemainingTime function to get the remaining time for voting
          const remainingTime = await contractInstance.getRemainingTime();

          // Update the webpage to display the voting status
          document.getElementById("status").innerHTML = status ? "Voting is open" : "Voting is closed";

          // Update the webpage to display the remaining time for voting
          document.getElementById("time").innerHTML = "Remaining time: " + remainingTime;
      } catch (error) {
          // Log any errors that occur during the process
          console.error("Error getting voting status:", error);
      }
  } else {
      // If the wallet is not connected, log a message to the console
      console.log("Please connect your wallet");
  }
};

/**
 * Submits a vote for a specific candidate.
 * This function is called when the user clicks to submit a vote.
 * It checks if the user's wallet (e.g., Metamask) is connected and then interacts with the smart contract to cast the vote.
 */
const addVote = async () => {
  // Check if the wallet is connected before proceeding
  if (WALLET_CONNECTED) {
      // Retrieve the vote index input element from the DOM
      const voteIndexInput = document.getElementById("vote");

      // Create a new Ethereum provider using the window.ethereum object provided by Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request the user's Ethereum accounts. If Metamask is not connected, this will prompt a connection request.
      await provider.send("eth_requestAccounts", []);

      // Get the signer, which represents the Ethereum account that is currently selected in Metamask
      const signer = provider.getSigner();

      // Create an instance of the contract to interact with it using the signer
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      try {
          // Parse the vote index from the input field and convert it to an integer
          const voteIndex = parseInt(voteIndexInput.value, 10);

          // Call the vote function from the smart contract with the selected candidate index
          const tx = await contractInstance.vote(voteIndex);

          // Wait for the transaction to be confirmed
          await tx.wait();

          // Update the webpage to confirm that the vote has been added
          document.getElementById("cand").innerHTML = "Vote added";
      } catch (error) {
          // Log any errors that occur and update the webpage to display an error message
          console.error("Error submitting vote:", error);
          document.getElementById("cand").innerHTML = "Error submitting vote. See console for details.";
      }
  } else {
      // If the wallet is not connected, log a message to the console
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

