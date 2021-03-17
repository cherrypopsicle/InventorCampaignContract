import React from "react";
import { Button, Typography, TableCell, TableRow } from "@material-ui/core";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const RequestRow = ({ id, request, address, approversCount }) => {
  const readyToFinalize = request.approvalCount > approversCount / 2;
  // approve request. any contributor can approve (or the manager)
  const approveRequest = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    try {
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
    } catch (error) {}
  };
  // only manager can finalize the request
  const finalizeRequest = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    try {
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
    } catch (error) {}
  };
  return (
    <TableRow style={request.complete ? { backgroundColor: "#d3d3d3" } : {}}>
      <TableCell>{id}</TableCell>
      <TableCell>{request.description}</TableCell>
      <TableCell>{web3.utils.fromWei(request.value, "ether")}Ξ</TableCell>
      <TableCell>{request.recipient}</TableCell>
      <TableCell
        style={
          readyToFinalize
            ? { backgroundColor: "#90ee90" }
            : { backgroundColor: "#FFCCCBB" }
        }
      >
        {request.approvalCount}/{approversCount}
      </TableCell>
      <TableCell>
        {request.complete ? null : (
          <Button variant="contained" color="primary" onClick={approveRequest}>
            Approve
          </Button>
        )}
      </TableCell>
      <TableCell>
        {request.complete ? null : (
          <Button
            variant="contained"
            color="secondary"
            onClick={finalizeRequest}
          >
            Finalize
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;
