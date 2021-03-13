// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

contract CampaignFactory {
    InventorCampaign[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        // syntax for calling another contract's constructor
        // msg.sender is the user using this factory to deploy
        // a new campaign.
        InventorCampaign newCampaign = new InventorCampaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getAllDeployedCampaigns() public view returns (InventorCampaign[] memory) {
        return deployedCampaigns;
    }
}

contract InventorCampaign {
    // the owner of this contract and the respective
    // crowdfunding campaign
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(uint256 => Request) public requests;
    uint256 public approversCount;
    uint256 public requestIndex;

    struct Request {
        // why is this request being created?
        string description;
        // how much money is being used?
        uint256 value;
        // address of the vendor
        address payable recipient;
        // is the request complete
        bool complete;
        // keep track on whether someone has voted
        mapping(address => bool) approvals;
        // numbner of approvals we got for a payment createRequest
        uint256 approvalCount;
    }

    constructor(uint256 _minimumContribution, address _creator) {
        manager = _creator;
        minimumContribution = _minimumContribution;
    }

    // contribute functuon can run into a little issue
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier isApprover() {
        require(approvers[msg.sender] == true);
        _;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public restricted {
        // Request storage newRequest =
        //     Request({
        //         description: _description,
        //         value: _value,
        //         recipient: _recipient,
        //         complete: false,
        //         approvalCount: 0
        //     });
        Request storage newRequest = requests[requestIndex++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public isApprover {
        // Store this instance of request as a storage variable so
        // that we can override it!
        Request storage request = requests[index];

        // Has this user not voted before? If they voted before
        // then don't allow them to vote. If not, allow them to
        // vote.
        require(request.approvals[msg.sender] == false);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        // first, we check if the request has NOT been completed
        require(request.approvalCount > (approversCount / 2));
        require(request.complete == false);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
