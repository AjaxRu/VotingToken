pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingToken is ERC20 {
    address public owner;
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint256 indexed proposalId);
    event ProposalCreated(uint256 indexed proposalId, string description);

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    Proposal[] public proposals;

    constructor() ERC20("VotingToken", "VOTE") {
        _mint(msg.sender, 1000000 * 10 ** uint(decimals()));
        owner = msg.sender;
    }

    function vote(uint256 proposalId) external {
        require(!hasVoted[msg.sender], "You have already voted");
        require(proposalId < proposals.length, "Invalid proposal ID");

        hasVoted[msg.sender] = true;
        proposals[proposalId].voteCount++;

        emit Voted(msg.sender, proposalId);
    }

    function createProposal(string memory description) external {
        require(msg.sender == owner, "Only owner can create proposals");

        uint256 proposalId = proposals.length;
        proposals.push(Proposal(description, 0));

        emit ProposalCreated(proposalId, description);
    }
}