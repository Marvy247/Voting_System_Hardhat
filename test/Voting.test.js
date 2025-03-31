const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await voting.owner()).to.equal(owner.address);
  });

  describe("Candidate Management", function () {
    it("Should allow owner to add candidates when voting is inactive", async function () {
      await voting.addCandidate("Alice");
      const candidate = await voting.getCandidate(1);
      expect(candidate[1]).to.equal("Alice");
      expect(candidate[2]).to.equal(0);
    });

    it("Should not allow adding duplicate candidates", async function () {
      await voting.addCandidate("Alice");
      await expect(voting.addCandidate("Alice")).to.be.revertedWith(
        "Candidate already exists"
      );
    });

    it("Should not allow non-owner to add candidates", async function () {
      await expect(
        voting.connect(addr1).addCandidate("Bob")
      ).to.be.revertedWith("Only the owner can call this function");
    });

    it("Should not allow adding candidates during active voting", async function () {
      await voting.addCandidate("Alice");

      await voting.startVoting(10);

      await expect(voting.addCandidate("Bob")).to.be.revertedWith(
        "Cannot add candidates during active voting"
      );
    });

    it("Should allow owner to delete candidates when voting is inactive", async function () {
      await voting.addCandidate("Alice");
      await voting.addCandidate("Bob");
      await voting.deleteCandidate(1);
      await expect(voting.getCandidate(1)).to.be.revertedWith(
        "Candidate does not exist"
      );
      const candidate2 = await voting.getCandidate(2);
      expect(candidate2[1]).to.equal("Bob");
    });

    it("Should not allow deleting candidates during active voting", async function () {
      await voting.addCandidate("Alice");
      await voting.startVoting(10);
      await expect(voting.deleteCandidate(1)).to.be.revertedWith(
        "Cannot delete candidates during active voting"
      );
    });

    it("Should not allow deleting non-existent candidates", async function () {
      await expect(voting.deleteCandidate(1)).to.be.revertedWith(
        "Invalid candidate ID"
      );
      await voting.addCandidate("Alice");
      await expect(voting.deleteCandidate(2)).to.be.revertedWith(
        "Invalid candidate ID"
      );
      await voting.deleteCandidate(1);
      await expect(voting.deleteCandidate(1)).to.be.revertedWith(
        "Candidate already deleted"
      );
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      await voting.addCandidate("Alice");
      await voting.addCandidate("Bob");
      await voting.startVoting(10); // 10 minutes voting period
    });

    it("Should allow voting for a valid candidate", async function () {
      await voting.connect(addr1).vote(1);
      const candidate = await voting.getCandidate(1);
      expect(candidate[2]).to.equal(1);
      expect(await voting.getTotalVotes()).to.equal(1);
    });

    it("Should not allow double voting", async function () {
      await voting.connect(addr1).vote(1);
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voter has already voted"
      );
    });

    it("Should not allow voting for a non-existent candidate", async function () {
      await expect(voting.connect(addr1).vote(3)).to.be.revertedWith(
        "Candidate does not exist"
      );
    });

    it("Should track votes correctly for multiple candidates", async function () {
      await voting.connect(addr1).vote(1);
      await voting.connect(addr2).vote(2);
      const candidate1 = await voting.getCandidate(1);
      const candidate2 = await voting.getCandidate(2);
      expect(candidate1[2]).to.equal(1);
      expect(candidate2[2]).to.equal(1);
      expect(await voting.getTotalVotes()).to.equal(2);
    });

    it("Should not allow voting when voting is inactive", async function () {
      await voting.endVoting();
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voting is not active"
      );
    });

    it("Should not allow voting after the voting period has ended", async function () {
      // Increase time by 11 minutes (more than the 10 minute voting period)
      await ethers.provider.send("evm_increaseTime", [11 * 60]);
      await ethers.provider.send("evm_mine");
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith(
        "Voting period has ended"
      );
    });
  });

  describe("Voting Activation", function () {
    it("Should allow owner to start and end voting", async function () {
      await voting.addCandidate("Alice");
      await voting.startVoting(10);
      expect(await voting.votingActive()).to.be.true;
      await ethers.provider.send("evm_increaseTime", [600]);
      await ethers.provider.send("evm_mine");
      await voting.endVoting();
      expect(await voting.votingActive()).to.be.false;
    });

    it("Should not allow starting voting with no candidates", async function () {
      await expect(voting.startVoting(10)).to.be.revertedWith(
        "No candidates added"
      );
    });

    it("Should not allow non-owner to start voting", async function () {
      await expect(voting.connect(addr1).startVoting(10)).to.be.revertedWith(
        "Only the owner can call this function"
      );
    });

    it("Should not allow non-owner to end voting", async function () {
      await voting.addCandidate("Alice");
      await voting.startVoting(10);
      await expect(voting.connect(addr1).endVoting()).to.be.revertedWith(
        "Only the owner can call this function"
      );
    });

    it("Should correctly track voting end time", async function () {
      await voting.addCandidate("Alice");

      const currentBlock = await ethers.provider.getBlock("latest");
      const startTime = currentBlock.timestamp;

      await voting.startVoting(10); // 10 minutes

      const endTime = await voting.votingEndTime();

      const expectedEndTime = startTime + 600;

      expect(endTime).to.be.closeTo(expectedEndTime, 2);
    });

    describe("Edge Cases", function () {
      it("Should handle vote count correctly when deleting candidates", async function () {
        await voting.addCandidate("Alice");
        await voting.addCandidate("Bob");
        await voting.startVoting(10);
        await voting.connect(addr1).vote(1);
        await voting.connect(addr2).vote(1);
        await ethers.provider.send("evm_increaseTime", [600]);
        await ethers.provider.send("evm_mine");
        await voting.endVoting();

        // After voting ends, delete candidate 1
        await voting.deleteCandidate(1);

        // Total votes should be reduced by the votes for candidate 1
        expect(await voting.getTotalVotes()).to.equal(0);
      });

      it("Should return correct voter information", async function () {
        await voting.addCandidate("Alice");
        await voting.startVoting(10);
        await voting.connect(addr1).vote(1);
        expect(await voting.getVoterVote(addr1.address)).to.equal(1);
        expect(await voting.getVoterVote(addr2.address)).to.equal(0);
      });
    });
  });
});
