// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Voting {
    // This struct defines a Candidate in the vote
    struct Candidate {
        string name; // The name of the candidate
        uint256 voteCount; // The total number of votes this candidate has received
    }

    // Instanciate the candidate struct
    Candidate[] public candidates;

    // Records the owner who deployed the contract
    address public owner;

    // Prevents double voting
    mapping(address => bool) public voters;

    uint256 public votingStart;

    uint256 public votingEnd;

    // Initializes the contract
    constructor(string[] memory _candidateNames, uint256 _duration) {
        // Iterate over candidate names and create new Candidate structs
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        owner = msg.sender; // Assign the contract deployer as the owner
        votingStart = block.timestamp; 
        votingEnd = block.timestamp + _duration; 
    }

    // Restrict certain functions to be callable only by the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Function to add a new candidate to the election
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    // Function to allow voters to vote
    function vote(uint256 _candidateIndex) public {
        // Ensure the current time is within the voting period
        require(block.timestamp >= votingStart, "Voting has not started yet");
        require(block.timestamp <= votingEnd, "Voting has ended");

        // Check that the sender hasn't voted already
        require(!voters[msg.sender], "You have already voted");

        // Validate the candidate index to prevent out-of-bounds access
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        candidates[_candidateIndex].voteCount += 1;

        // Record the sender's address to prevent them from voting again
        voters[msg.sender] = true;
    }

    // Return the list of candidates and their vote counts
    function getAllVotes() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Check if the voting period is currently active
    function getVotingStatus() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp <= votingEnd;
    }

    // Get the remaining time for voting
    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet");

        if (block.timestamp <= votingEnd) {
            return votingEnd - block.timestamp;
        } else {
            return 0;
        }
    }
}
