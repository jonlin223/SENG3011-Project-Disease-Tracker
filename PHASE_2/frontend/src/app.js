import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./UI/pages/search/search";
import Feed from "./UI/pages/feed/feed";
import Settings from "./UI/pages/settings/settings";
import LoginRegister from "./UI/pages/login/loginRegister";
import Report from "../src/UI/pages/report/Report";

import HomepageGlobe from "./UI/pages/homepage/HomepageGlobe.js";
import HomepageGeneral from "./UI/pages/homepage/HomepageGeneral.js";

import { theme } from "./theme"
import Info from "./UI/pages/info/info";

class App extends React.Component {
    render() {
        return (
          <ThemeProvider theme={theme}>
            <CssBaseline>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginRegister />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/" element={<HomepageGeneral />} />
                  <Route path="/home" element={<HomepageGlobe />} />
                  <Route path="/info" element={<Info />} />
                </Routes>
              </BrowserRouter>
            </CssBaseline>
          </ThemeProvider>
        );
    };
};

export default App;
