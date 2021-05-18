// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

/**
    @title: CampaignFactory
    @author: Memo Khoury
    @dev: A factory contract that creates multiple campagins. 
    There are no managers since anyone can create a campaign.
    Like, for instance, Kickstarter.

 */
contract CampaignFactory {
    InventorCampaign[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        // syntax for calling another contract's constructor
        // msg.sender is the user using this factory to deploy
        // a new campaign.
        InventorCampaign newCampaign =
            new InventorCampaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getAllDeployedCampaigns()
        public
        view
        returns (InventorCampaign[] memory)
    {
        return deployedCampaigns;
    }
}


/**
    @title: InventorCampaign
    @author: Memo Khoury
    @dev: The inventor campaign contract is meant to solve
    the Kickstarter problem where campaign managers run away with
    funds. Here, if one person contributes more than the minimum
    contribution required for the campaign, then they are added as 
    an approver of requests. Each approver is given one vote for each
    requests for funds.

    Only the manager of the campaign (created from the factory) is allowed
    to create requests. Requests are ideally requests for funds, where the
    manager writes a description of where the funds will go. For example,
    a campaign for creating a new building will typically have a request
    for building equipment. Once a request is created, all the approvers in
    the campaign can vote. If the majority of the vote is in the request,
    the manager can approve the request and the funds can be deposited
    in the wallet of the vendor. 

 */
contract InventorCampaign {
    // the owner of this contract and the respective
    // crowdfunding campaign
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(uint256 => Request) public requests;
    uint256 public approversCount;
    uint256 public requestIndex;
    uint256 totalRequests = 0;

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
        Request storage newRequest = requests[requestIndex++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        // increment the total number of requests
        totalRequests++;
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

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            totalRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return totalRequests;
    }
}
