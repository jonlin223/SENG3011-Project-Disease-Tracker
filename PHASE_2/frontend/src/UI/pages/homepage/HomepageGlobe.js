import React from "react";
import "./styles.css";
import ReactGlobe, { Globe } from "react-globe";
// import points from "./breakoutPoints.js";
import cdcPoints from "./cdcBreakoutPoints.js";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import NavBar from "../navbar";
import DiseaseItem from "./HomeComponents/DiseaseItem.js";

import {getLocation, getYear} from "../search/SearchComponents/Map.js";

import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

// colour for each disease
const colours = {
  listeriosis: "#ffae00",
  hepatitis: "red",
  measles: "#ff00ea",
  ebola: "black",
};

// filter out reports by disease
const filterDisease = (disease, reports) => {
  return reports.filter(report => report.disease.toLowerCase().includes(disease));
}

const getDate = (date) => {
  let newDate = date
  if (date.includes("to")) {
    newDate = date.split("to")[0]
  }

  newDate = `${newDate.split(" ")[0]}T${newDate.split(" ")[1]}`
  return newDate;
}

const HomepageGlobe = () => {
  const [breakoutPoints, setBreakoutPoints] = React.useState([]);
  const [displayPoints, setDisplayPoints] = React.useState([]);
  const [checked, setChecked] = React.useState({
    'ebola': true,
    'listeriosis': true,
    'measles': true,
    'hepatitis': true
  })

  const [values, setValues] = React.useState({
    start_date: "2021-04-19T00:00:00",
    end_date: "2022-04-19T00:00:00",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  React.useEffect(() => {
    setBreakoutPoints(cdcPoints);
  }, [])

  React.useEffect(() => {
    // set initial value for visible points
    // after all breakout points have been found
    updateDisplayPoints();
  }, [breakoutPoints])

  React.useEffect(() => {
    setDisplayPoints(
      breakoutPoints.filter((point) => {
        let inRange = false;

        let dateStr = getDate(point.event_date);
        let pointDate = new Date(dateStr);
        let start = new Date(values.start_date);
        let end = new Date(values.end_date);

        if (
          pointDate.getTime() >= start.getTime() &&
          pointDate.getTime() <= end.getTime()
        ) {
          inRange = true;
        }

        return inRange;
      })
    );
  }, [values])


  const updateDisplayPoints = () => {
    let hiddenDiseases = [];
    for (const disease in checked) {
      if (!checked[disease]) {
        hiddenDiseases.push(disease);
      }
    }

    const isHidden = (point) => {
      let show = true;
      hiddenDiseases.forEach((hidden) => {
        if (point.disease.includes(hidden)) {
          show = false;
        }
      });
      return show;
    };

    let newDisplayPoints = breakoutPoints.filter(isHidden);

    setDisplayPoints(
      newDisplayPoints.filter((point) => {
        let inRange = false;

        let dateStr = getDate(point.event_date);
        let pointDate = new Date(dateStr);
        let start = new Date(values.start_date);
        let end = new Date(values.end_date);

        if (
          pointDate.getTime() >= start.getTime() &&
          pointDate.getTime() <= end.getTime()
        ) {
          inRange = true;
        }

        return inRange;
      })
    );
  };

  React.useEffect(() => {
    updateDisplayPoints();
  }, [checked]);


  // NOTE: uncomment this section to fetch breakout points from the CDC API,
  // rather than use the fetched and stored list in cdcBreakoutPoints.js
  // This makes the page load take several seconds
  
  // React.useEffect(() => {
  //   let response = [];
  //   // get reports in cdc database for ebola, listeriosis, measles and hepatitis 
  //   // the date range would be changed to past year given more data to display to keep overview relevant
  //   let base_url =
  //     "http://implementerscdcapi-env.eba-h2hzu5xc.ap-southeast-2.elasticbeanstalk.com/api/v1/articles";
  //   let query_url = `${base_url}?key_terms=ebola,listeriosis,measles,hepatitis&start_date=1950-01-01T00:00:00&end_date=2022-12-12T00:00:00&location=.*`;
  //   // fetch response
  //   fetch(query_url)
  //     .then((res) => {
  //       if (res.status !== 200) {
  //         // no results
  //         return [];
  //       }
  //       return res.json();
  //     })
  //     .then((res) => {
  //       if (res.length == 0) {
  //         response = [];
  //       } else {
  //         response = res.articles;
  //       }

  //       // get all reports that have locations listed
  //       let allReports = [];
  //       response.forEach((article) => {
  //         article.reports.forEach((report) => {
  //           if ("locations" in report && report["locations"].length > 0) {
  //             allReports.push({ ...report, url: article.url });
  //           }
  //         });
  //       });

  //       // list of coordinate api promises
  //       let promises = allReports.map((report) => {
  //         let location = getLocation(report["locations"][0]);

  //         return fetch(
  //           `http://api.positionstack.com/v1/forward?access_key=bcc92317cc6abaf3c2d5e5655688d405&query=${location}`
  //         )
  //           .then((res) => res.json())
  //           .then((res) => {
  //             if (res["data"].length != 0) {
  //               // get first found coordinates
  //               let point = res["data"][0];
  //               let coords = [point["latitude"], point["longitude"]];

  //               return {
  //                 disease: report["diseases"].join(", "),
  //                 value: 1,
  //                 location: location,
  //                 coordinates: coords,
  //                 year: getYear(report["event_date"]),
  //                 url: report.url,
  //                 event_date: report.event_date
  //               };
  //             }
  //           });
  //       });

  //       // add a pointer for each report
  //       // using the first location listed in report
  //       Promise.all(promises).then((responses) => {
          
  //         // add id and colour for each entry
  //         let points = responses.map((point) => {
  //           let pointColour = "yellow";
  //           for (const colour in colours) {
  //             if (point.disease.includes(colour)) {
  //               pointColour = colours[colour];
  //             }
  //           }
  //           return {
  //             ...point,
  //             id: Math.random(),
  //             color: pointColour,
  //           };
  //         });

  //         console.log(JSON.stringify(points))
  //         setBreakoutPoints(points);
  //         setDisplayPoints(points);
  //     })});
  // }, []);


  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <NavBar />
      <div
        className="App"
        style={{
          width: "100vw",
          height: "calc(100vh - 64px)",
          padding: 0,
          margin: 0,
          overflow: "hidden",
        }}
      >
        <ReactGlobe
          markers={displayPoints}
          options={{
            enableMarkerGlow: true,
            markerRadiusScaleRange: [0.007, 0.007],
            markerType: "dot",
            enableMarkerTooltip: true,
            markerEnterAnimationDuration: 3000,
            markerEnterEasingFunction: ["Bounce", "InOut"],
            markerExitAnimationDuration: 3000,
            markerExitEasingFunction: ["Cubic", "Out"],
            cameraDistanceRadiusScale: 3.5,
            markerTooltipRenderer: (marker) =>
              `${marker.disease} - ${marker.year}`,
          }}
          style={{
            width: "100%",
            padding: 0,
          }}
          onClickMarker={(marker, markerObject, event) => {
            if ("url" in marker) {
              window.open(marker.url, "_blank");
            }
          }}
        />
        <div
          style={{
            position: "absolute",
            // backgroundColor: "rgba(255, 99, 71, 0.5)",
            width: "20vw",
            height: "calc(100vh - 50px)",
            left: 0,
            top: 50,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Date range filter */}
          <Box sx={{ width: "225px", mb: 2 }}>
            <TextField
              sx={{ bgcolor: "white" }}
              value={values.start_date}
              variant="outlined"
              fullWidth
              required
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange("start_date")}
              style={{
                borderRadius: "5px",
              }}
            />
            <Typography sx={{ color: "white" }}>To</Typography>
            <TextField
              sx={{ bgcolor: "white" }}
              value={values.end_date}
              variant="outlined"
              fullWidth
              required
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange("end_date")}
              style={{
                borderRadius: "5px",
              }}
            />
          </Box>

          <Card
            variant="outlined"
            sx={{ width: "225px" }}
            style={{
              // position: "absolute",
              // right: 0,
              background: "white",
            }}
          >
            {["Listeriosis", "Ebola", "Hepatitis", "Measles"].map(
              (diseaseName) => {
                let disease = diseaseName.toLowerCase();
                return (
                  <div
                    onClick={() => {
                      let newChecked = { ...checked };
                      newChecked[disease] = !checked[disease];
                      setChecked(newChecked);
                    }}
                    key={Math.random()}
                  >
                    <DiseaseItem
                      disease={diseaseName}
                      colour={colours[disease]}
                      selected={checked[disease]}
                    />
                  </div>
                );
              }
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default HomepageGlobe;
