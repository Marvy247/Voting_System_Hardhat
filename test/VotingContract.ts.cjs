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

    // Set up an admin for testing
    await voting.connect(owner).addAdmin(admin.address);
  });

  describe("Deployment", function () {
    it("Should set the deployer as owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Should initialize with voting inactive", async function () {
      expect(await voting.votingActive()).to.be.false;
    });
  });

  describe("Admin Management", function () {
    it("Should allow owner to add admins", async function () {
      await voting.connect(owner).addAdmin(voter1.address);
      expect(await voting.isAdmin(voter1.address)).to.be.true;
    });

    it("Should prevent non-owners from adding admins", async function () {
      await expect(
        voting.connect(voter1).addAdmin(voter2.address)
      ).to.be.revertedWith("Only the owner can call this function");
    });

    it("Should allow owner to remove admins", async function () {
      await voting.connect(owner).removeAdmin(admin.address);
      expect(await voting.isAdmin(admin.address)).to.be.false;
    });

    it("Should recognize owner as admin", async function () {
      expect(await voting.isAdmin(owner.address)).to.be.true;
    });
  });

  describe("Candidate Management", function () {
    it("Should allow admin to add candidates", async function () {
      await voting.connect(admin).addCandidate("Alice");
      const candidate = await voting.getCandidate(1);
      expect(candidate.name).to.equal("Alice");
    });

    it("Should prevent non-admins from adding candidates", async function () {
      await expect(
        voting.connect(voter1).addCandidate("Bob")
      ).to.be.revertedWith("Only admin can call this function");
    });

    it("Should prevent duplicate candidate names", async function () {
      await voting.connect(admin).addCandidate("Alice");
      await expect(
        voting.connect(admin).addCandidate("Alice")
      ).to.be.revertedWith("Candidate already exists");
    });

    it("Should allow admin to delete candidates", async function () {
      await voting.connect(admin).addCandidate("Alice");
      await voting.connect(admin).deleteCandidate(1);
      await expect(voting.getCandidate(1)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await voting.connect(admin).addCandidate("Alice");
      await voting.connect(admin).addCandidate("Bob");
      await voting.connect(admin).startVoting(10); // 10 minute voting period
    });

    it("Should allow voters to cast votes", async function () {
      await voting.connect(voter1).vote(1);
      const candidate = await voting.getCandidate(1);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Should prevent double voting", async function () {
      await voting.connect(voter1).vote(1);
      await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
        "Voter has already voted"
      );
    });

    it("Should prevent voting for invalid candidates", async function () {
      await expect(voting.connect(voter1).vote(999)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });

    it("Should track total votes correctly", async function () {
      await voting.connect(voter1).vote(1);
      await voting.connect(voter2).vote(2);
      expect(await voting.getTotalVotes()).to.equal(2);
    });

    it("Should prevent voting when inactive", async function () {
      await voting.connect(admin).endVoting();
      await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
        "Voting is not active"
      );
    });
  });

  describe("Voting Session Control", function () {
    beforeEach(async function () {
      await voting.connect(admin).addCandidate("Alice");
    });

    it("Should allow admin to start voting", async function () {
      await voting.connect(admin).startVoting(10);
      expect(await voting.votingActive()).to.be.true;
    });

    it("Should prevent non-admins from starting voting", async function () {
      await expect(voting.connect(voter1).startVoting(10)).to.be.revertedWith(
        "Only admin can call this function"
      );
    });

    it("Should set correct end time", async function () {
      // Get precise start time
      const startBlock = await ethers.provider.getBlock("latest");
      const startTime = startBlock.timestamp;

      await voting.connect(admin).startVoting(10); // 10 minutes = 600 seconds

      // Verify end time with 1-second tolerance
      const endTime = await voting.votingEndTime();
      expect(endTime).to.be.closeTo(startTime + 600, 1);
    });

    it("Should allow admin to end voting", async function () {
      await voting.connect(admin).startVoting(10);
      await voting.connect(admin).endVoting();
      expect(await voting.votingActive()).to.be.false;
    });
  });

  describe("Edge Cases", function () {
    it("Should prevent starting voting with no candidates", async function () {
      await expect(voting.connect(admin).startVoting(10)).to.be.revertedWith(
        "No candidates added"
      );
    });

    it("Should handle candidate deletion vote accounting", async function () {
      await voting.connect(admin).addCandidate("Alice");
      await voting.connect(admin).startVoting(10);
      await voting.connect(voter1).vote(1);

      // End voting before deletion
      await voting.connect(admin).endVoting();

      const initialTotal = await voting.getTotalVotes();
      await voting.connect(admin).deleteCandidate(1);
      expect(await voting.getTotalVotes()).to.equal(initialTotal - 1n);
    });
  });
});
