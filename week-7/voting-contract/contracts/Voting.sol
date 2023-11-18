// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

// import "hardhat/console.sol";

contract Voting {
    enum VoteStates {
        Absent,
        Yes,
        No
    }

    struct Proposal {
        address target;
        bytes data;
        uint yesCount;
        uint noCount;
        mapping(address => VoteStates) voteStates;
    }

    Proposal[] public proposals;

    //! Pushing to an array that contained a mapping inside it's stuct.
    event ProposalCreated(uint _proposalId);

    function newProposal(address _target, bytes calldata _data) external {
        emit ProposalCreated(proposals.length);
        Proposal storage proposal = proposals.push();
        proposal.target = _target;
        proposal.data = _data;
    }

    event VoteCast(uint _proposalId, address indexed voter);

    function castVote(uint _proposalId, bool _supports) external {
        Proposal storage proposal = proposals[_proposalId];

        // clear out previous vote
        if (proposal.voteStates[msg.sender] == VoteStates.Yes) {
            proposal.yesCount--;
        }
        if (proposal.voteStates[msg.sender] == VoteStates.No) {
            proposal.noCount--;
        }

        // add new vote
        if (_supports) {
            proposal.yesCount++;
        } else {
            proposal.noCount++;
        }

        // we're tracking whether or not someone has already voted
        // and we're keeping track as well of what they voted
        proposal.voteStates[msg.sender] = _supports
            ? VoteStates.Yes
            : VoteStates.No;

        emit VoteCast(_proposalId, msg.sender);
    }
}

contract VotingV2 {
    enum VoteStates {Absent, Yes, No}
    uint constant VOTE_THRESHOLD = 10;


    struct Proposal {
        address target;
        bytes data;
        bool executed;
        uint yesCount;
        uint noCount;
        mapping (address => VoteStates) voteStates;
    }
    
    Proposal[] public proposals;

    mapping(address => bool) members;

    constructor(address[] memory _addresses) {
        for(uint i = 0; i < _addresses.length; i++) {
            members[_addresses[i]] = true;
        }
        members[msg.sender] = true;
    }

    event ProposalCreated(uint _proposalId);
    
    function newProposal(address _target, bytes calldata _data) external {
        require(members[msg.sender], "Not a member");
        emit ProposalCreated(proposals.length);
        Proposal storage proposal = proposals.push();
        proposal.target = _target;
        proposal.data = _data;
    }

    event VoteCast(uint _proposalId, address indexed voter);

    function castVote(uint _proposalId, bool _supports) external payable {
        require(members[msg.sender], "Not a member");
        Proposal storage proposal = proposals[_proposalId];

        // clear out previous vote 
        if(proposal.voteStates[msg.sender] == VoteStates.Yes) {
            proposal.yesCount--;
        }
        if(proposal.voteStates[msg.sender] == VoteStates.No) {
            proposal.noCount--;
        }

        // add new vote 
        if(_supports) {
            proposal.yesCount++;
        }
        else {
            proposal.noCount++;
        }

        // we're tracking whether or not someone has already voted 
        // and we're keeping track as well of what they voted
        proposal.voteStates[msg.sender] = _supports ? VoteStates.Yes : VoteStates.No;
        emit VoteCast(_proposalId, msg.sender);

        if(proposal.yesCount == VOTE_THRESHOLD && !proposal.executed) {
            (bool s,) = proposal.target.call(proposal.data);
            require(s);
        }
    }
}