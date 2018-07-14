pragma solidity ^0.4.24;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function mul(uint a, uint b) internal pure returns (uint) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }
    function div(uint a, uint b) internal pure returns (uint) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
    function sub(uint a, uint b) internal pure returns (uint) {
        assert(b <= a);
        return a - b;
    }
    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        assert(c >= a);
        return c;
    }
}

contract ProjectList {
    using SafeMath for uint;
    address[] public projects;

    function createProject(string _description, uint _minInvest, uint _maxInvest, uint _goal) public {
        address newProject = new Project(_description, _minInvest, _maxInvest, _goal, msg.sender);
        projects.push(newProject);
    }

    function getProjects() public view returns(address[]) {
        return projects;
    }
}

contract Project {
    using SafeMath for uint;

    struct Payment {
        string description;
        uint amount;
        address receiver;
        bool completed;
        mapping(address => bool) voters;
        uint voterCount;
    }

    address public owner;        // 项目所有者
    string public description;   // 项目介绍
    uint public minInvest;       // 最小投资金额
    uint public maxInvest;       // 最大投资金额
    uint public goal;            // 融资上限
    uint public investorCount;   // 投资人列表
    mapping(address => uint) public investors;  

    Payment[] public payments;   // 资金支出列表

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    constructor(string _description, uint _minInvest, uint _maxInvest, uint _goal, address _owner) public {
        description = _description;
        minInvest = _minInvest;
        maxInvest = _maxInvest;
        goal = _goal;
        owner = _owner;
    }

    function contribute() public payable {
        require(msg.value >= minInvest);
        require(msg.value <= maxInvest);

        uint newBalance = 0;
        newBalance = address(this).balance.add(msg.value);
        require(newBalance <= goal);

        investors[msg.sender] = msg.value;
        investorCount += 1;
    }

    function createPayment(string _description, uint _amount, address _receiver) ownerOnly public {
        Payment memory newPayment = Payment({
            description: _description,
            amount: _amount,
            receiver: _receiver,
            completed: false,
            voterCount: 0
        });

        payments.push(newPayment);
    }

    function approvePayment(uint index) public {
        Payment storage payment = payments[index];

        // must be investor to vote
        require(investors[msg.sender] > 0);

        // can not vote twice
        require(!payment.voters[msg.sender]);

        payment.voters[msg.sender] = true;
        payment.voterCount += 1;
    }

    function doPayment(uint index) ownerOnly public {
        Payment storage payment = payments[index];
        
        require(!payment.completed);
        require(address(this).balance >= payment.amount);
        require(payment.voterCount > (investorCount / 2));

        payment.receiver.transfer(payment.amount);
        payment.completed = true;
    }
}