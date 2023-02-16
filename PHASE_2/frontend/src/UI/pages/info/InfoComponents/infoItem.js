import React from "react"
import { Box, Card, CardActions, CardContent, Collapse, IconButton, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
  }));

export default function InfoItem({disease, info, symptoms, prevention}) {

    const [expanded, setExpanded] = React.useState(false);

    const handleExpansion = () => {
        setExpanded(!expanded);
    }

    return (
        <Card>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <CardContent sx={{ml: 1}}>
                    <Typography variant="h5">
                        {disease}
                    </Typography>
                </CardContent>
                <CardActions sx={{mr: 1}}>
                    <ExpandMore expand={expanded} onClick={handleExpansion}>
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
            </Box>
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent sx={{mx: 1}}>
                    <Typography paragraph variant="body1">
                        <b>Info</b>: {info}
                    </Typography>
                    <Typography paragraph variant="body1">
                        <b>Symptoms</b>: {symptoms}
                    </Typography>
                    <Typography paragraph variant="body1">
                        <b>Prevention</b>: {prevention}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}