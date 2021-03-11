pragma solidity ^0.4.17;

contract InventorCampaign {
    struct Request {
        // why is this request being created?
        string description;
        // how much money is being used?
        uint value;
        // address of the vendor
        address recipient;
        // is the request complete
        bool complete;
    }
    // the owner of this contract and the respective
    // crowdfunding campaign
    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requests;


    function InventorCampaign(uint _minimumContribution) public {
        manager = msg.sender;
        minimumContribution = _minimumContribution;
    }

    // contribute functuon can run into a little issue
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function createRequest(string _description, uint _value, address _recipient) public restricted {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false
        });
        requests.push(newRequest);
    }
}