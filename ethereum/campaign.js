import web3 from "./web3";
import InventorCampaign from "./build/InventorCampaign.json";

// we pass an address as the constructor here. This will allow us
// to return contracts as we select them from the show.js file.
export default (address) => {
  const abi = InventorCampaign.abi;
  return new web3.eth.Contract(abi, address);
};
