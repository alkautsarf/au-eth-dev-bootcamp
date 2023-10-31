// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

// ☝️ With this pragma statement at the top of our code, we can use tuples in our ABI to describe structs.

contract Contract {
	enum Choices { Yes, No }

	// TODO: create a vote struct and a public state variable
	struct Vote {
		Choices choice;
		address voter;
	}

	Vote public vote;

	function createVote(Choices choice) external {
		vote = Vote(choice, msg.sender);
		// TODO: create a new vote
	}
}

contract ContractExp {
	enum Choices { Yes, No }

	struct Vote {
		Choices choice;
		address voter;
	}
	
	// TODO: make a new createVote function

	function createVote(Choices choice) external view returns(Vote memory) {
		return Vote(choice, msg.sender);
	}
}

contract ContractArray {
	enum Choices { Yes, No }
	
	struct Vote {
		Choices choice;
		address voter;
	}
	
	// TODO: create a public state variable: an array of votes

	Vote[] public votes;

	function createVote(Choices choice) external {
		// TODO: add a new vote to the array of votes state variable
		votes.push(Vote(choice, msg.sender));
	}
}

contract ContractLookup {
	enum Choices { Yes, No }
	
	struct Vote {
		Choices choice;
		address voter;
	}

	Vote none = Vote(Choices(0), address(0));

	Vote[] public votes; 

	function createVote(Choices choice) external {
		votes.push(Vote(choice, msg.sender));
	}

	function findVote(address voter) internal view returns(Vote storage) {
		for(uint i = 0; i < votes.length; i++) {
			if(votes[i].voter == voter) {
				return votes[i];
			}
		}
		return none;
	}

	function hasVoted(address voter) public view returns(bool) {
		return findVote(voter).voter == voter;
	}

	function findChoice(address voter) external view returns(Choices) {
		return findVote(voter).choice;
	}
}

contract ContractRevert {
	enum Choices { Yes, No }
	
	struct Vote {
		Choices choice;
		address voter;
	}

	Vote none = Vote(Choices(0), address(0));

	Vote[] public votes; 
	error VoteOnlyForOnce();
	function createVote(Choices choice) external {
		if(hasVoted(msg.sender)) {
			revert VoteOnlyForOnce();
		}
		votes.push(Vote(choice, msg.sender));
	}

	function findVote(address voter) internal view returns(Vote storage) {
		for(uint i = 0; i < votes.length; i++) {
			if(votes[i].voter == voter) {
				return votes[i];
			}
		}
		return none;
	}

	function hasVoted(address voter) public view returns(bool) {
		return findVote(voter).voter == voter;
	}

	function findChoice(address voter) public view returns(Choices) {
		return findVote(voter).choice;
	}
}

contract ContractFinal {
	enum Choices { Yes, No }
	
	struct Vote {
		Choices choice;
		address voter;
	}

	Vote none = Vote(Choices(0), address(0));

	Vote[] public votes; 
	error VoteOnlyForOnce();
	function createVote(Choices choice) external {
		if(hasVoted(msg.sender)) {
			revert VoteOnlyForOnce();
		}
		votes.push(Vote(choice, msg.sender));
	}

	function findVote(address voter) internal view returns(Vote storage) {
		for(uint i = 0; i < votes.length; i++) {
			if(votes[i].voter == voter) {
				return votes[i];
			}
		}
		return none;
	}

	function hasVoted(address voter) public view returns(bool) {
		return findVote(voter).voter == voter;
	}

	function findChoice(address voter) public view returns(Choices) {
		return findVote(voter).choice;
	}

	error MustVoteFirst();
	function changeVote(Choices _choice) external {
		if(!hasVoted(msg.sender)) {
			revert MustVoteFirst();
		}
		findVote(msg.sender).choice = _choice;				
	}
}