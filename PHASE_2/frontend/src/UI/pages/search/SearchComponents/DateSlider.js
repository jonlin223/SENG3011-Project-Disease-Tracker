import * as React from "react";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const formatDateStr = (date) => {
  return `${date.split('-')[0]}`
}

const getBoundary = (startDate, endDate, sliderValue) => {
  let start = new Date(startDate);
  let end = new Date(endDate);

  // return empty string if date range is invalid
  if (startDate == '' || endDate == '' || end.getTime() < start.getTime()) {
    return '';
  }

  let diffSeconds = (end - start);

  // get number of days indicated by slider
  let sliderDiff = Math.floor((sliderValue / 100.0) * diffSeconds);
  let endBoundary = new Date(start.getTime() + sliderDiff);

  // format date as string
  return endBoundary.toISOString().split('.')[0];
}

const DateSlider = ({ startDate, endDate, onChangeCall }) => {
  const [value, setValue] = React.useState(100)
  // end date boundary of the slider
  const [boundary, setBoundary] = React.useState(endDate)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    setBoundary(getBoundary(startDate, endDate, value));
  }, [value, endDate])

  React.useEffect(() => {
    onChangeCall(boundary);
  }, [boundary])

  return (
    <Box
      width={"100%"}
      sx={{ mt: 1 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }}
    >
      <Slider
        value={value}
        onChange={handleChange}
        aria-label="Default"
        valueLabelDisplay="off"
        valueLabelFormat={(val) => formatDateStr(boundary)}
        style={{
          width: "calc(100% - 150px)",
        }}
      />
      <Typography sx={{ ml: 3, color: 'primary.main'}}>{boundary == '' ? '' : formatDateStr(boundary)}</Typography>
    </Box>
  );
}

export default DateSlider;