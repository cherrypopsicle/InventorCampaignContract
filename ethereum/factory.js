import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// we need the contract address and abi to export our contract
// well. 
const contractAddress = '0x88DdEB87C14B15eac26324316717e938001Cb588';
const abi = CampaignFactory.abi;

const instance = new web3.eth.Contract(abi, contractAddress);
export default instance;