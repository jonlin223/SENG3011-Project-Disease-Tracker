import React, { useRef } from "react";
import NavBarSignedout from "../navbarSignedout";
import FeatureCard from "./HomeComponents/FeatureCard.js";
import "./styles.css";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import FeedIcon from "./HomeAssets/information.png";
import SearchIcon from "./HomeAssets/magnifier.png";
import ReportIcon from "./HomeAssets/people.png";
import HomePicture from "./HomeAssets/globe.png";
import SettingsIcon from "./HomeAssets/settings.png";
import Title from "./HomeAssets/cdisease.png";
import { KeyboardArrowDown } from "@mui/icons-material";
import { IconButton } from "@mui/material";


const PrimaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main
}));

const DarkText = styled(Typography)(({ theme }) => ({
  color: "#082c54",
}));

const HomepageGeneral = () => {

    const myRef = useRef(null)
  
    const executeScroll = () => myRef.current.scrollIntoView({behavior: 'smooth'})    
    // run this function from an event handler or an effect to execute scroll 

 
  return (
    <div
      style={{
        overflowX: "hidden"
      }}
    >
      <NavBarSignedout />
      <div
        className="App"
        style={{
          height: "calc(100vh - 50px)",
          padding: 0,
          margin: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20vh",
          }}
        >
          <img
            src={HomePicture}
            style={{
              width: "50%",
            }}
          />
          <div>
            <img
              src={Title}
              style={{
                width: "25%",
              }}
            />
          </div>
          <DarkText variant="subtitle1" sx={{ mt: 5 }}>
            Stay safe and informed with access to integrated outbreak data.
          </DarkText>
          <Button
            variant="contained"
            href='login'
            sx = {{ bgcolor: 'primary.main' }}
            style={{
              marginTop: "20px"
            }}
          >
            Create Account
          </Button>
          <div style={{padding:"13%"}}>
            <IconButton onClick={executeScroll}>
              <KeyboardArrowDown fontSize="large"></KeyboardArrowDown>
            </IconButton>
          </div>
        </div>
      </div>
      <div
        className="App"
        style={{
          width: "100vw",
          height: "100vh",
          padding: 0,
          margin: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
        ref={myRef}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <FeatureCard
            title="Custom Feed"
            icon={FeedIcon}
            description="View a custom feed of the latest social media discourse on active outbreaks from reliable sources."
          />
          <FeatureCard
            title="Advanced Search"
            icon={SearchIcon}
            description="Use advanced search options to filter outbreaks from numerous data sources."
          />
          <FeatureCard
            title="User Reports"
            icon={ReportIcon}
            description="Gain comprehensive insight into outbreaks using our community reports."
          />
          <FeatureCard
            title="Settings"
            icon={SettingsIcon}
            description="Receive email and text notifications so you never miss important outbreak news."
          />
        </div>
      </div>
    </div>
  );
}

export default HomepageGeneral;
