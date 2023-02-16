import { AppBar, Avatar, Box, Button, Container, IconButton, Switch, Toolbar, Typography } from "@mui/material";
import AccountMenu from './components/AccountMenu'
import SettingsIcon from '@mui/icons-material/Settings';
import React from "react";

class NavBar extends React.Component {

    render() {
        return (
            <>
                <AppBar position='fixed'>
                    <Container maxWidth='x1'>
                        <Toolbar disableGutters color='info'>
                            <Button href='/home' sx={{ my: 2, color: 'white', display: 'block' }}>
                                <Typography variant='h6' noWrap component='div' sx={{ mr: 2, display: { xs: 'flex' } }}>
                                    CDISEASE
                                </Typography>
                            </Button>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
                                <Button href='/search' sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Search
                                </Button>
                                <Button href='/feed' sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Feed
                                </Button>
                                <Button href='/report' sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Report
                                </Button>
                                <Button href='/info' sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Info
                                </Button>
                            </Box>
                            <Box sx={{ flexGrow: 0}}>
                                <AccountMenu></AccountMenu>
                                
                                {/* <IconButton href='/settings'>
                                    <Avatar src="https://webcms3.cse.unsw.edu.au/static/uploads/profilepic/z5160224/8f8bff9dd8a8a13a36378d12557660a5a71ea02d00a81b54d3ed1ecf9a0c1e44/Screen_Shot_2022-02-23_at_6.08.40_pm.png" />
                                </IconButton> */}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Toolbar />
            </>
        );
    };

};

export default NavBar;
