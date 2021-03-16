import { Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

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
      const accounts = await web3.eth.getAccounts();
      event.preventDefault();
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] })
        .then(() => {
          setError("");
        });
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
