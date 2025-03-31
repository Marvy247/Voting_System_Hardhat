const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract Integration", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy the contract successfully", async function () {
      expect(voting.target).to.not.be.null;
    });

    it("Should set the contract owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  describe("Candidate Management", function () {
    it("Should allow owner to add a candidate", async function () {
      await voting.connect(owner).addCandidate("Alice");
      const candidate = await voting.getCandidate(1);
      expect(candidate[1]).to.equal("Alice");
    });

    it("Should prevent non-owner from adding candidates", async function () {
      await expect(
        voting.connect(addr1).addCandidate("Bob")
      ).to.be.revertedWith("Only the owner can call this function");
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await voting.connect(owner).addCandidate("Alice");
      await voting.connect(owner).addCandidate("Bob");
      await voting.connect(owner).startVoting(10);
    });

    it("Should allow users to vote", async function () {
      await voting.connect(addr1).vote(1);
      const candidate = await voting.getCandidate(1);
      expect(candidate[2]).to.equal(1n);
    });

    it("Should prevent double voting", async function () {
      await voting.connect(addr1).vote(1);
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voter has already voted"
      );
    });

    it("Should track total votes correctly", async function () {
      await voting.connect(addr1).vote(1);
      await voting.connect(addr2).vote(2);
      expect(await voting.getTotalVotes()).to.equal(2n);
    });
  });

  describe("Voting Session Management", function () {
    beforeEach(async function () {
      await voting.connect(owner).addCandidate("Alice");
      await voting.connect(owner).addCandidate("Bob");
    });

    it("Should allow owner to start voting", async function () {
      await voting.connect(owner).startVoting(10);
      expect(await voting.votingActive()).to.be.true;
    });

    it("Should prevent non-owner from starting voting", async function () {
      await expect(voting.connect(addr1).startVoting(10)).to.be.revertedWith(
        "Only the owner can call this function"
      );
    });

    it("Should end voting correctly", async function () {
      await voting.connect(owner).startVoting(10);
      await voting.connect(owner).endVoting();
      expect(await voting.votingActive()).to.be.false;
    });
  });
});
