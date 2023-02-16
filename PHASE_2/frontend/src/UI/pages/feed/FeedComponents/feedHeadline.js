import { Box, Card, CardContent, CardMedia, Link, Typography } from "@mui/material";
import React from "react";

export default function FeedHeadline() {

    const [values, setValues] = React.useState({
        headline: '',
        description: '',
        image: '',
        url: '',
    });

    // TODO add API call to news
    // should retrieve most relevant headline

    return (
        <Card sx={{mt: 8, height: 650}}>
            <CardMedia component='img' sx={{width: '100%', height: '60%'}} image='https://media.gettyimages.com/photos/male-doctor-gesturing-thumbs-down-making-a-face-picture-id182676416' />
            <Box>
                <CardContent>
                    <Typography gutterBottom variant="h3" component="div">
                        <Link href='https://www.cdc.gov/outbreaks/' underline='hover' target='_blank'>
                            Outbreak of dangerous disease in Sydney
                        </Link>
                    </Typography>
                    <Typography variant="body1">
                        Reports of a dangerous new disease in Sydneywere confirmed by the Australian Government this morning.
                        Officials warned citizens that all were at risk, though university students doing SENG courses
                        are most at threat due to their weakening mental state and lack of Vitamin D.
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )

}