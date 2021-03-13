/**
 *  write the compile script to compile only once
 **/
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Step 1. Find build path and delete it
const build = path.resolve(__dirname, "build");
fs.removeSync(build);

// Step 2. Read InventorCampaign solidity script
const campaign = path.resolve(__dirname, "contracts", "InventorCampaign.sol");
const source = fs.readFileSync(campaign, "utf8");
// Step 3. compile both contracts
// This is how to compile with solidity versions ^0.5.0
const input = {
  language: "Solidity",
  sources: {
    "InventorCampaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
// Step 4. create new build directory
fs.ensureDirSync(build);

const contracts = output['contracts']['InventorCampaign.sol'];

// Step 5. write output of both contracts into build
for (let contract in contracts) {
  fs.outputJsonSync(path.resolve(build, contract + ".json"), contracts[contract]);
}
