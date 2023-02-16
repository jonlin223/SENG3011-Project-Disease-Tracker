import React from "react";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";

const DiseaseItem = ({ disease, colour, selected }) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px 0px 5px 10px",
        }}
      >
        <Checkbox
          style={{
            color: colour,
          }}
          checked={selected ? true : false}
        />
        <Typography>{disease}</Typography>
      </div>
    );
}

export default DiseaseItem;
