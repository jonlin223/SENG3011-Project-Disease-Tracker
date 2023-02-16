import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import {
  Grid,
  Box,
  Switch,
  Card,
  Avatar,
  TextField,
  Divider,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  FormGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { Done } from "@mui/icons-material";



export default function Settings() {    
  
  
  const token = localStorage.getItem('token');


  const [email, setEmail] = useState("");
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [locState, setLocState] = useState("");
  const [city, setCity] = useState("");
  const [img_uri, setImgUri] = useState("https://render.fineartamerica.com/images/rendered/default/print/8/6/break/images/artworkimages/medium/1/frank-heather-perry.jpg");
  const [success, setSuccess] = useState(false);

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
      console.log(data)
      setEmail(data.email)
      setFName(data.name_first)
      setLName(data.name_last)
      setPhone(data.phone)
      setCountry(data.country)
      setLocState(data.state)
      setCity(data.city)
      // TODO profile pic
    }
  }

  async function updateUserProfile(credentials) {
    const response = await fetch('http://127.0.0.1:8000/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return response
  };

  // Run on mount of the page
  useEffect(() => {
    loadUserProfile({token});
  }, []);
  
  const handleSubmit = async e => {
    e.preventDefault()
    const response = await updateUserProfile({
      "token": token, "email": email, "name_first": fname, "name_last": lname, "phone": phone, "country": country, "state": locState, "img_uri": img_uri, "city": city
    });
    if (response.status == 200){
      console.log("Success")
      setSuccess(true)

      setTimeout(function () {
        setSuccess(false)
      }, 3000)
    }
  };

  const handleFNameChange = (e) => setFName(e.target.value);
  const handleLNameChange = (e) => setLName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);
  const handleStateChange = (e) => setLocState(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);

  const profile = (
    <form noValidate onSubmit={handleSubmit}>
      <Card sx={{ height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
        <CardHeader title="Personal Information"></CardHeader>
        <Divider></Divider>
        <CardContent spacing={2}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField required id="f_name" fullWidth value={fname} label="First Name" onChange={handleFNameChange}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField required id="l_name" fullWidth value={lname} label="Last Name" onChange={handleLNameChange}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField required id="email" fullWidth value={email} label="Email" onChange={handleEmailChange}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="phone" fullWidth value={phone} label="Phone Number" onChange={handlePhoneChange}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="country" fullWidth value={country} label="Country" onChange={handleCountryChange}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="state" fullWidth value={locState} label="State" onChange={handleStateChange}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="city" fullWidth value={city} label="City" onChange={handleCityChange}></TextField>
                </Grid>
            </Grid>
        </CardContent>
        <Divider></Divider>
        <CardActions sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              {success && <Done color="success"></Done>}
              <Button variant="contained" color="primary" type="submit">Save Changes</Button>
            </Stack>
        </CardActions>
      </Card>
    </form>
  )
  
  const notifications = (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardHeader title="Notifications"></CardHeader>
      <Divider></Divider>
      <CardContent spacing={2}>
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive SMS notifications about close-by disease outbreaks"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Receive email notifications about close-by disease outbreaks"
          />
        </FormGroup>
      </CardContent>
      <Divider></Divider>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );

  const dp = (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <CardHeader
          title="Profile Picture"
          sx={{ justifySelf: "start" }}
        ></CardHeader>
        <Divider></Divider>
      </Box>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={img_uri}
            sx={{
              height: 200,
              width: 200,
            }}
          />
        </Box>
      </CardContent>
      <CardActions>
        <Divider />
        <Button color="primary" fullWidth variant="contained">
          Upload
        </Button>

        <Button color="primary" fullWidth variant="outlined">
          Remove
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ margin: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            {dp}
          </Grid>
          <Grid item xs={8}>
            {profile}
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            {notifications}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
