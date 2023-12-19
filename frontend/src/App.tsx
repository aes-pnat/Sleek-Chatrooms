import React from "react";
import "./App.css";
import { Main } from "./components/Main";
import { Container } from "@mui/material";

function App() {
  return (
    <Container
      sx={{
        // backgroundColor: "#ffffff",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // fontSize: "calc(10px + 2vmin)",
        // color: "white",
      }}
    >
      <Main />
    </Container>
  );
}

export default App;
