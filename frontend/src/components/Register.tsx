import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { UserType } from "../types/Types";
import { useNavigate } from "react-router-dom";

type RegisterProps = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const styles = {
  centerElement: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  formItem: {
    width: "100%",
  },
};

export const Register = ({ user, setUser }: RegisterProps) => {
  const [formData, setFormData] = useState<UserType>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log(formData);
    setUser(formData);
    setFormData({ username: "", password: "" });
    navigate("/messenger");
  };
  return (
    <Container
      maxWidth="sm"
      sx={{ width: "100%", height: "100%", margin: "2%" }}
    >
      <Paper
        elevation={3}
        sx={{ ...styles.centerElement, padding: "10% 10% 10% 10%" }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ ...styles.centerElement, padding: "2%" }}>
            <Typography variant="h4" sx={{ fontFamily: "monospace" }}>
              Sleek
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ padding: "2%" }}>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
              }}
              sx={styles.formItem}
            />
          </Grid>
          <Grid item xs={12} sx={{ padding: "2%" }}>
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              sx={styles.formItem}
            />
          </Grid>
          <Grid item xs={12} sx={{ ...styles.centerElement, padding: "2%" }}>
            <Button
              variant="contained"
              onClick={() => handleSubmit()}
              sx={{ width: "30%" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
