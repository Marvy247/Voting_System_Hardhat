// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Voting {
    // Data structures
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // State variables
    mapping(uint => Candidate) public candidates;
    mapping(address => uint) public voterToCandidate;
    mapping(address => bool) public admins;
    
    uint public totalVotes;
    uint public candidatesCount;
    bool public votingActive;
    address public owner;
    uint public votingEndTime;

    // Events
    event CandidateAdded(uint candidateId, string name);
    event VoteCast(address voter, uint candidateId);
    event CandidateDeleted(uint candidateId);
    event VotingStarted(uint durationInMinutes, uint endTime);
    event VotingEnded();
    event AdminAdded(address admin);
    event AdminRemoved(address admin);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }

    modifier votingActiveCheck() {
        require(votingActive, "Voting is not active");
        _;
    }

    modifier validCandidate(uint _candidateId) {
        require(_candidateId > 0 && _candidateId <= candidatesCount && candidates[_candidateId].id != 0, 
            "Candidate does not exist");
        _;
    }

    modifier hasNotVoted() {
        require(voterToCandidate[msg.sender] == 0, "Voter has already voted");
        _;
    }

constructor() {
    owner = msg.sender;
    admins[msg.sender] = true; // Owner is automatically an admin
    votingActive = false;
}

    // Admin functions
    function addAdmin(address _admin) public onlyOwner {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) public onlyOwner {
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function isAdmin(address _address) public view returns (bool) {
        return admins[_address] || _address == owner;
    }

    // Candidate management
    function addCandidate(string memory _name) public onlyAdmin {
        require(!votingActive, "Cannot add candidates during active voting");
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        // Check for duplicate names
        for (uint i = 1; i <= candidatesCount; i++) {
            if (keccak256(abi.encodePacked(candidates[i].name)) == keccak256(abi.encodePacked(_name))) {
                revert("Candidate already exists");
            }
        }
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function deleteCandidate(uint _candidateId) public onlyAdmin {
        require(!votingActive, "Cannot delete candidates during active voting");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].id != 0, "Candidate already deleted");
        
        totalVotes -= candidates[_candidateId].voteCount;
        delete candidates[_candidateId];
        emit CandidateDeleted(_candidateId);
    }

    // Voting control
    function startVoting(uint durationInMinutes) public onlyAdmin {
        require(candidatesCount > 0, "No candidates added");
        require(durationInMinutes > 0, "Duration must be positive");
        require(!votingActive, "Voting is already active");
        
        votingActive = true;
        votingEndTime = block.timestamp + (durationInMinutes * 1 minutes);
        emit VotingStarted(durationInMinutes, votingEndTime);
    }

    function endVoting() public onlyAdmin {
        require(votingActive, "Voting is already inactive");
        votingActive = false;
        emit VotingEnded();
    }

    // Voting functions
    function vote(uint _candidateId) public votingActiveCheck validCandidate(_candidateId) hasNotVoted {
        require(block.timestamp < votingEndTime, "Voting period has ended");
        
        voterToCandidate[msg.sender] = _candidateId;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        emit VoteCast(msg.sender, _candidateId);
    }

    // View functions
    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    function getTotalCandidates() public view returns (uint) {
        return candidatesCount;
    }

    function getCandidate(uint _candidateId) public view returns (Candidate memory) {
        require(candidates[_candidateId].id > 0, "Candidate does not exist");
        return candidates[_candidateId];
    }

    function getVoterVote(address _voter) public view returns (uint) {
        return voterToCandidate[_voter];
    }
}