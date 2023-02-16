import React from "react";
import { Marker } from "pigeon-maps";
import Typography from "@mui/material/Typography";

const Label = ({ point }) => {
  return (
    <Typography
      variant="body2"
      style={{
        backgroundColor: "white",
        padding: "0px 5px",
        borderRadius: 5,
        position: "relative",
        top: "-18px",
        left: "-25px",
      }}
    >
      {point.disease} - {point.year}
    </Typography>
  );
}

const MapMarker = ({ point }) => {
    const [hoverActive, setHoverActive] = React.useState(false)

    const onHover = () => {
      setHoverActive(true)
    }
    const onLeave = () => {
      setHoverActive(false)
    }

    return (
      <div>
        <Marker
          width={30}
          color="red"
          onClick={() => {
            if ("url" in point) {
              window.open(point.url, "_blank");
            }
          }}
          onMouseOver={onHover}
          onMouseOut={onLeave}
        />
        {hoverActive ? <Label point={point} /> : ""}
      </div>
    );
}

export default MapMarker;