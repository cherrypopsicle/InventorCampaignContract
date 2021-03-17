import React, { useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = (props) => {
  const [contribution, setContribution] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(props);
    const campaign = Campaign(props.address);
    setLoading(true);
    setError("");
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, "ether"),
      });
      Router.replaceRoute(`/campaigns/${props.address}`);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <form>
      <TextField
        label="Contribute"
        id="outlined-start-adornment"
        placeholder="Enter amount"
        value={contribution}
        onChange={(e) => {
          setContribution(e.target.value);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">Ξ</InputAdornment>,
        }}
      />
      <div>
        {!loading && (
          <Button
            onClick={onSubmit}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Contribute
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
  );
};

export default ContributeForm;
