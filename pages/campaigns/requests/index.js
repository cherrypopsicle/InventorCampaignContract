import React from "react";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

const Requests = ({
  campaignAddress,
  requests,
  requestCount,
  approversCount,
}) => {
  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          id={index}
          key={index}
          request={request}
          address={campaignAddress}
          approversCount={approversCount}
        />
      );
    });
  };
  return (
    <Layout>
      <Typography variant="h5">Requests</Typography>
      <Link route={`/campaigns/${campaignAddress}/requests/new`}>
        <div>
          <Button variant="contained" color="primary">
            New Request
          </Button>
        </div>
      </Link>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Approval Count</TableCell>
              <TableCell>Approve</TableCell>
              <TableCell>Finalize</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
      <div>
        <Typography>Found {requestCount} requests.</Typography>
      </div>
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
  const requests = JSON.parse(
    JSON.stringify(
      await Promise.all(
        Array(parseInt(requestCount))
          .fill()
          .map((element, index) => {
            // retrieves given request (by index)
            return campaign.methods.requests(index).call();
          })
      )
    )
  );
  const approversCount = await campaign.methods.approversCount().call();
  console.log(approversCount);
  return { props: { campaignAddress, requests, requestCount, approversCount } };
}

export default Requests;
