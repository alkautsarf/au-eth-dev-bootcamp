// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    receive() external payable {}

    struct Transaction {
        address to;
        uint value;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required) {
        require(
            _owners.length != 0 && _required != 0 && _required <= _owners.length
        );
        owners = _owners;
        required = _required;
    }

    //! should change this function internally
    function addTransaction(
        address _destination,
        uint256 _value
    ) public returns (uint256) {
        transactions[transactionCount] = Transaction(
            _destination,
            _value,
            false
        );
        transactionCount++;
        return transactionCount - 1;
    }

    function isOwner(address addr) private view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function confirmTransaction(uint txId) public {
        require(isOwner(msg.sender));
        confirmations[txId][msg.sender] = true;
    }

    function getConfirmationsCount(
        uint transactionId
    ) public view returns (uint) {
        uint idx;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]] == true) {
                idx++;
            }
        }
        return idx;
    }

    function submitTransaction(address _destination, uint _value) external {
        confirmTransaction(addTransaction(_destination, _value));
    }

    function isConfirmed(uint txId) public view returns (bool) {
        return getConfirmationsCount(txId) >= required;
    }

    function executeTransaction(uint txId) public {
        require(isConfirmed(txId));
        (bool s, ) = transactions[txId].to.call{
            value: transactions[txId].value
        }("");
        require(s);
        transactions[txId].executed = true;
    }
}


contract MultiSigFix {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    receive() external payable {}

    struct Transaction {
        address to;
        uint value;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required) {
        require(
            _owners.length != 0 && _required != 0 && _required <= _owners.length
        );
        owners = _owners;
        required = _required;
    }

    //! should change this function internally
    function addTransaction(
        address _destination,
        uint256 _value
    ) public returns (uint256) {
        transactions[transactionCount] = Transaction(
            _destination,
            _value,
            false
        );
        transactionCount++;
        return transactionCount - 1;
    }

    function isOwner(address addr) private view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function confirmTransaction(uint txId) public {
        require(isOwner(msg.sender));
        confirmations[txId][msg.sender] = true;
        if(isConfirmed(txId)) {
            executeTransaction(txId);
        }
    }

    function getConfirmationsCount(
        uint transactionId
    ) public view returns (uint) {
        uint idx;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]] == true) {
                idx++;
            }
        }
        return idx;
    }

    function submitTransaction(address _destination, uint _value) external {
        confirmTransaction(addTransaction(_destination, _value));
    }

    function isConfirmed(uint txId) public view returns (bool) {
        return getConfirmationsCount(txId) >= required;
    }

    function executeTransaction(uint txId) internal {
        (bool s, ) = transactions[txId].to.call{
            value: transactions[txId].value
        }("");
        require(s);
        transactions[txId].executed = true;
    }
}

contract MultiSigComplete {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    receive() external payable {}

    struct Transaction {
        address to;
        uint value;
        bool executed;
        bytes data;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length != 0 && _required != 0 && _required <= _owners.length);
        owners = _owners;
        required = _required;
    }

    function addTransaction(address _destination, uint256 _value, bytes calldata _data) internal returns(uint256) {
        transactions[transactionCount] = Transaction(_destination, _value, false, _data);
        transactionCount++;
        return transactionCount - 1;
    }

    function isOwner(address addr) private view returns(bool) {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function confirmTransaction(uint txId) public {
        require(isOwner(msg.sender));
        confirmations[txId][msg.sender] = true;
        if(isConfirmed(txId)) {
            executeTransaction(txId);
        }
    }

    function getConfirmationsCount(uint transactionId) public view returns (uint) {
        uint idx;
        for (uint i = 0; i < owners.length; i++) {
            if(confirmations[transactionId][owners[i]] == true) {
                idx++;
            }
        }
        return idx;
    }

    function submitTransaction(address _destination, uint _value, bytes calldata _data) external {
        confirmTransaction(addTransaction(_destination, _value, _data));
    }

    function isConfirmed(uint txId) public view returns(bool) {
        return getConfirmationsCount(txId) >= required;
    }

    function executeTransaction(uint txId) public {
        require(isConfirmed(txId));
        (bool s,) = transactions[txId].to.call{value: transactions[txId].value}(transactions[txId].data);
        require(s);
        transactions[txId].executed = true;
    }

}
