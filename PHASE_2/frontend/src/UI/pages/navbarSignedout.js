import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import React from "react";

class NavBarSignedout extends React.Component {
  render() {
    return (
      <>
        <AppBar position="fixed">
          <Container maxWidth="x1">
            <Toolbar disableGutters>
              <Button sx={{ my: 2, color: "white", display: "block" }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ mr: 2, display: { xs: "flex" } }}
                >
                  CDISEASE
                </Typography>
              </Button>

              <Box sx={{ flexGrow: 0 }}
                style={{
                    position: "absolute",
                    right: "20px"
                }}
              >
                <Button variant="outlined"
                  href='/login'
                  style={{
                      color: "white",
                      border: "1px solid white",
                  }}>Sign In</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Toolbar />
      </>
    );
  }
}

export default NavBarSignedout;
