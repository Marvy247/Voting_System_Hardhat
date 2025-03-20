// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Mapping of candidates to their information
    mapping(uint => Candidate) public candidates;

    // Mapping of voters to their registration status
    mapping(address => bool) public registeredVoters;

    // Mapping of voters to their vote
    mapping(address => uint) public voterToCandidate;

    // Total number of votes cast
    uint public totalVotes;

    // Total number of candidates
    uint public candidatesCount;

    // Event emitted when a candidate is added
    event CandidateAdded(uint candidateId, string name);

    // Event emitted when a voter is registered
    event VoterRegistered(address voter);

    // Event emitted when a vote is cast
    event VoteCast(address voter, uint candidateId);

    // Event emitted when a candidate is deleted
    event CandidateDeleted(uint candidateId);

    // Struct to represent a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Constructor
    constructor() public {
        // Initialize the total number of votes to 0
        totalVotes = 0;
        candidatesCount = 0;
    }

    // Function to add a candidate
    function addCandidate(string memory _name) public {
        // Require that the candidate does not already exist
        require(candidates[candidatesCount].id == 0, "Candidate already exists");

        // Create a new candidate
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);

        // Emit the CandidateAdded event
        emit CandidateAdded(candidatesCount, _name);

        // Increment the candidates count
        candidatesCount++;
    }

    // Function to delete a candidate
    function deleteCandidate(uint _candidateId) public {
        // Require that the candidate exists
        require(candidates[_candidateId].id != 0, "Candidate does not exist");

        // Delete the candidate
        delete candidates[_candidateId];

        // Emit the CandidateDeleted event
        emit CandidateDeleted(_candidateId);
    }

    // Function to register a voter
    function registerVoter(address _voter) public {
        // Require that the voter is not already registered
        require(!registeredVoters[_voter], "Voter already registered");

        // Register the voter
        registeredVoters[_voter] = true;

        // Emit the VoterRegistered event
        emit VoterRegistered(_voter);
    }

    // Function to cast a vote
    function vote(uint _candidateId) public {
        // Require that the voter is registered
        require(registeredVoters[msg.sender], "Voter not registered");

        // Require that the candidate exists
        require(candidates[_candidateId].id != 0, "Candidate does not exist");

        // Require that the voter has not already voted
        require(voterToCandidate[msg.sender] == 0, "Voter has already voted");

        // Cast the vote
        voterToCandidate[msg.sender] = _candidateId;
        candidates[_candidateId].voteCount++;

        // Increment the total number of votes
        totalVotes++;

        // Emit the VoteCast event
        emit VoteCast(msg.sender, _candidateId);
    }

    // Function to get the total number of votes
    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    // Function to get the total number of candidates
    function getTotalCandidates() public view returns (uint) {
        return candidatesCount;
    }

    // Function to get the candidate information
    function getCandidate(uint _candidateId) public view returns (uint, string memory, uint) {
        return (candidates[_candidateId].id, candidates[_candidateId].name, candidates[_candidateId].voteCount);
    }

    // Function to get the voter's vote
    function getVoterVote(address _voter) public view returns (uint) {
        return voterToCandidate[_voter];
    }
}