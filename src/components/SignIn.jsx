import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import image from '../images/image.png'
import { useNavigate } from 'react-router-dom';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn(props) {
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
      
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null); // Reset error state
  
      const data = new FormData(event.currentTarget);
  
      try {
        const response = await fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: data.get('email'), password: data.get('password') }),
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
          <Avatar src={image}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              Sign In
            </Button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Grid container sx={{ justifyContent: 'center'}}>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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