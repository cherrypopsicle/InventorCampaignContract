// require() invokes a function
const routes = require("next-routes")();

// route rules
// navigate to the campaigns/address show page
routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:campaignAddress", "/campaigns/show");

module.exports = routes;
