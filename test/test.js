const VotingToken = artifacts.require("VotingToken");

contract("VotingToken", accounts => {
  it("should deploy smart contract properly", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    assert(votingTokenInstance.address !== '');
  });

  it("should have correct token name and symbol", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    const name = await votingTokenInstance.name();
    const symbol = await votingTokenInstance.symbol();

    assert.equal(name, "VotingToken");
    assert.equal(symbol, "VOTE");
  });

  it("should assign initial supply to the deployer", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    const totalSupply = await votingTokenInstance.totalSupply();
    const ownerBalance = await votingTokenInstance.balanceOf(accounts[0]);

    assert.equal(totalSupply.toString(), "1000000000000000000000000");
    assert.equal(ownerBalance.toString(), "1000000000000000000000000");
  });

  it("should allow owner to create proposal", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    await votingTokenInstance.createProposal("Test proposal", { from: accounts[0] });
    const proposal = await votingTokenInstance.proposals(0);

    assert.equal(proposal.description, "Test proposal");
    assert.equal(proposal.voteCount.toString(), "0");
  });

  it("should not allow non-owner to create proposal", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    try {
      await votingTokenInstance.createProposal("Test proposal", { from: accounts[1] });
      assert.fail("Expected an error");
    } catch (error) {
      assert(error.toString().includes("Only owner can create proposals"));
    }
  });

  it("should allow users to vote for a proposal", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    await votingTokenInstance.createProposal("Test proposal", { from: accounts[0] });
    await votingTokenInstance.vote(0, { from: accounts[1] });
    const proposal = await votingTokenInstance.proposals(0);

    assert.equal(proposal.voteCount.toString(), "1");
  });

  it("should not allow users to vote more than once", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    try {
      await votingTokenInstance.vote(0, { from: accounts[1] });
      assert.fail("Expected an error");
    } catch (error) {
      assert(error.toString().includes("You have already voted"));
    }
  });

  it("should not allow voting for a non-existent proposal", async () => {
    const votingTokenInstance = await VotingToken.deployed();
    try {
      await votingTokenInstance.vote(1, { from: accounts[1] });
      assert.fail("Expected an error");
    } catch (error) {
      assert(error.toString().includes("revert"), "Expected revert");
    }
  });
});