import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default (props) => {
  const classes = useStyles();
  return (
    <AppBar style={{ marginTop: "10px" }} position="static">
      <Toolbar style={{maxWidth: "100%"}}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6" className={classes.title}>
              FundCoin
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button color="inherit">
              <AddCircleIcon />{" "}
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
