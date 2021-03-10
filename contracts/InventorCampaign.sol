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
        /// ???
        bool[] vote;
    }
    // the owner of this contract and the respective
    // crowdfunding campaign
    address public manager;
    uint public minimunContribution;
    address[] public approvers;


    function InventorCampaign(uint _minimumContribution) public {
        manager = msg.sender;
        minimunContribution = _minimumContribution;
    }

    // contribute functuon can run into a little issue
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }
}