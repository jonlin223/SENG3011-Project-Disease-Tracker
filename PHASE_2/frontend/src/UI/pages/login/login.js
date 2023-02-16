import { Warning } from "@mui/icons-material";
import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Navigate, useHi, useNavigate } from "react-router-dom";
import loginImg from "../../../login.svg";

async function loginUser(credentials) {
  return fetch('http://127.0.0.1:8000/auth/login', {
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



export default function Login(props) {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errMsg, setErrMsg] = useState();
  const [showWarning, setShowWarning] = useState();

  const navigate = useNavigate();

  // const handleLogin = () => {
  //   if(localStorage.getItem('token') != null) {
  //     setShowWarning(false)
  //     navigate('/home')
  //   }
  // }

  const handleSubmit = async e => {
    e.preventDefault()
    const response = await loginUser({
      email, password
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
      <div className="header">Login</div>
      <div className="content">
        <div className="image">
          <img src={loginImg} />
        </div>
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField name="email" label="Email" onChange={e => setEmail(e.target.value)}></TextField>
          </div>
          <div className="form-group">
            <TextField name="password" label="Password" type="password" onChange={e => setPassword(e.target.value)}></TextField>
          </div>
          <Button variant="contained" type="submit">
            Login
          </Button>
        </form>
        {showWarning && <AddNotif msg={errMsg}></AddNotif>}
      </div>
    </div>
  );
}
