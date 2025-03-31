const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting Contract", function () {
  let Voting, voting, owner, admin, voter1, voter2;

  beforeEach(async function () {
    [owner, admin, voter1, voter2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();

    // Don't add owner as admin again - they're already admin from constructor
    // Just add additional test accounts as needed
    await voting.connect(owner).addAdmin(admin.address);
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Should initialize with voting inactive", async function () {
      expect(await voting.votingActive()).to.be.false;
    });
  });

  describe("Candidate Management", function () {
    it("Should allow admin to add candidates when voting is inactive", async function () {
      await voting.connect(owner).addCandidate("Alice");
      const candidate = await voting.getCandidate(1);
      expect(candidate[1]).to.equal("Alice");
      expect(candidate[2]).to.equal(0);
    });

    it("Should not allow adding duplicate candidates", async function () {
      await voting.connect(owner).addCandidate("Alice");
      await expect(
        voting.connect(owner).addCandidate("Alice")
      ).to.be.revertedWith("Candidate already exists");
    });

    it("Should not allow non-admin to add candidates", async function () {
      await expect(
        voting.connect(voter1).addCandidate("Bob")
      ).to.be.revertedWith("Only admin can call this function");
    });

    it("Should not allow adding candidates during active voting", async function () {
      await voting.connect(owner).addCandidate("Alice");
      await voting.connect(owner).startVoting(10);
      await expect(
        voting.connect(owner).addCandidate("Bob")
      ).to.be.revertedWith("Cannot add candidates during active voting");
    });
  });

  describe("Voting Session Control", function () {
    it("Should not allow starting voting with no candidates", async function () {
      // Verify no candidates exist
      expect(await voting.getTotalCandidates()).to.equal(0);

      // Attempt to start voting
      await expect(voting.connect(owner).startVoting(10)).to.be.revertedWith(
        "No candidates added"
      );
    });

    it("Should prevent voting with zero duration", async function () {
      // Add a candidate first
      await voting.connect(owner).addCandidate("Alice");

      // Attempt to start with zero duration
      await expect(voting.connect(owner).startVoting(0)).to.be.revertedWith(
        "Duration must be positive"
      );
    });

    it("Should allow admin to start and end voting", async function () {
      await voting.connect(owner).addCandidate("Alice");
      await voting.connect(owner).startVoting(10);
      expect(await voting.votingActive()).to.be.true;
      await time.increase(600); // Fast-forward 10 minutes
      await voting.connect(owner).endVoting();
      expect(await voting.votingActive()).to.be.false;
    });

    it("Should not allow non-admin to start voting", async function () {
      await voting.connect(owner).addCandidate("Alice");
      await expect(voting.connect(voter1).startVoting(10)).to.be.revertedWith(
        "Only admin can call this function"
      );
    });

    it("Should correctly track voting end time", async function () {
      await voting.connect(owner).addCandidate("Alice");

      // Get precise start time
      const startBlock = await ethers.provider.getBlock("latest");
      const startTime = startBlock.timestamp;

      await voting.connect(owner).startVoting(10); // 10 minutes = 600 seconds

      // Verify end time with 1-second tolerance
      const endTime = await voting.votingEndTime();
      expect(endTime).to.be.closeTo(startTime + 600, 1);
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await voting.connect(owner).addCandidate("Alice");
      await voting.connect(owner).addCandidate("Bob");
      await voting.connect(owner).startVoting(10);
    });

    it("Should allow voting for valid candidates", async function () {
      await voting.connect(voter1).vote(1);
      const candidate = await voting.getCandidate(1);
      expect(candidate[2]).to.equal(1);
      expect(await voting.getTotalVotes()).to.equal(1);
    });

    it("Should not allow voting after period ends", async function () {
      await time.increase(11 * 60); // Fast-forward 11 minutes
      await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
        "Voting period has ended"
      );
    });
  });

  describe("Edge Cases", function () {
    it("Should handle candidate deletion correctly", async function () {
      await voting.connect(owner).addCandidate("Alice");
      await voting.connect(owner).startVoting(10);
      await voting.connect(voter1).vote(1);
      await time.increase(600);
      await voting.connect(owner).endVoting();

      // Delete candidate after voting ends
      await voting.connect(owner).deleteCandidate(1);
      expect(await voting.getTotalVotes()).to.equal(0);
    });
  });
});
