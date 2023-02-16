import { createTheme } from "@mui/material";
import { blue, deepPurple, green, indigo, orange, purple } from "@mui/material/colors";

export const theme = createTheme({
    palette: {
      primary: {
        main: "#022E52",
      },
      secondary: {
        main: green[500],
      },
      info: {
        main: "#37758C"
      }
      // background: {
      //   default: "#F0F7EE"
      // }
    },
  });