// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Voting {
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public registeredVoters;
    mapping(address => uint) public voterToCandidate;
    uint public totalVotes;
    uint public candidatesCount;
    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voter);
    event VoteCast(address voter, uint candidateId);
    event CandidateDeleted(uint candidateId);

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    bool public votingActive; 
    address public owner; 
    uint public votingEndTime; 

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier votingActiveCheck() {
        require(votingActive, "Voting is not active");
        _;
    }

    modifier validCandidate(uint _candidateId) {
        require(candidates[_candidateId].id != 0, "Candidate does not exist");
        _;
    }

    modifier hasNotVoted() {
        require(voterToCandidate[msg.sender] == 0, "Voter has already voted");
        _;
    }

    constructor() {
        totalVotes = 0;
        candidatesCount = 0;
        votingActive = true;
        owner = msg.sender;
    }


    function addCandidate(string memory _name) public votingActiveCheck {
        require(candidates[candidatesCount].id == 0, "Candidate already exists");
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
        candidatesCount++;
    }

    function deleteCandidate(uint _candidateId) public onlyOwner validCandidate(_candidateId) {
        delete candidates[_candidateId];
        emit CandidateDeleted(_candidateId);
    }
    
    function startVoting(uint durationInMinutes) public onlyOwner {
        votingActive = true;
        votingEndTime = block.timestamp + (durationInMinutes * 1 minutes);
    }

    function endVoting() public onlyOwner {
        require(votingActive, "Voting is already inactive");
        require(block.timestamp >= votingEndTime, "Voting period has not ended yet");
        votingActive = false;
    }

    function registerVoter(address _voter) public votingActiveCheck {
        require(!registeredVoters[_voter], "Voter already registered");
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function vote(uint _candidateId) public votingActiveCheck validCandidate(_candidateId) hasNotVoted {
        require(block.timestamp < votingEndTime, "Voting period has ended");
        voterToCandidate[msg.sender] = _candidateId;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        emit VoteCast(msg.sender, _candidateId);
    }

    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    function getTotalCandidates() public view returns (uint) {
        return candidatesCount;
    }

    function getCandidate(uint _candidateId) public view returns (uint, string memory, uint) {
        return (candidates[_candidateId].id, candidates[_candidateId].name, candidates[_candidateId].voteCount);
    }

    function getVoterVote(address _voter) public view returns (uint) {
        return voterToCandidate[_voter];
    }
}