import Web3 from "web3";

let web3;

// check if inside browser and metamask available
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  const provider = window.ethereum;
  // enable it
  provider.enable();
  // and pass it along as our web3 provider
  web3 = new Web3(provider);
} else {
    // we are in the server side or no meta mask
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/877a59f4a10342a5aff775080ec9fc06"
    );
    web3 = new Web3(provider);
}

// Get the meta mask provider

export default web3;
