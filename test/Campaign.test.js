const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const ganacheProvider = ganache.provider();
const web3 = new Web3(ganacheProvider);

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/InventorCampaign.json");

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
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.abi))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0] });

  await factory.methods.createCampaign("100").send({ from: accounts[0] });

  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaginAddress = addresses[0];

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign),
    campaignAddress
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0] });
});
