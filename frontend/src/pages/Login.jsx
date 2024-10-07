import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Grid, Paper } from '@mui/material';
import logo from "../images/logo.png";
import image from "../images/AuthPageSide.jpg";
import { api_base_url } from '../helper';



const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pwd
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userId", data.userId);
          setTimeout(() => {
          window.location.href = "/"
          }, 200);
        } else {
          setError(data.message);
        }
      });
  };

  return (
   

    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url(${image}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        color: '#fff',
      }}
    >
      
        {/* Left Section (Login Form) */}
       
          <Paper
            elevation={12}
            sx={{
              padding: 4,
              borderRadius: 4,
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // Frost glass effect
              boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
            </Box>

            <form onSubmit={submitForm}>
              <TextField
                required
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                   
                  },
                }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                sx={{
                 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  Don't have an account?
                  <Button
                    component="a"
                    href="/signUp"
                    sx={{
                      color: '#00AEEF',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      padding: '0px',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  padding: '10px',
                  backgroundColor: '#00AEEF',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#007bbd' },
                  borderRadius: 2,
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
       

       
     
    </Container>

   
  );
};

export default Login;
