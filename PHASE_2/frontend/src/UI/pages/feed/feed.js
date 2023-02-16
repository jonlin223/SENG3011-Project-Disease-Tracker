import { PinDrop, QuestionMarkOutlined, WarningAmberRounded } from "@mui/icons-material";
import { Box, Card, Container, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NavBar from "../navbar";
import FeedHeadline from "./FeedComponents/feedHeadline";
import FeedTweets from "./FeedComponents/feedTweets";

export default function Feed () {
    
    const token = localStorage.getItem('token');
    
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    async function loadUserProfile(credentials) {
        const user = await fetch('http://127.0.0.1:8000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });
        if(user.status == 200) {
          const data = await user.json()
          setCity(data.city)
          setCountry(data.country)
        }
      }

      useEffect(() => {
        loadUserProfile({token});
      }, []);

    return (
        <>
            <NavBar />
            <Container>
                <Grid container spacing={4} padding={3}>
                    <Grid item xs={12}>
                        <Card>
                            <Stack direction="row" padding={2} spacing={2}>
                                <PinDrop color="info"></PinDrop>
                                {city=="" && <Typography>No location set in profile. Feed tailored for <b>Sydney, Australia</b> based on IP address.</Typography>}
                                {city!=="" && <Typography>Feed tailored for <b>{city}, {country}</b>.</Typography>}
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <FeedTweets />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
