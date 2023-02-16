import { Box, Card, CardContent, CardMedia, Link, Typography } from "@mui/material";
import React from "react";
import NewsLogo from "../SearchAssets/news_logo.png";

const NewsItem = (props) => {
    const [img, setImg] = React.useState(NewsLogo);

    React.useEffect(() => {
      fetch(props.image, { mode: 'no-cors' })
        .then((res) => {
          if (res.status === 0) {
            setImg(props.image);
          }
        })
        .catch(err => {});
    }, []);

    return (
          <Card sx={{ display: "flex", height: 150 }}>
            <CardMedia
              component="img"
              sx={{ maxWidth: 150, minWidth: 150 }}
              image={ img }
            />
            <Box sx={{ display: "flex", flexDirection: "column", pt: "5" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <Link href={props.url} underline="hover" target="_blank">
                    {props.title}
                  </Link>
                </Typography>
                <Typography variant="subtitle1">
                  Source: {props.source}
                </Typography>
                <Typography variant="subtitle1">
                  Published: {props.date}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        );

}

export default NewsItem;