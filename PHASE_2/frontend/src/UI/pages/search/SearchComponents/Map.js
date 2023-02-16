import React from "react";
import Box from "@mui/material/Box";
import { Map, Marker, Overlay } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
// import breakoutPoints from "../../../../breakoutPoints.js";
import MapMarker from "./MapMarker.js"
import DateSlider from "./DateSlider.js";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const maptilerProvider = maptiler("UeT0vren0sM9Tlt1xifM", "streets");

export const getLocation = (loc) => {
  return `${loc.location} ${loc.country}`;
}

export const getYear = (date) => {
  if (date.includes("to")) {
    date = date.split("to")[0];
  }
  return date.split('-')[0];
}

const MyMap = ({ centre, response, startDate, endDate }) => {
  const [breakoutPoints, setBreakoutPoints] = React.useState([]);
  const [visiblePoints, setVisiblePoints] = React.useState([]);
  const [centreCoord, setCentreCoord] = React.useState([37.0902, -95.7129]);
  const [all, setAll] = React.useState(true);
  const [boundary, setBoundary] = React.useState(endDate);

  const handleCheckbox = () => {
    setAll(!all);
  };

  React.useEffect(() => {
    // get all reports that have locations listed
    let allReports = [];
    response.forEach((article) => {
      article.reports.forEach((report) => {
        if ("locations" in report && report["locations"].length > 0) {
          allReports.push({ ...report, url: article.url });
        }
      });
    });

    // list of coordinate api promises
    let promises = allReports.map((report) => {
      let location = getLocation(report["locations"][0]);

      return fetch(
        `http://api.positionstack.com/v1/forward?access_key=bcc92317cc6abaf3c2d5e5655688d405&query=${location}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res["data"].length != 0) {
            // get first found coordinates
            let point = res["data"][0];
            let coords = [point["latitude"], point["longitude"]];

            return {
              disease: report["diseases"].join(", "),
              value: 1,
              location: location,
              coordinates: coords,
              year: getYear(report["event_date"]),
              event_date: report["event_date"],
              url: report.url,
            };
          }
        });
    });

    // add a pointer for each report
    // using the first location listed in report
    Promise.all(promises).then((responses) => {
      setBreakoutPoints(responses);
      setVisiblePoints(responses);
    });
  }, []);

  // set centre to searched location
  React.useEffect(() => {
    if (centre.toLowerCase() === "us") {
      centre = "united states";
    }
    fetch(
      `http://api.positionstack.com/v1/forward?access_key=bcc92317cc6abaf3c2d5e5655688d405&query=${centre}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (!("error" in res) && res["data"].length != 0) {
          let point = res["data"][0];
          setCentreCoord([point["latitude"], point["longitude"]]);
        }
      });
  }, []);

  // if all option is checked, display all results on map
  React.useEffect(() => {
    if (all) {
      setVisiblePoints(breakoutPoints);
    } else {
      filterByBoundary(boundary);
    }
  }, [all]);

  const filterByBoundary = (endBoundary) => {
    setBoundary(endBoundary);

    if (!all) {
      setVisiblePoints(
        breakoutPoints.filter((point) => {
          let isWithinYear = false;
          // format point.event_date
          let event = point.event_date;
          if (point.event_date.includes("to")) {
            event = event.split("to")[0];
            event = `${event.split(" ")[0]}T${event.split(" ")[1]}`;
          } else {
            event = `${event.split(" ")[0]}T${event.split(" ")[1]}`;
          }

          let eventDate = new Date(event).getFullYear();
          let boundaryDate = new Date(endBoundary).getFullYear();

          if (eventDate == boundaryDate) {
            isWithinYear = true;
          }

          return isWithinYear;
        })
      );
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Map
        height={500}
        center={centreCoord}
        defaultZoom={4}
        provider={maptilerProvider}
      >
        {visiblePoints.map((point) => {
          if (point.coordinates[0] !== undefined && point.coordinates[1] !== undefined) {
            return (
              <Overlay
                anchor={[point.coordinates[0], point.coordinates[1]]}
                offset={[15, 34]}
                key={Math.random()}
              >
                <MapMarker point={point} />
              </Overlay>
            );
          }
        })}
      </Map>
      <Box
        style={{
          width: "100%",
          display: "flex",

        }}
      >
        <FormControlLabel
          control={<Checkbox onChange={handleCheckbox} checked={all} />}
          label="All reports"
          style={{
            minWidth: "150px",
          }}
        />
        <DateSlider
          startDate={startDate}
          endDate={endDate}
          onChangeCall={filterByBoundary}
        />
      </Box>
    </Box>
  );
};

export default MyMap;


