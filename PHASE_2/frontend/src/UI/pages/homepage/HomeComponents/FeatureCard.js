import React from "react";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => [
  {
    backgroundColor: `${theme.palette.primary.main}`,
    width: "20vw",
    height: "40vh",
    minHeight: "200px",
  },
  {
    "&:hover": {
      color: "red",
      backgroundColor: `${theme.palette.primary.light}`,
      cursor: "pointer"
    },
  },
]);

const FeatureCard = ({ title, description, icon }) => {

    const navigate = useNavigate();

    return (
      <StyledCard
        onClick={() => navigate("/login")}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={icon}
            style={{
              width: 50,
              height: 50,
              marginTop: 30,
              marginBottom: 10,
            }}
          />
          <Typography
            variant="h6"
            style={{
              color: "#FBFAF5",
            }}
          >
            {title}
          </Typography>
        </div>
        <Divider />
        <Typography
          variant="body1"
          style={{
            color: "#FBFAF5",
            textAlign: "center",
            padding: "10px 13px",
            paddingTop: "15px",
          }}
        >
          {description}
        </Typography>
      </StyledCard>
    );
}

export default FeatureCard;
