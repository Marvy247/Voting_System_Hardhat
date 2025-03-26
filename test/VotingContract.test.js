const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let votingContract;
  let owner;

  before(async function () {
    const Voting = await ethers.getContractFactory("Voting");
    console.log("Contract deployed at address:", votingContract.address); // Log the contract address after deployment
    votingContract = await Voting.deploy();

    owner = await ethers.getSigner();
  });

  it("should return the total number of candidates", async function () {
    const totalCandidates = await votingContract.getTotalCandidates();
    console.log("Total Candidates:", totalCandidates.toString());
    expect(totalCandidates).to.be.a("number");
  });
});
