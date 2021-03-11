pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        // syntax for calling another contract's constructor
        // msg.sender is the user using this factory to deploy
        // a new campaign.
        address newCampaign = new InventorCampaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getAllDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}


contract InventorCampaign {

    // the owner of this contract and the respective
    // crowdfunding campaign
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    Request[] public requests;
    uint public approversCount;
    
    struct Request {
        // why is this request being created?
        string description;
        // how much money is being used?
        uint value;
        // address of the vendor
        address recipient;
        // is the request complete
        bool complete;
        // keep track on whether someone has voted
        mapping(address=>bool) approvals;
        // numbner of approvals we got for a payment createRequest
        uint approvalCount;
    }
    
    function InventorCampaign(uint _minimumContribution, address _creator) public {
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

    function createRequest(string _description, uint _value, address _recipient) public restricted {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
        
    function approveRequest(uint requestIndex) public isApprover {
        // Store this instance of request as a storage variable so 
        // that we can override it!
        Request storage request = requests[requestIndex];
        
        // Has this user not voted before? If they voted before
        // then don't allow them to vote. If not, allow them to
        // vote.
        require(request.approvals[msg.sender] == false);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint requestIndex) public restricted {
        Request storage request = requests[requestIndex];
        // first, we check if the request has NOT been completed
        require(request.approvalCount >  (approversCount / 2));
        require(request.complete == false);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}