// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Contract {
    mapping (address => bool) public members;

    function addMember(address _address) public {
        members[_address] = true;
    }

    function isMember(address _address) external view returns(bool) {
        return members[_address];
    }

     function removeMember(address _address) external {
        members[_address] = false;
    }
}

contract ContractMap {
	struct User {
		uint balance;
		bool isActive;
	}

	mapping(address => User) public users;

	function createUser() external {
		require(!users[msg.sender].isActive);

		users[msg.sender] = User(100, true);
	}

    function transfer(address _address, uint _amount) external {
		require(users[msg.sender].isActive && users[_address].isActive && users[msg.sender].balance >= _amount);
		users[_address].balance += _amount;
		users[msg.sender].balance -= _amount;
	}

}

contract ContractNested {
	enum ConnectionTypes { 
		Unacquainted,
		Friend,
		Family
	}
	
	// TODO: create a public nested mapping `connections` 
	mapping(address => mapping(address => ConnectionTypes)) public connections;

	function connectWith(address other, ConnectionTypes connectionType) external {
		connections[msg.sender][other] = connectionType;
        // TODO: make the connection from msg.sender => other => connectionType
	}
}

// TODO: EXAMPLE TO LEARN

contract Market {
    // create the Collectible struct
    struct Collectible {
        address owner;
        bool forSale;
        uint price;
    }

    // map a uint ID to a Collectible struct
    mapping(uint => Collectible) idToCollectible;

    function purchase(uint _id) external payable {
        // find the collectible by the id passed in
        Collectible storage collectible = idToCollectible[_id];
        // purchase the collectible
        require(msg.value >= collectible.price);
        collectible.owner = msg.sender;
        collectible.forSale = false;
    }
}
