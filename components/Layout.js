import React from "react";
import Container from "@material-ui/core/Container";
import Header from "./Header";
import Head from "next/head";

export default (props) => {
  return (
    <Container>
      {" "}
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};
