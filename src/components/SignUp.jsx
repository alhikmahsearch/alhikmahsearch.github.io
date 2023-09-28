import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp(props) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    function setItemWithExpiry(key, value, days) {
        const now = new Date();
        // `days` converted to milliseconds
        const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        localStorage.setItem(key, JSON.stringify({ value, expires: expires.toISOString() }));
    }

    const goHome = () => {
    navigate('/');
    };

  const handleSubmit = async(event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state
  
    const data = new FormData(event.currentTarget);
    
    try {
    if (data.get('password') !== data.get('confirmPassword')){
        setError("Passwords don't match")
        return
    }
    if (data.get('username').length == 0){
        return
    }
    const response = await fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/signup', {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
    });

    const userResponse = await response.json();

    if (response.ok) {
        const token = userResponse.token;
        setItemWithExpiry('AHS_Token', token, 14)
        props.updateToken(token);
        navigate('/')
    } else {
        setError(userResponse.message || "Failed to login");
    }

    } catch (err) {
    console.log("error:", err);
    setError("An unexpected error occurred");
    } finally {
    setIsLoading(false);
    }
    
  };

  return (
    <div>
    <Box sx={{ position: 'absolute', left: 15, top: 15 }}>
        <Button 
        onClick={goHome}
        sx={{ 
            mb: 2, 
            fontSize: '1.1rem'
        }}
        >
        <KeyboardReturnIcon />Home
        </Button>
    </Box>
    
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              Sign Up
            </Button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
}