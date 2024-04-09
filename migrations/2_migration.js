const VotingToken = artifacts.require("VotingToken");

module.exports = function(deployer) {
  deployer.deploy(VotingToken);
};