import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

// Link allows us to import anker tags while the Router object allows
// us to navigate users from one page to another
import { Link, Router } from "../../routes";

const newCampaign = () => {
  // minimum contribtution to use
  const [minimumContribution, setContribution] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    setLoading(true);
    setError("");
    // all the accounts from our connected ETH provider
    try {
      // get the first account ..
      const accounts = await web3.eth.getAccounts();
      event.preventDefault();
      // .. create the first campaign ..
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });
      setError("");
      // .. then navigate back to the main page when it's successful
      Router.pushRoute("/");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Typography
        variant="h4"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        {" "}
        NEW CAMPAIGN{" "}
      </Typography>
      <form>
        {" "}
        <TextField
          label="Minimum contribution"
          id="outlined-start-adornment"
          placeholder="Enter amount"
          value={minimumContribution}
          onChange={(e) => {
            setContribution(e.target.value);
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">ωei</InputAdornment>,
          }}
          // variant="outlined"
        />
        <div>
          {!loading && (
            <Button
              onClick={onSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Create
            </Button>
          )}
          {loading && <CircularProgress />}
        </div>
        <div>
          {error && (
            <Alert style={{ marginTop: "10px" }} severity="error">
              {error}
            </Alert>
          )}
        </div>
      </form>
    </Layout>
  );
};

export default newCampaign;
