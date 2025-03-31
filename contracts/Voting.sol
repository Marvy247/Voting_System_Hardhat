// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Voting {
    mapping(uint => Candidate) public candidates;
    mapping(address => uint) public voterToCandidate;
    uint public totalVotes;
    uint public candidatesCount;
    
    event CandidateAdded(uint candidateId, string name);
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
        require(_candidateId > 0 && _candidateId <= candidatesCount && candidates[_candidateId].id != 0, "Candidate does not exist");
        _;
    }

    modifier hasNotVoted() {
        require(voterToCandidate[msg.sender] == 0, "Voter has already voted");
        _;
    }

    constructor() {
        owner = msg.sender;
        votingActive = false; // Start with voting inactive
    }

    function addCandidate(string memory _name) public onlyOwner {
        require(!votingActive, "Cannot add candidates during active voting");
        for (uint i = 1; i <= candidatesCount; i++) {
            require(keccak256(abi.encodePacked(candidates[i].name)) != keccak256(abi.encodePacked(_name)), "Candidate already exists");
        }
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function deleteCandidate(uint _candidateId) public onlyOwner {
        require(!votingActive, "Cannot delete candidates during active voting");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].id != 0, "Candidate already deleted");
        
        // Subtract votes from total
        totalVotes -= candidates[_candidateId].voteCount;
        delete candidates[_candidateId];
        emit CandidateDeleted(_candidateId);
    }
    
    function startVoting(uint durationInMinutes) public onlyOwner {
        require(candidatesCount > 0, "No candidates added");
        require(!votingActive, "Voting is already active");
        votingActive = true;
        votingEndTime = block.timestamp + (durationInMinutes * 1 minutes);
    }

    function endVoting() public onlyOwner {
        require(votingActive, "Voting is already inactive");
        votingActive = false;
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
        require(candidates[_candidateId].id > 0, "Candidate does not exist");
        return (candidates[_candidateId].id, candidates[_candidateId].name, candidates[_candidateId].voteCount);
    }

    function getVoterVote(address _voter) public view returns (uint) {
        return voterToCandidate[_voter];
    }
}
