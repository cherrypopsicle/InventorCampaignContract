import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, CardContent, Typography, Grid, Button } from "@material-ui/core";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

const CampaignShow = (props) => {
  const renderCards = () => {
    const {
      balance,
      manager,
      minimumContribution,
      totalRequests,
      approversCount,
    } = props;

    const items = [
      {
        data: manager,
        meta: "Address of Manager",
        description:
          "The manager who created this campaign and who can create requests for spending.",
      },
      {
        data: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance Ξ",
        description: "The amount of balance this respective campaign",
      },
      {
        data: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "The minimum amount of money (in wei) required to enter this campaign",
      },
      {
        data: totalRequests,
        meta: "Number of Requests",
        description:
          "A request tries to move money from this contract to a vendor's address. It must be approved by the approvers.",
      },
      {
        data: approversCount,
        meta: "Number of Contributors",
        description:
          "The number of contributors who have donated to this campaign so far.",
      },
    ];
    const renderedItems = items.map((item, index) => {
      return (
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Card variant="outlined" style={{ height: "100%" }} key={index}>
            <CardContent>
              <Typography variant="h5">{item.data}</Typography>
              <Typography color="textSecondary">{item.meta}</Typography>
              <Typography>{item.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    });
    return renderedItems;
  };
  return (
    <Layout>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Typography variant="h5"> Campaign Information</Typography>
        </Grid>
        <Grid item xs={12} sm={9} md={9} lg={9}>
          <Grid container>{renderCards()}</Grid>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <ContributeForm address={props.address}></ContributeForm>
        </Grid>
        <Grid item xs={12}>
          <Link route={`/campaigns/${props.address}/requests`}>
            <Button style={{marginTop: "20px"}}variant="contained" color="primary">
              View Requests
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  const campaignAddress = props.query.campaignAddress;
  const campaign = Campaign(campaignAddress);
  let summary = JSON.parse(
    JSON.stringify(await campaign.methods.getSummary().call())
  );
  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      totalRequests: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: campaignAddress,
    },
  };
}
export default CampaignShow;
