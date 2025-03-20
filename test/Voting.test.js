const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();

    [owner, voter1, voter2] = await ethers.getSigners();
  });

  describe("Candidate Management", function () {
    it("should add a candidate", async function () {
      await voting.addCandidate("Alice");
      const candidate = await voting.getCandidate(0);
      expect(candidate[1]).to.equal("Alice");
    });

    it("should not allow adding a duplicate candidate", async function () {
      await voting.addCandidate("Alice");
      await expect(voting.addCandidate("Alice")).to.be.revertedWith(
        "Candidate already exists"
      );
    });

    it("should delete a candidate", async function () {
      await voting.addCandidate("Alice");
      await voting.deleteCandidate(0);
      await expect(voting.getCandidate(0)).to.be.reverted;
    });

    it("should not allow deleting a non-existent candidate", async function () {
      await expect(voting.deleteCandidate(0)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });

    it("should not allow adding a candidate after reaching the limit", async function () {
      // Assuming a limit of 5 candidates
      for (let i = 0; i < 5; i++) {
        await voting.addCandidate(`Candidate ${i}`);
      }
      await expect(voting.addCandidate("Candidate 6")).to.be.revertedWith(
        "Maximum candidates reached"
      );
    });
  });

  describe("Voter Registration", function () {
    it("should register a voter", async function () {
      await voting.registerVoter(voter1.address);
      expect(await voting.registeredVoters(voter1.address)).to.be.true;
    });

    it("should not allow registering the same voter again", async function () {
      await voting.registerVoter(voter1.address);
      await expect(voting.registerVoter(voter1.address)).to.be.revertedWith(
        "Voter already registered"
      );
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await voting.addCandidate("Alice");
      await voting.registerVoter(voter1.address);
    });

    it("should allow a registered voter to cast a vote", async function () {
      await voting.connect(voter1).vote(0);
      const candidate = await voting.getCandidate(0);
      expect(candidate[2]).to.equal(1);
    });

    it("should not allow a voter to vote again", async function () {
      await voting.connect(voter1).vote(0);
      await expect(voting.connect(voter1).vote(0)).to.be.revertedWith(
        "Voter has already voted"
      );
    });

    it("should not allow voting for a non-existent candidate", async function () {
      await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });

    it("should not allow voting after the voting period has ended", async function () {
      // Assuming a function to end voting
      await voting.endVoting();
      await expect(voting.connect(voter1).vote(0)).to.be.revertedWith(
        "Voting has ended"
      );
    });
  });

  describe("Event Emissions", function () {
    it("should emit CandidateAdded event when a candidate is added", async function () {
      await expect(voting.addCandidate("Alice"))
        .to.emit(voting, "CandidateAdded")
        .withArgs(0, "Alice");
    });

    it("should emit VoterRegistered event when a voter is registered", async function () {
      await expect(voting.registerVoter(voter1.address))
        .to.emit(voting, "VoterRegistered")
        .withArgs(voter1.address);
    });

    it("should emit VoteCast event when a vote is cast", async function () {
      await voting.registerVoter(voter1.address);
      await expect(voting.connect(voter1).vote(0))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 0);
    });
  });
});
