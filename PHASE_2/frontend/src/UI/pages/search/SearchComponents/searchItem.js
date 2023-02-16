import { Box, Card, CardContent, CardMedia, Link, Typography } from "@mui/material";
import React from "react";

class SearchItem extends React.Component {

    render() {
        return (
            <Card sx={{ display: 'flex', height: 150}}>
                <CardMedia component='img' sx={{width: 150}} image="https://jbmediagroupllc.com/wp-content/uploads/cdc-logo.png"/>
                <Box sx={{ display: 'flex', flexDirection: 'column', pt: "5"}}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            <Link href={this.props.url} underline='hover' target='_blank'>
                                {this.props.title}
                            </Link>
                        </Typography>
                        <Typography variant="subtitle1">
                            Disease: {this.props.disease}
                        </Typography>
                        <Typography variant="subtitle1">
                            Date: {this.props.date}
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        )
    }

}

export default SearchItem;