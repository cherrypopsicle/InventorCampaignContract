import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// we need the contract address and abi to export our contract
// well. 
const contractAddress = '0x9fa9a180043d3C39142EB4FD4255Ee554E7E2495';
const abi = CampaignFactory.abi;

const instance = new web3.eth.Contract(abi, contractAddress);
export default instance;