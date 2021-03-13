// HDWalletProvider to inject our seed phrase and the rinkeby infura node
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const path = require('path');
const campaignFactoryPath = path.resolve(__dirname, 'build', 'CampaignFactory.json');
const fs = require('fs');
const compiledFactory = fs.readFileSync(campaignFactoryPath, 'utf8');

// Here we set up our Truffle provider. First argument we have to
// supply is our 12-word Mnemonic phrase for our wallets. The second
// argument is the API link to our Infura node, which will help us
// connect our provider.
const provider = new HDWalletProvider(
  "crew express nothing company wet enforce rural pioneer surround evidence trigger file",
  "https://rinkeby.infura.io/v3/877a59f4a10342a5aff775080ec9fc06"
);

// truffle provider created above is now injected into our web3
// instance
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);
//   console.log(JSON.parse(compiledFactory).evm.bytecode);
  const campaignFactory = await new web3.eth.Contract(JSON.parse(compiledFactory).abi)
    .deploy({ data: JSON.parse(compiledFactory).evm.bytecode.object })
    .send({ from: accounts[0] });
  console.log("Contract deployed to: ", campaignFactory.options.address);
};
deploy();


// addres of contract: 0x9fa9a180043d3C39142EB4FD4255Ee554E7E2495 