const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Voting Contract", function () {
  let voting;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Candidate Management", function () {
    it("should add a candidate successfully", async function () {
      await voting.addCandidate("Alice");
      const candidate = await voting.getCandidate(1);

      expect(candidate[1]).to.equal("Alice");
    });

    it("should not allow adding a duplicate candidate", async function () {
      await voting.addCandidate("Alice");
      await expect(voting.addCandidate("Alice")).to.be.revertedWith(
        "Candidate already exists"
      );
    });

    it("should delete a candidate successfully", async function () {
      await voting.addCandidate("Alice");
      await voting.deleteCandidate(1);
      await expect(voting.getCandidate(1)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });

    it("should not allow deleting a non-existent candidate", async function () {
      await expect(voting.deleteCandidate(0)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });
  });

  describe("Voting Process", function () {
    it("should start the voting process", async function () {
      await voting.startVoting(10); // Start voting for 10 minutes
      expect(await voting.votingActive()).to.equal(true);
    });

    it("should end the voting process", async function () {
      await voting.startVoting(10); // Start voting for 10 minutes
      expect(await voting.votingActive()).to.equal(true);

      // Simulate time passing (e.g., 11 minutes)
      await network.provider.send("evm_increaseTime", [11 * 60]); // 11 minutes in seconds
      await network.provider.send("evm_mine"); // Mine a new block to apply the time change

      await voting.endVoting(); // End the voting process
      expect(await voting.votingActive()).to.equal(false);
    });

    it("should register a voter successfully", async function () {
      await voting.registerVoter(addr1.address);
      expect(await voting.registeredVoters(addr1.address)).to.equal(true);
    });

    it("should not allow registering an already registered voter", async function () {
      await voting.registerVoter(addr1.address);
      await expect(voting.registerVoter(addr1.address)).to.be.revertedWith(
        "Voter already registered"
      );
    });

    it("should cast a vote successfully", async function () {
      await voting.addCandidate("Alice");
      await voting.registerVoter(addr1.address);
      await voting.startVoting(10); // Start voting for 10 minutes
      await voting.connect(addr1).vote(1);
      const candidate = await voting.getCandidate(1);
      expect(candidate[2]).to.equal(1); // Check if vote count is 1
    });

    it("should not allow voting for a non-existent candidate", async function () {
      await voting.registerVoter(addr1.address);
      await voting.startVoting(10); // Start voting for 10 minutes
      await expect(voting.connect(addr1).vote(0)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });

    it("should not allow voting after the voting period has ended", async function () {
      await voting.addCandidate("Alice");
      await voting.registerVoter(addr1.address);
      await voting.startVoting(0); // Start voting for 0 minutes (ends immediately)
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voting period has ended"
      );
    });
  });

  describe("State Checks", function () {
    it("should not allow a voter to vote more than once", async function () {
      await voting.addCandidate("Alice");
      await voting.registerVoter(addr1.address);
      await voting.startVoting(10); // Start voting for 10 minutes
      await voting.connect(addr1).vote(1);
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voter has already voted"
      );
    });

    it("should only allow registered voters to vote", async function () {
      await voting.addCandidate("Alice");
      await voting.startVoting(10); // Start voting for 10 minutes
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voter not registered"
      );
    });
  });

  describe("Events", function () {
    it("should emit CandidateAdded event when a candidate is added", async function () {
      await expect(voting.addCandidate("Alice")).to.emit(
        voting,
        "CandidateAdded"
      );
    });

    it("should emit CandidateDeleted event when a candidate is deleted", async function () {
      await voting.addCandidate("Alice");
      await expect(voting.deleteCandidate(1)).to.emit(
        voting,
        "CandidateDeleted"
      );
    });

    it("should emit VoterRegistered event when a voter is registered", async function () {
      await expect(voting.registerVoter(addr1.address)).to.emit(
        voting,
        "VoterRegistered"
      );
    });
  });
});
