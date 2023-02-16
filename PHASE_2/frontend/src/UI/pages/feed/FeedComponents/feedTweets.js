import { Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function FeedTweets() {

    const token = localStorage.getItem('token');
    
    const [city, setCity] = useState("");

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
          console.log(city)
        }
      }

    const [values, setValues] = React.useState({
        tweet_list: [],
    });

    useEffect(() => {
        loadUserProfile({token});
        console.log(city)
    }, [])

    useEffect(() => {
        let query_url = ""
        if (city.normalize() === "Sydney".normalize()) {
            query_url = "http://127.0.0.1:8000/feed/sydney"
        } else if (city.normalize() === "London".normalize()) {
            query_url = "http://127.0.0.1:8000/feed/london"
        } else {
            query_url = "http://127.0.0.1:8000/feed/sydney"
        }

        fetch(query_url)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setValues({tweet_list: []});
                setValues(res)
            })
    }, [city])

    return (
        <Grid container spacing={4}>
            {values.tweet_list.map(
                tweetInfo => (
                    <Grid container item xs={12} spacing={4}>
                        <Grid item xs />
                        <Grid item xs={6}>
                            <TwitterTweetEmbed
                                tweetId={tweetInfo.id}
                                placeholder={<Skeleton variant='rectangular' width={550} height={400} sx={{borderRadius: 4}} />}
                            />
                        </Grid>
                        <Grid item xs />
                    </Grid>
                )
            )}
        </Grid>
    )
}