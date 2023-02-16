import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import UserLogo from "../SearchAssets/user.png";

class ReportItem extends React.Component {
  render() {
    return (
      <Card sx={{ display: "flex", alignItems: "center", height: 150 }}>
        <CardMedia component="img" sx={{ width: 150 }} image={UserLogo} />
        <Box sx={{ display: "flex", flexDirection: "column", pt: "5" }}>
          <CardContent>
            <Typography variant="subtitle1">
              Disease: {this.props.disease}
            </Typography>
            <Typography variant="subtitle1">
              Date: {this.props.date}
            </Typography>
            <Typography variant="subtitle1">
              Location: {this.props.location}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    );
  }
}

export default ReportItem;
