import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import NavBar from "../navbar";
import SearchItem from "./SearchComponents/searchItem";
import NewsItem from "./SearchComponents/newsItem";
import ReportItem from "./SearchComponents/ReportItem"
import SearchIcon from "@mui/icons-material/Search";
import Map from "./SearchComponents/Map.js";
import ReportMap from "./SearchComponents/ReportMap.js";
import { Label } from "@mui/icons-material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";


export default function Search() {
  const [values, setValues] = React.useState({
    key_terms: "",
    location: "",
    start_date: "",
    end_date: "",
    error: false,
    map: false,
  });

  const [cdc_response, set_cdc_response] = React.useState([]);
  const [news_response, set_news_response] = React.useState([]);
  const [reports_response, set_reports_response] = React.useState([]);
  const [dataSource, setDataSource] = React.useState('cdc');

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  // const handleCheckbox = (event) => {
  //   setValues({ ...values, news: event.target.checked });
  // };

  const handleSourceSelect = (event) => {
    setDataSource(event.target.value);
  };

  const handleMapCheckbox = (event) => {
    setValues({ ...values, map: event.target.checked });
  };

  const displayDate = (date) => {
    if (date.includes("to")) {
      let range = date.split("to");
      return `${range[0]} to ${range[1]}`;
    } else {
      return date;
    }
  };

  const displayNewsDate = (date) => {
    let dateStr = `${date.split('T')[0]} ${date.split('T')[1]}`;
    return dateStr.split('Z')[0]
  }

  const displayReportDate = (date) => {
    return `${date.split('T')[0]} ${date.split('T')[1]}:00`
  }

  const handleSearch = () => {
    if (
      values.key_terms === "" ||
      values.location === "" ||
      values.start_date === "" ||
      values.end_date === ""
    ) {
      setValues({ ...values, error: true });
    } else {
      setValues({ ...values, error: false });

      // key terms - from space separated to comma separated
      let search_terms = values.key_terms.split(/[\s]+/);
      search_terms = search_terms.join(",");

      // dates - set seconds as 00
      let search_start = values.start_date + ":00";
      let search_end = values.end_date + ":00";

      // location
      let search_location = values.location;

      // CDC API //
      let base_url =
        "http://implementerscdcapi-env.eba-h2hzu5xc.ap-southeast-2.elasticbeanstalk.com/api/v1/articles";
      let query_url = `${base_url}?key_terms=${search_terms}&start_date=${search_start}&end_date=${search_end}&location=${search_location}`;
      // fetch response
      fetch(query_url)
        .then((res) => {
          if (res.status !== 200) {
            // no results
            return [];
          }
          return res.json();
        })
        .then((res) => {
          if (res.length == 0) {
            set_cdc_response([]);
          } else {
            set_cdc_response(res.articles);

            // re-render map to show new values
            if (values.map === true) {
              setValues({...values, map: false});
              setValues({...values, map: true});
            }
          }
        }).catch(err => console.log(err));
      
      // News API //
      let news_url =
        "http://implementerscdcapi-env.eba-h2hzu5xc.ap-southeast-2.elasticbeanstalk.com/api/v1/news_articles";
      // NOTE: local url could be deleted after deployment
      news_url = "http://127.0.0.1:8000/api/v1/news_articles";
      let news_query_url = `${news_url}?key_terms=${search_terms}&start_date=${search_start}&end_date=${search_end}&location=${search_location}`;
      // fetch response
      fetch(news_query_url)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          // other key terms could be filtered out as a user preference feature
          set_news_response(res.articles.filter(article => !article.headline.toLowerCase().includes("abuse")));
        }).catch(err => console.log(err));
      
      // User Reports //
      let reports_url = "http://127.0.0.1:8000/filtered_reports";
      let reports_query_url = `${reports_url}?key_terms=${search_terms}&start_date=${search_start}&end_date=${search_end}&location=${search_location}`;
      fetch(reports_query_url)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          set_reports_response(res.reports);
          
          // re-render map to show new values
          if (values.map === true) {
            setValues({ ...values, map: false });
            setValues({ ...values, map: true });
          }
        }).catch(err => console.log(err))
    }
  };

  const getResponse = () => {
    if (dataSource === 'cdc') {
      return cdc_response;
    } else if (dataSource === 'news') {
      return news_response;
    } else if (dataSource === 'reports') {
      return reports_response;
    } else {
      // default to CDC
      return cdc_response;
    }
  }

  return (
    <>
      <NavBar />
      <Container>
        <TextField
          label="Enter Key Terms"
          variant="outlined"
          required
          fullWidth
          error={values.error}
          sx={{ mt: 4 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={handleChange("key_terms")}
        />
        <Box sx={{ mt: 3, justifyContent: "space-between", display: "flex" }}>
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            required
            error={values.error}
            onChange={handleChange("location")}
            sx={{ mr: 1 }}
          />
          <TextField
            label={
              dataSource === "news" ? "Publication Start Date" : "Start Date"
            }
            variant="outlined"
            fullWidth
            required
            type="datetime-local"
            error={values.error}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange("start_date")}
            sx={{ mx: 1 }}
          />
          <TextField
            label={dataSource === "news" ? "Publication End Date" : "End Date"}
            variant="outlined"
            fullWidth
            required
            type="datetime-local"
            error={values.error}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange("end_date")}
            sx={{ ml: 1 }}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid item xs={6}>
              <Typography variant="h6">Data Source</Typography>

              <Box width={200}>
                <FormControl fullWidth>
                  <Select value={dataSource} onChange={handleSourceSelect}>
                    <MenuItem value={"cdc"}>CDC Reports</MenuItem>
                    <MenuItem value={"reports"}>User Reports</MenuItem>
                    <MenuItem value={"news"}>News Articles</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {(dataSource === "cdc" || dataSource === "reports") && (
              <Grid item xs={6}>
                <Typography variant="h6">Search Result Options</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleMapCheckbox}
                      checked={values.map}
                    />
                  }
                  label="Display results on map"
                />
              </Grid>
            )}
          </Grid>
        </Box>

        {dataSource === "cdc" && values.map && (
          <Map
            response={cdc_response}
            centre={values.location}
            startDate={values.start_date}
            endDate={values.end_date}
          />
        )}

        {dataSource === "reports" && values.map && (
          <ReportMap
            response={reports_response}
            centre={values.location}
            startDate={values.start_date}
            endDate={values.end_date}
          />
        )}

        {dataSource === "news" && (
          <Typography sx={{ mt: 1 }}>
            The following news articles are about {values.key_terms} in{" "}
            {values.location}, but may not include specific outbreak
            information.
          </Typography>
        )}

        <Box sx={{ mt: 6, mb: 6 }}>
          <Grid container spacing={2}>
            {dataSource == "cdc" &&
              cdc_response.map((article) => {
                return article.reports.map((report) => {
                  return (
                    <Grid item xs={12} key={Math.random()}>
                      <SearchItem
                        title={article.headline}
                        disease={report.diseases.join(", ")}
                        date={displayDate(report.event_date)}
                        url={article.url}
                      />
                    </Grid>
                  );
                });
              })}
            {dataSource == "news" &&
              news_response.map((article) => {
                return (
                  <Grid item xs={12} key={Math.random()}>
                    <NewsItem
                      title={article.headline}
                      date={displayNewsDate(article.date_of_publication)}
                      url={article.url}
                      image={article.image}
                      source={article.source}
                    />
                  </Grid>
                );
              })}
            {dataSource === "reports" &&
              reports_response.map((article) => {
                return (
                  <Grid item xs={12} key={Math.random()}>
                    <ReportItem
                      disease={article.disease}
                      date={displayReportDate(article.report_date)}
                      location={article.report_loc}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
