const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const ganacheProvider = ganache.provider();
const web3 = new Web3(ganacheProvider);
// file stream reader
const fs = require("fs");
// path finder
const path = require("path");
const { CancelPresentationOutlined } = require("@material-ui/icons");
const campaignFactoryPath = path.resolve(
  __dirname,
  "..",
  "ethereum",
  "build",
  "CampaignFactory.json"
);
const campaignPath = path.resolve(
  __dirname,
  "..",
  "ethereum",
  "build",
  "InventorCampaign.json"
);

const compiledFactory = fs.readFileSync(campaignFactoryPath, "utf8");
const compiledCampaign = fs.readFileSync(campaignPath, "utf8");

// retrieve all ganache accounts
let accounts;
// retrieve factory abi
let factory;
// address of campaign contract after we create from factory
let campaignAddress;
// retrieve campaign abi
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory).abi)
    .deploy({ data: JSON.parse(compiledFactory).evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  const addresses = await factory.methods.getAllDeployedCampaigns().call();
  campaignAddress = addresses[0];

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign).abi,
    campaignAddress
  );
});
describe("Campaigns", () => {
  it("deploys a factory", () => {
    // asserts if value exists at the address of the factory
    assert.ok(factory.options.address);
  });

  it("deploys a campaign", () => {
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    const testApprover = accounts[1];
    await campaign.methods.contribute().send({
      from: testApprover,
      value: "200",
      gas: "1000000",
    });
    const isContributor = await campaign.methods.approvers(testApprover).call();
    assert.equal(isContributor, true);
  });

  it("campaign has a minimum contribution tied to it", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy waffles!", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, "Buy waffles!");
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("bla bla", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance =  web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
