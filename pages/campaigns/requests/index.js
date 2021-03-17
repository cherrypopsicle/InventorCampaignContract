import React from "react";
import { Button, Typography } from "@material-ui/core";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

const Requests = ({ campaignAddress, requests }) => {
  return (
    <Layout>
      <Typography variant="h5">Requests</Typography>
      <Link route={`/campaigns/${campaignAddress}/requests/new`}>
        <Button variant="contained" color="primary">
          New Request
        </Button>
      </Link>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  const campaignAddress = props.query.campaignAddress;
  const campaign = Campaign(campaignAddress);
  const requestCount = await campaign.methods.getRequestsCount().call();

  // this is a promise that awaits for all our requests to be fetched.
  // First, we create an Array() of our request count and we fill it with
  // indices from map() and their respective values come from returning the
  // requests(index) from our Campaign contract. 
  const requests = await Promise.all(
    Array(requestCount)
      .fill()
      .map((element, index) => {
        // retrieves given request (by index)
        return campaign.methods.requests(index).call();
      })
  );
  console.log(requests);
  return { props: { campaignAddress, requests} };
}

export default Requests;
