import { Button } from "@material-ui/core";
import { Warning } from "@mui/icons-material";
import { Card, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../../login.svg";

async function registerUser(credentials) {
  return fetch('http://127.0.0.1:8000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

const AddNotif = ({msg}) => {
  return (
    <Card raised sx={{padding:2}} style={{ background: '#C41E3A' }}>
      <Grid container spacing={2} justifyContent="flex-start">
        <Grid item xs={1}>
          <Warning />
        </Grid>
        <Grid item xs={9}>
          <Typography>{msg}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};



export default function Register(props) {

  const [email, setEmail] = useState();
  const [name_first, setFName] = useState();
  const [name_last, setLName] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [errMsg, setErrMsg] = useState();
  const [showWarning, setShowWarning] = useState();

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault()
    const response = await registerUser({
      email, password, name_first, name_last, phone
    });

    console.log(response)

    if ('token' in response) {
      localStorage.setItem('token', response['token'])
      setShowWarning(false)
      navigate('/home')
    } else if ('message' in response) {
      console.log("Test")
      setShowWarning(true)
      setErrMsg(response['message'])
    }
  };

  return (
    <div className="base-container" ref={props.containerRef}>
      <div className="header">Register</div>
      <div className="content">
        <div className="image">
          <img src={loginImg} />
        </div>
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField name="f_name" label="First Name" onChange={e => setFName(e.target.value)}></TextField>
          </div>
          <div className="form-group">
            <TextField name="l_name" label="Last Name" onChange={e => setLName(e.target.value)}></TextField>
          </div>
          <div className="form-group">
            <TextField name="email" label="Email" onChange={e => setEmail(e.target.value)}></TextField>
          </div>
          <div className="form-group">
            <TextField name="password" label="Password" type="password" onChange={e => setPassword(e.target.value)}></TextField>
          </div>
          <div className="form-group">
            <TextField name="phone" label="Phone Number" onChange={e => setPhone(e.target.value)}></TextField>
          </div>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </form>
        {showWarning && <AddNotif msg={errMsg}></AddNotif>}
      </div>
        
    </div>
  );
}