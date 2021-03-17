import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

const NewRequest = ({ campaignAddress }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    // before we try to create a request, we set our loading
    // to true and our error message to an empty string.
    setLoading(true);
    setError("");
    event.preventDefault();
    const campaign = Campaign(campaignAddress);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div>
        <Link route={`/campaigns/${campaignAddress}/requests`}>
          <Button
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Back
          </Button>
        </Link>
      </div>
      <Typography variant="h5">New request</Typography>
      <form>
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <TextField
          label="Value"
          InputProps={{
            endAdornment: <InputAdornment position="end">Ξ</InputAdornment>,
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextField
          label="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <div>
          {!loading && (
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={onSubmit}
            >
              Create Request!
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

export async function getServerSideProps(props) {
  const campaignAddress = props.query.campaignAddress;
  return { props: { campaignAddress } };
}

export default NewRequest;
