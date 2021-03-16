import { Button, Grid } from "@material-ui/core";
import React from "react";
import Layout from "../../components/Layout";

const newCampaign = () => {
  return (
    <Layout>
      <h1> NEW CAMPAIGN </h1>
      <form>
        <label> Minimum contribution </label>
      </form>
      <Button color="primary"> Create </Button>
    </Layout>
  );
};

export default newCampaign;
